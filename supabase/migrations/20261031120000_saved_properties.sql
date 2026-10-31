-- The shortlist (§5.9).
--
-- This table was never created in the Supabase project, so every heart tap in
-- the app failed with
--   PGRST205: Could not find the table 'public.saved_properties'
--             in the schema cache
-- and the Saved tab could only ever render its empty state.
--
-- Apply it from the Supabase dashboard: SQL Editor -> new query -> paste -> Run.
--
-- Prerequisite: Authentication -> Third-party providers -> Clerk must be
-- active, because the policies below identify the caller from the Clerk JWT.

create table if not exists public.saved_properties (
  id uuid primary key default gen_random_uuid(),
  -- Clerk ids look like `user_2ab…`, so this column is text, not uuid.
  user_clerk_id text not null,
  property_id uuid not null references public.properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- Saving twice is a no-op, never a duplicate row.
  constraint saved_properties_user_property_key unique (user_clerk_id, property_id)
);

-- The Saved tab reads one person's rows, newest first.
create index if not exists saved_properties_user_created_idx
  on public.saved_properties (user_clerk_id, created_at desc);

alter table public.saved_properties enable row level security;

-- With Clerk's Supabase template the request runs as `authenticated`; if the
-- template carries no `role` claim it runs as `anon`. Both are granted, and the
-- policy is what actually keeps people apart — an anonymous request has no
-- `sub`, so it never matches a row.
grant select, insert, delete on public.saved_properties to anon, authenticated;

drop policy if exists "a person reads their own saves" on public.saved_properties;
create policy "a person reads their own saves"
  on public.saved_properties for select
  to anon, authenticated
  using ((select auth.jwt() ->> 'sub') = user_clerk_id);

drop policy if exists "a person saves for themselves" on public.saved_properties;
create policy "a person saves for themselves"
  on public.saved_properties for insert
  to anon, authenticated
  with check ((select auth.jwt() ->> 'sub') = user_clerk_id);

drop policy if exists "a person unsaves their own" on public.saved_properties;
create policy "a person unsaves their own"
  on public.saved_properties for delete
  to anon, authenticated
  using ((select auth.jwt() ->> 'sub') = user_clerk_id);

-- PostgREST caches the schema; without this the API keeps answering PGRST205
-- until its next automatic reload.
notify pgrst, 'reload schema';
