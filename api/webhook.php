<?php
// webhook.php

require_once 'config/database.php';
require_once 'includes/Database.php';
require_once 'models/User.php';
require_once 'models/Trade.php';

// Telegram webhook ma'lumotlarini olish
$content = file_get_contents("php://input");
$update = json_decode($content, true);

if (!$update) {
    exit;
}

// Bot obyekti
$bot = new TelegramBot(BOT_TOKEN);

// Xabar kelganda
if (isset($update['message'])) {
    $message = $update['message'];
    $chatId = $message['chat']['id'];
    $text = $message['text'] ?? '';

    // /start buyrug'i
    if (strpos($text, '/start') === 0) {
        $parts = explode(' ', $text);

        if (count($parts) > 1) {
            // Deep link orqali kelgan (savdo kodi)
            $secretCode = $parts[1];
            handleTradeJoin($bot, $chatId, $message['from'], $secretCode);
        } else {
            // Oddiy start
            sendWelcomeMessage($bot, $chatId);
        }
    }
}

// Callback query
if (isset($update['callback_query'])) {
    $callbackQuery = $update['callback_query'];
    $chatId = $callbackQuery['message']['chat']['id'];
    $data = $callbackQuery['data'];

    $bot->answerCallbackQuery($callbackQuery['id']);

    // Callback ma'lumotlarini qayta ishlash
    handleCallbackQuery($bot, $chatId, $callbackQuery['from'], $data);
}

// Functions
function sendWelcomeMessage($bot, $chatId)
{
    $keyboard = array(
        'inline_keyboard' => array(
            array(
                array('text' => '🌐 Web ilovani ochish', 'web_app' => array('url' => APP_URL))
            ),
            array(
                array('text' => '📚 Qo\'llanma', 'callback_data' => 'help'),
                array('text' => '💬 Yordam', 'url' => 'https://t.me/TradeLock_support')
            )
        )
    );

    $text = "🔐 *TradeLock* - Xavfsiz savdo platformasiga xush kelibsiz!\n\n";
    $text .= "✅ Xavfsiz savdo qilish\n";
    $text .= "✅ Kafolatlangan to'lovlar\n";
    $text .= "✅ Minimal komissiya\n\n";
    $text .= "Boshlash uchun quyidagi tugmani bosing:";

    $bot->sendMessage($chatId, $text, 'Markdown', $keyboard);
}

function handleTradeJoin($bot, $chatId, $user, $secretCode)
{
    $userModel = new User();
    $tradeModel = new Trade();

    // Foydalanuvchini ro'yxatdan o'tkazish
    $userData = $userModel->createOrUpdate($user);

    // Savdoni topish
    $trade = $tradeModel->getTradeBySecretCode($secretCode);

    if (!$trade) {
        $bot->sendMessage($chatId, "❌ Savdo topilmadi yoki muddati tugagan");
        return;
    }

    if ($trade['status'] !== 'active') {
        $bot->sendMessage($chatId, "❌ Bu savdo faol emas");
        return;
    }

    // Web app orqali davom ettirish
    $keyboard = array(
        'inline_keyboard' => array(
            array(
                array(
                    'text' => '✅ Savdoga qo\'shilish',
                    'web_app' => array('url' => APP_URL . '?trade=' . $secretCode)
                )
            )
        )
    );

    $text = "🔐 *Savdo ma'lumotlari:*\n\n";
    $text .= "📦 Mahsulot: " . $trade['trade_name'] . "\n";
    $text .= "💰 Summa: " . number_format($trade['amount'], 2) . " so'm\n";
    $text .= "👤 " . ($trade['creator_role'] === 'seller' ? 'Sotuvchi' : 'Xaridor') . ": ";
    $text .= $trade['creator_first_name'] . "\n\n";
    $text .= "Davom etish uchun tugmani bosing:";

    $bot->sendMessage($chatId, $text, 'Markdown', $keyboard);
}

function handleCallbackQuery($bot, $chatId, $user, $data)
{
    switch ($data) {
        case 'help':
            $text = "📚 *Qo'llanma:*\n\n";
            $text .= "*Savdo yaratish:*\n";
            $text .= "1. Web ilovani oching\n";
            $text .= "2. \"Yangi savdo\" tugmasini bosing\n";
            $text .= "3. Ma'lumotlarni kiriting\n";
            $text .= "4. Havolani do'stingizga yuboring\n\n";
            $text .= "*Savdoga qo'shilish:*\n";
            $text .= "1. Yuborilgan havolani bosing\n";
            $text .= "2. Ma'lumotlarni tekshiring\n";
            $text .= "3. \"Qo'shilish\" tugmasini bosing\n\n";
            $text .= "Qo'shimcha yordam: @TradeLock_support";

            $bot->sendMessage($chatId, $text, 'Markdown');
            break;
    }
}

// Telegram Bot class
class TelegramBot
{
    private $token;
    private $apiUrl;

    public function __construct($token)
    {
        $this->token = $token;
        $this->apiUrl = "https://api.telegram.org/bot{$token}/";
    }

    public function sendMessage($chatId, $text, $parseMode = null, $replyMarkup = null)
    {
        $params = array(
            'chat_id' => $chatId,
            'text' => $text
        );

        if ($parseMode) {
            $params['parse_mode'] = $parseMode;
        }

        if ($replyMarkup) {
            $params['reply_markup'] = json_encode($replyMarkup);
        }

        return $this->makeRequest('sendMessage', $params);
    }

    public function answerCallbackQuery($callbackQueryId, $text = null, $showAlert = false)
    {
        $params = array(
            'callback_query_id' => $callbackQueryId
        );

        if ($text) {
            $params['text'] = $text;
            $params['show_alert'] = $showAlert;
        }

        return $this->makeRequest('answerCallbackQuery', $params);
    }

    private function makeRequest($method, $params)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl . $method);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }
}