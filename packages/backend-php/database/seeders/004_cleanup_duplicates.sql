-- Clean up duplicate seeded notifications, keep only mock data + one copy of originals
USE `flowershop`;

-- Remove all non-mock notifications (from the old 002 seed that was run multiple times)
DELETE FROM `notifications` WHERE `title` NOT LIKE '[MOCK]%';

-- Verify
SELECT user_id, COUNT(*) as total, SUM(read_at IS NULL) as unread
FROM notifications
GROUP BY user_id
ORDER BY user_id;
