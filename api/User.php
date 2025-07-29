<?php
class User {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function createOrUpdate($userData) {
        // Foydalanuvchi mavjudligini tekshirish
        $existing = $this->db->fetch(
            "SELECT * FROM users WHERE telegram_id = ?",
            [$userData['telegram_id']]
        );
        
        if ($existing) {
            // Mavjud foydalanuvchini yangilash
            $this->db->query(
                "UPDATE users SET 
                    first_name = ?, 
                    last_name = ?, 
                    username = ?, 
                    language_code = ?, 
                    is_premium = ?,
                    updated_at = NOW()
                WHERE telegram_id = ?",
                [
                    $userData['first_name'],
                    $userData['last_name'], 
                    $userData['username'],
                    $userData['language_code'],
                    $userData['is_premium'],
                    $userData['telegram_id']
                ]
            );
            
            $userId = $existing['id'];
        } else {
            // Yangi foydalanuvchi yaratish
            $this->db->query(
                "INSERT INTO users (telegram_id, first_name, last_name, username, language_code, is_premium, balance) 
                VALUES (?, ?, ?, ?, ?, ?, 0.00)",
                [
                    $userData['telegram_id'],
                    $userData['first_name'],
                    $userData['last_name'],
                    $userData['username'],
                    $userData['language_code'],
                    $userData['is_premium']
                ]
            );
            
            $userId = $this->db->lastInsertId();
            
            // Sozlamalarni yaratish
            $this->db->query(
                "INSERT INTO user_settings (user_id) VALUES (?)",
                [$userId]
            );
        }
        
        return $this->getProfile($userId);
    }
    
