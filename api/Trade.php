<?php
// Trade.php
class Trade {
    private $db;
    private $bot;
    
    public function __construct($db, $bot) {
        $this->db = $db;
        $this->bot = $bot;
    }
    
    public function create($data, $userId) {
        // Ma'lumotlarni validatsiya qilish
        if (!isset($data['trade_name']) || !isset($data['amount']) || !isset($data['trade_type']) || !isset($data['commission_type'])) {
            throw new Exception('Required fields missing');
        }
        
        $amount = floatval($data['amount']);
        if ($amount < 1000) {
            throw new Exception('Minimum trade amount is 1000');
        }
        
        $commissionRate = COMMISSION_RATE / 100;
        $commissionAmount = $amount * $commissionRate;
        
        // Yetarli balans tekshirish (agar komissiya yaratuvchi tomonidan bo'lsa)
        if ($data['commission_type'] === 'creator') {
            $user = $this->db->fetch("SELECT balance FROM users WHERE id = ?", [$userId]);
            if ($user['balance'] < $commissionAmount) {
                throw new Exception('Insufficient balance for commission');
            }
        }
        
        // Maxfiy havola yaratish
        $secretLink = $this->generateSecretLink();
        
        $this->db->beginTransaction();
        
        try {
            // Savdoni yaratish
            $this->db->query(
                "INSERT INTO trades (creator_id, trade_name, amount, commission_type, commission_amount, trade_type, secret_link) 
                VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    $userId,
                    $data['trade_name'],
                    $amount,
                    $data['commission_type'],
                    $commissionAmount,
                    $data['trade_type'], 
                    $secretLink
                ]
            );
            
            $tradeId = $this->db->lastInsertId();
            
            // Agar komissiya yaratuvchi tomonidan bo'lsa, balansdan yechish
            if ($data['commission_type'] === 'creator') {
                $user = new User($this->db);
                $user->updateBalance($userId, $commissionAmount, 'subtract');
                
                // Komissiya to'lovini qayd qilish
                $this->db->query(
                    "INSERT INTO payments (user_id, type, amount, status, trade_id, notes) 
                    VALUES (?, 'commission', ?, 'completed', ?, 'Trade creation commission')",
                    [$userId, $commissionAmount, $tradeId]
                );
            }
            
            $this->db->commit();
            
            // Telegram orqali xabar yuborish
            $trade = $this->getById($tradeId, $userId);
            $this->bot->notifyTradeCreated($userId, $trade);
            
            return [
                'success' => true,
                'trade_id' => $tradeId,
                'secret_link' => $secretLink,
                'share_url' => "https://t.me/" . BOT_USERNAME . "?start=trade_" . $secretLink
            ];
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    public function joinTrade($secretLink, $userId) {
        $trade = $this->db->fetch(
            "SELECT * FROM trades WHERE secret_link = ? AND status = 'active'",
            [$secretLink]
        );
        
        if (!$trade) {
            throw new Exception('Trade not found or not active');
        }
        
        if ($trade['creator_id'] == $userId) {
            throw new Exception('Cannot join your own trade');
        }
        
        if ($trade['participant_id']) {
            throw new Exception('Trade already has a participant');
        }
        
        // Yetarli balans tekshirish
        $user = $this->db->fetch("SELECT balance FROM users WHERE id = ?", [$userId]);
        $requiredAmount = $trade['amount'];
        
        if ($trade['commission_type'] === 'participant') {
            $requiredAmount += $trade['commission_amount'];
        } elseif ($trade['commission_type'] === 'split') {
            $requiredAmount += $trade['commission_amount'] / 2;
        }
        
        if ($user['balance'] < $requiredAmount) {
            throw new Exception('Insufficient balance');
        }
        
        $this->db->beginTransaction();
        
        try {
            // Ishtirokchini qo'shish
            $this->db->query(
                "UPDATE trades SET participant_id = ?, status = 'in_progress', updated_at = NOW() WHERE id = ?",
                [$userId, $trade['id']]
            );
            
            // Balansdan yechish
            $userObj = new User($this->db);
            $userObj->updateBalance($userId, $requiredAmount, 'subtract');
            
            // To'lovni qayd qilish
            $this->db->query(
                "INSERT INTO payments (user_id, type, amount, status, trade_id, notes) 
                VALUES (?, 'trade_spend', ?, 'completed', ?, 'Trade participation')",
                [$userId, $requiredAmount, $trade['id']]
            );
            
            $this->db->commit();
            
            // Telegram orqali xabar yuborish
            $this->bot->notifyTradeUpdate($trade['creator_id'], $trade, 'joined');
            
            return [
                'success' => true,
                'message' => 'Successfully joined the trade'
            ];
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    public function confirm($tradeId, $userId) {
        $trade = $this->db->fetch(
            "SELECT * FROM trades WHERE id = ? AND (creator_id = ? OR participant_id = ?)",
            [$tradeId, $userId, $userId]
        );
        
        if (!$trade) {
            throw new Exception('Trade not found');
        }
        
        if ($trade['status'] !== 'in_progress') {
            throw new Exception('Trade is not in progress');
        }
        
        $this->db->beginTransaction();
        
        try {
            if ($trade['creator_id'] == $userId) {
                $this->db->query(
                    "UPDATE trades SET creator_confirmed = 1, updated_at = NOW() WHERE id = ?",
                    [$tradeId]
                );
            } else {
                $this->db->query(
                    "UPDATE trades SET participant_confirmed = 1, updated_at = NOW() WHERE id = ?",
                    [$tradeId]
                );
            }
            
            // Ikkalasi ham tasdiqlagan bo'lsa, savdoni yakunlash
            $updatedTrade = $this->db->fetch("SELECT * FROM trades WHERE id = ?", [$tradeId]);
            
            if ($updatedTrade['creator_confirmed'] && $updatedTrade['participant_confirmed']) {
                $this->completeTrade($tradeId);
            }
            
            $this->db->commit();
            
            // Telegram xabari
            $otherUserId = $trade['creator_id'] == $userId ? $trade['participant_id'] : $trade['creator_id'];
            $this->bot->notifyTradeUpdate($otherUserId, $trade, 'confirmed');
            
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    public function cancel($tradeId, $userId) {
        $trade = $this->db->fetch(
            "SELECT * FROM trades WHERE id = ? AND (creator_id = ? OR participant_id = ?)",
            [$tradeId, $userId, $userId]
        );
        
        if (!$trade) {
            throw new Exception('Trade not found');
        }
        
        if ($trade['status'] === 'completed') {
            throw new Exception('Cannot cancel completed trade');
        }
        
        $this->db->beginTransaction();
        
        try {
            // Savdoni bekor qilish
            $this->db->query(
                "UPDATE trades SET status = 'cancelled', updated_at = NOW() WHERE id = ?",
                [$tradeId]
            );
            
            // Pulni qaytarish
            if ($trade['participant_id']) {
                $userObj = new User($this->db);
                
                // Ishtirokchi pulini qaytarish
                $refundAmount = $trade['amount'];
                if ($trade['commission_type'] === 'participant') {
                    $refundAmount += $trade['commission_amount'];
                } elseif ($trade['commission_type'] === 'split') {
                    $refundAmount += $trade['commission_amount'] / 2;
                }
                
                $userObj->updateBalance($trade['participant_id'], $refundAmount, 'add');
                
                // Qaytarish to'lovini qayd qilish
                $this->db->query(
                    "INSERT INTO payments (user_id, type, amount, status, trade_id, notes) 
                    VALUES (?, 'trade_earn', ?, 'completed', ?, 'Trade cancellation refund')",
                    [$trade['participant_id'], $refundAmount, $tradeId]
                );
            }
            
            // Yaratuvchi komissiyasini qaytarish (agar to'lagan bo'lsa)
            if ($trade['commission_type'] === 'creator') {
                $userObj = new User($this->db);
                $userObj->updateBalance($trade['creator_id'], $trade['commission_amount'], 'add');
                
                $this->db->query(
                    "INSERT INTO payments (user_id, type, amount, status, trade_id, notes) 
                    VALUES (?, 'trade_earn', ?, 'completed', ?, 'Commission refund')",
                    [$trade['creator_id'], $trade['commission_amount'], $tradeId]
                );
            }
            
            $this->db->commit();
            
            // Telegram xabarlari
            if ($trade['participant_id']) {
                $otherUserId = $trade['creator_id'] == $userId ? $trade['participant_id'] : $trade['creator_id'];
                $this->bot->notifyTradeUpdate($otherUserId, $trade, 'cancelled');
            }
            
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    private function completeTrade($tradeId) {
        $trade = $this->db->fetch("SELECT * FROM trades WHERE id = ?", [$tradeId]);
        
        // Savdo statusini o'zgartirish
        $this->db->query(
            "UPDATE trades SET status = 'completed', updated_at = NOW() WHERE id = ?",
            [$tradeId]
        );
        
        $userObj = new User($this->db);
        
        // Yaratuvchiga pul berish
        $creatorAmount = $trade['amount'];
        if ($trade['commission_type'] === 'creator') {
            // Komissiya allaqachon yechilgan
        } elseif ($trade['commission_type'] === 'split') {
            $creatorAmount -= $trade['commission_amount'] / 2;
        }
        
        $userObj->updateBalance($trade['creator_id'], $creatorAmount, 'add');
        
        // To'lovni qayd qilish
        $this->db->query(
            "INSERT INTO payments (user_id, type, amount, status, trade_id, notes) 
            VALUES (?, 'trade_earn', ?, 'completed', ?, 'Trade completion payment')",
            [$trade['creator_id'], $creatorAmount, $tradeId]
        );
        
        // Telegram xabarlari
        $this->bot->notifyTradeUpdate($trade['creator_id'], $trade, 'completed');
        $this->bot->notifyTradeUpdate($trade['participant_id'], $trade, 'completed');
    }
    
    public function getUserTrades($userId, $status = 'all') {
        $sql = "SELECT t.*, 
                       c.first_name as creator_name, c.username as creator_username,
                       p.first_name as participant_name, p.username as participant_username
                FROM trades t
                LEFT JOIN users c ON t.creator_id = c.id  
                LEFT JOIN users p ON t.participant_id = p.id
                WHERE (t.creator_id = ? OR t.participant_id = ?)";
        
        $params = [$userId, $userId];
        
        if ($status !== 'all') {
            if ($status === 'active') {
                $sql .= " AND t.status IN ('active', 'in_progress')";
            } else {
                $sql .= " AND t.status = ?";
                $params[] = $status;
            }
        }
        
        $sql .= " ORDER BY t.created_at DESC";
        
        return $this->db->fetchAll($sql, $params);
    }
    
    public function getById($id, $userId = null) {
        $sql = "SELECT t.*, 
                       c.first_name as creator_name, c.username as creator_username,
                       p.first_name as participant_name, p.username as participant_username
                FROM trades t
                LEFT JOIN users c ON t.creator_id = c.id  
                LEFT JOIN users p ON t.participant_id = p.id
                WHERE t.id = ?";
        
        $params = [$id];
        
        if ($userId) {
            $sql .= " AND (t.creator_id = ? OR t.participant_id = ?)";
            $params[] = $userId;
            $params[] = $userId;
        }
        
        return $this->db->fetch($sql, $params);
    }
    
    private function generateSecretLink() {
        return bin2hex(random_bytes(16));
    }
}
?>