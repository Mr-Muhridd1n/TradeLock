// Database.php
<?php
class Database {
    private $connection;
    
    public function __construct() {
        try {
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            throw new Exception("Query failed: " . $e->getMessage());
        }
    }
    
    public function fetch($sql, $params = []) {
        return $this->query($sql, $params)->fetch();
    }
    
    public function fetchAll($sql, $params = []) {
        return $this->query($sql, $params)->fetchAll();
    }
    
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
    
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    public function commit() {
        return $this->connection->commit();
    }
    
    public function rollback() {
        return $this->connection->rollback();
    }
    
    // Database yaratish SQL
    public function createTables() {
        $tables = [
            // Foydalanuvchilar jadvali
            "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                telegram_id BIGINT UNIQUE NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                username VARCHAR(255),
                language_code VARCHAR(10) DEFAULT 'uz',
                is_premium BOOLEAN DEFAULT FALSE,
                balance DECIMAL(15,2) DEFAULT 0.00,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            // Savdolar jadvali
            "CREATE TABLE IF NOT EXISTS trades (
                id INT AUTO_INCREMENT PRIMARY KEY,
                creator_id INT NOT NULL,
                participant_id INT NULL,
                trade_name VARCHAR(255) NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                commission_type ENUM('creator', 'participant', 'split') NOT NULL,
                commission_amount DECIMAL(15,2) NOT NULL,
                trade_type ENUM('sell', 'buy') NOT NULL,
                status ENUM('active', 'in_progress', 'completed', 'cancelled') DEFAULT 'active',
                secret_link VARCHAR(255) UNIQUE NOT NULL,
                creator_confirmed BOOLEAN DEFAULT FALSE,
                participant_confirmed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (creator_id) REFERENCES users(id),
                FOREIGN KEY (participant_id) REFERENCES users(id)
            )",
            
            // To'lovlar jadvali
            "CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type ENUM('deposit', 'withdraw', 'trade_earn', 'trade_spend', 'commission') NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
                payment_method VARCHAR(100),
                card_number VARCHAR(20),
                transaction_id VARCHAR(255) UNIQUE,
                trade_id INT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (trade_id) REFERENCES trades(id)
            )",
            
            // Sozlamalar jadvali
            "CREATE TABLE IF NOT EXISTS user_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                balance_hide BOOLEAN DEFAULT FALSE,
                theme_dark BOOLEAN DEFAULT FALSE,
                notifications_app BOOLEAN DEFAULT TRUE,
                notifications_email BOOLEAN DEFAULT FALSE,
                notifications_sms BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )",
            
            // Karta ma'lumotlari jadvali
            "CREATE TABLE IF NOT EXISTS user_cards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                card_number VARCHAR(20) NOT NULL,
                card_name VARCHAR(255),
                card_type VARCHAR(50),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )",
            
            // Referral tizimi
            "CREATE TABLE IF NOT EXISTS referrals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                referrer_id INT NOT NULL,
                referred_id INT NOT NULL,
                bonus_amount DECIMAL(15,2) DEFAULT 0.00,
                status ENUM('pending', 'completed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (referrer_id) REFERENCES users(id),
                FOREIGN KEY (referred_id) REFERENCES users(id),
                UNIQUE KEY unique_referral (referrer_id, referred_id)
            )",
            
            // Xabarlar tarixi
            "CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                trade_id INT NULL,
                message_type ENUM('system', 'trade', 'payment', 'notification') NOT NULL,
                title VARCHAR(255),
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (trade_id) REFERENCES trades(id)
            )"
        ];
        
        foreach ($tables as $sql) {
            $this->query($sql);
        }
        
        return true;
    }
}
?>