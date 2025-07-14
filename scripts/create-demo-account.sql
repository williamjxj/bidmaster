-- Create Demo Account for BidMaster
-- This script creates a test account with demo@example.com / 123456
-- Run this in your Supabase SQL editor

-- Note: Since Supabase handles user creation through the auth system,
-- this script sets up the supporting data for the demo account.
-- The actual user account should be created through the signup process or Supabase dashboard.

-- Demo account details:
-- Email: demo@example.com
-- Password: 123456
-- Display Name: Demo User

-- First, let's create a placeholder for the demo user ID
-- You'll need to replace this with the actual UUID after creating the user in Supabase Auth
DO $$
DECLARE
    demo_user_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
BEGIN
    -- Insert demo user preferences
    INSERT INTO user_preferences (
        user_id,
        target_technologies,
        target_categories,
        min_budget,
        max_budget,
        preferred_platforms,
        notification_settings,
        created_at,
        updated_at
    ) VALUES (
        demo_user_id,
        ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'JavaScript'],
        ARRAY['Web Development', 'Frontend Development', 'Full Stack Development'],
        500,
        5000,
        ARRAY['Upwork', 'Freelancer', 'Toptal'],
        '{"new_projects": true, "bid_updates": true, "email": true}'::jsonb,
        NOW(),
        NOW()
    ) ON CONFLICT (user_id) DO UPDATE SET
        target_technologies = EXCLUDED.target_technologies,
        target_categories = EXCLUDED.target_categories,
        min_budget = EXCLUDED.min_budget,
        max_budget = EXCLUDED.max_budget,
        preferred_platforms = EXCLUDED.preferred_platforms,
        notification_settings = EXCLUDED.notification_settings,
        updated_at = NOW();

    -- You can add more demo data here if needed
    RAISE NOTICE 'Demo account data prepared for user ID: %', demo_user_id;
END $$;

-- Instructions:
-- 1. First create the user account in Supabase Auth Dashboard:
--    - Go to Authentication > Users in Supabase Dashboard
--    - Click "Add user"
--    - Email: demo@example.com
--    - Password: 123456
--    - Confirm: true (to skip email verification)
--    - Or use the signup form with these credentials
-- 
-- 2. After creating the user, get the user ID and update the demo_user_id variable above
-- 
-- 3. Run this script to set up the demo user's preferences and data

-- Alternative: Create user programmatically (requires service role key)
-- This is commented out for security reasons, but you can use this approach:
/*
SELECT auth.create_user(
    'demo@example.com'::text,
    '123456'::text,
    true, -- email_confirmed
    '{"display_name": "Demo User"}'::jsonb -- user_metadata
);
*/
