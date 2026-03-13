# Feature Specification: Billing & Subscription Management

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Billing & Langganan (Billing & Subscription)
> **Analyzed From**: UI Screenshot (March 2026)

---

## 1. Feature Identification

### Main Feature
**Subscription Plan Management** — a self-service billing page that allows kos property owners to view their active subscription plan, monitor usage against plan limits, and upgrade/switch to a different tier.

### Purpose
Enables the SaaS operator to monetize the platform through tiered subscription plans based on the number of rooms a landlord manages. It provides tenants (landlord users) full transparency into their current plan, usage consumption, billing cycle, and available upgrade options.

### Problem It Solves
- Landlords need to know which features they have access to and when their subscription renews.
- As their property portfolio grows (more rooms), they need a clear and frictionless path to upgrade.
- The platform needs to enforce feature/resource limits per plan to protect infrastructure and drive revenue.

---

## 2. UI Component Breakdown

### Global Navigation (Sidebar)
| Component | Description |
|---|---|
| App logo + name | "Living Kost Pro" branding with "Demo Mode" label |
| Main menu links | Dashboard, Properti, Kamar, Penyewa, Tagihan, Pembayaran, Pengeluaran, Inventaris, Laporan, WhatsApp |
| Account section | Billing (active/highlighted), Pengaturan |
| Logout button | "Keluar" at the bottom of the sidebar |
| Collapse toggle | Arrow icon `<` to collapse the sidebar |

### Header Bar
| Component | Description |
|---|---|
| Global search bar | Placeholder: "Cari kamar, penyewa, invoice..." — searches across rooms, tenants, and invoices |
| Notification bell | Red dot badge indicating unread notifications |
| User avatar | Initials "DM", opens profile/account menu |

### Current Plan Banner (Active Subscription Card)
| Component | Description |
|---|---|
| Crown icon + plan name | "Paket Growth" with gold crown icon indicating premium tier |
| "Aktif" badge | Teal pill badge confirming the plan is currently active |
| Usage counters | "Batas: 30 kamar • Terpakai: 32 kamar" — quota limit vs actual usage |
| Price display | "Rp 199.000/bln" (right-aligned) |
| Next billing date | "Pembayaran berikutnya: 1 Mar 2026" |
| Usage progress bar | Orange full-overflow bar indicating quota has been exceeded |
| Warning message | "Anda sudah melebihi batas kamar. Upgrade untuk menambah kamar." — contextual alert nudging upgrade |

### Subscription Plan Cards (4 tiers)
| Component | Description |
|---|---|
| Plan name + room limit | Title and subtitle (e.g., "Growth / s/d 30 kamar") |
| Price | Monthly price in IDR |
| Feature checklist | Bullet list of included features per tier (cumulative) |
| CTA button | "Pilih Paket" (Choose Plan) for inactive tiers; "Paket Aktif" (teal, disabled) for the current plan |
| Active plan highlight | Teal border + filled CTA button to visually distinguish the current plan |

---

## 3. User Flow

### Entry Point
User navigates to **Billing** from the left sidebar under the "Akun" section.

### Step-by-Step Flow

```
1. User opens the Billing page
   → System fetches current subscription and usage data
   → Active plan banner is rendered with live usage metrics

2. User reviews current plan status
   → Sees "Paket Growth" is active at Rp 199.000/bln
   → Sees they have exceeded the room quota (32/30)
   → Orange progress bar + warning text make the issue immediately clear

3. User reviews available plans
   → Four plan cards are displayed side-by-side
   → Current plan (Growth) is highlighted with teal border and "Paket Aktif" button

4a. User clicks "Pilih Paket" on an upgrade tier (e.g., Pro)
    → Confirmation modal opens showing plan details and price difference
    → User confirms → redirected to payment flow (midtrans/xendit/etc.)
    → On success → plan is updated, page refreshes with new active plan

4b. User clicks "Pilih Paket" on a downgrade tier (e.g., Starter)
    → System checks if current usage exceeds the lower plan's limit
    → If yes → warning modal: "You have 32 rooms, Starter supports max 10. Remove rooms before downgrading."
    → If no → confirmation modal → plan downgrade scheduled at end of billing cycle

5. User clicks "Paket Aktif" button on current plan
   → No action (button is disabled/non-interactive)
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display the user's current active subscription plan with name, status badge, and price |
| FR-02 | Display real-time room usage (used vs. limit) with a visual progress bar |
| FR-03 | Show a warning when usage exceeds plan limits |
| FR-04 | List all available subscription plans with pricing and feature comparison |
| FR-05 | Highlight the currently active plan visually (border, button state) |
| FR-06 | Allow upgrade to a higher plan immediately |
| FR-07 | Allow downgrade to a lower plan only if current usage is within the lower plan's limit |
| FR-08 | Display the next billing/renewal date |
| FR-09 | Enforce feature access restrictions based on active plan (e.g., block WhatsApp Reminder if on Growth) |
| FR-10 | Show "Demo Mode" indicator when user is on a free trial or demo account |

---

## 5. Backend Requirements

### API Endpoints

#### Get Current Subscription
```
GET /api/saas/subscription
Authorization: Bearer <token>

