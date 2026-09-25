-- ============================================================
-- Newton Papito 2027 — Campaign CMS schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- before supabase/rls.sql and supabase/seed.sql.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- shared enum types ----------
create type publish_status as enum ('draft', 'published', 'unpublished');
create type event_status as enum ('upcoming', 'ongoing', 'completed', 'cancelled');
create type volunteer_status as enum ('new', 'contacted', 'processed', 'archived');
create type message_status as enum ('unread', 'read', 'archived');
create type admin_role as enum ('super_admin', 'editor');

-- ---------- admin_profiles ----------
-- Mirrors auth.users 1:1 so we can attach a role without touching Supabase's own table.
create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role admin_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- candidate_profile ----------
-- Single-row table: the CMS UI always upserts id = 1.
create table candidate_profile (
  id int primary key default 1 check (id = 1),
  candidate_name text not null,
  candidate_title text,          -- e.g. "Kijana Mtanashati"
  position text not null,        -- e.g. "MCA"
  ward text not null,            -- e.g. "Roysambu Ward"
  election_year int not null,
  movement_name text not null,
  movement_tagline text,
  slogan text,
  short_biography text,
  full_biography text,
  hero_description text,
  profile_photo_url text,
  logo_url text,
  movement_logo_url text,
  updated_at timestamptz not null default now()
);

-- ---------- campaign_settings / site_settings ----------
-- Split into two single-row tables so contact info (frequently edited,
-- publicly read) is separate from branding/SEO settings.
create table campaign_settings (
  id int primary key default 1 check (id = 1),
  primary_phone text,
  secondary_phone text,
  whatsapp_number text,
  email text,
  office_address text,
  office_hours text,
  contact_description text,
  election_date date,
  updated_at timestamptz not null default now()
);

create table site_settings (
  id int primary key default 1 check (id = 1),
  website_name text not null default 'Newton Papito 2027',
  website_title text,
  website_description text,
  favicon_url text,
  primary_color text default '#0757D5',
  secondary_color text default '#ED1111',
  accent_color text default '#071B3A',
  seo_title text,
  seo_description text,
  canonical_url text,
  social_share_image_url text,
  footer_copyright text,
  updated_at timestamptz not null default now()
);

-- ---------- navigation_items ----------
create table navigation_items (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  url text not null,
  is_external boolean not null default false,
  open_in_new_tab boolean not null default false,
  is_visible boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- homepage_sections ----------
create table homepage_sections (
  id uuid primary key default uuid_generate_v4(),
  section_key text not null unique, -- e.g. 'hero', 'about', 'vision' — stable identifier for known section types
  title text,
  subtitle text,
  description text,
  image_url text,
  icon text,
  button_text text,
  button_url text,
  background_style text default 'light',
  is_visible boolean not null default true,
  display_order int not null default 0,
  status publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- about_sections ----------
create table about_sections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  content text, -- sanitized rich text (HTML)
  image_url text,
  image_position text default 'right', -- left | right | top | none
  display_order int not null default 0,
  is_visible boolean not null default true,
  status publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- vision_sections ----------
create table vision_sections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  icon text,
  display_order int not null default 0,
  status publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- priorities ----------
create table priorities (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  short_description text,
  full_description text,
  image_url text,
  icon text,
  category text,
  display_order int not null default 0,
  status publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- community_sections ----------
create table community_sections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  is_featured boolean not null default false,
  display_order int not null default 0,
  status publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- news_articles ----------
create table news_articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image_url text,
  author text,
  category text,
  tags text[] default '{}',
  seo_title text,
  seo_description text,
  og_title text,
  og_description text,
  social_image_url text,
  status publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_articles_status_idx on news_articles (status, published_at desc);

-- ---------- events ----------
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  event_date date not null,
  start_time time,
  end_time time,
  location text,
  address text,
  featured_image_url text,
  poster_url text,
  registration_url text,
  contact_info text,
  status event_status not null default 'upcoming',
  is_published boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_date_idx on events (event_date);

-- ---------- gallery_categories / gallery_items ----------
create table gallery_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  display_order int not null default 0
);

create table gallery_items (
  id uuid primary key default uuid_generate_v4(),
  media_id uuid, -- optional link into media_library
  image_url text not null,
  caption text,
  category_id uuid references gallery_categories(id) on delete set null,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- media_library ----------
create table media_library (
  id uuid primary key default uuid_generate_v4(),
  filename text not null,
  url text not null,
  storage_path text not null,
  type text, -- image | video | document
  category text,
  alt_text text,
  caption text,
  uploaded_by uuid references admin_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table gallery_items
  add constraint gallery_items_media_fk foreign key (media_id) references media_library(id) on delete set null;

-- ---------- social_links ----------
create table social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null, -- Facebook | Instagram | TikTok | X | YouTube | LinkedIn ...
  display_name text,
  url text not null,
  icon text,
  is_enabled boolean not null default true,
  display_order int not null default 0
);

-- ---------- footer_sections ----------
create table footer_sections (
  id uuid primary key default uuid_generate_v4(),
  heading text,
  content text, -- rich text or a JSON list of links, rendered by the component
  display_order int not null default 0,
  is_visible boolean not null default true
);

-- ---------- contact_messages ----------
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  email text,
  subject text,
  message text not null,
  status message_status not null default 'unread',
  created_at timestamptz not null default now()
);

-- ---------- volunteer_submissions ----------
create table volunteer_submissions (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text,
  email text,
  area text,
  preferred_involvement text,
  message text,
  status volunteer_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- activity_logs ----------
create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references admin_profiles(id) on delete set null,
  action text not null,       -- e.g. 'content.published'
  resource text not null,     -- e.g. 'news_articles:uuid'
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- ---------- updated_at triggers ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array[
    'admin_profiles','candidate_profile','campaign_settings','site_settings',
    'navigation_items','homepage_sections','about_sections','vision_sections',
    'priorities','community_sections','news_articles','events'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on %I for each row execute function set_updated_at();',
      t
    );
  end loop;
end $$;
