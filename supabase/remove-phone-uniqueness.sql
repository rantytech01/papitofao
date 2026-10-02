-- ============================================================
-- Removes the "one submission per phone number, ever" restriction
-- on members and volunteer_submissions. Submission frequency is now
-- governed entirely by the app-side device rate limit (3 per day),
-- not a permanent database-level block.
--
-- Written defensively since this constraint wasn't created from a
-- migration in this repo — it finds and drops it by inspecting the
-- column name (anything containing "phone") rather than assuming an
-- exact constraint name.
-- ============================================================

-- Drop named unique constraints on any phone-like column
do $$
declare r record;
begin
  for r in
    select con.conname, rel.relname as table_name
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.contype = 'u'
      and rel.relname in ('members', 'volunteer_submissions')
      and att.attname ilike '%phone%'
  loop
    execute format('alter table %I drop constraint %I', r.table_name, r.conname);
    raise notice 'Dropped constraint % on %', r.conname, r.table_name;
  end loop;
end $$;

-- Drop any standalone unique indexes on phone-like columns (covers the
-- case where uniqueness was enforced via `create unique index` directly
-- rather than a named table constraint)
do $$
declare r record;
begin
  for r in
    select indexname, tablename
    from pg_indexes
    where tablename in ('members', 'volunteer_submissions')
      and indexdef ilike '%unique%'
      and indexdef ilike '%phone%'
  loop
    execute format('drop index if exists %I', r.indexname);
    raise notice 'Dropped index % on %', r.indexname, r.tablename;
  end loop;
end $$;
