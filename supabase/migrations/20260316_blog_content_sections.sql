-- Optional CMS columns for richer blog SEO / E-E-A-T sections.
-- Run in Supabase SQL editor if these columns are not yet present.

alter table public.blogs
  add column if not exists author_bio text,
  add column if not exists content_sections jsonb default '{}'::jsonb;

comment on column public.blogs.author_bio is 'Short author bio for E-E-A-T on the post page';
comment on column public.blogs.content_sections is 'JSON: why_this_matters, comparison_table, tips_mistakes';
