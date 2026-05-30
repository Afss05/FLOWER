# FlowerShop Premium Design System
## MNC-Level SaaS Aesthetic

Last Updated: May 2026

---

## 🎨 Design Philosophy

The FlowerShop design system is built on the principles of:

- **Apple-level simplicity**: Clean, minimal interfaces
- **Airbnb-level UX**: Intuitive, frictionless experiences
- **Stripe-level animations**: Smooth, purposeful motion
- **Linear-level smoothness**: Polished interactions
- **Notion-level consistency**: Unified visual language
- **Tesla-level premium feel**: Modern, aspirational aesthetic

### Core Principle
> "When someone opens the website, they should think it's a premium global product company that happens to sell flowers—not a typical flower shop."

---

## 🎭 Color System

### Primary: Dark Navy
- **Color**: `#0F172A`
- **Usage**: Primary buttons, headings, main CTAs
- **Meaning**: Trust, premium, professional

### Secondary: Off White
- **Color**: `#F8FAFC`
- **Usage**: Backgrounds, cards, supporting elements
- **Meaning**: Clean, spacious, premium feel

### Accent: Rose
- **Color**: `#E11D48`
- **Usage**: Highlights, secondary CTAs, interactive elements
- **Meaning**: Energy, sophistication, luxury

### Semantic Colors
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)

### Usage in Components

```
Button Primary: Dark Navy background, white text
Button Secondary: Off White background, Navy text
Button Accent: Rose background, white text
Cards: White background, navy text
Success Message: Green badge with white text
Error Message: Red badge with white text
```

---

## ✍️ Typography System

### Font Families

```css
--font-heading: 'Plus Jakarta Sans', sans-serif;  /* All headings */
--font-body: 'Inter', sans-serif;                   /* All body text */
--font-mono: 'JetBrains Mono', monospace;           /* Code blocks */
```

### Type Scale

| Size | Use Case | Example |
|------|----------|---------|
| `60px` (6xl) | Hero title | "Deliver Moments That Bloom Forever" |
| `48px` (5xl) | Main heading | Page titles |
| `36px` (4xl) | Subheading | Section headers |
| `30px` (3xl) | Card title | Product title |
| `24px` (2xl) | Section title | Feature title |
| `20px` (xl) | Accent text | Button text |
| `18px` (lg) | Lead text | Description |
| `16px` (base) | Body text | Default text |
| `14px` (sm) | Secondary text | Helper text |
| `12px` (xs) | Captions | Metadata |

### Font Weights

```
Heading: 600-700 (Bold)
Body: 400-500 (Regular-Medium)
Buttons: 500 (Medium)
Labels: 500 (Medium)
```

---

## 📏 Spacing & Sizing

### Spacing Scale

```css
1px   → 4px
2px   → 8px
3px   → 12px
4px   → 16px    /* Base unit */
5px   → 20px
6px   → 24px
7px   → 28px
8px   → 32px
...
```

### Component Sizes

```
Button Small:    16px × 32px padding
Button Medium:   24px × 40px padding
Button Large:    32px × 48px padding

Card Padding:    24px
Input Padding:   12px vertical, 16px horizontal
Modal Padding:   24px
```

---

## 🔄 Border Radius

Rounded corners create premium, approachable feel.

| Radius | Use Case |
|--------|----------|
| `8px` | Small elements (badges, small buttons) |
| `12px` | Medium elements (inputs, small cards) |
| `16px` | Buttons, standard inputs |
| `20px` | Cards, dropdowns |
| `24px` | Large cards, hero containers |
| `32px` | Modals, major containers |

---

## 🌚 Shadow System

All shadows are soft, premium, non-harsh.

```css
--shadow-xs:   0 1px 2px rgba(15, 23, 42, 0.04);      /* Subtle */
--shadow-sm:   0 2px 4px rgba(15, 23, 42, 0.06);      /* Light */
--shadow-base: 0 4px 6px rgba(15, 23, 42, 0.1);       /* Standard */
--shadow-md:   0 8px 12px rgba(15, 23, 42, 0.12);     /* Medium */
--shadow-lg:   0 12px 20px rgba(15, 23, 42, 0.15);    /* Large */
--shadow-xl:   0 20px 32px rgba(15, 23, 42, 0.2);     /* Extra Large */
--shadow-2xl:  0 32px 48px rgba(15, 23, 42, 0.25);    /* Maximum */
```

