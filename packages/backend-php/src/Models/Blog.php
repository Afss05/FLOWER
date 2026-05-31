<?php

declare(strict_types=1);

namespace App\Models;

class Blog extends BaseModel
{
    public function all(array $filters = [], int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;
        $where  = ['b.tenant_id = ?', 'b.is_published = 1'];
        $params = [$this->tenantId()];

        if (!empty($filters['category'])) {
            $where[]  = 'b.category = ?';
            $params[] = $filters['category'];
        }

        if (!empty($filters['search'])) {
            $where[]  = '(b.title LIKE ? OR b.excerpt LIKE ?)';
            $term     = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
        }

        $whereStr = implode(' AND ', $where);

        $sql = "SELECT b.*, u.name AS author_name FROM blog_posts b
                LEFT JOIN users u ON u.id = b.author_id
                WHERE {$whereStr}
                ORDER BY b.published_at DESC
                LIMIT ? OFFSET ?";

        $cParams  = $params;
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        $cStmt = $this->db->prepare("SELECT COUNT(*) FROM blog_posts b WHERE {$whereStr}");
        $cStmt->execute($cParams);

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
            FROM blog_posts b
            LEFT JOIN users u ON u.id = b.author_id
            WHERE b.slug = ? AND b.tenant_id = ? AND b.is_published = 1
        ");
        $stmt->execute([$slug, $this->tenantId()]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM blog_posts WHERE id = ? AND tenant_id = ?');
        $stmt->execute([$id, $this->tenantId()]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data, int $authorId): array
    {
        $slug = $this->slugify($data['title']);
        $stmt = $this->db->prepare('
            INSERT INTO blog_posts
              (tenant_id, author_id, title, slug, excerpt, content, category, image_url,
               is_published, published_at, created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        ');
        $stmt->execute([
            $this->tenantId(),
            $authorId,
            $data['title'],
            $slug,
            $data['excerpt'] ?? null,
            $data['content'],
            $data['category'] ?? 'general',
            $data['image_url'] ?? null,
            (int) ($data['is_published'] ?? 1),
            $data['published_at'] ?? $this->now(),
            $this->now(),
            $this->now(),
        ]);

        return $this->findById((int) $this->db->lastInsertId());
    }

    private function slugify(string $text): string
    {
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);
        $text = preg_replace('~[^-\w]+~', '', strtolower(trim($text, '-')));
        return $text ?: 'post-' . time();
    }
}
