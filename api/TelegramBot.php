<?php
class TelegramBot {
    private $token;
    private $api_url;
    
    public function __construct($token) {
        $this->token = $token;
        $this->api_url = "https://api.telegram.org/bot{$token}/";
    }
    
    public function sendMessage($chat_id, $text, $reply_markup = null) {
        $data = [
            'chat_id' => $chat_id,
            'text' => $text,
            'parse_mode' => 'HTML'
        ];
        
        if ($reply_markup) {
            $data['reply_markup'] = json_encode($reply_markup);
        }
        
        return $this->makeRequest('sendMessage', $data);
    }
    
    public function editMessage($chat_id, $message_id, $text, $reply_markup = null) {
        $data = [
            'chat_id' => $chat_id,
            'message_id' => $message_id,
            'text' => $text,
            'parse_mode' => 'HTML'
        ];
        
        if ($reply_markup) {
            $data['reply_markup'] = json_encode($reply_markup);
        }
        
        return $this->makeRequest('editMessageText', $data);
    }
    
    public function handleMessage($message) {
        $chat_id = $message['chat']['id'];
        $user_id = $message['from']['id'];
        $text = $message['text'] ?? '';
        
        if ($text === '/start') {
            $this->handleStart($chat_id, $user_id, $message);
        } elseif (strpos($text, '/start ') === 0) {
            $param = substr($text, 7);
            $this->handleStartWithParam($chat_id, $user_id, $param);
        } else {
            $this->handleOtherCommands($chat_id, $text);
        }
    }
    
    public function handleCallbackQuery($callback_query) {
        $chat_id = $callback_query['message']['chat']['id'];
        $message_id = $callback_query['message']['message_id'];
        $user_id = $callback_query['from']['id'];
        $data = $callback_query['data'];
        
        $this->answerCallbackQuery($callback_query['id']);
        
        switch ($data) {
            case 'open_webapp':
                $this->openWebApp($chat_id);
                break;
            case 'help':
                $this->sendHelp($chat_id);
                break;
            default:
                if (strpos($data, 'trade_') === 0) {
                    $this->handleTradeCallback($chat_id, $message_id, $data);
                }
                break;
        }
    }
    
