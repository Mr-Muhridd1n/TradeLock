<?php
// models/Payment.php

require_once 'BaseModel.php';
require_once 'User.php';
require_once 'Transaction.php';

class Payment extends BaseModel
{
    protected $table = 'payment_methods';
    private $userModel;
    private $transactionModel;

    public function __construct()
    {
        parent::__construct();
        $this->userModel = new User();
        $this->transactionModel = new Transaction();
    }

    public function deposit($userId, $amount, $paymentMethodId, $referenceId)
    {
        $this->db->beginTransaction();

        try {
            // Validatsiya
            if ($amount < 1000) {
                throw new Exception("Minimal to'lov summasi 1,000 so'm");
            }

            // To'lov usulini tekshirish
            $sql = "SELECT * FROM payment_methods WHERE id = ? AND user_id = ? AND is_active = 1";
            $stmt = $this->query($sql, array($paymentMethodId, $userId));
            $paymentMethod = $stmt->fetch();

            if (!$paymentMethod) {
                throw new Exception("To'lov usuli topilmadi");
            }

            // Balansni yangilash
            $updateResult = $this->userModel->updateBalance($userId, $amount, 'add');
            if (!$updateResult['success']) {
                throw new Exception($updateResult['error']);
            }

            // Tranzaksiya yaratish
            $this->transactionModel->createTransaction(array(
                'user_id' => $userId,
                'type' => 'deposit',
                'amount' => $amount,
                'description' => "Hisob to'ldirish - " . $paymentMethod['type'],
                'reference_id' => $referenceId
            ));

            // Audit log
            $this->logAction(
                $userId,
                'deposit',
                'payment',
                null,
                null,
                array('amount' => $amount, 'method' => $paymentMethod['type'])
            );

            $this->db->commit();

            return array('success' => true);

        } catch (Exception $e) {
            $this->db->rollback();
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    public function withdraw($userId, $amount, $cardNumber)
    {
        $this->db->beginTransaction();

        try {
            // Validatsiya
            if ($amount < MIN_WITHDRAWAL_AMOUNT) {
                throw new Exception("Minimal yechish summasi " . number_format(MIN_WITHDRAWAL_AMOUNT, 2) . " so'm");
            }

            // Balansni tekshirish
            $balanceInfo = $this->userModel->getBalance($userId);
            if ($balanceInfo['available_balance'] < $amount) {
                throw new Exception("Balans yetarli emas");
            }

            // Faol savdolarni tekshirish
            $sql = "SELECT COUNT(*) as count FROM trades 
                    WHERE (creator_id = ? OR partner_id = ?) AND status = 'active'";
            $stmt = $this->query($sql, array($userId, $userId));
            $result = $stmt->fetch();

            if ($result['count'] > 0) {
                throw new Exception("Sizda faol savdolar mavjud. Avval ularni yakunlang");
            }

            // Balansni kamaytirish
            $updateResult = $this->userModel->updateBalance($userId, $amount, 'subtract');
            if (!$updateResult['success']) {
                throw new Exception($updateResult['error']);
            }

            // Tranzaksiya yaratish
            $this->transactionModel->createTransaction(array(
                'user_id' => $userId,
                'type' => 'withdrawal',
                'amount' => -$amount,
                'description' => "Pul yechish - " . substr($cardNumber, 0, 4) . '****',
                'reference_id' => uniqid('WD_')
            ));

            // Audit log
            $this->logAction(
                $userId,
                'withdrawal',
                'payment',
                null,
                null,
                array('amount' => $amount, 'card' => substr($cardNumber, 0, 4) . '****')
            );

            $this->db->commit();

            return array(
                'success' => true,
                'reference_id' => uniqid('WD_')
            );

        } catch (Exception $e) {
            $this->db->rollback();
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    public function addPaymentMethod($userId, $data)
    {
        $sql = "INSERT INTO payment_methods (user_id, type, card_number, card_holder_name) 
                VALUES (?, ?, ?, ?)";

        $cardNumber = isset($data['card_number']) ?
            substr($data['card_number'], 0, 4) . '****' . substr($data['card_number'], -4) : null;

        $params = array(
            $userId,
            $data['type'],
            $cardNumber,
            $data['card_holder_name'] ?? null
        );

        $this->query($sql, $params);

        return array(
            'success' => true,
            'method_id' => $this->db->lastInsertId()
        );
    }

    public function getUserPaymentMethods($userId)
    {
        $sql = "SELECT * FROM payment_methods WHERE user_id = ? AND is_active = 1";
        $stmt = $this->query($sql, array($userId));
        return $stmt->fetchAll();
    }
}