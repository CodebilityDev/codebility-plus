revoke select on public.admin_users from public, anon, authenticated;
revoke select on public.mentor_users from public, anon, authenticated;
revoke select on public.guild_leaderboard_discord from public, anon, authenticated;
revoke select on public.user_rewards_summary_discord from public, anon, authenticated;
revoke select on public.leaderboard_discord_view from public, anon, authenticated;
revoke select on public.projects_with_categories from public, anon, authenticated;

grant select on public.public_codev_profiles to anon, authenticated;
grant select on public.codev_total_points to anon, authenticated;

revoke execute on all functions in schema public from public;
revoke execute on all functions in schema public from anon;
revoke execute on all functions in schema public from authenticated;

alter default privileges in schema public revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon;
alter default privileges in schema public revoke execute on functions from authenticated;

grant execute on function public.sign_nda(text, text, text) to anon, authenticated;
grant execute on function public.calculate_member_rating_score(uuid) to anon, authenticated;
grant execute on function public.create_kanban_column(uuid, text, integer) to authenticated;
grant execute on function public.delete_kanban_column(uuid) to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.has_permission(text) to authenticated;
grant execute on function public.is_project_member(uuid) to authenticated;
