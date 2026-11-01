-- Run once in Supabase → SQL Editor
create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (length(platform) between 1 and 40),
  url text not null check (url ~* '^(https?://|mailto:)'),
  label text check (length(label) <= 60),
  enabled boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 200),
  subject text check (length(subject) <= 200),
  message text not null check (length(message) between 5 and 4000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created on contact_messages (created_at desc);
create table if not exists admins (user_id uuid primary key references auth.users on delete cascade);

create or replace function is_admin() returns boolean
language sql security definer stable set search_path = public as
$$ select exists (select 1 from admins where user_id = auth.uid()) $$;

alter table site_settings enable row level security;
alter table social_links enable row level security;
alter table contact_messages enable row level security;
alter table admins enable row level security;

drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);
drop policy if exists "admin write settings" on site_settings;
create policy "admin write settings" on site_settings for all using (is_admin()) with check (is_admin());

drop policy if exists "public read enabled links" on social_links;
create policy "public read enabled links" on social_links for select using (enabled or is_admin());
drop policy if exists "admin write links" on social_links;
create policy "admin write links" on social_links for all using (is_admin()) with check (is_admin());

drop policy if exists "anyone can send message" on contact_messages;
create policy "anyone can send message" on contact_messages for insert with check (true);
drop policy if exists "admin read messages" on contact_messages;
create policy "admin read messages" on contact_messages for select using (is_admin());
drop policy if exists "admin update messages" on contact_messages;
create policy "admin update messages" on contact_messages for update using (is_admin());
drop policy if exists "admin delete messages" on contact_messages;
create policy "admin delete messages" on contact_messages for delete using (is_admin());

drop policy if exists "read own admin row" on admins;
create policy "read own admin row" on admins for select using (user_id = auth.uid());

insert into site_settings (id, data) values (1, '{}') on conflict do nothing;

-- Storage: public-read bucket, admin-only writes, images only, 5 MB
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site', 'site', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
drop policy if exists "admin upload" on storage.objects;
create policy "admin upload" on storage.objects for insert with check (bucket_id = 'site' and is_admin());
drop policy if exists "admin replace" on storage.objects;
create policy "admin replace" on storage.objects for update using (bucket_id = 'site' and is_admin());
drop policy if exists "admin remove" on storage.objects;
create policy "admin remove" on storage.objects for delete using (bucket_id = 'site' and is_admin());

-- After creating your user in Authentication → Users, run (replace the email):
-- insert into admins select id from auth.users where email = 'YOUR_EMAIL';

drop policy if exists "admin list files" on storage.objects;
create policy "admin list files" on storage.objects for select using (bucket_id = 'site' and is_admin());