---

## 🎬 Animation System

### Durations

```css
--duration-fast:    150ms  /* Quick feedback */
--duration-normal:  250ms  /* Standard transitions */
--duration-slow:    350ms  /* Deliberate movement */
--duration-slower:  500ms  /* Cinematic movement */
```

### Timing Functions

```css
--timing-ease:      cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* Natural ease */
--timing-ease-out:  cubic-bezier(0, 0, 0.58, 1);             /* Fast start, slow end */
--timing-ease-in:   cubic-bezier(0.42, 0, 1, 1);             /* Slow start, fast end */
```

### Animation Patterns

#### Page Load
- **Skeleton loaders** for content blocks
- **Progressive loading** with staggered animations
- **Image lazy loading** with blur placeholders

#### Hover Effects
```javascript
// Standard hover
whileHover={{ scale: 1.02 }}
transition={{ duration: 250, ease: 'easeOut' }}

// Button press
whileTap={{ scale: 0.98 }}
```

#### Card Animation
```javascript
// Fade Up on mount
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 350, ease: 'easeOut' }}

// Hover lift
whileHover={{ y: -8 }}
```

#### Success Animation
- **Confetti particles** scatter outward
- **Scale up** followed by fade out
- **Duration**: 2-3 seconds

---

## 🧩 Component Library

### Core Components

#### Button
```tsx
<Button 
  variant="primary" | "secondary" | "accent" | "ghost"
  size="sm" | "md" | "lg"
  isLoading={false}
>
  Click Me
</Button>
```

**Variants:**
- **Primary**: Dark navy, white text → `bg-primary-950 text-white`
- **Secondary**: Off white, navy text → `bg-secondary-100 text-secondary-900`
- **Accent**: Rose, white text → `bg-accent-950 text-white`
- **Ghost**: Transparent, navy text → `text-primary-950`

#### Card
```tsx
<Card interactive className="p-6">
  Premium content goes here
</Card>
```

**Features:**
- Smooth shadow on hover
- Scale up 2% on hover (if interactive)
- 24px border radius
- White background with base shadow

#### Input
```tsx
<Input
  label="Email"
  placeholder="your@email.com"
  error="Email is required"
  helpText="We'll never share your email"
/>
```

**Features:**
- Smooth focus ring (primary color)
- Error state with red border
- Icon support (left-aligned)
- Help text or error message

#### Badge
```tsx
<Badge variant="primary" | "accent" | "success" | "warning" | "error">
  Festival Special
</Badge>
```

**Features:**
- Soft background colors
- Semantic color variants
- Scale in animation on mount

#### Modal
```tsx
<Modal isOpen={open} onClose={onClose} title="Welcome" size="md">
  Modal content here
</Modal>
```

**Features:**
- Glassmorphic backdrop
- Smooth scale + fade animation
- Spring physics for natural feel
- 32px border radius

#### Skeleton Loader
```tsx
<CardSkeleton />
<ProductGridSkeleton count={6} />
```

**Features:**
- Shimmer animation across text
- Multiple layout presets
- Gray gradient background

#### Toast Notification
```tsx
<Toast
  type="success" | "error" | "info" | "warning"
  message="Item added to cart"
  onClose={handleClose}
/>
```

**Features:**
- Auto-dismiss after 4 seconds
- Icon + message + close button
- Slide in from right animation
- Semantic colors

### Premium Components

#### Navbar
```tsx
<Navbar
  logo="🌸"
  onLoginClick={handleLogin}
  onCartClick={handleCart}
  cartCount={3}
/>
```

**Features:**
- Glassmorphism on scroll
- Mobile hamburger menu
- Search, wishlist, cart, profile icons
- Fixed top z-index

#### Hero Section
```tsx
<HeroSection
  headline="Deliver Moments That Bloom Forever"
  subheadline="Luxury flowers..."
  backgroundImage={url}
  onExploreClick={explore}
  onBuildGiftBoxClick={buildBox}
/>
```

**Features:**
- Full-screen background image
- Parallax effect
- Floating petal animations
- Dual CTA buttons
- Scroll indicator animation

