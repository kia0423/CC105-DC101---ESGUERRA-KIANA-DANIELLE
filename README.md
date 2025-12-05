# School Canteen Ordering System

Simple final-project template combining MySQL + PHP (backend) + HTML/CSS/JS (frontend).

## Contents
- `frontend/`
  - `index.html` — main UI to view menu & place orders
  - `styles.css` — basic styling
  - `script.js` — client-side JS & form validation
- `backend/` (PHP files)
  - `db.php` — DB connection (configure your DB credentials)
  - `get_menu.php` — returns menu items JSON
  - `place_order.php` — accepts an order (JSON POST) and inserts order + items
  - `get_orders.php` — list orders for admin/testing
  - `update_order.php` — update order status
  - `delete_order.php` — delete order by id
- `db.sql` — SQL script to create schema and sample data
- `ER_diagram.txt` — simple ER description

## How to run (local)
1. Import `db.sql` into your MySQL server.
2. Put `backend/` in a PHP-enabled server (XAMPP, WAMP) and update `db.php` with credentials.
3. Open `frontend/index.html` in a browser (or serve it via the same server).
4. Use the UI to place orders. Orders are saved into MySQL.

## Notes
- For production you must add authentication, CSRF protection, and stronger validation.
- This template is meant for the course final project requirements: 3+ tables, CRUD, JS interactivity.

