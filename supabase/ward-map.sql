-- ============================================================
-- Ward map — admin-managed markers for the interactive Roysambu
-- Ward map. Run AFTER schema.sql, rls.sql, storage-policies.sql.
-- ============================================================

create table ward_locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category text not null default 'area', -- area | landmark | office | market | school | polling_station
  latitude double precision not null,
  longitude double precision not null,
  is_visible boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on ward_locations
  for each row execute function set_updated_at();

alter table ward_locations enable row level security;

create policy "public read visible ward locations" on ward_locations
  for select using (is_visible = true);
create policy "admins manage ward locations" on ward_locations
  for all using (is_admin()) with check (is_admin());

-- Seed: just the ward's own reference point (real, sourced coordinate).
-- Add real local landmarks (chief's office, markets, schools, polling
-- stations) from Admin → Ward Map — you know the ward, we don't.
insert into ward_locations (name, description, category, latitude, longitude, display_order)
values (
  'Roysambu Ward',
  'Central reference point for the ward.',
  'area',
  -1.21833,
  36.88639,
  0
);
