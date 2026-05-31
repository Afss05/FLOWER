-- FlowerShop Database Migration
-- Run: mysql -u root -p flowershop < database/migrations/001_create_tables.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── Database ──────────────────────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS `flowershop`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `flowershop`;

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`           VARCHAR(50)  NOT NULL DEFAULT 'default',
  `name`                VARCHAR(150) NOT NULL,
  `email`               VARCHAR(200) NOT NULL,
  `phone`               VARCHAR(20)  NOT NULL DEFAULT '',
  `password`            VARCHAR(255) NOT NULL,
  `role`                ENUM('customer','admin','super_admin') NOT NULL DEFAULT 'customer',
  `status`              ENUM('active','inactive','suspended')  NOT NULL DEFAULT 'active',
  `email_verified_at`   DATETIME     DEFAULT NULL,
  `phone_verified_at`   DATETIME     DEFAULT NULL,
  `created_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_email_tenant` (`email`, `tenant_id`),
  INDEX `idx_tenant`    (`tenant_id`),
  INDEX `idx_role`      (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Categories ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`   VARCHAR(50)  NOT NULL DEFAULT 'default',
  `name`        VARCHAR(100) NOT NULL,
  `name_ta`     VARCHAR(100) DEFAULT NULL,
  `slug`        VARCHAR(120) NOT NULL,
  `description` TEXT         DEFAULT NULL,
  `image_url`   VARCHAR(500) DEFAULT NULL,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tenant_slug` (`tenant_id`, `slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Products ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `products` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`            VARCHAR(50)     NOT NULL DEFAULT 'default',
  `category_id`          INT UNSIGNED    DEFAULT NULL,
  `name`                 VARCHAR(200)    NOT NULL,
  `name_ta`              VARCHAR(200)    DEFAULT NULL,
  `description`          TEXT            DEFAULT NULL,
  `description_ta`       TEXT            DEFAULT NULL,
  `price`                DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  `discounted_price`     DECIMAL(10,2)   DEFAULT NULL,
  `stock_quantity`       INT             NOT NULL DEFAULT 0,
  `unit`                 VARCHAR(30)     NOT NULL DEFAULT 'piece',
  `is_festival_special`  TINYINT(1)      NOT NULL DEFAULT 0,
  `is_seasonal`          TINYINT(1)      NOT NULL DEFAULT 0,
  `is_fresh`             TINYINT(1)      NOT NULL DEFAULT 0,
  `is_active`            TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tenant`     (`tenant_id`),
  INDEX `idx_category`   (`category_id`),
  INDEX `idx_festival`   (`is_festival_special`),
  FULLTEXT KEY `ft_name` (`name`, `description`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Product Images ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `product_images` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id`   INT UNSIGNED NOT NULL,
  `url`          VARCHAR(500) NOT NULL,
  `alt`          VARCHAR(200) DEFAULT NULL,
  `sort_order`   INT          NOT NULL DEFAULT 0,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_product` (`product_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Carts ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `carts` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`   VARCHAR(50)  NOT NULL DEFAULT 'default',
  `user_id`     INT UNSIGNED NOT NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_user_tenant` (`user_id`, `tenant_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Cart Items ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `cart_id`      INT UNSIGNED  NOT NULL,
  `product_id`   INT UNSIGNED  NOT NULL,
  `quantity`     INT           NOT NULL DEFAULT 1,
  `unit_price`   DECIMAL(10,2) NOT NULL,
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cart`    (`cart_id`),
  INDEX `idx_product` (`product_id`),
  FOREIGN KEY (`cart_id`)    REFERENCES `carts`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Orders ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `orders` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`        VARCHAR(50)   NOT NULL DEFAULT 'default',
  `user_id`          INT UNSIGNED  NOT NULL,
  `order_number`     VARCHAR(30)   NOT NULL,
  `status`           ENUM('pending','confirmed','processing','out_for_delivery','delivered','cancelled')
                     NOT NULL DEFAULT 'pending',
  `total_amount`     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `delivery_address` JSON          DEFAULT NULL,
  `delivery_date`    DATE          DEFAULT NULL,
  `delivery_slot`    VARCHAR(50)   DEFAULT NULL,
  `notes`            TEXT          DEFAULT NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_order_number` (`order_number`),
  INDEX `idx_tenant`  (`tenant_id`),
  INDEX `idx_user`    (`user_id`),
  INDEX `idx_status`  (`status`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Order Items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `order_items` (
  `id`           INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  `order_id`     INT UNSIGNED  NOT NULL,
  `product_id`   INT UNSIGNED  NOT NULL,
  `quantity`     INT           NOT NULL,
  `unit_price`   DECIMAL(10,2) NOT NULL,
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order`   (`order_id`),
  INDEX `idx_product` (`product_id`),
  FOREIGN KEY (`order_id`)   REFERENCES `orders`(`id`)   ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Payments ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `payments` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id`              INT UNSIGNED  NOT NULL,
  `razorpay_order_id`     VARCHAR(100)  DEFAULT NULL,
  `razorpay_payment_id`   VARCHAR(100)  DEFAULT NULL,
  `razorpay_signature`    VARCHAR(255)  DEFAULT NULL,
  `amount`                DECIMAL(10,2) NOT NULL,
  `currency`              CHAR(3)       NOT NULL DEFAULT 'INR',
  `status`                ENUM('created','paid','failed','refunded') NOT NULL DEFAULT 'created',
  `created_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Subscriptions ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`      VARCHAR(50)  NOT NULL DEFAULT 'default',
  `user_id`        INT UNSIGNED NOT NULL,
  `plan`           VARCHAR(50)  NOT NULL,
  `delivery_days`  JSON         DEFAULT NULL,
  `address`        JSON         DEFAULT NULL,
  `status`         ENUM('active','paused','cancelled') NOT NULL DEFAULT 'active',
  `starts_at`      DATE         NOT NULL,
  `ends_at`        DATE         DEFAULT NULL,
  `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user`   (`user_id`),
  INDEX `idx_tenant` (`tenant_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Reviews ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `reviews` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`   VARCHAR(50)  NOT NULL DEFAULT 'default',
  `product_id`  INT UNSIGNED NOT NULL,
  `user_id`     INT UNSIGNED NOT NULL,
  `rating`      TINYINT      NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment`     TEXT         DEFAULT NULL,
  `is_approved` TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_product` (`product_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Blog Posts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`    VARCHAR(50)  NOT NULL DEFAULT 'default',
  `author_id`    INT UNSIGNED DEFAULT NULL,
  `title`        VARCHAR(300) NOT NULL,
  `slug`         VARCHAR(320) NOT NULL,
  `excerpt`      TEXT         DEFAULT NULL,
  `content`      LONGTEXT     NOT NULL,
  `category`     VARCHAR(60)  NOT NULL DEFAULT 'general',
  `image_url`    VARCHAR(500) DEFAULT NULL,
  `is_published` TINYINT(1)   NOT NULL DEFAULT 1,
  `published_at` DATETIME     DEFAULT NULL,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_slug_tenant` (`slug`, `tenant_id`),
  INDEX `idx_tenant`   (`tenant_id`),
  INDEX `idx_category` (`category`),
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Coupons ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `coupons` (
  `id`              INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`       VARCHAR(50)   NOT NULL DEFAULT 'default',
  `code`            VARCHAR(30)   NOT NULL,
  `type`            ENUM('flat','percent') NOT NULL DEFAULT 'flat',
  `value`           DECIMAL(10,2) NOT NULL,
  `min_order`       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `max_uses`        INT           DEFAULT NULL,
  `used_count`      INT           NOT NULL DEFAULT 0,
  `expires_at`      DATETIME      DEFAULT NULL,
  `is_active`       TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_code_tenant` (`code`, `tenant_id`),
  INDEX `idx_tenant` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Notifications ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`   VARCHAR(50)   NOT NULL DEFAULT 'default',
  `user_id`     INT UNSIGNED  NOT NULL,
  `type`        VARCHAR(100)  NOT NULL,
  `title`       VARCHAR(255)  NOT NULL,
  `body`        TEXT          NOT NULL,
  `data`        JSON          DEFAULT NULL,
  `read_at`     DATETIME      DEFAULT NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_unread` (`tenant_id`, `user_id`, `read_at`),
  INDEX `idx_created`     (`created_at`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
