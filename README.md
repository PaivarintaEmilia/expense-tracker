# Expense Tracker

Expense Tracker is a Next.js + TypeScript web app for tracking incomes and expenses. The app uses Supabase for authentication and data access and provides a simple UI to create, browse, filter, update and delete transactions.

## Tech stack / Tools

### Core
- **Next.js** (App Router)  
- **React**
- **TypeScript**
- **Supabase** (`@supabase/supabase-js`) for Auth + database operations

### Styling
- **Tailwind CSS** (with PostCSS integration)

### Code quality & tooling
- **ESLint** (Next.js ESLint config)
- **Prettier** (code formatting)

## Features

### Authentication
- Checks for an active Supabase session.
- Redirects unauthenticated users to the authentication page.

### Transactions (Incomes & Expenses)
- **Create** new transactions (amount, description, category, type).
- **Read/List** transactions.
- **Update** existing transactions (via an update popup/modal).
- **Delete** transactions (via a delete confirmation popup/modal).

### Categories
- Fetches categories for dropdown selections.
- **Create** new categories (via “Create category” popup/modal), so they can be used immediately in forms.

### Filtering & totals
- Filter transactions by:
  - category
  - type (income/expense)
  - date range (from/to)
- Shows the total amount of the currently filtered items.

***** 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
