<?php
// config/database.php

// Database sozlamalari
define('DB_HOST', 'localhost');
define('DB_NAME', 'tradelock_db');
define('DB_USER', 'tradelock_db');
define('DB_PASS', '6EnfykXbTXTzR7fz');
define('DB_CHARSET', 'utf8mb4');

// Komisiya foizi
define('COMMISSION_RATE', 2); // 2%

// Minimal va maksimal savdo summasi
define('MIN_TRADE_AMOUNT', 1000);
define('MAX_TRADE_AMOUNT', 50000000);

// Minimal pul yechish summasi
define('MIN_WITHDRAWAL_AMOUNT', 10000);

// Bot tokeni - O'z bot tokeningizni kiriting
define('BOT_TOKEN', '8123651961:AAGqNuwUWkg49-4icEP9_LUuJi49TrHEVt8');
define('BOT_USERNAME', 'Trade_Lock_bot');

// App URL
define('APP_URL', 'https://trade-lock.vercel.app/');

// Development rejimi
define('DEVELOPMENT_MODE', true);

// CORS sozlamalari
define('ALLOWED_ORIGINS', json_encode([
    'https://trade-lock.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
]));

// Log sozlamalari
define('ENABLE_LOGGING', true);
define('LOG_LEVEL', 'DEBUG'); // DEBUG, INFO, WARNING, ERROR

// Error handling
if (DEVELOPMENT_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('log_errors', 1);
} else {
    error_reporting(E_ERROR | E_WARNING | E_PARSE);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
}

// Custom error logging function
function logMessage($level, $message, $context = []) {
    if (!ENABLE_LOGGING) return;
    
    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? json_encode($context) : '';
    $logMessage = "[$timestamp] [$level] $message $contextStr" . PHP_EOL;
    
    error_log($logMessage, 3, __DIR__ . '/../logs/app.log');
}