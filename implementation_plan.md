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

---

## Phase-by-Phase Fixes (Short, Actionable)

Below are concise, high-impact fixes for real-world usage grouped by phase. Each item is intentionally short—pick the highest-priority items first.

**Phase 1 — Foundation & Auth (HIGH priority)**
- Email verification flow and password reset endpoints + UI
- Session management: idle timeout and refresh-token handling
- Supabase Row-Level Security (RLS) policies for multi-tenancy
- Centralized error handling + network retry/backoff
- Basic monitoring/alerts (Sentry/Logflare) for production

**Phase 2 — Inventory (HIGH priority)**
- Bulk import/export (CSV/Excel) with validation and preview
- Expiry/lot tracking and per-item expiry alerts
- Supplier records, purchase orders and reorder points
- Inventory audit/stocktake workflow with adjustments
- Automated low-stock notifications (email/SMS/webhook)

**Phase 3 — POS Terminal (CRITICAL)**
- Multiple payments: cash, mobile money (MOMO), card (Stripe/POS SDK)
- Receipt printing, PDF archival, and reprint endpoint
- Returns/refunds and credit/layby handling + journal entries
- Till/shifts: open/close, cash reconciliation, shortage/overages
- Promotions engine: multi-item discounts, promo codes, time-based offers

**Phase 4 — Financials (MEDIUM priority)**
- Tax/VAT calculation and country-aware reports (exportable)
- Invoicing for B2B with PDF generation and numbering
- Recurring expenses and scheduled payments recording
- Budget vs actual tracking and alerts for overspend
- Profit margin and contribution by product/category

**Phase 5 — Business Intelligence (MEDIUM priority)**
- Staff sales metrics, commissions, and shift performance
- Customer loyalty program (points, tiers, redemption)
- Inventory turnover, dead-stock detection, and alerts
- Refund/return trend dashboard and anomaly detection
- BI exports (CSV, scheduled reports) + drill-downs

**Cross-Cutting (apply across phases)**
- Role-Based Access Control (RBAC) + admin console
- Audit logging for compliance (who/what/when on critical changes)
- Multi-location / multi-branch data separation and reporting
- Integrations: accounting (Xero/QuickBooks), delivery APIs, SMS gateway
- End-to-end test harness and CI checks for critical flows

**Quick Roadmap (minimal MVP prioritization)**
1. v1.1 (Immediate): Payments integration (MOMO/Stripe), Returns, Till reconciliation, RBAC basics
2. v1.2 (Short): Bulk import, expiry tracking, low-stock alerts, supplier & PO flows
3. v1.3 (Medium): Multi-location, tax reporting, invoicing, audit logs
4. v1.4 (Polish): Loyalty, staff analytics, BI exports, PWA/offline

If you want, I can start by scaffolding the highest-priority items (auth flows, simple RBAC, and payment placeholders) and open small PRs. Which phase should I begin implementing first?
