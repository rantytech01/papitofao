-- ============================================================
-- Initial seed — uses ONLY the information supplied by the
-- campaign. Everything else is a neutral placeholder the admin
-- must replace before publishing. Nothing here is invented
-- biography, achievements, or promises (see brief section 40).
-- ============================================================

insert into candidate_profile (
  id, candidate_name, candidate_title, position, ward, election_year,
  movement_name, movement_tagline, slogan, hero_description
) values (
  1, 'Newton Papito', 'Kijana Mtanashati', 'MCA', 'Roysambu Ward', 2027,
  'People''s Renaissance Movement', 'The Change We Need',
  'The Change We Need',
  'Placeholder hero description — replace from Admin → Candidate Profile.'
)
on conflict (id) do nothing;

insert into campaign_settings (id, primary_phone) values (1, '+254725656735')
on conflict (id) do nothing;

insert into site_settings (id, website_name, website_title, primary_color, secondary_color, accent_color)
values (1, 'Newton Papito 2027', 'Newton Papito — MCA Roysambu Ward 2027', '#0757D5', '#ED1111', '#071B3A')
on conflict (id) do nothing;

insert into navigation_items (label, url, display_order) values
  ('Home', '/', 0),
  ('About', '/about', 1),
  ('Vision', '/vision', 2),
  ('Priorities', '/priorities', 3),
  ('Community', '/community', 4),
  ('News', '/news', 5),
  ('Events', '/events', 6),
  ('Gallery', '/gallery', 7),
  ('Contact', '/contact', 8);

insert into homepage_sections (section_key, title, subtitle, description, button_text, button_url, display_order, status) values
  ('hero', 'Newton Papito', 'Kijana Mtanashati', 'MCA — Roysambu Ward · 2027', 'Learn About Newton', '/about', 0, 'published'),
  ('about', 'About Newton', null, 'Placeholder — replace from Admin → Homepage.', 'Read More', '/about', 1, 'draft'),
  ('vision', 'Vision', null, 'Placeholder — replace from Admin → Vision.', 'Our Vision', '/vision', 2, 'draft'),
  ('priorities', 'Priorities', null, 'Placeholder — replace from Admin → Priorities.', 'See Priorities', '/priorities', 3, 'draft'),
  ('community', 'Community', null, 'Placeholder — replace from Admin → Community.', 'Community', '/community', 4, 'draft'),
  ('news', 'Latest News', null, null, 'All News', '/news', 5, 'draft'),
  ('events', 'Upcoming Events', null, null, 'All Events', '/events', 6, 'draft'),
  ('gallery', 'Gallery', null, null, 'View Gallery', '/gallery', 7, 'draft'),
  ('get_involved', 'Get Involved', null, 'Placeholder — replace from Admin → Homepage.', 'Volunteer', '/volunteer', 8, 'draft'),
  ('contact', 'Contact', null, null, 'Contact Us', '/contact', 9, 'published');

insert into gallery_categories (name, display_order) values
  ('Community', 0), ('Meetings', 1), ('Youth', 2), ('Events', 3), ('Campaign', 4), ('Leadership', 5);

insert into footer_sections (heading, content, display_order) values
  ('Movement', 'Placeholder — replace from Admin → Footer.', 0);
