<?php
// Configure DB connection
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'canteen_db';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if($mysqli->connect_errno){
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'DB connection failed: '.$mysqli->connect_error]);
  exit;
}
$mysqli->set_charset('utf8mb4');
?>