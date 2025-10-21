-- Insert dummy news banner data for testing
-- Description: Adds sample banners to demonstrate the news banner system

INSERT INTO news_banners (title, message, type, is_active, priority, start_date, end_date) VALUES 
(
  '🚀 New Feature Alert!', 
  'We''ve just launched our new project management dashboard with enhanced collaboration tools. Check it out in the Projects section!',
  'announcement',
  true,
  5,
  NOW(),
  NOW() + INTERVAL '30 days'
),
(
  '📅 System Maintenance Scheduled', 
  'Planned maintenance will occur this Saturday from 2:00 AM to 4:00 AM EST. Some features may be temporarily unavailable.',
  'warning',
  true,
  4,
  NOW(),
  NOW() + INTERVAL '7 days'
),
(
  '🎉 Welcome to Codebility Plus!', 
  'Start exploring your dashboard, track your progress, and connect with your team members.',
  'info',
  true,
  3,
  NOW(),
  NULL
),
(
  '🏆 Leaderboard Update', 
  'Monthly leaderboards have been updated! Check your ranking and see who''s leading this month.',
  'success',
  true,
  2,
  NOW(),
  NOW() + INTERVAL '14 days'
),
(
  '💡 Pro Tip', 
  'Did you know you can customize your dashboard layout? Visit Settings to personalize your workspace.',
  'info',
  true,
  1,
  NOW(),
  NOW() + INTERVAL '60 days'
);