-- FlowerShop Seed Data
-- Run after migrations: mysql -u root -p flowershop < database/seeders/001_seed_data.sql

USE `flowershop`;

-- ── Admin user (password: Admin@123) ─────────────────────────────────────────
INSERT IGNORE INTO `users` (tenant_id, name, email, phone, password, role, status) VALUES
('default', 'Admin User',       'admin@flowershop.com',    '9876543210', '$2y$12$2cpBchQxoBEeMvf6M6DJfOegWForEFqNu2BzhClof4dVKpMPcz3gq', 'admin',    'active'),
('default', 'Test Customer',    'customer@flowershop.com', '9876543211', '$2y$12$u8jekzZCT/11UWXnaWeDe.uVNfc5OQkh3CiDsVwYf5VW5G/8tXIOy', 'customer', 'active');
-- admin@flowershop.com    → Admin@12345
-- customer@flowershop.com → Customer@12345

-- ── Categories ────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `categories` (tenant_id, name, name_ta, slug, sort_order) VALUES
('default', 'Fresh Flowers',  'புதிய பூக்கள்',    'fresh-flowers',  1),
('default', 'Pooja Items',    'பூஜை பொருட்கள்',    'pooja-items',    2),
('default', 'Garlands',       'மாலைகள்',           'garlands',       3),
('default', 'Seasonal',       'பருவகால பூக்கள்',   'seasonal',       4),
('default', 'Gift Bouquets',  'பரிசு கொத்து',      'gift-bouquets',  5);

-- ── Products ──────────────────────────────────────────────────────────────────
INSERT INTO `products`
  (tenant_id, category_id, name, name_ta, description, price, discounted_price, stock_quantity, unit, is_festival_special, is_fresh)
VALUES
('default', 1, 'Red Roses Bunch',       'சிவப்பு ரோஜா கட்டு',    'Fresh red roses — perfect for gifting.',      499.00, 349.00, 50, 'bunch',  0, 1),
('default', 1, 'Jasmine Flowers',       'மல்லிகை பூக்கள்',        'Fresh hand-picked jasmine for puja & hair.',  299.00,   NULL, 100,'100g',  0, 1),
('default', 3, 'Marigold Garland',      'சாமந்தி மாலை',           'Traditional marigold garland — 1 metre.',     199.00, 149.00, 80, 'piece', 1, 1),
('default', 3, 'Lotus Garland',         'தாமரை மாலை',             'Pure lotus garland for temple offering.',     399.00,   NULL, 40, 'piece', 1, 1),
('default', 2, 'Mixed Pooja Flowers',   'கலை பூஜை பூக்கள்',       'Assorted flowers for daily puja.',           599.00,   NULL, 60, 'pack',  0, 1),
('default', 2, 'Tulsi Garland',         'துளசி மாலை',             'Sacred tulsi leaves garland for Vishnu puja.',149.00,  NULL, 70, 'piece', 0, 1),
('default', 4, 'Chrysanthemum Bunch',   'சந்தன மல்லிகை',          'White chrysanthemum bunch for festivals.',    249.00, 199.00, 45, 'bunch', 1, 0),
('default', 5, 'Wedding Rose Bouquet',  'திருமண ரோஜா கட்டு',      'Premium red and white roses for weddings.',  899.00, 749.00, 20, 'piece', 0, 1);

-- ── Product Images ────────────────────────────────────────────────────────────
INSERT INTO `product_images` (product_id, url, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=500', 0),
(2, 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=500', 0),
(3, 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=500', 0),
(4, 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=500', 0),
(5, 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=500',    0),
(6, 'https://images.unsplash.com/photo-1490750967868-88df5691cc8b?w=500', 0),
(7, 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500', 0),
(8, 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500',    0);

-- ── Blog Posts ────────────────────────────────────────────────────────────────
INSERT INTO `blog_posts` (tenant_id, author_id, title, slug, excerpt, content, category, image_url, is_published, published_at) VALUES
('default', 1,
 'Top 5 Flowers for Karthigai Deepam',
 'top-5-flowers-karthigai-deepam',
 'Discover the most auspicious flowers to use during the Karthigai Deepam festival.',
 '<p>Karthigai Deepam is one of the most celebrated festivals in Tamil Nadu...</p>',
 'Festivals',
 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800',
 1, NOW()),
('default', 1,
 'How to Keep Jasmine Fresh Longer',
 'how-to-keep-jasmine-fresh-longer',
 'Simple tips to keep your jasmine flowers fresh and fragrant throughout the day.',
 '<p>Jasmine flowers are delicate and need proper care to stay fresh...</p>',
 'Tips',
 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=800',
 1, NOW());

-- ── Coupon ────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `coupons` (tenant_id, code, type, value, min_order, max_uses, expires_at) VALUES
('default', 'WELCOME10', 'percent', 10.00, 199.00, 100, DATE_ADD(NOW(), INTERVAL 30 DAY)),
('default', 'FLAT50',    'flat',    50.00, 499.00, 50,  DATE_ADD(NOW(), INTERVAL 30 DAY));
