-- users: RLS was on, but nothing let the app write the row it creates on first
-- sign-in. Every sync ended with
--   42501: new row violates row-level security policy for table "users"
-- and `useUserSync` fell back to `is_admin = false`. The Add tab is gated on
-- that flag, so publishing a home was unreachable.
--
-- Select and insert only: the app never edits a row after it exists, and an
-- update policy would let anyone grant themselves `is_admin`.

alter table public.users enable row level security;

grant select, insert on public.users to anon, authenticated;

drop policy if exists "a person reads their own row" on public.users;
create policy "a person reads their own row"
  on public.users for select
  to anon, authenticated
  using ((select auth.jwt() ->> 'sub') = clerk_id);

drop policy if exists "a person creates their own row" on public.users;
create policy "a person creates their own row"
  on public.users for insert
  to anon, authenticated
  -- A new row may not arrive already an admin.
  with check (
    (select auth.jwt() ->> 'sub') = clerk_id
    and coalesce(is_admin, false) = false
  );

notify pgrst, 'reload schema';
