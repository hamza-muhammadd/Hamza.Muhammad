-- Projects & websites (run once in Supabase → SQL Editor)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 100),
  description text check (length(description) <= 400),
  url text check (url is null or url ~* '^https?://'),
  category text check (length(category) <= 40),
  status text not null default 'live' check (status in ('live','building','planned')),
  image_url text check (image_url is null or image_url ~* '^https?://'),
  featured boolean not null default false,
  enabled boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table projects enable row level security;
drop policy if exists "public read projects" on projects;
drop policy if exists "admin write projects" on projects;
create policy "public read projects" on projects for select using (enabled or is_admin());
create policy "admin write projects" on projects for all using (is_admin()) with check (is_admin());
