do $$
declare
  target text[] := array[
      'announcements',
      'backup_notification_preferences_20260220',
      'client_outreach',
      'comment_mentions',
      'contracts',
      'faq_items',
      'feature_modals',
      'help_ticket_attachments',
      'help_ticket_replies',
      'levelup_messages_discord',
      'member_checklists',
      'news_banners',
      'notification_preferences',
      'notification_queue',
      'notification_templates',
      'overflow_comments',
      'overflow_likes',
      'points_history',
      'post_content_images',
      'post_tags',
      'post_upvotes',
      'project_categories',
      'settings_discord',
      'social_points_categories',
      'survey_dismissals',
      'survey_questions',
      'survey_responses',
      'task_drafts',
      'task_ticket_codes',
      'ticket_support',
      'user_badges_discord',
      'user_rewards_discord',
      'user_stats_discord',
      'xp_config_discord',
      'xp_logs_discord'
  ];
  pol record;
begin
  for pol in
    select policyname, tablename
      from pg_policies
     where schemaname = 'public'
       and tablename = any (target)
  loop
    execute format('drop policy %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end
$$;

alter table public.announcements enable row level security;
alter table public.backup_notification_preferences_20260220 enable row level security;
alter table public.client_outreach enable row level security;
alter table public.comment_mentions enable row level security;
alter table public.contracts enable row level security;
alter table public.faq_items enable row level security;
alter table public.feature_modals enable row level security;
alter table public.help_ticket_attachments enable row level security;
alter table public.help_ticket_replies enable row level security;
alter table public.levelup_messages_discord enable row level security;
alter table public.member_checklists enable row level security;
alter table public.news_banners enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notification_queue enable row level security;
alter table public.notification_templates enable row level security;
alter table public.overflow_comments enable row level security;
alter table public.overflow_likes enable row level security;
alter table public.points_history enable row level security;
alter table public.post_content_images enable row level security;
alter table public.post_tags enable row level security;
alter table public.post_upvotes enable row level security;
alter table public.project_categories enable row level security;
alter table public.settings_discord enable row level security;
alter table public.social_points_categories enable row level security;
alter table public.survey_dismissals enable row level security;
alter table public.survey_questions enable row level security;
alter table public.survey_responses enable row level security;
alter table public.task_drafts enable row level security;
alter table public.task_ticket_codes enable row level security;
alter table public.ticket_support enable row level security;
alter table public.user_badges_discord enable row level security;
alter table public.user_rewards_discord enable row level security;
alter table public.user_stats_discord enable row level security;
alter table public.xp_config_discord enable row level security;
alter table public.xp_logs_discord enable row level security;
