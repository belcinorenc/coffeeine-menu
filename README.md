# Coffeeine QR Menu

Coffeeine is a production-ready starter for a premium cafe QR menu built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style components, and Supabase. It includes a polished public menu at `/` and a protected admin panel for categories, products, and cafe settings at `/admin`.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Supabase database + auth
- Vercel-ready deployment

## Folder Structure

```text
app/
  admin/
    (protected)/
      categories/page.tsx
      products/page.tsx
      settings/page.tsx
      layout.tsx
      loading.tsx
      page.tsx
    login/page.tsx
    actions.ts
    layout.tsx
  globals.css
  layout.tsx
  loading.tsx
  page.tsx
components/
  admin/
  menu/
  shared/
  ui/
lib/
  data.ts
  demo-data.ts
  env.ts
  supabase/
  types.ts
  utils.ts
supabase/
  schema.sql
  seed.sql
middleware.ts
```

## What Each Area Does

- `app/page.tsx`: public QR menu page with hero, sticky category nav, menu sections, and cafe footer.
- `app/admin/login/page.tsx`: email/password login for staff.
- `app/admin/(protected)/*`: protected admin dashboard and CRUD pages.
- `app/admin/actions.ts`: server actions for auth and content management.
- `components/menu/*`: reusable public-facing menu UI.
- `components/admin/*`: reusable admin shell and setup messaging.
- `lib/data.ts`: server-side queries and fallback demo mode.
- `lib/supabase/*`: browser, server, and middleware Supabase helpers.
- `supabase/schema.sql`: database schema, indexes, timestamps, and starter RLS.
- `supabase/seed.sql`: Coffeeine sample data in TRY pricing.

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create a local environment file.

```bash
cp .env.example .env.local
```

3. Fill in these values in `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_EMAILS=owner@coffeeine.com,manager@coffeeine.com,admin@coffeeine-menu.com,belcinorencc@gmail.com
```

4. Run the app.

```bash
npm run dev
```

The public menu will still render with demo data before Supabase is connected, but admin writes and authentication require a live Supabase project.

## Connect Supabase

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run [`supabase/schema.sql`](C:/Users/belcin/Documents/Codex/2026-04-18-bir-kahve-d-kkan-i-in/supabase/schema.sql).
4. Run [`supabase/seed.sql`](C:/Users/belcin/Documents/Codex/2026-04-18-bir-kahve-d-kkan-i-in/supabase/seed.sql).
5. Copy the project URL and anon key into `.env.local`.

## Create The First Admin User

1. In Supabase, go to Authentication.
2. Create a user with email/password manually, or enable email sign-ups and register once through the login screen.
3. Add that email address to `ADMIN_EMAILS` in `.env.local` and in Vercel environment variables.
4. Sign in at `/admin/login`.

Notes:

- The UI restricts admin access using `ADMIN_EMAILS`.
- If the user exists in Supabase Auth and the password is correct but login still fails, the most common cause is that the deployed Vercel project does not have the same `ADMIN_EMAILS` value yet, or it has not been redeployed after the env update.
- The included SQL policies allow any authenticated user to write by default.
- For stricter database-level security, replace the authenticated RLS policies with a custom claim or role-based check in Supabase.

## Deploy To Vercel

1. Push this project to GitHub, GitLab, or Bitbucket.
2. Import the repository into Vercel.
3. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAILS`
4. Deploy.

Example:

```env
ADMIN_EMAILS=owner@coffeeine.com,manager@coffeeine.com,admin@coffeeine-menu.com,belcinorencc@gmail.com
```

Vercel will automatically detect Next.js and use the correct build settings.

## Admin Features Included

- Category CRUD
- Product CRUD
- Product availability and active-state controls
- Category and product reordering with simple up/down actions
- Product search and category filtering
- Global cafe settings editing
- Empty states and loading states
- Optional images and badges

## Notes For Handover

- If product images are not added, the menu still looks complete using text-based placeholders.
- Public menu data is server-rendered for fast QR access.
- Admin pages use Next.js server actions to keep the code practical and maintainable.
- `middleware.ts` keeps Supabase auth cookies refreshed.

## Verification

This workspace sandbox did not allow Node.js to run, so I could not execute `npm install`, `npm run lint`, or `next build` here. The source has been structured to be Vercel-ready, but the first local run should include a quick install/build check.
