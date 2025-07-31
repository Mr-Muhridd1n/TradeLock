<?php
// config/database.php

define('DB_HOST', 'localhost');
define('DB_NAME', 'trade_lock_db');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_CHARSET', 'utf8mb4');

// Komisiya foizi
define('COMMISSION_RATE', 2); // 2%

// Minimal va maksimal savdo summasi
define('MIN_TRADE_AMOUNT', 1000);
define('MAX_TRADE_AMOUNT', 50000000);

// Minimal pul yechish summasi
define('MIN_WITHDRAWAL_AMOUNT', 10000);

// Bot tokeni
define('BOT_TOKEN', 'your_bot_token');
define('BOT_USERNAME', 'Trade_Lock_bot');

// App URL
define('APP_URL', 'https://trade-lock.vercel.app/');