<?php
// models/BaseModel.php

abstract class BaseModel
{
    protected $db;
    protected $table;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    protected function query($sql, $params = array())
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    protected function findById($id)
    {
        $sql = "SELECT * FROM {$this->table} WHERE id = ?";
        $stmt = $this->query($sql, array($id));
        return $stmt->fetch();
    }

    protected function logAction($userId, $action, $entityType, $entityId, $oldData = null, $newData = null)
    {
        $sql = "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_data, new_data, ip_address, user_agent) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        $oldDataJson = $oldData ? json_encode($oldData) : null;
        $newDataJson = $newData ? json_encode($newData) : null;
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $this->query($sql, array($userId, $action, $entityType, $entityId, $oldDataJson, $newDataJson, $ipAddress, $userAgent));
    }
}