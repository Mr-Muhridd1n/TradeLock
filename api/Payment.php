<?php

// Payment.php
class Payment {
    private $db;
    private $bot;
    
    public function __construct($db, $bot) {
        $this->db = $db;
        $this->bot = $bot;
    }
    
    public function createDeposit($userId, $data) {
        if (!isset($data['amount']) || !isset($data['payment_method'])) {
            throw new Exception('Required fields missing');
        }
        
        $amount = floatval($data['amount']);
        
        if ($amount < MIN_DEPOSIT) {
            throw new Exception('Minimum deposit amount is ' . MIN_DEPOSIT);
        }
        
        // To'lov so'rovini yaratish
        $transactionId = $this->generateTransactionId();
        
        $this->db->query(
            "INSERT INTO payments (user_id, type, amount, payment_method, card_number, transaction_id, status) 
            VALUES (?, 'deposit', ?, ?, ?, ?, 'pending')",
            [
                $userId,
                $amount,
                $data['payment_method'],
                $data['card_number'] ?? null,
                $transactionId
            ]
        );
        
        $paymentId = $this->db->lastInsertId();
        
        // Telegram xabari
        $this->bot->notifyPayment($userId, 'deposit', $amount, 'pending');
        
        return [
            'success' => true,
            'payment_id' => $paymentId,
            'transaction_id' => $transactionId,
            'status' => 'pending',
            'amount' => $amount
        ];
    }
    
    public function createWithdraw($userId, $data) {
        if (!isset($data['amount']) || !isset($data['card_number'])) {
            throw new Exception('Required fields missing');
        }
        
        $amount = floatval($data['amount']);
        
        if ($amount < MIN_WITHDRAW) {
            throw new Exception('Minimum withdraw amount is ' . MIN_WITHDRAW);
        }
        
        if ($amount > MAX_WITHDRAW) {
            throw new Exception('Maximum withdraw amount is ' . MAX_WITHDRAW);
        }
        
        // Balans tekshirish
        $user = $this->db->fetch("SELECT balance FROM users WHERE id = ?", [$userId]);
        
        if ($user['balance'] < $amount) {
            throw new Exception('Insufficient balance');
        }
        
        $this->db->beginTransaction();
        
        try {
            // Balansdan yechish
            $userObj = new User($this->db);
            $userObj->updateBalance($userId, $amount, 'subtract');
            
            // Chiqarish so'rovini yaratish
            $transactionId = $this->generateTransactionId();
            
            $this->db->query(
                "INSERT INTO payments (user_id, type, amount, card_number, transaction_id, status) 
                VALUES (?, 'withdraw', ?, ?, ?, 'pending')",
                [
                    $userId,
                    $amount,
                    $data['card_number'],
                    $transactionId
                ]
            );
            
            $paymentId = $this->db->lastInsertId();
            
            $this->db->commit();
            
            // Telegram xabari
            $this->bot->notifyPayment($userId, 'withdraw', $amount, 'pending');
            
            return [
                'success' => true,
                'payment_id' => $paymentId,
                'transaction_id' => $transactionId,
                'status' => 'pending'
            ];
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    public function confirmPayment($paymentId, $status = 'completed') {
        $payment = $this->db->fetch("SELECT * FROM payments WHERE id = ?", [$paymentId]);
        
        if (!$payment) {
            throw new Exception('Payment not found');
        }
        
        if ($payment['status'] !== 'pending') {
            throw new Exception('Payment is not pending');
        }
        
        $this->db->beginTransaction();
        
        try {
            // To'lov statusini yangilash
            $this->db->query(
                "UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?",
                [$status, $paymentId]
            );
            
            // Agar deposit va muvaffaqiyatli bo'lsa, balansga qo'shish
            if ($payment['type'] === 'deposit' && $status === 'completed') {
                $userObj = new User($this->db);
                $userObj->updateBalance($payment['user_id'], $payment['amount'], 'add');
            }
            
            // Agar withdraw va muvaffaqiyatsiz bo'lsa, balansga qaytarish
            if ($payment['type'] === 'withdraw' && $status === 'failed') {
                $userObj = new User($this->db);
                $userObj->updateBalance($payment['user_id'], $payment['amount'], 'add');
            }
            
            $this->db->commit();
            
            // Telegram xabari
            $this->bot->notifyPayment($payment['user_id'], $payment['type'], $payment['amount'], $status);
            
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    public function getHistory($userId, $limit = 50) {
        return $this->db->fetchAll(
            "SELECT p.*, t.trade_name 
             FROM payments p 
             LEFT JOIN trades t ON p.trade_id = t.id 
             WHERE p.user_id = ? 
             ORDER BY p.created_at DESC 
             LIMIT ?",
            [$userId, $limit]
        );
    }
    
    public function getById($id, $userId = null) {
        $sql = "SELECT * FROM payments WHERE id = ?";
        $params = [$id];
        
        if ($userId) {
            $sql .= " AND user_id = ?";
            $params[] = $userId;
        }
        
        return $this->db->fetch($sql, $params);
    }
    
    private function generateTransactionId() {
        return 'TXN' . time() . rand(1000, 9999);
    }
}