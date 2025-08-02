<?php
// models/Transaction.php

require_once __DIR__ . '/BaseModel.php';

class Transaction extends BaseModel
{
    protected $table = 'transactions';

    public function createTransaction($data)
    {
        $this->db->beginTransaction();

        try {
            // Validate required fields
            $this->validateRequired($data, array('user_id', 'type', 'amount', 'description'));

            // Validate amount
            $amount = $this->validateNumeric($data['amount'], 'Amount');

            // Joriy balansni olish
            $sql = "SELECT balance FROM users WHERE id = ? FOR UPDATE";
            $stmt = $this->query($sql, array($data['user_id']));
            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("User not found");
            }

            $balanceBefore = floatval($user['balance']);
            $balanceAfter = $balanceBefore + $amount;

            // Tranzaksiya yaratish
            $sql = "INSERT INTO transactions (user_id, trade_id, type, amount, balance_before, 
                    balance_after, description, reference_id, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";

            $params = array(
                $data['user_id'],
                isset($data['trade_id']) ? $data['trade_id'] : null,
                $this->sanitizeString($data['type']),
                $amount,
                $balanceBefore,
                $balanceAfter,
                $this->sanitizeString($data['description']),
                isset($data['reference_id']) ? $this->sanitizeString($data['reference_id']) : null
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
        // Validate parameters
        $limit = $this->validateNumeric($limit, 'Limit', 1, 100);
        $offset = $this->validateNumeric($offset, 'Offset', 0);

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
        // Validate parameters
        $limit = $this->validateNumeric($limit, 'Limit', 1, 100);
        $type = $this->sanitizeString($type);

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
        $validPeriods = array('day', 'week', 'month', 'year');
        
        if (!in_array($period, $validPeriods)) {
            $period = 'month';
        }

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
        $result = $stmt->fetch();

        // Convert to float and handle nulls
        return array(
            'total_income' => floatval($result['total_income'] ?? 0),
            'total_expense' => floatval($result['total_expense'] ?? 0),
            'total_commission' => floatval($result['total_commission'] ?? 0),
            'transaction_count' => intval($result['transaction_count'] ?? 0),
            'unique_trades' => intval($result['unique_trades'] ?? 0)
        );
    }

    public function getTransactionById($transactionId)
    {
        $sql = "SELECT t.*, tr.trade_name, tr.secret_code,
                u.first_name, u.last_name, u.username
                FROM transactions t
                LEFT JOIN trades tr ON t.trade_id = tr.id
                LEFT JOIN users u ON t.user_id = u.id
                WHERE t.id = ?";

        $stmt = $this->query($sql, array($transactionId));
        return $stmt->fetch();
    }

    public function getTransactionHistory($userId, $startDate = null, $endDate = null, $limit = 100)
    {
        $sql = "SELECT t.*, tr.trade_name, tr.secret_code 
                FROM transactions t
                LEFT JOIN trades tr ON t.trade_id = tr.id
                WHERE t.user_id = ?";
        
        $params = array($userId);

        if ($startDate) {
            $sql .= " AND t.created_at >= ?";
            $params[] = $startDate;
        }

        if ($endDate) {
            $sql .= " AND t.created_at <= ?";
            $params[] = $endDate;
        }

        $sql .= " ORDER BY t.created_at DESC LIMIT ?";
        $params[] = intval($limit);

        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }

    public function getTotalVolume($userId, $period = 'all')
    {
        $dateCondition = "";
        
        switch ($period) {
            case 'day':
                $dateCondition = "AND created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)";
                break;
            case 'week':
                $dateCondition = "AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
                break;
            case 'month':
                $dateCondition = "AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
                break;
            case 'year':
                $dateCondition = "AND created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
                break;
        }

        $sql = "SELECT 
                SUM(CASE WHEN type = 'trade_release' AND amount > 0 THEN amount ELSE 0 END) as total_received,
                SUM(CASE WHEN type = 'trade_release' AND amount < 0 THEN ABS(amount) ELSE 0 END) as total_paid,
                COUNT(CASE WHEN type = 'trade_release' THEN 1 END) as trade_count
                FROM transactions 
                WHERE user_id = ? {$dateCondition}";

        $stmt = $this->query($sql, array($userId));
        $result = $stmt->fetch();

        return array(
            'total_received' => floatval($result['total_received'] ?? 0),
            'total_paid' => floatval($result['total_paid'] ?? 0),
            'trade_count' => intval($result['trade_count'] ?? 0),
            'net_amount' => floatval($result['total_received'] ?? 0) - floatval($result['total_paid'] ?? 0)
        );
    }
}