Response 200:
{
  "plan": "growth",
  "status": "active",
  "roomLimit": 30,
  "roomsUsed": 32,
  "priceMonthly": 199000,
  "nextBillingDate": "2026-03-01",
  "isDemo": false,
  "isOverLimit": true
}
```

#### Get Available Plans
```
GET /api/saas/plans

Response 200:
[
  {
    "id": "starter",
    "name": "Starter",
    "roomLimit": 10,
    "priceMonthly": 99000,
    "features": ["Dashboard", "Manajemen Kamar", "Invoice Otomatis"]
  },
  {
    "id": "growth",
    "name": "Growth",
    "roomLimit": 30,
    "priceMonthly": 199000,
    "features": ["Semua fitur Starter", "Multi-Properti", "Meter Listrik/Air"]
  },
  {
    "id": "pro",
    "name": "Pro",
    "roomLimit": 100,
    "priceMonthly": 399000,
    "features": ["Semua fitur Growth", "WhatsApp Reminder", "Custom Domain"]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "roomLimit": null,
    "priceMonthly": null,
    "features": ["Semua fitur Pro", "Dedicated Server", "SLA 99.9%"]
  }
]
```

#### Change Subscription Plan
```
POST /api/saas/subscription/change
Authorization: Bearer <token>

Body:
{
  "planId": "pro"
}

Response 200:
{
  "success": true,
  "paymentUrl": "https://payment-gateway.com/pay/xxxx",  // for upgrades
  "message": "Downgrade scheduled for end of billing cycle"  // for downgrades
}

