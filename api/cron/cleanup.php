<?php
// cron/cleanup.php
// Bu faylni har kuni ishga tushirish kerak

require_once './config/database.php';
require_once './includes/Database.php';

$db = Database::getInstance()->getConnection();

try {
    // 24 soatdan eski faol savdolarni bekor qilish
    $sql = "UPDATE trades 
            SET status = 'cancelled', 
                cancelled_at = CURRENT_TIMESTAMP 
            WHERE status = 'active' 
            AND partner_id IS NULL 
            AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)";

    $stmt = $db->prepare($sql);
    $stmt->execute();

    $cancelledCount = $stmt->rowCount();

    // Muzlatilgan mablag'larni qaytarish
    if ($cancelledCount > 0) {
        $sql = "SELECT t.*, u.frozen_balance 
                FROM trades t 
                JOIN users u ON t.creator_id = u.id 
                WHERE t.status = 'cancelled' 
                AND t.cancelled_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)
                AND t.creator_role = 'buyer'";

        $stmt = $db->prepare($sql);
        $stmt->execute();
        $trades = $stmt->fetchAll();

        foreach ($trades as $trade) {
            // Komissiya hisoblash
            $commissionAmount = $trade['commission_amount'];
            $freezeAmount = $trade['amount'];

            switch ($trade['commission_type']) {
                case 'creator':
                    $freezeAmount += $commissionAmount;
                    break;
                case 'split':
                    $freezeAmount += $commissionAmount / 2;
                    break;
            }

            // Mablag'ni qaytarish
            $sql = "UPDATE users 
                    SET frozen_balance = frozen_balance - ? 
                    WHERE id = ?";

            $stmt = $db->prepare($sql);
            $stmt->execute(array($freezeAmount, $trade['creator_id']));
        }
    }

    // Log
    error_log("Cleanup completed. Cancelled trades: " . $cancelledCount);

} catch (Exception $e) {
    error_log("Cleanup error: " . $e->getMessage());
}