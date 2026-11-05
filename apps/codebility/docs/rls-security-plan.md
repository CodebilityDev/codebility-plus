# Database security plan

Goal: the new build is the only client. Every table, function, view and bucket follows deny-by-default. The anon key can read only what the public site displays, and nothing it can read contains PII or documents.

## Verified starting point

Done already:

- anon writes revoked on every table except the careers form insert
- private tables on RLS with an authenticated policy: applicant, kanban_boards, kanban_columns, kanban_sprints, tasks, tasks_comments, clients, help_tickets, appointments, notifications, surveys and the survey tables
- legacy and dead tables on RLS, anon denied
- NDA signing moved to the token-bound security definer function sign_nda
- the app reads private data with the session client through private caches

Still open, measured with the anon key:

| Surface | Anon | Risk |
|---|---|---|
| codev | 1414 rows, 39 columns | emails, phones, addresses, NDA URLs |
| storage bucket codebility | public | NDA PDFs and resumes downloadable by URL |
| projects, project_members, job_listings, skill_category, roles | rows | public by design, keep |
| education, work_experience, codev_points | rows | public profile data, keep |
| posts, post_comments, overflow_post | rows | no feature uses them, close |
| functions | unknown ACLs | any security definer callable by anon is a bypass |

## Target model

- anon: select only through an explicit allowlist. No PII columns, no documents, no writes except the careers insert.
- authenticated: own rows, or rows reachable through a role permission or project membership. Never a blanket true.
- codev: the row is locked to the owner, admins and the applicants permission. Other members are read through the public view.
- Protected columns (role_id, application_status, nda_*, quiz fields) cannot be changed by their owner through the REST API. Triggers enforce this because RLS is row-level.
- Functions: execute revoked from public and anon by default. Security definer only with a fixed search_path and explicit grants.
- Storage: private buckets for resumes and NDA documents, signed URLs, paths stored instead of public URLs.
- Auth: leaked password protection, refresh token rotation, MFA, rate limits.

## Phase 0: audit, no changes

Run in the SQL editor and keep the output. It decides the function and storage work in phases 1 and 6.

```sql
select tablename, rowsecurity from pg_tables where schemaname = 'public' order by rowsecurity, tablename;

select tablename, policyname, roles, cmd, qual is not null as has_using
  from pg_policies where schemaname = 'public' order by tablename, policyname;

select p.proname, p.prosecdef, pg_get_function_identity_arguments(p.oid) as args,
       has_function_privilege('anon', p.oid, 'execute') as anon_exec
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.prokind = 'f'
 order by p.prosecdef desc, anon_exec desc, p.proname;

select id, name, public from storage.buckets;

select table_name, privilege_type from information_schema.role_table_grants
 where grantee = 'anon' order by table_name, privilege_type;

select c.relname, c.relkind, c.reloptions
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and c.relkind in ('v','m');
```

## Phase 1: functions and default privileges

```sql
revoke execute on all functions in schema public from public;
revoke execute on all functions in schema public from anon;

alter default privileges in schema public revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon;

grant execute on function public.sign_nda(text, text, text) to anon;
```

Then the app must still work: profiles listing calls calculate_member_rating_score as anon. Either move that call behind the public view or grant execute on that one read-only function back to anon. Decide from the phase 0 output.

## Phase 2: public data surface

Create a view with display columns only, no email, phone, address, NDA, internal status or role:

```sql
create or replace view public.public_profiles
with (security_invoker = false) as
select id, first_name, last_name, display_position, image_url, about,
       portfolio_website, tech_stacks, years_of_experience,
       availability_status, date_joined, github, linkedin, facebook, headline
  from public.codev
 where application_status = 'passed';

grant select on public.public_profiles to anon, authenticated;
```

Then move the public modules from codev to the view, enable RLS on codev, and revoke anon:

```sql
alter table public.codev enable row level security;
revoke select on public.codev from anon;
```

The modules to change: landing interns and admins, codevs profiles, profiles listing, profile detail, proposal, services projects, onboarding team, featured projects. The list comes from the earlier anon inventory.

Keep as explicit anon policies, each with its own select policy:

- projects, project_members, job_listings, skill_category, roles
- education, work_experience, codev_points

Close with no policies: posts, post_comments, overflow_post, overflow_comments, overflow_likes, member_ratings.

## Phase 3: codev policies and protected columns

```sql
create policy codev_select_self on public.codev for select to authenticated
  using (id = auth.uid() or public.is_admin() or public.has_permission('applicants'));

create policy codev_insert_self on public.codev for insert to authenticated
  with check (id = auth.uid());

create policy codev_update_self on public.codev for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
```

Then a trigger that refuses changes to role_id, application_status, internal_status, nda_status, nda_signature, nda_document, nda_signed_at, landing_rank_score, level, rejected_count and promote_declined unless is_admin(). The owner can still update their own display fields.

The member pickers (task assignees, project contributors) must read public_profiles, not codev, otherwise the select policy hides them.

## Phase 4: workflow tables

- applicant: select and update own row (codev_id = auth.uid()), admins with the applicants permission. Trigger protects quiz_score, quiz_passed, test_taken.
- projects: select for members, admins and the projects permission; writes for the projects permission or admins.
- project_members: select for members; writes for team leaders and admins.
- kanban_boards, kanban_columns, kanban_sprints, tasks, tasks_comments: project membership or the kanban permission. tasks reach the project through kanban_column_id, boards through project_id.
- notifications: recipient_id = auth.uid(). Creation goes through a definer function.
- help_tickets: author_id = auth.uid(), admins see all.

Add helpers:

```sql
create or replace function public.project_of_column(target uuid) returns uuid
language sql security definer set search_path = '' stable as $$
  select b.project_id from public.kanban_columns c join public.kanban_boards b on b.id = c.board_id
   where c.id = target;
$$;
```

## Phase 5: public writes and storage

- job_applications: anon insert only, select and update for the applicants permission.
- storage: create private buckets for documents, move NDA and resume files, store object paths, serve signed URLs from server components. Then set the old bucket private and delete the copies.
- until storage is fixed, codev.nda_document must not be anon-readable. That is already achieved by the codev view in phase 2, but the URLs themselves stay public.

## Phase 6: auth hardening

In the dashboard: leaked password protection, refresh token rotation, JWT expiry, rate limits, MFA for admins. In SQL: revoke create on schema public from anon and authenticated if not needed, audit extensions, drop backup_notification_preferences_20260220 once copied out.

## Verification

Every phase ends with the same three checks:

1. Anon audit script: every table not on the allowlist returns 0 rows, the allowlist returns only the expected columns.
2. Role smoke test: admin, HR, applicant, anonymous.
3. App smoke: sign-in, applicants, kanban, profiles, NDA page, careers form.

Rollback is per phase: disable RLS on the affected tables, or drop the policies, and redeploy the previous build.

## Order of execution

1. Phase 0 audit
2. Phase 1 function hardening
3. Phase 2 view and public surface
4. Phase 3 codev and triggers
5. Phase 4 workflow tables
6. Phase 5 storage
7. Phase 6 auth settings
8. Final verification and the anon audit report
