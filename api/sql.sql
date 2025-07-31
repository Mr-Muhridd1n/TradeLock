-- Database yaratish
CREATE DATABASE IF NOT EXISTS trade_lock_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE trade_lock_db;

-- Foydalanuvchilar jadvali
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    balance DECIMAL(20, 2) DEFAULT 0.00,
    frozen_balance DECIMAL(20, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_telegram_id (telegram_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Savdolar jadvali
CREATE TABLE trades (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    secret_code VARCHAR(50) UNIQUE NOT NULL,
    creator_id BIGINT UNSIGNED NOT NULL,
    partner_id BIGINT UNSIGNED NULL,
    trade_name VARCHAR(255) NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    commission_amount DECIMAL(20, 2) NOT NULL,
    commission_type ENUM('creator', 'partner', 'split') NOT NULL,
    creator_role ENUM('seller', 'buyer') NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id),
    FOREIGN KEY (partner_id) REFERENCES users(id),
    INDEX idx_secret_code (secret_code),
    INDEX idx_status (status),
    INDEX idx_creator_id (creator_id),
    INDEX idx_partner_id (partner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tranzaksiyalar jadvali
CREATE TABLE transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    trade_id BIGINT UNSIGNED NULL,
    type ENUM('deposit', 'withdrawal', 'trade_hold', 'trade_release', 
              'commission', 'transfer_in', 'transfer_out') NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    balance_before DECIMAL(20, 2) NOT NULL,
    balance_after DECIMAL(20, 2) NOT NULL,
    description TEXT,
    reference_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trade_id) REFERENCES trades(id),
    INDEX idx_user_id (user_id),
    INDEX idx_trade_id (trade_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- To'lov ma'lumotlari
CREATE TABLE payment_methods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('humo', 'uzcard', 'visa', 'mastercard') NOT NULL,
    card_number VARCHAR(20),
    card_holder_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit log jadvali
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT UNSIGNED,
    old_data JSON,
    new_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;