#### AI Gift Assistant
```tsx
<AIGiftAssistant onComplete={preferences => {}} />
```

**Features:**
- Floating action button
- Multi-step form (recipient → budget → occasion → date)
- Progress bar
- Smooth transitions between steps
- Processing state with confetti

#### Product Card
```tsx
<ProductCard
  id={1}
  image={url}
  name="Red Roses Bouquet"
  price={999}
  discountedPrice={799}
  rating={4.5}
  reviews={128}
  isFresh={true}
  isSpecial={false}
  onAddToCart={add}
  onWishlist={wish}
  isInWishlist={false}
/>
```

**Features:**
- Image lazy loading with skeleton
- Zoom effect on image hover
- Quick add button (appears on hover)
- Wishlist heart (toggle state)
- Star rating + review count
- Occasion tag + delivery info
- Discount badge
- Fresh/Special badges

---

## 🌊 Glassmorphism

Used for navbar on scroll and premium overlays.

```css
.glass {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## 📱 Responsive Breakpoints

```css
xs:  0px       (Mobile)
sm:  640px     (Small tablet)
md:  768px     (Tablet)
lg:  1024px    (Desktop)
xl:  1280px    (Wide desktop)
2xl: 1536px    (Ultra-wide)
```

### Mobile-First Design
- Bottom navigation bar instead of top
- Single column layouts
- Larger touch targets
- Simplified navigation

---

## ⚡ Performance & Accessibility

### Performance
- Lazy load images with blur placeholders
- Code splitting with dynamic imports
- CSS minification
- Image optimization (WebP format)
- Debounced scroll/resize handlers

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Sufficient color contrast (WCAG AA)
- Alt text on all images

### Focus States
```css
.focus-ring {
  focus: outline-none;
  focus: ring-2 ring-offset-2 ring-primary-950;
}
```

---

## 📋 Component Inventory

### ✅ Completed
- [x] Button (all variants)
- [x] Card (standard + interactive)
- [x] Input (with labels, errors, help text)
- [x] Badge (all variants)
- [x] Modal
- [x] Toast notification
- [x] Navbar (with glassmorphism)
- [x] Hero section (with parallax + petals)
- [x] AI Gift Assistant
- [x] Product Card (Pinterest-style)
- [x] Skeleton loaders
- [x] Confetti animation

### ⏳ In Progress
- [ ] Product details page (image gallery + sticky panel)
- [ ] Build your gift box (live preview)
- [ ] Checkout (one-page, no reload)
- [ ] Customer dashboard (SaaS-style)
- [ ] Admin dashboard (modern enterprise)
- [ ] Corporate gifting module

---

## 🚀 Implementation Guide

### Using Components

```tsx
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ProductCard } from '@/components/product/ProductCard';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { AIGiftAssistant } from '@/components/home/AIGiftAssistant';

export function HomePage() {
  return (
    <>
      <Navbar cartCount={3} />
      <HeroSection />
      <AIGiftAssistant />
      
      {/* Product grid */}
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </>
  );
}
```

### Custom Styling

Use Tailwind classes with design tokens:

```tsx
<div className="bg-primary-950 text-secondary-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-normal">
  Premium container
</div>
```

### Animation Patterns

```tsx
import { motion } from 'framer-motion';

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 250 }}
/>

// Fade up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 350, ease: 'easeOut' }}
/>

// Hover scale
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
/>
```

---

## 🎯 Success Metrics

A component is well-designed when:

1. ✅ Loads in < 2 seconds
2. ✅ 60fps animations (smooth)
3. ✅ No layout shift
4. ✅ Accessible (WCAG AA)
5. ✅ Mobile-responsive
6. ✅ Keyboard-navigable
7. ✅ Looks premium
8. ✅ Feels premium

---

## 🔗 References

### Design Systems
- [Apple Human Interface Guidelines](https://developer.apple.com/design/)
- [Stripe Design System](https://stripe.com/design)
- [Airbnb Design Language](https://airbnb.design/)
- [Linear Design](https://linear.app)
- [Notion Design](https://notion.so)

### Technologies
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)

---

**Designed for Premium Experience**  
**Built for Global Standards**  
**Made for Luxury Gifting**
