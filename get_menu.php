<?php
require 'db.php';
header('Content-Type: application/json');

$res = $mysqli->query("SELECT item_id, name, price, category, description, available FROM menu_items WHERE available=1");
$items = [];
while($r = $res->fetch_assoc()) $items[] = $r;
echo json_encode($items);
?>