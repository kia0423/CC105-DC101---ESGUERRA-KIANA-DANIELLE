<?php
require 'db.php';
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
if(!$input || !isset($input['order_id']) || !isset($input['status'])){ echo json_encode(['success'=>false,'message'=>'Missing']); exit; }
$stmt = $mysqli->prepare("UPDATE orders SET status=? WHERE order_id=?");
$stmt->bind_param('si', $input['status'], $input['order_id']);
$stmt->execute();
echo json_encode(['success'=>true, 'affected'=>$stmt->affected_rows]);
?>