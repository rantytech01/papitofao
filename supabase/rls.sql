-- ============================================================
-- Row Level Security — run after schema.sql
--
-- Pattern used throughout:
--   * SELECT for anon/authenticated: only rows that are published
--     (or, for tables with no explicit status, always-readable
--     settings/reference tables).
--   * ALL (select/insert/update/delete) for admins: gated on the
--     caller existing in admin_profiles. Editors and super_admins
--     get the same content permissions; only admin_profiles/user
--     management is super_admin-only.
-- ============================================================

-- Helper: is the current JWT owned by an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_profiles where id = auth.uid()
  );
$$ language sql stable security definer;

create or replace function is_super_admin()
returns boolean as $$
  select exists (
    select 1 from admin_profiles where id = auth.uid() and role = 'super_admin'
  );
$$ language sql stable security definer;

-- ---------- enable RLS everywhere ----------
alter table admin_profiles enable row level security;
alter table candidate_profile enable row level security;
alter table campaign_settings enable row level security;
alter table site_settings enable row level security;
alter table navigation_items enable row level security;
alter table homepage_sections enable row level security;
alter table about_sections enable row level security;
alter table vision_sections enable row level security;
alter table priorities enable row level security;
alter table community_sections enable row level security;
alter table news_articles enable row level security;
alter table events enable row level security;
alter table gallery_categories enable row level security;
alter table gallery_items enable row level security;
alter table media_library enable row level security;
alter table social_links enable row level security;
alter table footer_sections enable row level security;
alter table contact_messages enable row level security;
alter table volunteer_submissions enable row level security;
alter table activity_logs enable row level security;

-- ---------- admin_profiles ----------
create policy "admins can read admin list" on admin_profiles
  for select using (is_admin());
create policy "super admins manage admins" on admin_profiles
  for all using (is_super_admin()) with check (is_super_admin());

-- ---------- always-public single-row settings (readable by everyone) ----------
create policy "public read candidate profile" on candidate_profile for select using (true);
create policy "admins write candidate profile" on candidate_profile for all using (is_admin()) with check (is_admin());

create policy "public read campaign settings" on campaign_settings for select using (true);
create policy "admins write campaign settings" on campaign_settings for all using (is_admin()) with check (is_admin());

create policy "public read site settings" on site_settings for select using (true);
create policy "admins write site settings" on site_settings for all using (is_admin()) with check (is_admin());

create policy "public read visible nav items" on navigation_items for select using (is_visible = true);
create policy "admins manage nav items" on navigation_items for all using (is_admin()) with check (is_admin());

create policy "public read visible social links" on social_links for select using (is_enabled = true);
create policy "admins manage social links" on social_links for all using (is_admin()) with check (is_admin());

create policy "public read visible footer sections" on footer_sections for select using (is_visible = true);
create policy "admins manage footer sections" on footer_sections for all using (is_admin()) with check (is_admin());

create policy "public read gallery categories" on gallery_categories for select using (true);
create policy "admins manage gallery categories" on gallery_categories for all using (is_admin()) with check (is_admin());

create policy "public read visible gallery items" on gallery_items for select using (is_visible = true);
create policy "admins manage gallery items" on gallery_items for all using (is_admin()) with check (is_admin());

-- ---------- published-only content tables ----------
create policy "public read published homepage sections" on homepage_sections
  for select using (status = 'published' and is_visible = true);
create policy "admins manage homepage sections" on homepage_sections
  for all using (is_admin()) with check (is_admin());

create policy "public read published about sections" on about_sections
  for select using (status = 'published' and is_visible = true);
create policy "admins manage about sections" on about_sections
  for all using (is_admin()) with check (is_admin());

create policy "public read published vision sections" on vision_sections
  for select using (status = 'published');
create policy "admins manage vision sections" on vision_sections
  for all using (is_admin()) with check (is_admin());

create policy "public read published priorities" on priorities
  for select using (status = 'published');
create policy "admins manage priorities" on priorities
  for all using (is_admin()) with check (is_admin());

create policy "public read published community sections" on community_sections
  for select using (status = 'published');
create policy "admins manage community sections" on community_sections
  for all using (is_admin()) with check (is_admin());

create policy "public read published news" on news_articles
  for select using (status = 'published');
create policy "admins manage news" on news_articles
  for all using (is_admin()) with check (is_admin());

create policy "public read published events" on events
  for select using (is_published = true);
create policy "admins manage events" on events
  for all using (is_admin()) with check (is_admin());

-- ---------- admin-only data ----------
create policy "admins read media" on media_library for select using (is_admin());
create policy "admins manage media" on media_library for all using (is_admin()) with check (is_admin());

create policy "admins read messages" on contact_messages for select using (is_admin());
create policy "admins manage messages" on contact_messages for all using (is_admin()) with check (is_admin());
create policy "anyone can submit a message" on contact_messages for insert with check (true);

create policy "admins read volunteers" on volunteer_submissions for select using (is_admin());
create policy "admins manage volunteers" on volunteer_submissions for all using (is_admin()) with check (is_admin());
create policy "anyone can submit volunteer form" on volunteer_submissions for insert with check (true);

create policy "admins read activity log" on activity_logs for select using (is_admin());
create policy "admins write activity log" on activity_logs for insert with check (is_admin());
