# 🔧 Fixed the UUID Error!

## ✅ **Problem Solved**

The error was caused by using `"default"` as a user ID, but the database expects a valid UUID format.

**Error was:**
```
invalid input syntax for type uuid: "default"
```

**Solution:**
- Changed from `"default"` to `"00000000-0000-0000-0000-000000000000"` (valid UUID)
- Updated both the Settings page and API hooks

## 🚀 **What to do now:**

### Option 1: Let the app create the record automatically
1. **Refresh** http://localhost:3000/settings
2. The page should load with default values
3. **Save settings** once to create the database record

### Option 2: Create the record manually (recommended)
1. Go to your **Supabase SQL Editor**: https://supabase.com/dashboard/project/qjzarzdnunujmheotzvu/sql
2. Copy and run this SQL:

```sql
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
```

## ✨ **Result:**
The Settings page should now work perfectly without any UUID errors!
