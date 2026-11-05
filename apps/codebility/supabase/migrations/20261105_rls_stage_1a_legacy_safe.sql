do $$
declare
  legacy text[] := array['announcements', 'client_outreach', 'comment_mentions', 'contracts', 'feature_modals', 'levelup_messages_discord', 'member_checklists', 'news_banners', 'notification_preferences', 'notification_queue', 'notification_templates', 'overflow_comments', 'overflow_likes', 'points_history', 'post_content_images', 'post_tags', 'post_upvotes', 'project_categories', 'social_points_categories', 'survey_dismissals', 'survey_questions', 'survey_responses', 'task_drafts', 'task_ticket_codes', 'ticket_support', 'user_badges_discord', 'xp_logs_discord'];
  dead text[] := array['backup_notification_preferences_20260220', 'faq_items', 'help_ticket_attachments', 'help_ticket_replies', 'settings_discord', 'user_rewards_discord', 'user_stats_discord', 'xp_config_discord'];
  t text;
  pol record;
begin
  foreach t in array legacy loop
    for pol in
      select policyname from pg_policies
       where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy %I on public.%I', pol.policyname, t);
    end loop;
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      'authenticated_access', t
    );
  end loop;

  foreach t in array dead loop
    for pol in
      select policyname from pg_policies
       where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy %I on public.%I', pol.policyname, t);
    end loop;
    execute format('alter table public.%I enable row level security', t);
  end loop;
end
$$;
