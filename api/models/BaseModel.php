<?php
// models/BaseModel.php

require_once __DIR__ . '/../includes/Database.php';

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
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database query error: " . $e->getMessage() . " SQL: " . $sql);
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    public function findById($id)
    {
        if (!$this->table) {
            throw new Exception("Table name not defined");
        }
        
        $sql = "SELECT * FROM {$this->table} WHERE id = ?";
        $stmt = $this->query($sql, array($id));
        return $stmt->fetch();
    }

    protected function logAction($userId, $action, $entityType, $entityId, $oldData = null, $newData = null)
    {
        try {
            $sql = "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_data, new_data, ip_address, user_agent, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";

            $oldDataJson = $oldData ? json_encode($oldData) : null;
            $newDataJson = $newData ? json_encode($newData) : null;
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

            $this->query($sql, array(
                $userId, 
                $action, 
                $entityType, 
                $entityId, 
                $oldDataJson, 
                $newDataJson, 
                $ipAddress, 
                $userAgent
            ));
        } catch (Exception $e) {
            // Log the error but don't throw exception to avoid breaking main functionality
            error_log("Audit log error: " . $e->getMessage());
        }
    }

    protected function validateRequired($data, $requiredFields)
    {
        $missing = array();
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            throw new Exception("Required fields missing: " . implode(', ', $missing));
        }
    }

    protected function sanitizeString($value)
    {
        return trim(strip_tags($value));
    }

    protected function validateNumeric($value, $fieldName, $min = null, $max = null)
    {
        if (!is_numeric($value)) {
            throw new Exception("$fieldName must be numeric");
        }
        
        $value = floatval($value);
        
        if ($min !== null && $value < $min) {
            throw new Exception("$fieldName must be at least $min");
        }
        
        if ($max !== null && $value > $max) {
            throw new Exception("$fieldName must not exceed $max");
        }
        
        return $value;
    }
}