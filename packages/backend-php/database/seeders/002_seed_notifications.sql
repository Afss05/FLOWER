-- Seed notifications for all users
-- Run: mysql -u root flowershop < database/seeders/002_seed_notifications.sql

USE `flowershop`;

INSERT INTO `notifications` (tenant_id, user_id, type, title, body, data, read_at, created_at) VALUES

-- ── Customer (id=2) notifications ─────────────────────────────────────────────
('default', 2, 'order_placed',
 'Order Placed Successfully',
 'Your order #ORD-20260001 has been placed. Total: ₹848.00',
 '{"orderNumber":"ORD-20260001","amount":848}',
 NOW(), DATE_SUB(NOW(), INTERVAL 3 DAY)),

('default', 2, 'payment_success',
 'Payment Successful',
 'Payment of ₹848.00 for order #ORD-20260001 was successful.',
 '{"orderNumber":"ORD-20260001","amount":848}',
 NOW(), DATE_SUB(NOW(), INTERVAL 3 DAY)),

('default', 2, 'order_confirmed',
 'Order Confirmed',
 'Your order #ORD-20260001 has been confirmed and is being prepared.',
 '{"orderNumber":"ORD-20260001","status":"confirmed"}',
 NOW(), DATE_SUB(NOW(), INTERVAL 2 DAY)),

('default', 2, 'order_shipped',
 'Order Out for Delivery',
 'Your order #ORD-20260001 is on the way! 🚚 Expected by evening.',
 '{"orderNumber":"ORD-20260001","status":"out_for_delivery"}',
 NULL, DATE_SUB(NOW(), INTERVAL 1 DAY)),

('default', 2, 'order_delivered',
 'Order Delivered! 🌸',
 'Your order #ORD-20260001 has been delivered. Enjoy your flowers!',
 '{"orderNumber":"ORD-20260001","status":"delivered"}',
 NULL, DATE_SUB(NOW(), INTERVAL 12 HOUR)),

('default', 2, 'promo',
 'Weekend Special: 20% Off All Bouquets!',
 'Use code WEEKEND20 before Sunday midnight to get 20% off on all gift bouquets.',
 '{"code":"WEEKEND20","discount":20}',
 NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR)),

('default', 2, 'order_placed',
 'Order Placed Successfully',
 'Your order #ORD-20260002 has been placed. Total: ₹299.00',
 '{"orderNumber":"ORD-20260002","amount":299}',
 NULL, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),

-- ── test@flowershop.com (id=3) notifications ───────────────────────────────
('default', 3, 'order_placed',
 'Order Placed Successfully',
 'Your order #ORD-20260003 has been placed. Total: ₹499.00',
 '{"orderNumber":"ORD-20260003","amount":499}',
 NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR)),

('default', 3, 'promo',
 'Karthigai Deepam Special: Fresh Marigold Garlands!',
 'Get fresh marigold garlands delivered to your doorstep. Order before 6 PM for same-day delivery.',
 '{"festival":"Karthigai Deepam"}',
 NULL, DATE_SUB(NOW(), INTERVAL 3 HOUR)),

-- ── Admin (id=1) notifications ─────────────────────────────────────────────
('default', 1, 'new_order',
 'New Order Received',
 'Order #ORD-20260002 from Test Customer (₹299.00) needs confirmation.',
 '{"orderNumber":"ORD-20260002","customer":"Test Customer"}',
 NULL, DATE_SUB(NOW(), INTERVAL 29 MINUTE)),

('default', 1, 'low_stock',
 'Low Stock Alert: Wedding Rose Bouquet',
 'Wedding Rose Bouquet stock is below 5 units. Current stock: 3.',
 '{"product":"Wedding Rose Bouquet","stock":3}',
 NULL, DATE_SUB(NOW(), INTERVAL 4 HOUR)),

('default', 1, 'new_order',
 'New Order Received',
 'Order #ORD-20260003 from Test Customer (₹499.00) needs confirmation.',
 '{"orderNumber":"ORD-20260003","customer":"Test Customer"}',
 NOW(), DATE_SUB(NOW(), INTERVAL 55 MINUTE));
