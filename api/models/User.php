<?php
// models/User.php

require_once 'BaseModel.php';

class User extends BaseModel
{
    protected $table = 'users';

    public function createOrUpdate($telegramData)
    {
        $sql = "INSERT INTO users (telegram_id, username, first_name, last_name) 
                VALUES (?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                username = VALUES(username), 
                first_name = VALUES(first_name), 
                last_name = VALUES(last_name),
                updated_at = CURRENT_TIMESTAMP";

        $params = array(
            $telegramData['id'],
            $telegramData['username'] ?? null,
            $telegramData['first_name'] ?? null,
            $telegramData['last_name'] ?? null
        );

        $this->query($sql, $params);

        return $this->findByTelegramId($telegramData['id']);
    }

    public function findByTelegramId($telegramId)
    {
        $sql = "SELECT * FROM users WHERE telegram_id = ?";
        $stmt = $this->query($sql, array($telegramId));
        return $stmt->fetch();
    }

    public function getBalance($userId)
    {
        $sql = "SELECT balance, frozen_balance FROM users WHERE id = ?";
        $stmt = $this->query($sql, array($userId));
        $result = $stmt->fetch();

        return array(
            'balance' => $result['balance'],
            'frozen_balance' => $result['frozen_balance'],
            'available_balance' => $result['balance'] - $result['frozen_balance']
        );
    }

    public function updateBalance($userId, $amount, $type = 'add')
    {
        $this->db->beginTransaction();

        try {
            // Joriy balansni olish
            $sql = "SELECT balance FROM users WHERE id = ? FOR UPDATE";
            $stmt = $this->query($sql, array($userId));
            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("User not found");
            }

            $oldBalance = $user['balance'];
            $newBalance = $type === 'add' ? $oldBalance + $amount : $oldBalance - $amount;

            if ($newBalance < 0) {
                throw new Exception("Insufficient balance");
            }

            // Balansni yangilash
            $sql = "UPDATE users SET balance = ? WHERE id = ?";
            $this->query($sql, array($newBalance, $userId));

            $this->db->commit();

            return array(
                'success' => true,
                'old_balance' => $oldBalance,
                'new_balance' => $newBalance
            );

        } catch (Exception $e) {
            $this->db->rollback();
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    public function freezeBalance($userId, $amount)
    {
        $this->db->beginTransaction();

        try {
            $sql = "SELECT balance, frozen_balance FROM users WHERE id = ? FOR UPDATE";
            $stmt = $this->query($sql, array($userId));
            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("User not found");
            }

            $availableBalance = $user['balance'] - $user['frozen_balance'];

            if ($availableBalance < $amount) {
                throw new Exception("Insufficient available balance");
            }

            $newFrozenBalance = $user['frozen_balance'] + $amount;

            $sql = "UPDATE users SET frozen_balance = ? WHERE id = ?";
            $this->query($sql, array($newFrozenBalance, $userId));

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

    public function unfreezeBalance($userId, $amount)
    {
        $this->db->beginTransaction();

        try {
            $sql = "SELECT frozen_balance FROM users WHERE id = ? FOR UPDATE";
            $stmt = $this->query($sql, array($userId));
            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user['frozen_balance'] < $amount) {
                throw new Exception("Invalid frozen amount");
            }

            $newFrozenBalance = $user['frozen_balance'] - $amount;

            $sql = "UPDATE users SET frozen_balance = ? WHERE id = ?";
            $this->query($sql, array($newFrozenBalance, $userId));

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
}