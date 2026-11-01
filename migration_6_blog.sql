-- Blog design fields (run once in Supabase → SQL Editor, after migration_2_posts.sql)
alter table posts add column if not exists category text check (category is null or length(category) <= 40);
alter table posts add column if not exists cover_pos text check (cover_pos is null or cover_pos ~ '^[0-9]{1,3}% [0-9]{1,3}%$');
alter table posts add column if not exists read_min int check (read_min is null or read_min between 1 and 999);
