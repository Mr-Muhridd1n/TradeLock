<?php
// includes/Auth.php

require_once 'Database.php';
require_once '../models/User.php';

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
            // Telegram ma'lumotlarini tekshirish
            if (!$this->verifyTelegramData($data)) {
                throw new Exception('Invalid Telegram data');
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
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    public function verifyToken($token)
    {
        try {
            // Token dekodlash (bu yerda JWT yoki boshqa token tizimini ishlatish mumkin)
            // Soddalik uchun base64 va vaqt tekshiruvidan foydalanamiz
            $decoded = base64_decode($token);
            $parts = explode('|', $decoded);

            if (count($parts) !== 3) {
                throw new Exception('Invalid token format');
            }

            list($userId, $timestamp, $signature) = $parts;

            // Imzoni tekshirish
            $expectedSignature = hash_hmac('sha256', $userId . '|' . $timestamp, BOT_TOKEN);
            if ($signature !== $expectedSignature) {
                throw new Exception('Invalid token signature');
            }

            // Vaqt chegarasini tekshirish (24 soat)
            if (time() - $timestamp > 86400) {
                throw new Exception('Token expired');
            }

            return array(
                'success' => true,
                'user_id' => $userId
            );

        } catch (Exception $e) {
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    private function verifyTelegramData($data)
    {
        if (!isset($data['hash'])) {
            return false;
        }

        $checkHash = $data['hash'];
        unset($data['hash']);

        $dataCheckArray = array();
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value);
            }
            $dataCheckArray[] = $key . '=' . $value;
        }

        sort($dataCheckArray);
        $dataCheckString = implode("\n", $dataCheckArray);

        $secretKey = hash('sha256', BOT_TOKEN, true);
        $hash = hash_hmac('sha256', $dataCheckString, $secretKey);

        return $hash === $checkHash;
    }

    private function generateToken($userId)
    {
        $timestamp = time();
        $signature = hash_hmac('sha256', $userId . '|' . $timestamp, BOT_TOKEN);
        $token = base64_encode($userId . '|' . $timestamp . '|' . $signature);
        return $token;
    }
}