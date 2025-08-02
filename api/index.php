<?php
// api/index.php

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include files with absolute paths
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/Database.php';
require_once __DIR__ . '/includes/Auth.php';
require_once __DIR__ . '/models/BaseModel.php';
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Trade.php';
require_once __DIR__ . '/models/Transaction.php';
require_once __DIR__ . '/models/Payment.php';

// Error handler
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    error_log("PHP Error: $errstr in $errfile on line $errline");
    if ($errno === E_ERROR || $errno === E_PARSE || $errno === E_CORE_ERROR) {
        http_response_code(500);
        echo json_encode(array('error' => 'Internal server error'));
        exit();
    }
});

// Exception handler
set_exception_handler(function ($exception) {
    error_log("Uncaught exception: " . $exception->getMessage());
    http_response_code(500);
    echo json_encode(array('error' => 'Internal server error: ' . $exception->getMessage()));
});

try {
    // Request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Parse URL
    $requestUri = $_SERVER['REQUEST_URI'];
    $scriptName = $_SERVER['SCRIPT_NAME'];
    $basePath = dirname($scriptName);
    
    // Remove base path and query string
    $path = substr($requestUri, strlen($basePath));
    $path = strtok($path, '?');
    
    // Remove leading slash and split
    $path = ltrim($path, '/');
    $request = $path ? explode('/', $path) : array();

    // Health check endpoint
    if (empty($request) || $request[0] === 'health') {
        echo json_encode(array(
            'status' => 'OK',
            'timestamp' => date('c'),
            'version' => '1.0.0'
        ));
        exit();
    }

    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null && $_SERVER['CONTENT_LENGTH'] > 0) {
        throw new Exception('Invalid JSON input');
    }

    // Authentication
    $auth = new Auth();
    $userId = null;

    // Check auth token for protected routes
    $publicRoutes = array('auth', 'health', ''); // Bo'sh string ham public
    $currentRoute = isset($request[0]) ? $request[0] : '';
    
    if (!in_array($currentRoute, $publicRoutes)) {
        $authHeader = null;
        
        // Authorization header ni topish
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        } elseif (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            }
        }
        
        if ($authHeader) {
            if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                $token = $matches[1];
                $authResult = $auth->verifyToken($token);

                if ($authResult['success']) {
                    $userId = $authResult['user_id'];
                    error_log("Auth: User authenticated successfully, ID: " . $userId);
                } else {
                    error_log("Auth: Token verification failed: " . $authResult['error']);
                    http_response_code(401);
                    echo json_encode(array(
                        'error' => 'Invalid or expired token',
                        'details' => $authResult['error']
                    ));
                    exit;
                }
            } else {
                error_log("Auth: Invalid Authorization header format");
                http_response_code(401);
                echo json_encode(array('error' => 'Invalid Authorization header format'));
                exit;
            }
        } else {
            error_log("Auth: No Authorization header found for route: " . $currentRoute);
            error_log("Auth: Available headers: " . json_encode(getallheaders()));
            http_response_code(401);
            echo json_encode(array('error' => 'Authorization header required'));
            exit;
        }
    }

    // Router
    switch ($request[0]) {
        case 'auth':
            handleAuth($method, $request, $input, $auth);
            break;

        case 'user':
            handleUser($method, $request, $input, $userId);
            break;

        case 'trade':
            handleTrade($method, $request, $input, $userId);
            break;

        case 'transaction':
            handleTransaction($method, $request, $input, $userId);
            break;

        case 'payment':
            handlePayment($method, $request, $input, $userId);
            break;

        default:
            http_response_code(404);
            echo json_encode(array('error' => 'Endpoint not found: ' . $request[0]));
            break;
    }

} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array('error' => $e->getMessage()));
}

// Handler functions
function handleAuth($method, $request, $input, $auth)
{
    if ($method === 'POST' && isset($request[1]) && $request[1] === 'telegram') {
        if (!$input) {
            http_response_code(400);
            echo json_encode(array('error' => 'Request body required'));
            return;
        }
        
        $result = $auth->authenticateWithTelegram($input);
        
        if ($result['success']) {
            http_response_code(200);
        } else {
            http_response_code(400);
        }
        
        echo json_encode($result);
    } else {
        http_response_code(405);
        echo json_encode(array('error' => 'Method not allowed'));
    }
}

