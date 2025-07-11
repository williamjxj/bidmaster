-- Initialize default user preferences
-- Run this in your Supabase SQL editor if you want to create default preferences

INSERT INTO user_preferences (
  user_id,
  target_technologies,
  target_categories,
  min_budget,
  max_budget,
  preferred_platforms,
  notification_settings
) VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'Python'],
  ARRAY['Web Development', 'AI Development', 'Backend Development'],
  1000,
  10000,
  ARRAY['Upwork', 'Freelancer', 'Toptal'],
  '{"new_projects": true, "bid_updates": true, "email": false}'::jsonb
) ON CONFLICT (user_id) DO UPDATE SET
  target_technologies = EXCLUDED.target_technologies,
  target_categories = EXCLUDED.target_categories,
  min_budget = EXCLUDED.min_budget,
  max_budget = EXCLUDED.max_budget,
  preferred_platforms = EXCLUDED.preferred_platforms,
  notification_settings = EXCLUDED.notification_settings,
  updated_at = NOW();
