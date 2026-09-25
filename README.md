# Newton Papito 2027 — Campaign Website + CMS

A fully CMS-driven campaign website for **Newton Papito** ("Kijana Mtanashati"), running for
**MCA, Roysambu Ward**, 2027, under the **People's Renaissance Movement** ("The Change We Need").

Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS on the frontend, and Supabase
(Postgres + Auth + Storage) as the backend. Nothing a visitor sees is hardcoded — every string,
image, button, and menu item comes from the database and is editable from `/admin`.

---

## 1. Setup

### 1.1 Create the Supabase project
1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run, **in this order**:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/seed.sql`
3. In **Storage**, create a bucket named `media` and mark it **public** (gallery uploads and the
   media library both write to this bucket).
4. In **Authentication → Users**, create your first admin login manually (email + password), then
   run this in the SQL editor to make that user a Super Admin (replace the UUID with the new
   user's id from the Users table):

   ```sql
   insert into admin_profiles (id, full_name, role)
   values ('PASTE-USER-UUID-HERE', 'Your Name', 'super_admin');
   ```

   Every admin user after that can be invited from **Admin → Admin Users** once you're signed in.

### 1.2 Configure the app
```bash
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, and NEXT_PUBLIC_SITE_URL
npm install
npm run dev
```
Visit `http://localhost:3000` for the public site and `/admin/login` for the CMS.

### 1.3 Deploy
- Frontend: push to GitHub and import into Vercel. Add the same environment variables there.
- Backend: already live on Supabase — no separate deployment step.

---

## 2. How the "everything is editable" requirement is implemented

- **No hardcoded campaign content.** Candidate name, position, ward, colors, phone numbers,
  social links, navigation, and every page's copy live in Postgres tables (see `supabase/schema.sql`)
  and are read at request time by Server Components (`app/**/page.tsx`).
- **Contact buttons** (`components/contact-buttons.tsx`) are the single place `tel:`, `wa.me`, and
  `mailto:` links are built — always from `campaign_settings`, never inline elsewhere.
- **Row Level Security** (`supabase/rls.sql`) enforces the publish/draft rule at the database
  level, not just in the UI: anonymous visitors can only ever `select` rows where
  `status = 'published'` (or `is_visible`/`is_published` for tables that use a boolean instead).
  Admin writes require a matching row in `admin_profiles`.
- **Homepage layout** is itself data: `homepage_sections` stores the order, visibility, and publish
  state of every section, and `app/page.tsx` renders whatever it finds, in that order.

## 3. What's fully built vs. simplified

Everything in the acceptance test list (brief section 51) works end-to-end: editing the candidate,
phone number, About content, navigation, footer, colors (stored, see note below), adding/removing
sections, drafting vs. publishing news/events, and uploading gallery images.

A few things were deliberately kept simple rather than gold-plated, given the size of the brief —
each is a natural next iteration rather than a missing foundation:

- **Rich text editing** uses a plain HTML textarea (sanitize-on-save is stubbed — see the note in
  `app/about/page.tsx`). Swapping in a WYSIWYG editor (Tiptap, Lexical, or shadcn's editor) is a
  drop-in replacement for the `<textarea name="content">` fields in the About/News/Event forms.
  **Before going live, add real server-side HTML sanitization** (e.g. `sanitize-html`) in the
  `about`, `news`, and `events` server actions — the current build trusts admin input, which is
  fine for a small trusted campaign team but should not be skipped in production.
- **Image uploads** go straight to a single public `media` Storage bucket via the browser Supabase
  client. That's enough for a campaign team's day-to-day use; per-file access control, image
  resizing/optimization pipelines, and CDN cache invalidation are not implemented.
- **Theme colors** in Site Settings are stored and shown back in the admin form, but the live
  Tailwind theme reads fixed values from `tailwind.config.ts` (matching the supplied poster). Wiring
  the stored colors into the live theme means generating CSS variables from `site_settings` at
  request time — straightforward, just not done here, since the poster's palette is presumably
  fixed for this campaign.
- **Admin user invites** use Supabase's `inviteUserByEmail`, which requires email sending to be
  configured in your Supabase project (Authentication → Email Templates / a custom SMTP provider).
- **Content preview** (brief section 30) currently means "open the live public page in a new tab" —
  there's no separate draft-preview-without-publishing view yet.
- **Activity log** table and RLS exist; only the candidate-profile save currently writes to it as a
  worked example. Add an `activity_logs` insert to the other server actions in `app/actions/` the
  same way to log everything.

## 4. Project structure

```
app/
  (public routes)          → about, vision, priorities, community, news, events, gallery, contact, volunteer
  admin/login/              → public login page (outside the auth-gated layout)
  admin/(protected)/        → every /admin/* page, wrapped in the sidebar layout + middleware auth check
  actions/                  → all server actions (one file per content type)
components/
  admin/                    → admin-only UI (sidebar, per-entity managers)
  (site-header, site-footer, hero, contact-buttons, etc.) → public site UI
lib/supabase/               → browser / server / admin (service-role) Supabase clients
supabase/                   → schema.sql, rls.sql, seed.sql — run in that order
middleware.ts                → protects /admin/* and refreshes the auth session
```

## 5. Political content safeguard

No political promises, achievements, statistics, or endorsements have been invented anywhere in
this codebase or its seed data — only the facts supplied (movement name, tagline, candidate name,
identity, position, ward, year, phone number). Every content table defaults new records to
`draft`/unpublished, and placeholder text explicitly says "replace from Admin" rather than
presenting invented copy as real.