Response 400:
{
  "error": "ROOM_LIMIT_EXCEEDED",
  "message": "Current room count (32) exceeds Starter plan limit (10)."
}
```

### Business Logic
- **Upgrade**: Prorated charge for the remainder of the billing cycle; new limits apply immediately.
- **Downgrade**: Scheduled at the end of the current billing period; old limits remain until then.
- **Over-limit enforcement**: System should restrict adding new rooms if `roomsUsed >= roomLimit`. Existing rooms are not removed automatically.
- **Enterprise plan**: Requires manual contact/sales flow, no self-service payment.

---

## 6. Data Model

### `tenant_subscription` table
```sql
CREATE TABLE tenant_subscription (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  plan_id         VARCHAR(50) NOT NULL,       -- 'starter' | 'growth' | 'pro' | 'enterprise'
  status          VARCHAR(20) NOT NULL,        -- 'active' | 'expired' | 'cancelled' | 'demo'
  started_at      TIMESTAMP NOT NULL,
  expires_at      TIMESTAMP,
  next_billing_at TIMESTAMP,
  price_monthly   INTEGER,                    -- in IDR (smallest unit)
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### `subscription_plans` table
```sql
CREATE TABLE subscription_plans (
  id              VARCHAR(50) PRIMARY KEY,    -- 'starter' | 'growth' | 'pro' | 'enterprise'
  name            VARCHAR(100) NOT NULL,
  room_limit      INTEGER,                    -- NULL = unlimited
  price_monthly   INTEGER,                    -- NULL = custom/contact sales
  features        JSONB NOT NULL,             -- array of feature strings
  is_active       BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER
);
```

### `subscription_usage` (computed/cached)
```sql
CREATE TABLE subscription_usage (
  tenant_id       UUID PRIMARY KEY REFERENCES tenants(id),
  rooms_used      INTEGER NOT NULL DEFAULT 0,
  last_synced_at  TIMESTAMP DEFAULT NOW()
);
```

### `subscription_invoices` table
```sql
CREATE TABLE subscription_invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  plan_id         VARCHAR(50) NOT NULL,
  amount          INTEGER NOT NULL,
  status          VARCHAR(20) NOT NULL,        -- 'paid' | 'pending' | 'failed'
  payment_method  VARCHAR(50),
  payment_ref     VARCHAR(255),               -- external payment gateway reference
  issued_at       TIMESTAMP NOT NULL,
  paid_at         TIMESTAMP
);
```

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | User exceeds room limit (current: 32, limit: 30) | Show orange overflow bar + warning banner; block adding new rooms |
| E-02 | User tries to downgrade but usage exceeds the lower plan's limit | Show blocking modal with message; prevent downgrade until usage is reduced |
| E-03 | Payment fails during upgrade | Keep current plan active; show payment failure notification; allow retry |
| E-04 | Subscription expires (missed renewal) | Set status to `expired`; restrict access to features beyond the free tier; prompt renewal |
| E-05 | Enterprise plan selected | Redirect to contact sales / WhatsApp flow instead of payment gateway |
| E-06 | Demo mode user tries to select a plan | Prompt to complete account registration/KYC before subscribing |
| E-07 | Multiple browser tabs open simultaneously | Use server-authoritative plan data; avoid stale state from cached responses |
| E-08 | Plan is discontinued/archived | Existing subscribers keep current plan; plan is hidden from new signups |
| E-09 | Proration on mid-cycle upgrade | Calculate remaining days and charge delta; record in invoice |
| E-10 | `roomsUsed` counter is out of sync | Provide a background job or endpoint to reconcile count from actual room records |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Unauthorized plan changes | All `/api/saas/subscription/*` endpoints must require valid JWT and verify `tenant_id` against the token |
| S-02 | Privilege escalation via API | Server must validate plan limits server-side; never trust client-sent `planId` without server lookup |
| S-03 | Payment tampering | Use webhook callbacks from payment gateway (not client redirect) to confirm payment before upgrading plan |
| S-04 | Feature access bypass | Feature flags must be enforced on the backend, not just in the frontend UI |
| S-05 | Data isolation | Each tenant's subscription data must be strictly scoped to their `tenant_id`; no cross-tenant leakage |
| S-06 | Input validation | `planId` in change request must be validated against the `subscription_plans` table |
| S-07 | IDOR on invoices | Invoice download/view endpoints must verify that the requesting user owns the invoice |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Usage trend chart** | Show room usage over the past 30/60/90 days to help users anticipate when they'll hit limits |
| I-02 | **Annual billing option** | Offer 1-2 months free for annual payment, increasing LTV and reducing churn |
| I-03 | **Billing history tab** | Allow users to view and download past invoices from the same page |
| I-04 | **Upgrade CTA inline** | The warning banner's "Upgrade" link should scroll to or highlight the next plan card |
| I-05 | **Proration breakdown modal** | During upgrade, show users exactly what they'll be charged today vs. next cycle |
| I-06 | **Email/WhatsApp renewal reminders** | Notify users 7 days and 1 day before renewal, especially if the card might fail |
| I-07 | **Grace period on expiry** | Allow a 3–7 day grace period before hard-locking the account on missed renewal |
| I-08 | **Add-on modules** | Offer optional add-ons (e.g., extra rooms, extra WhatsApp quota) without requiring a full plan upgrade |
| I-09 | **Cancellation flow** | Provide a structured cancellation flow with an exit survey to capture churn reasons |
| I-10 | **Mobile responsive layout** | Plan cards should stack vertically and remain readable on mobile screens |

---

## 10. Feature Summary

The **Billing & Subscription** feature is the central self-service hub for managing a tenant's (landlord's) SaaS subscription on Living Kost Pro. It presents the user's **current active plan** with real-time usage metrics (rooms used vs. limit) and a visual progress indicator that turns orange when the quota is breached. When the user exceeds their plan limits, a contextual inline warning prompts them to upgrade.

Below the active plan banner, all **four subscription tiers** (Starter, Growth, Pro, Enterprise) are displayed as side-by-side plan cards with pricing, room limits, and a cumulative feature checklist. The current plan is visually highlighted with a teal border and a disabled "Paket Aktif" button, while all other plans show a "Pilih Paket" CTA. Selecting a higher plan initiates a payment flow (upgrade); selecting a lower plan is only permitted if the current room usage fits within that plan's limit.

The feature drives revenue growth through clear limit visibility, frictionless upgrade prompts, and a transparent plan comparison grid — while enforcing resource constraints server-side to protect the platform.
