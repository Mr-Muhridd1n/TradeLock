<?php
// models/Trade.php

require_once 'BaseModel.php';
require_once 'User.php';
require_once 'Transaction.php';

class Trade extends BaseModel
{
    protected $table = 'trades';
    private $userModel;
    private $transactionModel;

    public function __construct()
    {
        parent::__construct();
        $this->userModel = new User();
        $this->transactionModel = new Transaction();
    }

    public function createTrade($data)
    {
        $this->db->beginTransaction();

        try {
            // Validatsiya
            $this->validateTradeData($data);

            // Foydalanuvchi balansini tekshirish
            $balanceCheck = $this->checkUserBalance($data['creator_id'], $data);
            if (!$balanceCheck['success']) {
                throw new Exception($balanceCheck['error']);
            }

            // Mahfiy kod yaratish
            $secretCode = $this->generateSecretCode();

            // Komissiya hisoblash
            $commissionAmount = $data['amount'] * COMMISSION_RATE;

            // Savdo yaratish
            $sql = "INSERT INTO trades (secret_code, creator_id, trade_name, amount, commission_amount, 
                    commission_type, creator_role, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')";

            $params = array(
                $secretCode,
                $data['creator_id'],
                $data['trade_name'],
                $data['amount'],
                $commissionAmount,
                $data['commission_type'],
                $data['creator_role']
            );

            $this->query($sql, $params);
            $tradeId = $this->db->lastInsertId();

            // Agar oluvchi bo'lsa, mablag'ni muzlatish
            if ($data['creator_role'] === 'buyer') {
                $freezeAmount = $this->calculateFreezeAmount(
                    $data['amount'],
                    $commissionAmount,
                    $data['commission_type'],
                    'buyer'
                );

                $freezeResult = $this->userModel->freezeBalance($data['creator_id'], $freezeAmount);
                if (!$freezeResult['success']) {
                    throw new Exception($freezeResult['error']);
                }

                // Tranzaksiya yozish
                $this->transactionModel->createTransaction(array(
                    'user_id' => $data['creator_id'],
                    'trade_id' => $tradeId,
                    'type' => 'trade_hold',
                    'amount' => $freezeAmount,
                    'description' => "Savdo #{$tradeId} uchun mablag' muzlatildi"
                ));
            }

            // Audit log
            $this->logAction($data['creator_id'], 'trade_created', 'trade', $tradeId, null, $data);

            $this->db->commit();

            return array(
                'success' => true,
                'trade_id' => $tradeId,
                'secret_code' => $secretCode
            );

        } catch (Exception $e) {
            $this->db->rollback();
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    public function joinTrade($secretCode, $userId)
    {
        $this->db->beginTransaction();

        try {
            // Savdoni topish
            $sql = "SELECT * FROM trades WHERE secret_code = ? AND status = 'active' FOR UPDATE";
            $stmt = $this->query($sql, array($secretCode));
            $trade = $stmt->fetch();

            if (!$trade) {
                throw new Exception("Savdo topilmadi yoki faol emas");
            }

            if ($trade['partner_id']) {
                throw new Exception("Bu savdoga allaqachon kimdir qo'shilgan");
            }

            if ($trade['creator_id'] == $userId) {
                throw new Exception("O'z savdongizga qo'shila olmaysiz");
            }

            // Partner rolini aniqlash
            $partnerRole = $trade['creator_role'] === 'seller' ? 'buyer' : 'seller';

            // Partner balansini tekshirish
            if ($partnerRole === 'buyer') {
                $commissionAmount = $trade['commission_amount'];
                $freezeAmount = $this->calculateFreezeAmount(
                    $trade['amount'],
                    $commissionAmount,
                    $trade['commission_type'],
                    'partner'
                );

                $balanceInfo = $this->userModel->getBalance($userId);
                if ($balanceInfo['available_balance'] < $freezeAmount) {
                    throw new Exception("Balans yetarli emas. Kerakli summa: " . number_format($freezeAmount, 2));
                }

                // Mablag'ni muzlatish
                $freezeResult = $this->userModel->freezeBalance($userId, $freezeAmount);
                if (!$freezeResult['success']) {
                    throw new Exception($freezeResult['error']);
                }

                // Tranzaksiya yozish
                $this->transactionModel->createTransaction(array(
                    'user_id' => $userId,
                    'trade_id' => $trade['id'],
                    'type' => 'trade_hold',
                    'amount' => $freezeAmount,
                    'description' => "Savdo #{$trade['id']} uchun mablag' muzlatildi"
                ));
            }

            // Savdoni yangilash
            $sql = "UPDATE trades SET partner_id = ? WHERE id = ?";
            $this->query($sql, array($userId, $trade['id']));

            // Audit log
            $this->logAction($userId, 'trade_joined', 'trade', $trade['id']);

            $this->db->commit();

            return array(
                'success' => true,
                'trade' => $this->getTradeById($trade['id'])
            );

        } catch (Exception $e) {
            $this->db->rollback();
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    public function completeTrade($tradeId, $userId)
    {
        $this->db->beginTransaction();

        try {
            // Savdoni olish
            $sql = "SELECT * FROM trades WHERE id = ? AND status = 'active' FOR UPDATE";
            $stmt = $this->query($sql, array($tradeId));
            $trade = $stmt->fetch();

            if (!$trade) {
                throw new Exception("Savdo topilmadi yoki faol emas");
            }

            if (!$trade['partner_id']) {
                throw new Exception("Savdoga hali hech kim qo'shilmagan");
            }

            // Faqat sotuvchi tasdiqlashi mumkin
            $sellerId = $trade['creator_role'] === 'seller' ? $trade['creator_id'] : $trade['partner_id'];
            if ($userId != $sellerId) {
                throw new Exception("Faqat sotuvchi savdoni yakunlashi mumkin");
            }

            $buyerId = $trade['creator_role'] === 'buyer' ? $trade['creator_id'] : $trade['partner_id'];

            // Komissiyani hisoblash
            $commissionAmount = $trade['commission_amount'];
            $sellerCommission = 0;
            $buyerCommission = 0;

            switch ($trade['commission_type']) {
                case 'creator':
                    if ($trade['creator_role'] === 'seller') {
                        $sellerCommission = $commissionAmount;
                    } else {
                        $buyerCommission = $commissionAmount;
                    }
                    break;
                case 'partner':
                    if ($trade['creator_role'] === 'seller') {
                        $buyerCommission = $commissionAmount;
                    } else {
                        $sellerCommission = $commissionAmount;
                    }
                    break;
                case 'split':
                    $sellerCommission = $commissionAmount / 2;
                    $buyerCommission = $commissionAmount / 2;
                    break;
            }

            // Oluvchidan muzlatilgan mablag'ni ochish
            $buyerFreezeAmount = $trade['amount'] + $buyerCommission;
            $this->userModel->unfreezeBalance($buyerId, $buyerFreezeAmount);

            // Oluvchidan pul yechish
            $this->userModel->updateBalance($buyerId, $buyerFreezeAmount, 'subtract');

            // Sotuvchiga pul o'tkazish
            $sellerAmount = $trade['amount'] - $sellerCommission;
            $this->userModel->updateBalance($sellerId, $sellerAmount, 'add');

            // Tranzaksiyalar yozish
            // Oluvchi uchun
            $this->transactionModel->createTransaction(array(
                'user_id' => $buyerId,
                'trade_id' => $tradeId,
                'type' => 'trade_release',
                'amount' => -$trade['amount'],
                'description' => "Savdo #{$tradeId} uchun to'lov"
            ));

            if ($buyerCommission > 0) {
                $this->transactionModel->createTransaction(array(
                    'user_id' => $buyerId,
                    'trade_id' => $tradeId,
                    'type' => 'commission',
                    'amount' => -$buyerCommission,
                    'description' => "Savdo #{$tradeId} komissiyasi"
                ));
            }

            // Sotuvchi uchun
            $this->transactionModel->createTransaction(array(
                'user_id' => $sellerId,
                'trade_id' => $tradeId,
                'type' => 'trade_release',
                'amount' => $trade['amount'],
                'description' => "Savdo #{$tradeId} dan tushum"
            ));

            if ($sellerCommission > 0) {
                $this->transactionModel->createTransaction(array(
                    'user_id' => $sellerId,
                    'trade_id' => $tradeId,
                    'type' => 'commission',
                    'amount' => -$sellerCommission,
                    'description' => "Savdo #{$tradeId} komissiyasi"
                ));
            }

            // Savdoni yakunlash
            $sql = "UPDATE trades SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?";
            $this->query($sql, array($tradeId));

            // Audit log
            $this->logAction($userId, 'trade_completed', 'trade', $tradeId);

            $this->db->commit();

            return array('success' => true);

        } catch (Exception $e) {
            $this->db->rollback();
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    public function cancelTrade($tradeId, $userId)
    {
        $this->db->beginTransaction();

        try {
            // Savdoni olish
            $sql = "SELECT * FROM trades WHERE id = ? AND status = 'active' FOR UPDATE";
            $stmt = $this->query($sql, array($tradeId));
            $trade = $stmt->fetch();

            if (!$trade) {
                throw new Exception("Savdo topilmadi yoki faol emas");
            }

            // Faqat yaratuvchi bekor qila oladi
            if ($userId != $trade['creator_id']) {
                throw new Exception("Faqat savdo yaratuvchisi bekor qila oladi");
            }

            // Agar partner qo'shilgan bo'lsa
            if ($trade['partner_id']) {
                // Muzlatilgan mablag'larni qaytarish
                if ($trade['creator_role'] === 'buyer') {
                    $creatorFreezeAmount = $this->calculateFreezeAmount(
                        $trade['amount'],
                        $trade['commission_amount'],
                        $trade['commission_type'],
                        'buyer'
                    );
                    $this->userModel->unfreezeBalance($trade['creator_id'], $creatorFreezeAmount);
                }

                $partnerId = $trade['partner_id'];
                $partnerRole = $trade['creator_role'] === 'seller' ? 'buyer' : 'seller';

                if ($partnerRole === 'buyer') {
                    $partnerFreezeAmount = $this->calculateFreezeAmount(
                        $trade['amount'],
                        $trade['commission_amount'],
                        $trade['commission_type'],
                        'partner'
                    );
                    $this->userModel->unfreezeBalance($partnerId, $partnerFreezeAmount);
                }
            } else {
                // Faqat yaratuvchi bor
                if ($trade['creator_role'] === 'buyer') {
                    $creatorFreezeAmount = $this->calculateFreezeAmount(
                        $trade['amount'],
                        $trade['commission_amount'],
                        $trade['commission_type'],
                        'buyer'
                    );
                    $this->userModel->unfreezeBalance($trade['creator_id'], $creatorFreezeAmount);
                }
            }

            // Savdoni bekor qilish
            $sql = "UPDATE trades SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP WHERE id = ?";
            $this->query($sql, array($tradeId));

            // Audit log
            $this->logAction($userId, 'trade_cancelled', 'trade', $tradeId);

            $this->db->commit();

            return array('success' => true);

        } catch (Exception $e) {
            $this->db->rollback();
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }

    public function getUserTrades($userId, $status = null)
    {
        $sql = "SELECT t.*, 
                u1.username as creator_username, u1.first_name as creator_first_name,
                u2.username as partner_username, u2.first_name as partner_first_name
                FROM trades t
                LEFT JOIN users u1 ON t.creator_id = u1.id
                LEFT JOIN users u2 ON t.partner_id = u2.id
                WHERE (t.creator_id = ? OR t.partner_id = ?)";

        $params = array($userId, $userId);

        if ($status) {
            $sql .= " AND t.status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY t.created_at DESC";

        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }

    public function getTradeById($tradeId)
    {
        $sql = "SELECT t.*, 
                u1.username as creator_username, u1.first_name as creator_first_name,
                u2.username as partner_username, u2.first_name as partner_first_name
                FROM trades t
                LEFT JOIN users u1 ON t.creator_id = u1.id
                LEFT JOIN users u2 ON t.partner_id = u2.id
                WHERE t.id = ?";

        $stmt = $this->query($sql, array($tradeId));
        return $stmt->fetch();
    }

    public function getTradeBySecretCode($secretCode)
    {
        $sql = "SELECT t.*, 
                u1.username as creator_username, u1.first_name as creator_first_name,
                u2.username as partner_username, u2.first_name as partner_first_name
                FROM trades t
                LEFT JOIN users u1 ON t.creator_id = u1.id
                LEFT JOIN users u2 ON t.partner_id = u2.id
                WHERE t.secret_code = ?";

        $stmt = $this->query($sql, array($secretCode));
        return $stmt->fetch();
    }

    private function validateTradeData($data)
    {
        if (empty($data['trade_name']) || strlen($data['trade_name']) < 3) {
            throw new Exception("Savdo nomi kamida 3 ta belgi bo'lishi kerak");
        }

        if ($data['amount'] < MIN_TRADE_AMOUNT) {
            throw new Exception("Minimal savdo summasi " . number_format(MIN_TRADE_AMOUNT, 2) . " so'm");
        }

        if ($data['amount'] > MAX_TRADE_AMOUNT) {
            throw new Exception("Maksimal savdo summasi " . number_format(MAX_TRADE_AMOUNT, 2) . " so'm");
        }

        if (!in_array($data['commission_type'], array('creator', 'partner', 'split'))) {
            throw new Exception("Noto'g'ri komissiya turi");
        }

        if (!in_array($data['creator_role'], array('seller', 'buyer'))) {
            throw new Exception("Noto'g'ri rol");
        }
    }

    private function checkUserBalance($userId, $tradeData)
    {
        // Foydalanuvchi balansini olish
        $balanceInfo = $this->userModel->getBalance($userId);
        $availableBalance = $balanceInfo['available_balance'];

        // Faol savdolarni tekshirish
        $sql = "SELECT COUNT(*) as active_count FROM trades 
               WHERE creator_id = ? AND status = 'active' AND creator_role = 'buyer'";
        $stmt = $this->query($sql, array($userId));
        $result = $stmt->fetch();

        if ($result['active_count'] > 0 && $tradeData['creator_role'] === 'buyer') {
            return array(
                'success' => false,
                'error' => "Sizda faol savdo mavjud. Avval uni yakunlang"
            );
        }

        // Agar oluvchi bo'lsa, kerakli summani hisoblash
        if ($tradeData['creator_role'] === 'buyer') {
            $commissionAmount = $tradeData['amount'] * COMMISSION_RATE;
            $requiredAmount = $this->calculateFreezeAmount(
                $tradeData['amount'],
                $commissionAmount,
                $tradeData['commission_type'],
                'buyer'
            );

            if ($availableBalance < $requiredAmount) {
                return array(
                    'success' => false,
                    'error' => "Balans yetarli emas. Kerakli summa: " . number_format($requiredAmount, 2) . " so'm"
                );
            }
        }

        return array('success' => true);
    }

    private function calculateFreezeAmount($tradeAmount, $commissionAmount, $commissionType, $role)
    {
        if ($role === 'buyer') {
            switch ($commissionType) {
                case 'creator':
                    return $tradeAmount + $commissionAmount;
                case 'partner':
                    return $tradeAmount;
                case 'split':
                    return $tradeAmount + ($commissionAmount / 2);
            }
        } else if ($role === 'partner') {
            switch ($commissionType) {
                case 'creator':
                    return $tradeAmount;
                case 'partner':
                    return $tradeAmount + $commissionAmount;
                case 'split':
                    return $tradeAmount + ($commissionAmount / 2);
            }
        }

        return 0;
    }

    private function generateSecretCode()
    {
        $prefix = "TL";
        $timestamp = dechex(time());
        $random = strtoupper(bin2hex(random_bytes(4)));
        return $prefix . $timestamp . $random;
    }
}