    private function handleStart($chat_id, $user_id, $message) {
        $welcome_text = "🔐 <b>Trade Lock</b> - Xavfsiz Savdo Platformasiga Xush Kelibsiz!\n\n";
        $welcome_text .= "Bizning platforma orqali siz:\n";
        $welcome_text .= "✅ Xavfsiz savdo-sotiq qilishingiz mumkin\n";
        $welcome_text .= "✅ Pul o'tkazmalarini kafolatlaysiz\n";
        $welcome_text .= "✅ Foydalanish oson va tez\n\n";
        $welcome_text .= "Boshlash uchun quyidagi tugmani bosing:";
        
        $keyboard = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '🚀 Platformani ochish',
                        'web_app' => ['url' => WEBAPP_URL]
                    ]
                ],
                [
                    [
                        'text' => '❓ Yordam',
                        'callback_data' => 'help'
                    ]
                ]
            ]
        ];
        
        $this->sendMessage($chat_id, $welcome_text, $keyboard);
    }
    
    private function handleStartWithParam($chat_id, $user_id, $param) {
        if (strpos($param, 'trade_') === 0) {
            $trade_link = substr($param, 6);
            $this->handleTradeLink($chat_id, $user_id, $trade_link);
        } elseif (strpos($param, 'ref_') === 0) {
            $referrer_id = substr($param, 4);
            $this->handleReferral($chat_id, $user_id, $referrer_id);
        }
    }
    
    private function handleTradeLink($chat_id, $user_id, $trade_link) {
        // Database dan savdo ma'lumotlarini olish
        $db = new Database();
        $trade = $db->fetch(
            "SELECT t.*, u.first_name as creator_name FROM trades t 
             JOIN users u ON t.creator_id = u.id 
             WHERE t.secret_link = ? AND t.status = 'active'",
            [$trade_link]
        );
        
        if (!$trade) {
            $this->sendMessage($chat_id, "❌ Savdo topilmadi yoki faol emas.");
            return;
        }
        
        // Foydalanuvchi mavjudligini tekshirish
        $user = $db->fetch("SELECT * FROM users WHERE telegram_id = ?", [$user_id]);
        
        if (!$user) {
            $text = "❌ Avval ro'yxatdan o'tishingiz kerak. /start buyrug'ini yuboring.";
            $this->sendMessage($chat_id, $text);
            return;
        }
        
        // Savdo yaratuvchisi emasligini tekshirish
        if ($trade['creator_id'] == $user['id']) {
            $this->sendMessage($chat_id, "❌ Siz bu savdoni yaratgansiz, o'zingiz ishtirok eta olmaysiz.");
            return;
        }
        
        $amount = number_format($trade['amount'], 0, '', ' ');
        $commission = number_format($trade['commission_amount'], 0, '', ' ');
        
        $text = "💼 <b>Savdo Ma'lumotlari</b>\n\n";
        $text .= "📝 Nomi: {$trade['trade_name']}\n";
        $text .= "💰 Summa: {$amount} so'm\n";
        $text .= "👤 Yaratuvchi: {$trade['creator_name']}\n";
        $text .= "💳 Komissiya: {$commission} so'm\n\n";
        $text .= "Savdoga qo'shilishni xohlaysizmi?";
        
        $keyboard = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '✅ Qo\'shilish',
                        'web_app' => ['url' => WEBAPP_URL . '/trade/' . $trade_link]
                    ]
                ],
                [
                    [
                        'text' => '❌ Bekor qilish',
                        'callback_data' => 'cancel'
                    ]
                ]
            ]
        ];
        
        $this->sendMessage($chat_id, $text, $keyboard);
    }
    
    private function sendHelp($chat_id) {
        $help_text = "❓ <b>Trade Lock Yordam</b>\n\n";
        $help_text .= "🔹 <b>Savdo yaratish:</b> Platformani ochib, yangi savdo yarating\n";
        $help_text .= "🔹 <b>Pul to'ldirish:</b> Hamyon bo'limidan hisobingizni to'ldiring\n";
        $help_text .= "🔹 <b>Savdoga qo'shilish:</b> Maxsus havolani bosing\n";
        $help_text .= "🔹 <b>Yordam:</b> @TradeLock_support\n\n";
        $help_text .= "📱 Platformani ochish uchun quyidagi tugmani bosing:";
        
        $keyboard = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '🚀 Platformani ochish',
                        'web_app' => ['url' => WEBAPP_URL]
                    ]
                ]
            ]
        ];
        
        $this->sendMessage($chat_id, $help_text, $keyboard);
    }
    
    public function notifyTradeCreated($user_id, $trade) {
        $amount = number_format($trade['amount'], 0, '', ' ');
        $link = "https://t.me/" . BOT_USERNAME . "?start=trade_" . $trade['secret_link'];
        
        $text = "✅ <b>Savdo muvaffaqiyatli yaratildi!</b>\n\n";
        $text .= "📝 Nomi: {$trade['trade_name']}\n";
        $text .= "💰 Summa: {$amount} so'm\n";
        $text .= "🔗 Havola: <code>{$link}</code>\n\n";
        $text .= "Bu havolani do'stingizga yuboring va savdoni boshlang!";
        
        $keyboard = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '📤 Havolani ulashish',
                        'switch_inline_query' => $link
                    ]
                ]
            ]
        ];
        
        $db = new Database();
        $user = $db->fetch("SELECT telegram_id FROM users WHERE id = ?", [$user_id]);
        
        if ($user) {
            $this->sendMessage($user['telegram_id'], $text, $keyboard);
        }
    }
    
    public function notifyTradeUpdate($user_id, $trade, $action) {
        $amount = number_format($trade['amount'], 0, '', ' ');
        
        $messages = [
            'joined' => "👥 Savdongizga ishtirokchi qo'shildi!\n\n📝 {$trade['trade_name']}\n💰 {$amount} so'm",
            'confirmed' => "✅ Savdo tasdiqlandi!\n\n📝 {$trade['trade_name']}\n💰 {$amount} so'm",
            'completed' => "🎉 Savdo muvaffaqiyatli yakunlandi!\n\n📝 {$trade['trade_name']}\n💰 {$amount} so'm",
            'cancelled' => "❌ Savdo bekor qilindi!\n\n📝 {$trade['trade_name']}\n💰 {$amount} so'm"
        ];
        
        $text = $messages[$action] ?? "📢 Savdo yangilandi!";
        
        $db = new Database();
        $user = $db->fetch("SELECT telegram_id FROM users WHERE id = ?", [$user_id]);
        
        if ($user) {
            $this->sendMessage($user['telegram_id'], $text);
        }
    }
    
    public function notifyPayment($user_id, $type, $amount, $status) {
        $amount_formatted = number_format($amount, 0, '', ' ');
        
        $statuses = [
            'pending' => '⏳ Kutilmoqda',
            'completed' => '✅ Muvaffaqiyatli',
            'failed' => '❌ Muvaffaqiyatsiz',
            'cancelled' => '🚫 Bekor qilindi'
        ];
        
        $types = [
            'deposit' => 'Hisob to\'ldirish',
            'withdraw' => 'Pul chiqarish'
        ];
        
        $text = "💳 <b>{$types[$type]}</b>\n\n";
        $text .= "💰 Summa: {$amount_formatted} so'm\n";
        $text .= "📊 Status: {$statuses[$status]}\n";
        
        if ($status === 'completed') {
            $text .= "\n🎉 To'lov muvaffaqiyatli amalga oshirildi!";
        }
        
        $db = new Database();
        $user = $db->fetch("SELECT telegram_id FROM users WHERE id = ?", [$user_id]);
        
        if ($user) {
            $this->sendMessage($user['telegram_id'], $text);
        }
    }
    
    private function answerCallbackQuery($callback_query_id, $text = null) {
        $data = ['callback_query_id' => $callback_query_id];
        if ($text) {
            $data['text'] = $text;
        }
        
        return $this->makeRequest('answerCallbackQuery', $data);
    }
    
    private function makeRequest($method, $data) {
        $url = $this->api_url . $method;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($http_code !== 200) {
            error_log("Telegram API Error: " . $response);
            return false;
        }
        
        return json_decode($response, true);
    }
}
?>