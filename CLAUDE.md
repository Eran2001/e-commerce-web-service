# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (Vite, http://localhost:5173)
npm run build      # type-check then build for production
npm run preview    # preview production build
```

There is no test suite or linter configured.

## Architecture

This is a **Vite + React 19 SPA** called "Luxe Commerce" — a fully client-side e-commerce frontend with no backend. Despite the repo name and `app/layout.tsx` from a v0 scaffold, **Next.js is not used**. The actual application lives entirely under `src/`.

### Dual directory situation

| Directory | Purpose |
|-----------|---------|
| `src/` | The live application (Vite entry: `src/main.tsx`) |
| `app/` | Unused Next.js shell left from v0 scaffold — ignore |
| `components/ui/` | shadcn/ui components (root-level, referenced by `components.json`) |
| `src/components/` | App-specific components |

The path alias `@` maps to `./src` (configured in `vite.config.ts` and `tsconfig.json`).

### State management

Four React Context providers wrap the app in `src/App.tsx`, in this order:

1. **ThemeProvider** (`src/context/ThemeContext.tsx`) — dark/light toggle, defaults to dark, persisted in `localStorage` as `luxe-theme`
2. **AuthProvider** (`src/context/AuthContext.tsx`) — simulated auth (no real backend; any password ≥ 6 chars succeeds), persisted as `luxe-auth`
3. **CartProvider** (`src/context/CartContext.tsx`) — cart items + coupon logic, persisted as `luxe-cart`; only valid coupon is `SAVE10` (10% off)
4. **WishlistProvider** (`src/context/WishlistContext.tsx`) — wishlist, persisted as `luxe-wishlist`

Each context exports a custom hook (`useAuth`, `useCart`, `useWishlist`, `useTheme`) that throws if used outside its provider.

### Routing

React Router v7 handles all routing in `src/App.tsx`. Routes:

- `/` → Home
- `/products`, `/products/:category` → ProductListing
- `/product/:id` → ProductDetail
- `/cart`, `/wishlist`, `/checkout`, `/auth`, `/profile`, `/search` → respective pages

### Data layer

All data is mock/static in `src/data/`:
- `products.ts` — programmatically generates product catalog across 6 categories
- `categories.ts` — category metadata
- `mockOrders.ts` — order history for the profile page

There is no API layer. Adding real data fetching would require building one from scratch.

### UI components

- shadcn/ui (new-york style) components live in `components/ui/` at the root
- App-specific shared components in `src/components/common/`, `src/components/filters/`, `src/components/home/`, `src/components/layout/`, `src/components/product/`
- Icons: `lucide-react`
- Toasts: `sonner` (via `toast.success()` / `toast.error()`)
- Forms: `react-hook-form` + `zod`

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.*` file needed). The `cn()` utility in `src/lib/utils.ts` combines `clsx` + `tailwind-merge`.

Note: there is a duplicate `lib/utils.ts` at the root level (from the v0 scaffold) — the one used by the app is `src/lib/utils.ts`.
