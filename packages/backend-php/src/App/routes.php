<?php

declare(strict_types=1);

use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Controllers\BlogController;
use App\Controllers\CartController;
use App\Controllers\NotificationController;
use App\Controllers\OrderController;
use App\Controllers\ProductController;
use App\Controllers\SubscriptionController;
use App\Controllers\UserController;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app): void {

    // ── Health ──────────────────────────────────────────────────────────────
    $app->get('/health', function ($req, $res) {
        $res->getBody()->write(json_encode(['status' => 'ok', 'timestamp' => date('c')]));
        return $res->withHeader('Content-Type', 'application/json');
    });

    // ── Auth ─────────────────────────────────────────────────────────────────
    $app->group('/api/auth', function (RouteCollectorProxy $group) {
        $group->post('/register', [AuthController::class, 'register']);
        $group->post('/login',    [AuthController::class, 'login']);
        $group->get('/me',        [AuthController::class, 'me'])->add(AuthMiddleware::class);
        $group->post('/refresh',  [AuthController::class, 'refresh'])->add(AuthMiddleware::class);
    });

    // ── Products (public) ────────────────────────────────────────────────────
    $app->group('/api/products', function (RouteCollectorProxy $group) {
        $group->get('',                    [ProductController::class, 'index']);
        $group->get('/festival-specials',  [ProductController::class, 'festivalSpecials']);
        $group->get('/trending',           [ProductController::class, 'trending']);
        $group->get('/search',             [ProductController::class, 'search']);
        $group->get('/categories',         [ProductController::class, 'categories']);
        $group->get('/{id:[0-9]+}',        [ProductController::class, 'show']);
    });

    // ── Cart (auth required) ─────────────────────────────────────────────────
    $app->group('/api/cart', function (RouteCollectorProxy $group) {
        $group->get('',                        [CartController::class, 'index']);
        $group->post('/items',                 [CartController::class, 'addItem']);
        $group->put('/items/{itemId:[0-9]+}',  [CartController::class, 'updateItem']);
        $group->delete('/items/{itemId:[0-9]+}', [CartController::class, 'removeItem']);
        $group->delete('',                     [CartController::class, 'clear']);
    })->add(AuthMiddleware::class);

    // ── Orders (auth required) ───────────────────────────────────────────────
    $app->group('/api/orders', function (RouteCollectorProxy $group) {
        $group->get('',                        [OrderController::class, 'index']);
        $group->post('',                       [OrderController::class, 'store']);
        $group->get('/{id:[0-9]+}',            [OrderController::class, 'show']);
        $group->post('/{id:[0-9]+}/cancel',    [OrderController::class, 'cancel']);
    })->add(AuthMiddleware::class);

    // ── Subscriptions (auth required) ────────────────────────────────────────
    $app->group('/api/subscriptions', function (RouteCollectorProxy $group) {
        $group->get('',                        [SubscriptionController::class, 'index']);
        $group->post('',                       [SubscriptionController::class, 'store']);
        $group->post('/{id:[0-9]+}/cancel',    [SubscriptionController::class, 'cancel']);
    })->add(AuthMiddleware::class);

    // ── User profile (auth required) ─────────────────────────────────────────
    $app->group('/api/user', function (RouteCollectorProxy $group) {
        $group->get('/profile',           [UserController::class, 'profile']);
        $group->put('/profile',           [UserController::class, 'updateProfile']);
        $group->post('/change-password',  [UserController::class, 'changePassword']);
    })->add(AuthMiddleware::class);

    // ── Blogs (public read, admin write) ─────────────────────────────────────
    $app->group('/api/blogs', function (RouteCollectorProxy $group) {
        $group->get('',             [BlogController::class, 'index']);
        $group->get('/{slug}',      [BlogController::class, 'show']);
        $group->post('',            [BlogController::class, 'store'])
              ->add(new RoleMiddleware(['admin', 'super_admin']))
              ->add(AuthMiddleware::class);
    });

    // ── Admin (auth + admin role required) ───────────────────────────────────
    $app->group('/api/admin', function (RouteCollectorProxy $group) {
        $group->get('/dashboard',                        [AdminController::class, 'dashboard']);
        $group->get('/orders',                           [AdminController::class, 'orders']);
        $group->patch('/orders/{id:[0-9]+}/status',      [AdminController::class, 'updateOrderStatus']);
        $group->get('/customers',                        [AdminController::class, 'customers']);

        // Product management
        $group->post('/products',                        [ProductController::class, 'store']);
        $group->put('/products/{id:[0-9]+}',             [ProductController::class, 'update']);
        $group->delete('/products/{id:[0-9]+}',          [ProductController::class, 'destroy']);
    })->add(new RoleMiddleware(['admin', 'super_admin']))->add(AuthMiddleware::class);

    // ── Notifications (auth required) ─────────────────────────────────────────────────────
    // Polling-based push notifications — no WebSocket required.
    //
    // Client usage:
    //   1. GET /api/notifications/poll?since=<ISO8601>&timeout=20
    //      → blocks up to 20s, returns new notifications + nextSince
    //   2. On response (empty or not), immediately re-connect with nextSince
    //   3. GET /api/notifications/count  → lightweight badge count
    $app->group('/api/notifications', function (RouteCollectorProxy $group) {
        $group->get('',                    [NotificationController::class, 'index']);
        $group->get('/count',              [NotificationController::class, 'count']);
        $group->get('/poll',               [NotificationController::class, 'poll']);
        $group->patch('/read-all',         [NotificationController::class, 'markAllRead']);
        $group->patch('/{id:[0-9]+}/read', [NotificationController::class, 'markRead']);
        $group->delete('/{id:[0-9]+}',     [NotificationController::class, 'destroy']);
    })->add(AuthMiddleware::class);
};
