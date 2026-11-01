-- Project details (run once in Supabase → SQL Editor)
-- Adds the long "why I built it / why people use it" text shown when a project card is opened.
alter table projects add column if not exists details text check (details is null or length(details) <= 6000);
