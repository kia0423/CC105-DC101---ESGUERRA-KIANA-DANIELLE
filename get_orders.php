<?php
require 'db.php';
header('Content-Type: application/json');

$res = $mysqli->query("SELECT o.order_id, o.total_amount, o.status, o.created_at, c.name AS customer_name, c.year_section
  FROM orders o LEFT JOIN customers c ON o.customer_id=c.customer_id ORDER BY o.created_at DESC LIMIT 50");
$out = [];
while($r = $res->fetch_assoc()) $out[] = $r;
echo json_encode($out);
?>