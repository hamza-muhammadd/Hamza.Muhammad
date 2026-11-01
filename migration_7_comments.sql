-- Blog comments (run once in Supabase → SQL Editor, after migration_2_posts.sql)
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  name text not null check (length(name) between 1 and 60),
  email text check (email is null or (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 200)),
  body text not null check (length(body) between 2 and 1000),
  status text not null default 'pending' check (status in ('pending','approved')),
  created_at timestamptz not null default now()
);
create index if not exists comments_post on comments (post_id, status, created_at);
alter table comments enable row level security;
-- anyone can leave a comment, but it always starts as pending (hidden until you approve it)
drop policy if exists "anyone can comment" on comments;
create policy "anyone can comment" on comments for insert with check (
  status = 'pending'
  and exists (select 1 from posts p where p.id = post_id and p.status = 'published')
);
-- visitors only see approved comments; the admin sees everything
drop policy if exists "read approved comments" on comments;
create policy "read approved comments" on comments for select using (status = 'approved' or is_admin());
drop policy if exists "admin update comments" on comments;
create policy "admin update comments" on comments for update using (is_admin()) with check (is_admin());
drop policy if exists "admin delete comments" on comments;
create policy "admin delete comments" on comments for delete using (is_admin());
