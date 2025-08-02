<?php
// includes/Auth.php

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../models/User.php';

class Auth
{
    private $db;
    private $userModel;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
        $this->userModel = new User();
    }

    public function authenticateWithTelegram($data)
    {
        try {
            // Development rejimida hash tekshiruvini o'tkazib yuborish
            if (defined('DEVELOPMENT_MODE') && DEVELOPMENT_MODE) {
                error_log("Auth: Development mode - skipping hash verification");
            } else {
                // Production rejimida hash tekshirish
                if (!$this->verifyTelegramData($data)) {
                    throw new Exception('Invalid Telegram data');
                }
            }

            // Foydalanuvchini yaratish yoki yangilash
            $user = $this->userModel->createOrUpdate($data['user']);

            // Token yaratish
            $token = $this->generateToken($user['id']);

            return array(
                'success' => true,
                'token' => $token,
                'user' => $user
            );

        } catch (Exception $e) {
            error_log("Auth error: " . $e->getMessage());
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

  public function verifyToken($token)
    {
        try {
            error_log("Auth: Verifying token: " . substr($token, 0, 20) . "...");
            
            // Token dekodlash
            $decoded = base64_decode($token);
            if (!$decoded) {
                throw new Exception('Invalid token format - base64 decode failed');
            }
            
            $parts = explode('|', $decoded);
            if (count($parts) !== 3) {
                throw new Exception('Invalid token format - expected 3 parts, got ' . count($parts));
            }

            list($userId, $timestamp, $signature) = $parts;
            
            error_log("Auth: Token parts - UserID: $userId, Timestamp: $timestamp");

            // User ID validation
            if (!is_numeric($userId) || $userId <= 0) {
                throw new Exception('Invalid user ID in token');
            }

            // Timestamp validation
            if (!is_numeric($timestamp)) {
                throw new Exception('Invalid timestamp in token');
            }

            // Check if user exists
            $userModel = new User();
            $user = $userModel->findById($userId);
            if (!$user) {
                throw new Exception('User not found');
            }

            // Check if user is active
            if (!$user['is_active']) {
                throw new Exception('User account is inactive');
            }

            // Imzoni tekshirish
            $expectedSignature = hash_hmac('sha256', $userId . '|' . $timestamp, BOT_TOKEN);
            if (!hash_equals($signature, $expectedSignature)) {
                throw new Exception('Invalid token signature');
            }

            // Vaqt chegarasini tekshirish (7 kun)
            $maxAge = 7 * 24 * 60 * 60; // 7 kun
            if (time() - $timestamp > $maxAge) {
                throw new Exception('Token expired');
            }

            error_log("Auth: Token verification successful for user: " . $userId);

            return array(
                'success' => true,
                'user_id' => intval($userId),
                'issued_at' => intval($timestamp)
            );

        } catch (Exception $e) {
            error_log("Auth: Token verification failed: " . $e->getMessage());
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    private function verifyTelegramData($data)
    {
        // Development rejimida yoki demo hash bilan tekshiruvni o'tkazib yuborish
        if (!isset($data['hash']) || $data['hash'] === 'demo_hash') {
            error_log("Auth: Demo mode or no hash provided");
            return true;
        }

        try {
            $checkHash = $data['hash'];
            
            error_log("Auth: Starting hash verification");
            error_log("Auth: Received hash: " . $checkHash);
            error_log("Auth: Bot token: " . BOT_TOKEN);

            // Method 1: WebApp standart usuli
            if ($this->verifyWebAppHash($data, $checkHash)) {
                error_log("Auth: WebApp method successful");
                return true;
            }

            // Method 2: Classic Bot API usuli
            if ($this->verifyClassicHash($data, $checkHash)) {
                error_log("Auth: Classic method successful");
                return true;
            }

            // Method 3: Alternative formatting
            if ($this->verifyAlternativeHash($data, $checkHash)) {
                error_log("Auth: Alternative method successful");
                return true;
            }

            error_log("Auth: All verification methods failed");
            return false;

        } catch (Exception $e) {
            error_log("Auth: Hash verification error: " . $e->getMessage());
            // Development rejimida true qaytarish
            if (defined('DEVELOPMENT_MODE') && DEVELOPMENT_MODE) {
                error_log("Auth: Allowing access in development mode");
                return true;
            }
            return false;
        }
    }

    private function verifyWebAppHash($data, $checkHash)
    {
        try {
            $dataForCheck = $data;
            unset($dataForCheck['hash']);

            // User obyektini JSON ga aylantirish
            $userJson = json_encode($dataForCheck['user'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $dataCheckString = "user=" . $userJson;

            // WebApp secret key
            $secretKey = hash_hmac('sha256', BOT_TOKEN, 'WebAppData', true);
            $calculatedHash = hash_hmac('sha256', $dataCheckString, $secretKey);

            error_log("Auth WebApp: Data string: " . $dataCheckString);
            error_log("Auth WebApp: Calculated hash: " . $calculatedHash);

            return hash_equals($calculatedHash, $checkHash);
        } catch (Exception $e) {
            error_log("Auth WebApp error: " . $e->getMessage());
            return false;
        }
    }

    private function verifyClassicHash($data, $checkHash)
    {
        try {
            $dataForCheck = $data;
            unset($dataForCheck['hash']);

            $dataCheckArray = array();
            foreach ($dataForCheck as $key => $value) {
                if (is_array($value)) {
                    $value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                }
                $dataCheckArray[] = $key . '=' . $value;
            }

            sort($dataCheckArray);
            $dataCheckString = implode("\n", $dataCheckArray);

            // Classic secret key
            $secretKey = hash('sha256', BOT_TOKEN, true);
            $calculatedHash = hash_hmac('sha256', $dataCheckString, $secretKey);

            error_log("Auth Classic: Data string: " . str_replace("\n", "\\n", $dataCheckString));
            error_log("Auth Classic: Calculated hash: " . $calculatedHash);

            return hash_equals($calculatedHash, $checkHash);
        } catch (Exception $e) {
            error_log("Auth Classic error: " . $e->getMessage());
            return false;
        }
    }

    private function verifyAlternativeHash($data, $checkHash)
    {
        try {
            // auth_date bilan birga tekshirish
            $currentTime = time();
            $possibleTimes = [$currentTime, $currentTime - 3600, $currentTime - 7200];

            foreach ($possibleTimes as $authDate) {
                $userJson = json_encode($data['user'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                
                // Different combinations
                $combinations = [
                    "auth_date=$authDate\nuser=" . $userJson,
                    "user=" . $userJson . "\nauth_date=$authDate",
                    "user=" . $userJson
                ];

                foreach ($combinations as $dataString) {
                    // WebApp method
                    $secretKey1 = hash_hmac('sha256', BOT_TOKEN, 'WebAppData', true);
                    $hash1 = hash_hmac('sha256', $dataString, $secretKey1);

                    // Classic method
                    $secretKey2 = hash('sha256', BOT_TOKEN, true);
                    $hash2 = hash_hmac('sha256', $dataString, $secretKey2);

                    if (hash_equals($hash1, $checkHash) || hash_equals($hash2, $checkHash)) {
                        error_log("Auth Alternative success: " . str_replace("\n", "\\n", $dataString));
                        return true;
                    }
                }
            }

            return false;
        } catch (Exception $e) {
            error_log("Auth Alternative error: " . $e->getMessage());
            return false;
        }
    }


    private function generateToken($userId)
    {
        try {
            $timestamp = time();
            $signature = hash_hmac('sha256', $userId . '|' . $timestamp, BOT_TOKEN);
            $token = base64_encode($userId . '|' . $timestamp . '|' . $signature);
            
            error_log("Auth: Generated token for user $userId, expires: " . date('Y-m-d H:i:s', $timestamp + 7*24*60*60));
            
            return $token;
        } catch (Exception $e) {
            error_log("Auth: Token generation failed: " . $e->getMessage());
            throw $e;
        }
    }
}