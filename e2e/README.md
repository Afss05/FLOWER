# End-to-End Tests

Playwright-based E2E tests for FlowerShop customer portal and admin dashboard.

## Directory Structure

```
tests/
├── customer-portal/         # Customer portal tests
│   ├── auth/               # Authentication flows
│   ├── products/           # Product browsing
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout process
│   ├── orders/             # Order management
│   └── subscriptions/      # Subscription features
│
└── admin/                  # Admin dashboard tests
    ├── auth/               # Admin login
    ├── products/           # Product management
    ├── orders/             # Order management
    ├── analytics/          # Analytics pages
    └── users/              # User management

helpers/                    # Test utilities
shared/                     # Shared test data
```

## Getting Started

```bash
# Install Playwright browsers
npx playwright install

# Run tests
npm test

# Run tests in UI mode
npm test -- --ui

# Run specific test file
npm test -- tests/customer-portal/auth/login.spec.ts

# Run tests in headed mode (see browser)
npm test -- --headed
```

## Writing Tests

```typescript
// tests/customer-portal/auth/login.spec.ts
import { test, expect } from "@playwright/test";

test("user can login with valid credentials", async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  await page.fill('input[type="email"]', "user@example.com");
  await page.fill('input[type="password"]', "password123");
  await page.click('button:has-text("Sign In")');

  await expect(page).toHaveURL("http://localhost:5173/home");
});
```

## Best Practices

1. **User-centric**: Test workflows, not implementation
2. **Maintainable**: Use page objects & helpers
3. **Independent**: Tests should not depend on each other
4. **Fast**: Use proper waits, not arbitrary delays
5. **Clear**: Descriptive test names

## Test Data

Test accounts and data are managed in `shared/test-data.ts`:

```typescript
export const testAccounts = {
  customer: {
    email: "customer@test.com",
    password: "Test@12345",
  },
  admin: {
    email: "admin@test.com",
    password: "Admin@12345",
  },
};
```

## Running Tests in CI/CD

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run tests
npm test

# Generate report
npm test -- --reporter=html
```

## Configuration

See `playwright.config.ts` for:

- Browser configuration
- Base URL
- Timeout settings
- Reporter configuration
- Device emulation

## Troubleshooting

### Tests are flaky

- Use proper waits instead of `waitForTimeout`
- Check for dynamic content loading
- Verify element selectors

### Tests timeout

- Increase timeout in config
- Check server is running
- Debug with `--debug` flag

### Selectors not found

- Use Playwright Inspector: `npx playwright codegen`
- Check element exists in DOM
- Use more stable selectors

## Documentation

See [../../CLAUDE.md](../../CLAUDE.md) for complete E2E testing guide.
