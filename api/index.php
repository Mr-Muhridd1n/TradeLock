<?php
// api/index.php

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Include files
require_once './config/database.php';
require_once './includes/Database.php';
require_once './includes/Auth.php';
require_once './models/User.php';
require_once './models/Trade.php';
require_once './models/Transaction.php';
require_once './models/Payment.php';

// Error handler
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

// Request method
$method = $_SERVER['REQUEST_METHOD'];
$request = isset($_GET['request']) ? explode('/', $_GET['request']) : array();

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

// Authentication
$auth = new Auth();
$userId = null;

// Check auth token
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
    $authResult = $auth->verifyToken($token);

    if ($authResult['success']) {
        $userId = $authResult['user_id'];
    } else {
        http_response_code(401);
        echo json_encode(array('error' => 'Unauthorized'));
        exit;
    }
}

// Router
try {
    switch ($request[0]) {
        case 'auth':
            handleAuth($method, $request, $input);
            break;

        case 'user':
            if (!$userId) {
                throw new Exception('Authentication required');
            }
            handleUser($method, $request, $input, $userId);
            break;

        case 'trade':
            if (!$userId) {
                throw new Exception('Authentication required');
            }
            handleTrade($method, $request, $input, $userId);
            break;

        case 'transaction':
            if (!$userId) {
                throw new Exception('Authentication required');
            }
            handleTransaction($method, $request, $input, $userId);
            break;

        case 'payment':
            if (!$userId) {
                throw new Exception('Authentication required');
            }
            handlePayment($method, $request, $input, $userId);
            break;

        default:
            http_response_code(404);
            echo json_encode(array('error' => 'Endpoint not found'));
            break;
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('error' => $e->getMessage()));
}

// Handler functions
function handleAuth($method, $request, $input)
{
    $auth = new Auth();

    if ($method === 'POST' && isset($request[1]) && $request[1] === 'telegram') {
        $result = $auth->authenticateWithTelegram($input);
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
                echo json_encode($user);
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
                } else if (is_numeric($request[1])) {
                    $trade = $tradeModel->getTradeById($request[1]);
                    echo json_encode($trade);
                }
            }
            break;

        case 'POST':
            if (isset($request[1])) {
                switch ($request[1]) {
                    case 'create':
                        $input['creator_id'] = $userId;
                        $result = $tradeModel->createTrade($input);
                        echo json_encode($result);
                        break;

                    case 'join':
                        if (!isset($input['secret_code'])) {
                            throw new Exception('Secret code required');
                        }
                        $result = $tradeModel->joinTrade($input['secret_code'], $userId);
                        echo json_encode($result);
                        break;

                    case 'complete':
                        if (!isset($input['trade_id'])) {
                            throw new Exception('Trade ID required');
                        }
                        $result = $tradeModel->completeTrade($input['trade_id'], $userId);
                        echo json_encode($result);
                        break;

                    case 'cancel':
                        if (!isset($input['trade_id'])) {
                            throw new Exception('Trade ID required');
                        }
                        $result = $tradeModel->cancelTrade($input['trade_id'], $userId);
                        echo json_encode($result);
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
            if (isset($request[1])) {
                switch ($request[1]) {
                    case 'deposit':
                        $result = $paymentModel->deposit(
                            $userId,
                            $input['amount'],
                            $input['payment_method_id'],
                            $input['reference_id']
                        );
                        echo json_encode($result);
                        break;

                    case 'withdraw':
                        $result = $paymentModel->withdraw(
                            $userId,
                            $input['amount'],
                            $input['card_number']
                        );
                        echo json_encode($result);
                        break;

                    case 'add-method':
                        $result = $paymentModel->addPaymentMethod($userId, $input);
                        echo json_encode($result);
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