<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'config.php';
require_once 'Database.php';
require_once 'TelegramBot.php';
require_once 'User.php';
require_once 'Trade.php';
require_once 'Payment.php';

class API {
    private $db;
    private $bot;
    
    public function __construct() {
        $this->db = new Database();
        $this->bot = new TelegramBot(BOT_TOKEN);
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $path = str_replace('/api/', '', $path);
        
        $segments = explode('/', trim($path, '/'));
        $action = $segments[0] ?? '';
        $id = $segments[1] ?? null;
        
        try {
            switch ($action) {
                case 'auth':
                    return $this->auth();
                    
                case 'user':
                    return $this->handleUser($method, $id);
                    
                case 'trade':
                    return $this->handleTrade($method, $id);
                    
                case 'payment':
                    return $this->handlePayment($method, $id);
                    
                case 'webhook':
                    return $this->handleWebhook();
                    
                default:
                    return $this->response(['error' => 'Invalid endpoint'], 404);
            }
        } catch (Exception $e) {
            return $this->response(['error' => $e->getMessage()], 500);
        }
    }
    
    private function auth() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['initData'])) {
            return $this->response(['error' => 'Invalid auth data'], 400);
        }
        
        $initData = $data['initData'];
        
        // Telegram WebApp ma'lumotlarini tekshirish
        if (!$this->validateTelegramData($initData)) {
            return $this->response(['error' => 'Invalid Telegram data'], 401);
        }
        
        // Foydalanuvchi ma'lumotlarini parsing qilish
        parse_str($initData, $parsed);
        $user_data = json_decode($parsed['user'], true);
        
        $user = new User($this->db);
        $userData = $user->createOrUpdate([
            'telegram_id' => $user_data['id'],
            'first_name' => $user_data['first_name'] ?? '',
            'last_name' => $user_data['last_name'] ?? '',
            'username' => $user_data['username'] ?? '',
            'language_code' => $user_data['language_code'] ?? 'uz',
            'is_premium' => $user_data['is_premium'] ?? false
        ]);
        
        // JWT token yaratish
        $token = $this->generateToken($userData['id']);
        
        return $this->response([
            'success' => true,
            'token' => $token,
            'user' => $userData
        ]);
    }
    
    private function handleUser($method, $id) {
        $user = new User($this->db);
        
        switch ($method) {
            case 'GET':
                if ($id) {
                    return $this->response($user->getById($id));
                } else {
                    $user_id = $this->getCurrentUserId();
                    return $this->response($user->getProfile($user_id));
                }
                
            case 'PUT':
                $data = json_decode(file_get_contents('php://input'), true);
                $user_id = $this->getCurrentUserId();
                return $this->response($user->updateProfile($user_id, $data));
                
            default:
                return $this->response(['error' => 'Method not allowed'], 405);
        }
    }
    
    private function handleTrade($method, $id) {
        $trade = new Trade($this->db, $this->bot);
        $user_id = $this->getCurrentUserId();
        
        switch ($method) {
            case 'GET':
                if ($id) {
                    return $this->response($trade->getById($id, $user_id));
                } else {
                    $status = $_GET['status'] ?? 'all';
                    return $this->response($trade->getUserTrades($user_id, $status));
                }
                
            case 'POST':
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (isset($data['join_link'])) {
                    // Savdoga qo'shilish
                    return $this->response($trade->joinTrade($data['join_link'], $user_id));
                } else {
                    // Yangi savdo yaratish
                    return $this->response($trade->create($data, $user_id));
                }
                
            case 'PUT':
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (isset($data['action'])) {
                    switch ($data['action']) {
                        case 'confirm':
                            return $this->response($trade->confirm($id, $user_id));
                        case 'cancel':
                            return $this->response($trade->cancel($id, $user_id));
                        case 'complete':
                            return $this->response($trade->complete($id, $user_id));
                        default:
                            return $this->response(['error' => 'Invalid action'], 400);
                    }
                }
                break;
                
            default:
                return $this->response(['error' => 'Method not allowed'], 405);
        }
    }
    
    private function handlePayment($method, $id) {
        $payment = new Payment($this->db, $this->bot);
        $user_id = $this->getCurrentUserId();
        
        switch ($method) {
            case 'GET':
                return $this->response($payment->getHistory($user_id));
                
            case 'POST':
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (isset($data['type'])) {
                    switch ($data['type']) {
                        case 'deposit':
                            return $this->response($payment->createDeposit($user_id, $data));
                        case 'withdraw':
                            return $this->response($payment->createWithdraw($user_id, $data));
                        default:
                            return $this->response(['error' => 'Invalid payment type'], 400);
                    }
                }
                break;
                
            default:
                return $this->response(['error' => 'Method not allowed'], 405);
        }
    }
    
    private function handleWebhook() {
        $update = json_decode(file_get_contents('php://input'), true);
        
        if (isset($update['message'])) {
            $this->bot->handleMessage($update['message']);
        } elseif (isset($update['callback_query'])) {
            $this->bot->handleCallbackQuery($update['callback_query']);
        }
        
        return $this->response(['ok' => true]);
    }
    
    private function validateTelegramData($initData) {
        // Telegram WebApp ma'lumotlarini tekshirish
        parse_str($initData, $data);
        
        if (!isset($data['hash'])) {
            return false;
        }
        
        $check_hash = $data['hash'];
        unset($data['hash']);
        
        $data_check_arr = [];
        foreach ($data as $key => $value) {
            $data_check_arr[] = $key . '=' . $value;
        }
        sort($data_check_arr);
        
        $data_check_string = implode("\n", $data_check_arr);
        $secret_key = hash('sha256', BOT_TOKEN, true);
        $hash = hash_hmac('sha256', $data_check_string, $secret_key);
        
        return strcmp($hash, $check_hash) === 0;
    }
    
    private function generateToken($user_id) {
        $payload = [
            'user_id' => $user_id,
            'exp' => time() + (7 * 24 * 60 * 60) // 7 kun
        ];
        
        return base64_encode(json_encode($payload));
    }
    
    private function getCurrentUserId() {
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? '';
        $token = str_replace('Bearer ', '', $token);
        
        if (!$token) {
            throw new Exception('No token provided');
        }
        
        $payload = json_decode(base64_decode($token), true);
        
        if (!$payload || !isset($payload['user_id']) || $payload['exp'] < time()) {
            throw new Exception('Invalid or expired token');
        }
        
        return $payload['user_id'];
    }
    
    private function response($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
}

$api = new API();
$api->handleRequest();
?>