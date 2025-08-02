<?php
// models/User.php

require_once __DIR__ . '/BaseModel.php';

class User extends BaseModel
{
    protected $table = 'users';

    public function createOrUpdate($telegramData)
    {
        $this->db->beginTransaction();
        
        try {
            // Validate required fields
            $this->validateRequired($telegramData, array('id'));
            
            $telegramId = intval($telegramData['id']);
            $username = isset($telegramData['username']) ? $this->sanitizeString($telegramData['username']) : null;
            $firstName = isset($telegramData['first_name']) ? $this->sanitizeString($telegramData['first_name']) : null;
            $lastName = isset($telegramData['last_name']) ? $this->sanitizeString($telegramData['last_name']) : null;

            $sql = "INSERT INTO users (telegram_id, username, first_name, last_name, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, NOW(), NOW()) 
                    ON DUPLICATE KEY UPDATE 
                    username = VALUES(username), 
                    first_name = VALUES(first_name), 
                    last_name = VALUES(last_name),
                    updated_at = NOW()";

            $this->query($sql, array($telegramId, $username, $firstName, $lastName));

            $user = $this->findByTelegramId($telegramId);
            
            if (!$user) {
                throw new Exception("Failed to create or find user");
            }

            $this->db->commit();
            return $user;
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
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

        if (!$result) {
            throw new Exception("User not found");
        }

        return array(
            'balance' => floatval($result['balance']),
            'frozen_balance' => floatval($result['frozen_balance']),
            'available_balance' => floatval($result['balance']) - floatval($result['frozen_balance'])
        );
    }

    public function updateBalance($userId, $amount, $type = 'add')
    {
        $this->db->beginTransaction();

        try {
            // Validate amount
            $amount = $this->validateNumeric($amount, 'Amount', 0);
            
            // Get current balance with lock
            $sql = "SELECT balance FROM users WHERE id = ? FOR UPDATE";
            $stmt = $this->query($sql, array($userId));
            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("User not found");
            }

            $oldBalance = floatval($user['balance']);
            $newBalance = $type === 'add' ? $oldBalance + $amount : $oldBalance - $amount;

            if ($newBalance < 0) {
                throw new Exception("Insufficient balance");
            }

            // Update balance
            $sql = "UPDATE users SET balance = ?, updated_at = NOW() WHERE id = ?";
            $this->query($sql, array($newBalance, $userId));

            // Log the action
            $this->logAction($userId, 'balance_update', 'user', $userId, 
                array('old_balance' => $oldBalance), 
                array('new_balance' => $newBalance, 'amount' => $amount, 'type' => $type)
            );

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
            // Validate amount
            $amount = $this->validateNumeric($amount, 'Amount', 0);
            
            $sql = "SELECT balance, frozen_balance FROM users WHERE id = ? FOR UPDATE";
            $stmt = $this->query($sql, array($userId));
            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("User not found");
            }

            $currentBalance = floatval($user['balance']);
            $currentFrozen = floatval($user['frozen_balance']);
            $availableBalance = $currentBalance - $currentFrozen;

            if ($availableBalance < $amount) {
                throw new Exception("Insufficient available balance");
            }

            $newFrozenBalance = $currentFrozen + $amount;

            $sql = "UPDATE users SET frozen_balance = ?, updated_at = NOW() WHERE id = ?";
            $this->query($sql, array($newFrozenBalance, $userId));

            // Log the action
            $this->logAction($userId, 'balance_freeze', 'user', $userId, 
                array('frozen_balance' => $currentFrozen), 
                array('frozen_balance' => $newFrozenBalance, 'freeze_amount' => $amount)
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

    public function unfreezeBalance($userId, $amount)
    {
        $this->db->beginTransaction();

        try {
            // Validate amount
            $amount = $this->validateNumeric($amount, 'Amount', 0);
            
            $sql = "SELECT frozen_balance FROM users WHERE id = ? FOR UPDATE";
            $stmt = $this->query($sql, array($userId));
            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("User not found");
            }

            $currentFrozen = floatval($user['frozen_balance']);
            
            if ($currentFrozen < $amount) {
                throw new Exception("Invalid frozen amount to unfreeze");
            }

            $newFrozenBalance = $currentFrozen - $amount;

            $sql = "UPDATE users SET frozen_balance = ?, updated_at = NOW() WHERE id = ?";
            $this->query($sql, array($newFrozenBalance, $userId));

            // Log the action
            $this->logAction($userId, 'balance_unfreeze', 'user', $userId, 
                array('frozen_balance' => $currentFrozen), 
                array('frozen_balance' => $newFrozenBalance, 'unfreeze_amount' => $amount)
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

    public function getUserStats($userId)
    {
        $sql = "SELECT 
                    (SELECT COUNT(*) FROM trades WHERE creator_id = ? OR partner_id = ?) as total_trades,
                    (SELECT COUNT(*) FROM trades WHERE (creator_id = ? OR partner_id = ?) AND status = 'active') as active_trades,
                    (SELECT COUNT(*) FROM trades WHERE (creator_id = ? OR partner_id = ?) AND status = 'completed') as completed_trades,
                    (SELECT SUM(amount) FROM trades WHERE (creator_id = ? OR partner_id = ?) AND status = 'completed') as total_volume";
        
        $stmt = $this->query($sql, array($userId, $userId, $userId, $userId, $userId, $userId, $userId, $userId));
        return $stmt->fetch();
    }

    public function isActive($userId)
    {
        $sql = "SELECT is_active FROM users WHERE id = ?";
        $stmt = $this->query($sql, array($userId));
        $result = $stmt->fetch();
        
        return $result ? (bool)$result['is_active'] : false;
    }

    public function setActive($userId, $isActive)
    {
        $sql = "UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?";
        $this->query($sql, array($isActive ? 1 : 0, $userId));
        
        // Log the action
        $this->logAction($userId, 'status_change', 'user', $userId, 
            array('is_active' => !$isActive), 
            array('is_active' => $isActive)
        );
        
        return array('success' => true);
    }
}