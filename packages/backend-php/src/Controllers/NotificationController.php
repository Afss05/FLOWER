<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Exceptions\NotFoundException;
use App\Exceptions\UnauthorizedException;
use App\Services\NotificationService;
use App\Utils\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class NotificationController
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    // ──────────────────────────────────────────────────────────────────────
    // GET /api/notifications
    // List paginated notifications for the authenticated user.
    // ──────────────────────────────────────────────────────────────────────
    public function index(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        ['userId' => $userId, 'tenantId' => $tenantId] = $this->identity($request);
        $params = $request->getQueryParams();
        $page   = max(1, (int) ($params['page']  ?? 1));
        $limit  = min(50, max(1, (int) ($params['limit'] ?? 20)));

        $result = $this->notificationService->list($tenantId, $userId, $page, $limit);

        // Return shape that matches the frontend NotificationListResponse interface.
        return Response::success($response, [
            'notifications' => $result['items'],
            'meta'          => [
                'total' => $result['total'],
                'page'  => $result['page'],
                'limit' => $result['limit'],
                'pages' => $result['pages'],
            ],
            'unreadCount'   => $result['unreadCount'],
        ], 'Notifications retrieved');
    }

    // ──────────────────────────────────────────────────────────────────────
    // GET /api/notifications/count
    // Returns unread badge count only — lightweight call.
    // ──────────────────────────────────────────────────────────────────────
    public function count(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        ['userId' => $userId, 'tenantId' => $tenantId] = $this->identity($request);
        $count = $this->notificationService->unreadCount($tenantId, $userId);
        return Response::success($response, ['unreadCount' => $count]);
    }

    // ──────────────────────────────────────────────────────────────────────
    // GET /api/notifications/poll?since=<ISO8601>&timeout=<seconds>
    //
    // Long-polling endpoint.
    // Client sends the ISO-8601 timestamp of the last notification it saw
    // (or "now" on first connect).  Server blocks for up to `timeout`
    // seconds (default 20, max 25) and returns as soon as new notifications
    // arrive.  Client immediately re-connects after receiving a response.
    //
    // Flow:
    //   1. Client → GET /api/notifications/poll?since=2026-05-31T10:00:00Z
    //   2. Server waits up to 20 s
    //   3. Server → { data: [...notifications], nextSince: "2026-05-31T10:00:05Z" }
    //   4. Client updates UI and re-polls with nextSince
    // ──────────────────────────────────────────────────────────────────────
    public function poll(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        ['userId' => $userId, 'tenantId' => $tenantId] = $this->identity($request);
        $params  = $request->getQueryParams();

        $since   = trim((string) ($params['since']   ?? ''));
        $timeout = min(25, max(1, (int) ($params['timeout'] ?? 20)));

        // Disable output buffering so the response isn't held in memory
        if (ob_get_level()) {
            ob_end_clean();
        }

        $notifications = $this->notificationService->poll(
            $tenantId, $userId, $since, $timeout
        );

        // nextSince = latest createdAt in results, or current server time if empty
        $nextSince = !empty($notifications)
            ? end($notifications)['createdAt']
            : date('c');

        return Response::success($response, [
            'notifications' => $notifications,
            'nextSince'     => $nextSince,
            'count'         => count($notifications),
        ]);
    }

    // ──────────────────────────────────────────────────────────────────────
    // PATCH /api/notifications/{id}/read
    // ──────────────────────────────────────────────────────────────────────
    public function markRead(
        ServerRequestInterface $request,
        ResponseInterface      $response,
        array                  $args
    ): ResponseInterface {
        ['userId' => $userId] = $this->identity($request);
        $id = max(0, (int) ($args['id'] ?? 0));

        if (!$this->notificationService->markRead($id, $userId)) {
            throw new NotFoundException('Notification not found');
        }
        return Response::success($response, null, 'Marked as read');
    }

    // ──────────────────────────────────────────────────────────────────────
    // PATCH /api/notifications/read-all
    // ──────────────────────────────────────────────────────────────────────
    public function markAllRead(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        ['userId' => $userId, 'tenantId' => $tenantId] = $this->identity($request);
        $this->notificationService->markAllRead($tenantId, $userId);
        return Response::success($response, null, 'All notifications marked as read');
    }

    // ──────────────────────────────────────────────────────────────────────
    // DELETE /api/notifications/{id}
    // ──────────────────────────────────────────────────────────────────────
    public function destroy(
        ServerRequestInterface $request,
        ResponseInterface      $response,
        array                  $args
    ): ResponseInterface {
        ['userId' => $userId] = $this->identity($request);
        $id = max(0, (int) ($args['id'] ?? 0));

        if (!$this->notificationService->delete($id, $userId)) {
            throw new NotFoundException('Notification not found');
        }
        return Response::success($response, null, 'Notification deleted');
    }

    // ──────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ──────────────────────────────────────────────────────────────────────

    /** @return array{userId: int, tenantId: string} */
    private function identity(ServerRequestInterface $request): array
    {
        $user     = $request->getAttribute('user');
        $userId   = is_array($user) ? (int) ($user['id'] ?? 0) : 0;
        $tenantId = is_array($user) ? (string) ($user['tenantId'] ?? 'default') : 'default';

        if ($userId <= 0) {
            throw new UnauthorizedException('Authentication required');
        }
        return ['userId' => $userId, 'tenantId' => $tenantId];
    }
}
