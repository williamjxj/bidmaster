# BidMaster - Fix User Preferences

## Issue
The Settings page is failing because there are no user preferences in the database for the "default" user.

## Solution
I've updated the API to handle missing user preferences gracefully. Now it will:

1. **Return default values** if no preferences exist
2. **Use `maybeSingle()`** instead of `single()` to handle empty results
3. **Provide fallback defaults** for a better user experience

## What was changed:

### 1. Updated API (`src/lib/api.ts`)
- Changed `single()` to `maybeSingle()` in `getUserPreferences()`
- Added default values when no preferences exist
- Fixed the notification field names to match the database schema

### 2. Created initialization script (`scripts/init-user-preferences.sql`)
- Optional SQL script to create default preferences in the database
- You can run this in your Supabase SQL editor if you want

## Next Steps:

### Option 1: Let the app handle it automatically
- The app will now work with default values
- When you save settings, it will create the preferences in the database

### Option 2: Initialize preferences manually (optional)
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/qjzarzdnunujmheotzvu
2. Navigate to SQL Editor
3. Run the contents of `scripts/init-user-preferences.sql`

## Test the fix:
1. Refresh your browser at http://localhost:3000/settings
2. The Settings page should now load with default values
3. You can modify and save settings, which will create the database record

The error should now be resolved!
