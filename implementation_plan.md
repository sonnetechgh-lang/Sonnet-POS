# Implementation Plan: Arkos-style Cloud POS

This plan outlines the development of a modern, cloud-based Point of Sale system. The architecture focuses on speed, reliability (offline support), and insightful analytics for business owners.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), Tailwind CSS
- **Backend/Database**: Supabase (Auth, PostgreSQL, Realtime)
- **State Management**: React Query (Server State), Zustand (Client State)
- **Offline Strategy**: PWA (next-pwa) + IndexedDB (Dexie)

---

## Phase 1: Foundation & Database Architecture (Weeks 1-2)
**Goal**: Set up the core infrastructure and authentication.

- [x] **Infrastructure Setup**: Initialize Next.js project with Tailwind and Supabase.
- [x] **Design System**: Integrated custom color palette and typography.
- [x] **Database Schema Design**: Blueprint for Shops, Products, Sales, etc.
- [x] **Authentication UI**: Premium Login and Signup (multi-step) pages designed.
- [x] **Auth Infrastructure**: Supabase SSR client and Middleware configured.
- [x] **Shop Configuration**: Multi-step onboarding flow for business setup.
- [x] **System Polish**: Added premium feedback (Toasts), animations, and custom scrollbars.

## Phase 2: Inventory & Product Management (Weeks 3-4) [COMPLETED]
**Goal**: Enable users to manage what they sell.

- [x] **Product Catalog UI**: CRUD interface with real-time search.
- [x] **Inventory Tracking UI**: Stock level alerts (Low/Empty) and status indicators.
- [x] **Add/Edit Flow**: Unified modal for adding and updating products.
- [x] **Data Integration**: Full Supabase connectivity for categories and items.
- [x] **CSV Export**: Professional inventory reports for audit and accounting.
- [x] **Barcode Integration**: SKU/Barcode scanning support implemented.

## Phase 3: Core POS Terminal (Weeks 5-7)
**Goal**: The heart of the application—the selling interface.

- [x] **POS UI/UX**: Fast, touch-friendly interface for adding items to a cart.
- [/] **Advanced Cart**: Implement dynamic discounts (flat/%) and CRM integration.
- [/] **Checkout Process**: Support for customer linking and transaction tagging.
- [x] **Print Integration**: Browser Print support implemented.
- [/] **Accessibility**: Added keyboard shortcuts for speed-selling (F1, F2, ESC).
- [/] **Themable UI**: Support for Dark Mode in the Terminal.

## Phase 4: Expense & Financial Tracking (Weeks 8-9) [COMPLETED]
**Goal**: Professional business accounting and profit optimization.

- [x] **Accounting Integrity**: Implement COGS (Cost of Goods Sold) tracking by recording cost_price at time of sale.
- [x] **Net Profit Analysis**: Real-time calculation of Gross Profit vs Net Profit (after expenses).
- [x] **Expense Management**: Advanced categorization and vendor attribution for all business costs.
- [x] **Financial Trends**: Interactive dashboard charts showing revenue vs. profit over time.
- [x] **Advanced Exports**: Generate CSV reports with detailed accounting breakdowns.
- [x] **Audit Logs**: Basic logging through sales/expense records.

## Phase 5: Advanced Business Intelligence (Weeks 10-11)
**Goal**: High-density visualizations and customer analytics.

- [/] **Sales Heatmap**: Hourly distribution of revenue to identify peak hours.
- [/] **Product Intelligence**: Leaderboards for top selling items by revenue and volume.
- [/] **Customer Intelligence**: Retention rates and VIP customer tracking.
- [/] **Analytics Hub**: A dedicated page for deep-dive financial analysis.

## Phase 6: PWA & Final Polish (Future)
- [ ] **PWA Conversion**: Enable offline capabilities.
- [ ] **Offline Mode**: Use IndexedDB for local persistence.
