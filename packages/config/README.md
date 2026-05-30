# Configuration Package

Shared configuration and client-specific settings for FlowerShop.

## Directory Structure

```
clients/
├── default/             # Default client configuration
│   ├── theme.ts         # Brand colors, fonts, assets
│   ├── public-config.ts # Public configuration
│   ├── private-config.ts    # Secrets & API keys (git-ignored)
│   ├── pages/           # Client-specific page content
│   └── workflows/       # Client-specific workflows
│
└── {CLIENT_ID}/         # Additional clients
    └── ...

schema/
├── theme.ts             # Theme type definitions
├── pages.ts             # Page content schema
└── workflows.ts         # Workflow schema

index.ts                # Barrel exports
```

## Multi-Tenant Configuration

### Adding a New Client

1. Create client directory:

   ```bash
   mkdir packages/config/clients/{CLIENT_ID}
   ```

2. Copy default client:

   ```bash
   cp -r packages/config/clients/default/* packages/config/clients/{CLIENT_ID}/
   ```

3. Update configuration files with client-specific data

4. Update environment:
   ```env
   CLIENT_ID={CLIENT_ID}
   ```

## Theme Configuration

```typescript
// clients/{CLIENT_ID}/theme.ts
export const theme = {
  colors: {
    primary: "#8B0000", // Maroon
    secondary: "#D4AF37", // Gold
    accent: "#F5F5DC", // Cream
  },
  fonts: {
    primary: "Inter, sans-serif",
    decorative: "Georgia, serif",
  },
  assets: {
    logo: "/assets/logo.svg",
    favicon: "/assets/favicon.ico",
  },
  businessConfig: {
    openTime: "06:00",
    closeTime: "22:00",
    nextDayDeliveryTime: "10:00",
  },
  defaultLanguage: "en",
  supportedLanguages: ["en", "ta"],
};
```

## Public vs Private Config

### Public Config (`public-config.ts`)

- Business hours
- Supported languages
- Delivery settings
- Payment methods
- Feature flags

### Private Config (`private-config.ts`)

- API keys (Razorpay, SMS, etc.)
- Database credentials (dev only)
- Third-party service secrets
- **Never commit to Git**

## Usage in Frontends

```typescript
// customer-portal & admin-dashboard
import { theme } from "@flowershop/config/clients/default/theme";
import { publicConfig } from "@flowershop/config/clients/default/public-config";
```

## Usage in Backend

```php
// Laravel backend
$clientConfig = config('clients.' . config('app.client_id'));
$theme = $clientConfig['theme'];
```

## Environment Variables

Set `CLIENT_ID` to load client-specific configuration:

```env
CLIENT_ID=default          # Uses default client
CLIENT_ID=yw-flowers       # Uses yw-flowers client
```

## Documentation

See [../../CLAUDE.md](../../CLAUDE.md) for detailed multi-tenant architecture.