    public function getProfile($userId) {
        $user = $this->db->fetch(
            "SELECT u.*, us.* FROM users u 
             LEFT JOIN user_settings us ON u.id = us.user_id 
             WHERE u.id = ?",
            [$userId]
        );
        
        if (!$user) {
            throw new Exception('User not found');
        }
        
        // Balans va tranzaksiya statistikasi
        $stats = $this->getUserStats($userId);
        
        return [
            'id' => $user['id'],
            'telegram_id' => $user['telegram_id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'username' => $user['username'],
            'language_code' => $user['language_code'],
            'is_premium' => $user['is_premium'],
            'balance' => floatval($user['balance']),
            'settings' => [
                'balance_hide' => $user['balance_hide'],
                'theme_dark' => $user['theme_dark'],
                'notifications' => [
                    'app' => $user['notifications_app'],
                    'email' => $user['notifications_email'],
                    'sms' => $user['notifications_sms']
                ]
            ],
            'stats' => $stats
        ];
    }
    
    public function updateProfile($userId, $data) {
        $allowedFields = ['first_name', 'last_name', 'username'];
        $updateFields = [];
        $params = [];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateFields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        
        if (!empty($updateFields)) {
            $params[] = $userId;
            $sql = "UPDATE users SET " . implode(', ', $updateFields) . ", updated_at = NOW() WHERE id = ?";
            $this->db->query($sql, $params);
        }
        
        return $this->getProfile($userId);
    }
    
    public function updateSettings($userId, $settings) {
        $allowedSettings = [
            'balance_hide', 'theme_dark', 
            'notifications_app', 'notifications_email', 'notifications_sms'
        ];
        
        $updateFields = [];
        $params = [];
        
        foreach ($allowedSettings as $setting) {
            if (isset($settings[$setting])) {
                $updateFields[] = "$setting = ?";
                $params[] = $settings[$setting] ? 1 : 0;
            }
        }
        
        if (!empty($updateFields)) {
            $params[] = $userId;
            $sql = "UPDATE user_settings SET " . implode(', ', $updateFields) . ", updated_at = NOW() WHERE user_id = ?";
            $this->db->query($sql, $params);
        }
        
        return $this->getProfile($userId);
    }
    
    public function updateBalance($userId, $amount, $operation = 'add') {
        $this->db->beginTransaction();
        
        try {
            // Current balance olish
            $user = $this->db->fetch("SELECT balance FROM users WHERE id = ?", [$userId]);
            
            if (!$user) {
                throw new Exception('User not found');
            }
            
            $currentBalance = floatval($user['balance']);
            
            if ($operation === 'add') {
                $newBalance = $currentBalance + $amount;
            } else {
                $newBalance = $currentBalance - $amount;
                
                if ($newBalance < 0) {
                    throw new Exception('Insufficient balance');
                }
            }
            
            // Balansni yangilash
            $this->db->query(
                "UPDATE users SET balance = ?, updated_at = NOW() WHERE id = ?",
                [$newBalance, $userId]
            );
            
            $this->db->commit();
            return $newBalance;
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    public function addCard($userId, $cardData) {
        $this->db->query(
            "INSERT INTO user_cards (user_id, card_number, card_name, card_type) VALUES (?, ?, ?, ?)",
            [
                $userId,
                $cardData['card_number'],
                $cardData['card_name'] ?? '',
                $cardData['card_type'] ?? 'unknown'
            ]
        );
        
        return $this->db->lastInsertId();
    }
    
    public function getCards($userId) {
        return $this->db->fetchAll(
            "SELECT * FROM user_cards WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC",
            [$userId]
        );
    }
    
    public function removeCard($userId, $cardId) {
        return $this->db->query(
            "UPDATE user_cards SET is_active = 0 WHERE id = ? AND user_id = ?",
            [$cardId, $userId]
        );
    }
    
    private function getUserStats($userId) {
        // Umumiy savdolar soni
        $totalTrades = $this->db->fetch(
            "SELECT COUNT(*) as count FROM trades WHERE creator_id = ? OR participant_id = ?",
            [$userId, $userId]
        )['count'];
        
        // Faol savdolar soni  
        $activeTrades = $this->db->fetch(
            "SELECT COUNT(*) as count FROM trades 
             WHERE (creator_id = ? OR participant_id = ?) AND status IN ('active', 'in_progress')",
            [$userId, $userId]
        )['count'];
        
        // Yakunlangan savdolar soni
        $completedTrades = $this->db->fetch(
            "SELECT COUNT(*) as count FROM trades 
             WHERE (creator_id = ? OR participant_id = ?) AND status = 'completed'",
            [$userId, $userId]
        )['count'];
        
        // Muvaffaqiyat foizi
        $successRate = $totalTrades > 0 ? round(($completedTrades / $totalTrades) * 100, 1) : 0;
        
        // Oxirgi 30 kundagi daromad
        $monthlyEarnings = $this->db->fetch(
            "SELECT COALESCE(SUM(amount), 0) as total FROM payments 
             WHERE user_id = ? AND type = 'trade_earn' AND status = 'completed' 
             AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
            [$userId]
        )['total'];
        
        return [
            'total_trades' => intval($totalTrades),
            'active_trades' => intval($activeTrades),
            'completed_trades' => intval($completedTrades),
            'success_rate' => floatval($successRate),
            'monthly_earnings' => floatval($monthlyEarnings)
        ];
    }
    
    public function getById($id) {
        return $this->db->fetch(
            "SELECT id, telegram_id, first_name, last_name, username, created_at FROM users WHERE id = ?",
            [$id]
        );
    }
    
    public function sendNotification($userId, $title, $message, $type = 'system', $tradeId = null) {
        $this->db->query(
            "INSERT INTO messages (user_id, trade_id, message_type, title, message) VALUES (?, ?, ?, ?, ?)",
            [$userId, $tradeId, $type, $title, $message]
        );
        
        return $this->db->lastInsertId();
    }
    
    public function getNotifications($userId, $limit = 50) {
        return $this->db->fetchAll(
            "SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
            [$userId, $limit]
        );
    }
    
    public function markNotificationAsRead($userId, $messageId) {
        return $this->db->query(
            "UPDATE messages SET is_read = 1 WHERE id = ? AND user_id = ?",
            [$messageId, $userId]
        );
    }
}
?>