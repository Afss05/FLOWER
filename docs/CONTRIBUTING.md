# Contributing to FlowerShop

Thank you for your interest in contributing to FlowerShop! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Follow the established coding standards
- Test your changes thoroughly
- Write clear commit messages
- Update documentation as needed

## Getting Started

### 1. Fork and Clone

```bash
git clone <your-fork-url>
cd FlowerShop
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes

Follow the coding standards and patterns in [CLAUDE.md](CLAUDE.md).

### 4. Test Your Changes

```bash
# Frontend
pnpm test

# Backend
cd packages/backend && php artisan test
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add awesome feature"
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Create a PR with:

- Clear description of changes
- Related issue numbers
- Screenshot/video for UI changes
- Test coverage summary

## Coding Standards

### Frontend

- Use functional components and React hooks
- TypeScript strict mode
- Follow ESLint rules
- Descriptive variable names
- British English for user-facing text

### Backend

- Laravel conventions (PSR-12)
- Type hints on all methods
- Repository pattern for data access
- PHPDoc comments
- Proper error handling

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Example:

```
feat(product): add product search functionality

Implement advanced search with filters for:
- Category filtering
- Price range
- Availability status

Closes #123
```

## Pull Request Process

1. **Title**: Use same format as commit messages
2. **Description**: Explain what and why
3. **Screenshots**: For UI changes
4. **Tests**: Ensure tests pass
5. **Code Review**: Address reviewer feedback
6. **Merge**: Rebase and squash commits if needed

## Testing Requirements

- Unit tests for business logic
- Component tests for UI
- E2E tests for critical workflows
- Aim for 80%+ coverage

## Documentation

Update documentation when:

- Adding new features
- Changing API endpoints
- Modifying database schema
- Adding new configuration

## Questions?

- Check [CLAUDE.md](CLAUDE.md) for architecture guide
- Review similar features in codebase
- Ask in issues before starting work

---

Happy contributing! 🌸