function handleUser($method, $request, $input, $userId)
{
    $userModel = new User();

    switch ($method) {
        case 'GET':
            if (isset($request[1]) && $request[1] === 'balance') {
                $result = $userModel->getBalance($userId);
                echo json_encode($result);
            } else {
                $user = $userModel->findById($userId);
                if ($user) {
                    // Remove sensitive data
                    unset($user['password']);
                    echo json_encode($user);
                } else {
                    http_response_code(404);
                    echo json_encode(array('error' => 'User not found'));
                }
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(array('error' => 'Method not allowed'));
            break;
    }
}

function handleTrade($method, $request, $input, $userId)
{
    $tradeModel = new Trade();

    switch ($method) {
        case 'GET':
            if (isset($request[1])) {
                if ($request[1] === 'list') {
                    $status = isset($_GET['status']) ? $_GET['status'] : null;
                    $trades = $tradeModel->getUserTrades($userId, $status);
                    echo json_encode($trades);
                } else if ($request[1] === 'code' && isset($request[2])) {
                    $trade = $tradeModel->getTradeBySecretCode($request[2]);
                    if ($trade) {
                        echo json_encode($trade);
                    } else {
                        http_response_code(404);
                        echo json_encode(array('error' => 'Trade not found'));
                    }
                } else if (is_numeric($request[1])) {
                    $trade = $tradeModel->getTradeById($request[1]);
                    if ($trade) {
                        echo json_encode($trade);
                    } else {
                        http_response_code(404);
                        echo json_encode(array('error' => 'Trade not found'));
                    }
                }
            } else {
                // Return all user trades
                $trades = $tradeModel->getUserTrades($userId);
                echo json_encode($trades);
            }
            break;

        case 'POST':
            if (!$input) {
                http_response_code(400);
                echo json_encode(array('error' => 'Request body required'));
                return;
            }

            if (isset($request[1])) {
                switch ($request[1]) {
                    case 'create':
                        $input['creator_id'] = $userId;
                        $result = $tradeModel->createTrade($input);
                        if ($result['success']) {
                            http_response_code(201);
                        } else {
                            http_response_code(400);
                        }
                        echo json_encode($result);
                        break;

                    case 'join':
                        if (!isset($input['secret_code'])) {
                            http_response_code(400);
                            echo json_encode(array('error' => 'Secret code required'));
                            return;
                        }
                        $result = $tradeModel->joinTrade($input['secret_code'], $userId);
                        if ($result['success']) {
                            http_response_code(200);
                        } else {
                            http_response_code(400);
                        }
                        echo json_encode($result);
                        break;

                    case 'complete':
                        if (!isset($input['trade_id'])) {
                            http_response_code(400);
                            echo json_encode(array('error' => 'Trade ID required'));
                            return;
                        }
                        $result = $tradeModel->completeTrade($input['trade_id'], $userId);
                        if ($result['success']) {
                            http_response_code(200);
                        } else {
                            http_response_code(400);
                        }
                        echo json_encode($result);
                        break;

                    case 'cancel':
                        if (!isset($input['trade_id'])) {
                            http_response_code(400);
                            echo json_encode(array('error' => 'Trade ID required'));
                            return;
                        }
                        $result = $tradeModel->cancelTrade($input['trade_id'], $userId);
                        if ($result['success']) {
                            http_response_code(200);
                        } else {
                            http_response_code(400);
                        }
                        echo json_encode($result);
                        break;
                        
                    default:
                        http_response_code(404);
                        echo json_encode(array('error' => 'Action not found'));
                        break;
                }
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(array('error' => 'Method not allowed'));
            break;
    }
}

function handleTransaction($method, $request, $input, $userId)
{
    $transactionModel = new Transaction();

    switch ($method) {
        case 'GET':
            if (isset($request[1]) && $request[1] === 'stats') {
                $period = isset($_GET['period']) ? $_GET['period'] : 'month';
                $stats = $transactionModel->getTransactionStats($userId, $period);
                echo json_encode($stats);
            } else {
                $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
                $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
                $transactions = $transactionModel->getUserTransactions($userId, $limit, $offset);
                echo json_encode($transactions);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(array('error' => 'Method not allowed'));
            break;
    }
}

function handlePayment($method, $request, $input, $userId)
{
    $paymentModel = new Payment();

    switch ($method) {
        case 'GET':
            if (isset($request[1]) && $request[1] === 'methods') {
                $methods = $paymentModel->getUserPaymentMethods($userId);
                echo json_encode($methods);
            }
            break;

        case 'POST':
            if (!$input) {
                http_response_code(400);
                echo json_encode(array('error' => 'Request body required'));
                return;
            }

            if (isset($request[1])) {
                switch ($request[1]) {
                    case 'deposit':
                        $result = $paymentModel->deposit(
                            $userId,
                            $input['amount'],
                            $input['payment_method_id'],
                            $input['reference_id']
                        );
                        if ($result['success']) {
                            http_response_code(200);
                        } else {
                            http_response_code(400);
                        }
                        echo json_encode($result);
                        break;

                    case 'withdraw':
                        $result = $paymentModel->withdraw(
                            $userId,
                            $input['amount'],
                            $input['card_number']
                        );
                        if ($result['success']) {
                            http_response_code(200);
                        } else {
                            http_response_code(400);
                        }
                        echo json_encode($result);
                        break;

                    case 'add-method':
                        $result = $paymentModel->addPaymentMethod($userId, $input);
                        if ($result['success']) {
                            http_response_code(201);
                        } else {
                            http_response_code(400);
                        }
                        echo json_encode($result);
                        break;
                        
                    default:
                        http_response_code(404);
                        echo json_encode(array('error' => 'Action not found'));
                        break;
                }
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(array('error' => 'Method not allowed'));
            break;
    }
}