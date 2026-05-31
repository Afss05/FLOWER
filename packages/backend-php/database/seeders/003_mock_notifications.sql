-- Extra mock notifications — run any time to add fresh data
-- mysql -u root flowershop < database/seeders/003_mock_notifications.sql

USE `flowershop`;

-- clear any previous mock data so we can re-run safely
DELETE FROM `notifications` WHERE `title` LIKE '[MOCK]%';

INSERT INTO `notifications` (tenant_id, user_id, type, title, body, data, read_at, created_at) VALUES

-- ═══════════════════════════════════════════════════════════════
--  ADMIN (user_id = 1)
-- ═══════════════════════════════════════════════════════════════

-- Urgent: new orders requiring action (unread)
('default', 1, 'new_order',
 '[MOCK] New Order #ORD-20260010',
 'Priya Sharma placed an order for Wedding Rose Bouquet × 2 (₹1,498). Needs confirmation.',
 '{"orderNumber":"ORD-20260010","customer":"Priya Sharma","amount":1498}',
 NULL, DATE_SUB(NOW(), INTERVAL 5 MINUTE)),

('default', 1, 'new_order',
 '[MOCK] New Order #ORD-20260011',
 'Ravi Kumar ordered Marigold Garland × 5 + Jasmine Flowers × 3 (₹1,892). Needs confirmation.',
 '{"orderNumber":"ORD-20260011","customer":"Ravi Kumar","amount":1892}',
 NULL, DATE_SUB(NOW(), INTERVAL 18 MINUTE)),

-- Low stock alerts (unread)
('default', 1, 'low_stock',
 '[MOCK] Low Stock: Wedding Rose Bouquet',
 'Only 3 units left. Last sold 2 hours ago. Consider restocking before the weekend.',
 '{"product":"Wedding Rose Bouquet","productId":8,"stock":3,"threshold":5}',
 NULL, DATE_SUB(NOW(), INTERVAL 45 MINUTE)),

('default', 1, 'low_stock',
 '[MOCK] Low Stock: Lotus Garland',
 'Stock dropped to 4 units after 6 orders today. Restock recommended.',
 '{"product":"Lotus Garland","productId":4,"stock":4,"threshold":5}',
 NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR)),

-- Payment failure (unread)
('default', 1, 'payment_failed',
 '[MOCK] Payment Failed — Order #ORD-20260009',
 'UPI payment of ₹499 failed for order by Arun Raj. Customer has been notified to retry.',
 '{"orderNumber":"ORD-20260009","customer":"Arun Raj","amount":499,"reason":"upi_timeout"}',
 NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR)),

-- Older read ones
('default', 1, 'new_order',
 '[MOCK] New Order #ORD-20260007',
 'Meena Devi ordered Chrysanthemum Bunch × 3 (₹597).',
 '{"orderNumber":"ORD-20260007","customer":"Meena Devi","amount":597}',
 NOW(), DATE_SUB(NOW(), INTERVAL 6 HOUR)),

('default', 1, 'new_order',
 '[MOCK] New Order #ORD-20260006',
 'Suresh Babu ordered Mixed Pooja Flowers × 1 (₹599).',
 '{"orderNumber":"ORD-20260006","customer":"Suresh Babu","amount":599}',
 NOW(), DATE_SUB(NOW(), INTERVAL 10 HOUR)),

-- ═══════════════════════════════════════════════════════════════
--  CUSTOMER customer@flowershop.com (user_id = 2)
-- ═══════════════════════════════════════════════════════════════

-- Fresh order lifecycle (unread)
('default', 2, 'order_placed',
 '[MOCK] Order Placed #ORD-20260011',
 'Your order of Marigold Garland × 5 + Jasmine Flowers × 3 has been placed. Total: ₹1,892.',
 '{"orderNumber":"ORD-20260011","amount":1892}',
 NULL, DATE_SUB(NOW(), INTERVAL 17 MINUTE)),

('default', 2, 'payment_success',
 '[MOCK] Payment Confirmed — ₹1,892',
 'Your UPI payment for order #ORD-20260011 was successful. Order is being prepared.',
 '{"orderNumber":"ORD-20260011","amount":1892,"method":"UPI"}',
 NULL, DATE_SUB(NOW(), INTERVAL 16 MINUTE)),

('default', 2, 'order_shipped',
 '[MOCK] Your Order is On the Way! 🚚',
 'Order #ORD-20260010 has been picked up by our delivery partner. Expected by 7 PM today.',
 '{"orderNumber":"ORD-20260010","eta":"7 PM"}',
 NULL, DATE_SUB(NOW(), INTERVAL 3 HOUR)),

-- Promo (unread)
('default', 2, 'promo',
 '[MOCK] Flash Sale: Jasmine at ₹199 Today Only!',
 'Fresh jasmine stock just arrived! Use code JASMINE30 for 30% off. Valid until midnight.',
 '{"code":"JASMINE30","discount":30,"product":"Jasmine Flowers"}',
 NULL, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),

-- Older read ones
('default', 2, 'order_delivered',
 '[MOCK] Order Delivered 🌸',
 'Your order #ORD-20260007 has been delivered. We hope you enjoy the flowers!',
 '{"orderNumber":"ORD-20260007"}',
 NOW(), DATE_SUB(NOW(), INTERVAL 2 DAY)),

('default', 2, 'order_confirmed',
 '[MOCK] Order Confirmed #ORD-20260007',
 'Your order has been confirmed and is being carefully packed.',
 '{"orderNumber":"ORD-20260007"}',
 NOW(), DATE_SUB(NOW(), INTERVAL 3 DAY)),

-- ═══════════════════════════════════════════════════════════════
--  TEST USER test@flowershop.com (user_id = 3)
-- ═══════════════════════════════════════════════════════════════
('default', 3, 'order_placed',
 '[MOCK] Order Placed #ORD-20260012',
 'Your order of Red Roses Bunch has been placed. Total: ₹349.',
 '{"orderNumber":"ORD-20260012","amount":349}',
 NULL, DATE_SUB(NOW(), INTERVAL 10 MINUTE)),

('default', 3, 'payment_success',
 '[MOCK] Payment Successful — ₹349',
 'Payment for order #ORD-20260012 confirmed.',
 '{"orderNumber":"ORD-20260012","amount":349}',
 NULL, DATE_SUB(NOW(), INTERVAL 9 MINUTE)),

('default', 3, 'promo',
 '[MOCK] Karthigai Deepam Offer 🪔',
 'Get 15% off all garlands this week. Use code DEEPAM15 at checkout.',
 '{"code":"DEEPAM15","discount":15}',
 NULL, DATE_SUB(NOW(), INTERVAL 4 HOUR));
