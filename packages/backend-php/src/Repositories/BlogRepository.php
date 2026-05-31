<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\BlogRepositoryInterface;
use PDO;

final class BlogRepository implements BlogRepositoryInterface
{
    public function __construct(private readonly PDO $db) {}

    public function all(array $filters = [], int $page = 1, int $limit = 10): array
    {
        $page   = max(1, $page);
        $limit  = min(50, max(1, $limit));
        $offset = ($page - 1) * $limit;

        $where    = ['b.tenant_id = :tid', 'b.is_published = 1'];
        $params   = [':tid' => $this->tenantId()];
        $i        = 0;

        if (!empty($filters['category'])) {
            $k              = ":cat{$i}";
            $where[]        = "b.category = {$k}";
            $params[$k]     = mb_substr(trim((string) $filters['category']), 0, 50);
            $i++;
        }

        if (!empty($filters['search'])) {
            $term         = '%' . $this->escapeLike($filters['search']) . '%';
            $k1 = ":s1{$i}"; $k2 = ":s2{$i}";
            $where[]       = "(b.title LIKE {$k1} OR b.excerpt LIKE {$k2})";
            $params[$k1]   = $term;
            $params[$k2]   = $term;
            $i++;
        }

        $whereStr    = implode(' AND ', $where);
        $countParams = $params;

        $params[':lim'] = $limit;
        $params[':off'] = $offset;

        $sql = "
            SELECT b.*, u.name AS author_name
            FROM   blog_posts b
            LEFT JOIN users u ON u.id = b.author_id
            WHERE  {$whereStr}
            ORDER  BY b.published_at DESC
            LIMIT  :lim OFFSET :off
        ";

        $stmt = $this->db->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v, in_array($k, [':lim', ':off'], true) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $stmt->execute();

        $cStmt = $this->db->prepare("SELECT COUNT(*) FROM blog_posts b WHERE {$whereStr}");
        $cStmt->execute($countParams);

        return [
            'data'  => $stmt->fetchAll(),
            'total' => (int) $cStmt->fetchColumn(),
            'page'  => $page,
            'limit' => $limit,
        ];
    }

    public function findBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare("
            SELECT b.*, u.name AS author_name
            FROM   blog_posts b
            LEFT JOIN users u ON u.id = b.author_id
            WHERE  b.slug = :slug AND b.tenant_id = :tid AND b.is_published = 1
        ");
        $stmt->execute([':slug' => $slug, ':tid' => $this->tenantId()]);
        $row = $stmt->fetch();
        return $row !== false ? $row : null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM blog_posts WHERE id = :id AND tenant_id = :tid'
        );
        $stmt->execute([':id' => $id, ':tid' => $this->tenantId()]);
        $row = $stmt->fetch();
        return $row !== false ? $row : null;
    }

    public function create(array $data, int $authorId): array
    {
        $slug = $this->slugify((string) ($data['title'] ?? ''));
        $stmt = $this->db->prepare('
            INSERT INTO blog_posts
              (tenant_id, author_id, title, slug, excerpt, content, category,
               image_url, is_published, published_at, created_at, updated_at)
            VALUES
              (:tid, :author, :title, :slug, :excerpt, :content, :cat,
               :img, :published, :pub_at, :now, :now2)
        ');
        $stmt->execute([
            ':tid'       => $this->tenantId(),
            ':author'    => $authorId,
            ':title'     => mb_substr(trim((string) $data['title']), 0, 255),
            ':slug'      => $slug,
            ':excerpt'   => $data['excerpt'] ?? null,
            ':content'   => $data['content'] ?? '',
            ':cat'       => mb_substr(trim((string) ($data['category'] ?? 'general')), 0, 50),
            ':img'       => $data['image_url'] ?? null,
            ':published' => (int) (bool) ($data['is_published'] ?? true),
            ':pub_at'    => $data['published_at'] ?? $this->now(),
            ':now'       => $this->now(),
            ':now2'      => $this->now(),
        ]);

        $id = (int) $this->db->lastInsertId();
        return $this->findById($id) ?? throw new \RuntimeException('Blog post not found after insert');
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private function slugify(string $text): string
    {
        $text = preg_replace('~[^\pL\d]+~u', '-', $text) ?? '';
        $text = preg_replace('~[^-\w]+~', '', strtolower(trim($text, '-'))) ?? '';
        return $text !== '' ? $text : 'post-' . time();
    }

    private function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
    }

    private function tenantId(): string
    {
        return $_ENV['CLIENT_ID'] ?? 'default';
    }

    private function now(): string
    {
        return date('Y-m-d H:i:s');
    }
}
