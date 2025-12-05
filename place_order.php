<?php
require 'db.php';
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
if(!$input){ echo json_encode(['success'=>false,'message'=>'Invalid JSON']); exit; }
$customer = $input['customer'] ?? null;
$items = $input['items'] ?? null;
if(!$customer || !$items){ echo json_encode(['success'=>false,'message'=>'Missing fields']); exit; }

$mysqli->begin_transaction();
try{
  // insert or find customer (simple upsert by name+year_section)
  $stmt = $mysqli->prepare("SELECT customer_id FROM customers WHERE name=? AND year_section=? LIMIT 1");
  $stmt->bind_param('ss', $customer['name'], $customer['year_section']);
  $stmt->execute(); $res = $stmt->get_result();
  if($row = $res->fetch_assoc()){
    $cust_id = $row['customer_id'];
  } else {
    $stmt = $mysqli->prepare("INSERT INTO customers (name, email, phone, year_section) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('ssss', $customer['name'], $customer['email'], $customer['phone'], $customer['year_section']);
    $stmt->execute();
    $cust_id = $mysqli->insert_id;
  }

  // compute total
  $total = 0.0;
  foreach($items as $it) $total += floatval($it['price']) * intval($it['quantity']);

  $stmt = $mysqli->prepare("INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, 'Pending')");
  $stmt->bind_param('id', $cust_id, $total);
  $stmt->execute();
  $order_id = $mysqli->insert_id;

  $stmt = $mysqli->prepare("INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)");
  foreach($items as $it){
    $stmt->bind_param('iiid', $order_id, $it['item_id'], $it['quantity'], $it['price']);
    $stmt->execute();
  }

  $mysqli->commit();
  echo json_encode(['success'=>true, 'order_id'=>$order_id]);
} catch(Exception $e){
  $mysqli->rollback();
  echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}
?>