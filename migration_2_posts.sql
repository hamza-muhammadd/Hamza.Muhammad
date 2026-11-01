-- Run once in Supabase → SQL Editor (after schema.sql)
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 120),
  title text not null check (length(title) between 1 and 200),
  excerpt text check (length(excerpt) <= 400),
  cover_url text check (cover_url is null or cover_url ~* '^https?://'),
  body text not null default '' check (length(body) <= 100000),
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_status_pub on posts (status, published_at desc);
alter table posts enable row level security;
drop policy if exists "public read published posts" on posts;
create policy "public read published posts" on posts for select using (status = 'published' or is_admin());
drop policy if exists "admin write posts" on posts;
create policy "admin write posts" on posts for all using (is_admin()) with check (is_admin());
