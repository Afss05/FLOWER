# Admin Dashboard

Admin portal for managing products, orders, inventory, and customers built with React + TypeScript + Vite.

## Directory Structure

```
src/
├── api/                 # Admin API client functions
├── components/          # Dashboard-specific components
├── pages/               # Admin pages
├── hooks/               # Custom hooks for admin features
├── store/               # Admin state management
├── types/               # Admin-specific types
├── utils/               # Admin utilities
└── App.tsx              # Root component
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Admin Features

- 📊 Dashboard with analytics
- 📦 Product management (CRUD)
- 🏷️ Category management
- 📋 Order management
- 👥 Customer management
- 🎟️ Coupon management
- 📝 Blog CMS
- 📅 Subscription management
- 📈 Revenue & inventory analytics

## Development Notes

- Use functional components with hooks
- Maintain TypeScript strict mode
- Follow ESLint rules
- Implement proper access control
- Write tests for critical features

## Documentation

See [../../CLAUDE.md](../../CLAUDE.md) for detailed architecture and patterns.
