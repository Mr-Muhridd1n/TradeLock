<?php
// models/Transaction.php

require_once 'BaseModel.php';

class Transaction extends BaseModel
{
    protected $table = 'transactions';

    public function createTransaction($data)
    {
        $this->db->beginTransaction();

        try {
            // Joriy balansni olish
            $sql = "SELECT balance FROM users WHERE id = ? FOR UPDATE";
            $stmt = $this->query($sql, array($data['user_id']));
            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("User not found");
            }

            $balanceBefore = $user['balance'];
            $balanceAfter = $balanceBefore + $data['amount'];

            // Tranzaksiya yaratish
            $sql = "INSERT INTO transactions (user_id, trade_id, type, amount, balance_before, 
                    balance_after, description, reference_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            $params = array(
                $data['user_id'],
                $data['trade_id'] ?? null,
                $data['type'],
                $data['amount'],
                $balanceBefore,
                $balanceAfter,
                $data['description'] ?? null,
                $data['reference_id'] ?? null
            );

            $this->query($sql, $params);

            $this->db->commit();

            return array(
                'success' => true,
                'transaction_id' => $this->db->lastInsertId()
            );

        } catch (Exception $e) {
            $this->db->rollback();
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    public function getUserTransactions($userId, $limit = 50, $offset = 0)
    {
        $sql = "SELECT t.*, tr.trade_name, tr.secret_code 
                FROM transactions t
                LEFT JOIN trades tr ON t.trade_id = tr.id
                WHERE t.user_id = ?
                ORDER BY t.created_at DESC
                LIMIT ? OFFSET ?";

        $stmt = $this->query($sql, array($userId, $limit, $offset));
        return $stmt->fetchAll();
    }

    public function getTransactionsByType($userId, $type, $limit = 50)
    {
        $sql = "SELECT t.*, tr.trade_name, tr.secret_code 
                FROM transactions t
                LEFT JOIN trades tr ON t.trade_id = tr.id
                WHERE t.user_id = ? AND t.type = ?
                ORDER BY t.created_at DESC
                LIMIT ?";

        $stmt = $this->query($sql, array($userId, $type, $limit));
        return $stmt->fetchAll();
    }

    public function getTransactionStats($userId, $period = 'month')
    {
        $dateCondition = "";

        switch ($period) {
            case 'day':
                $dateCondition = "AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)";
                break;
            case 'week':
                $dateCondition = "AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
                break;
            case 'month':
                $dateCondition = "AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
                break;
            case 'year':
                $dateCondition = "AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
                break;
        }

        $sql = "SELECT 
                SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_expense,
                SUM(CASE WHEN type = 'commission' THEN ABS(amount) ELSE 0 END) as total_commission,
                COUNT(*) as transaction_count,
                COUNT(DISTINCT trade_id) as unique_trades
                FROM transactions t
                WHERE t.user_id = ? {$dateCondition}";

        $stmt = $this->query($sql, array($userId));
        return $stmt->fetch();
    }
}