#!/usr/bin/env node

/**
 * Create Demo Account Script
 * 
 * This script creates a demo account for BidMaster using Supabase Admin API
 * Email: demo@example.com
 * Password: 123456
 * 
 * Usage: node scripts/create-demo-account.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function createDemoAccount() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env.local')
    process.exit(1)
  }

  // Create Supabase admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('🚀 Creating demo account...')

    // Create the demo user
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email: 'demo@example.com',
      password: '123456',
      email_confirm: true, // Skip email verification for demo account
      user_metadata: {
        display_name: 'Demo User',
        full_name: 'Demo User'
      }
    })

    if (createError) {
      if (createError.message.includes('already registered')) {
        console.log('⚠️  Demo account already exists')
        
        // Get the existing user
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
        if (listError) {
          console.error('❌ Error checking existing users:', listError.message)
          return
        }
        
        const demoUser = existingUsers.users.find(u => u.email === 'demo@example.com')
        if (demoUser) {
          console.log('✅ Found existing demo user:', demoUser.id)
          await setupUserPreferences(supabase, demoUser.id)
        }
        return
      } else {
        console.error('❌ Error creating demo user:', createError.message)
        return
      }
    }

    if (user) {
      console.log('✅ Demo user created successfully!')
      console.log('📧 Email: demo@example.com')
      console.log('🔑 Password: 123456')
      console.log('🆔 User ID:', user.user.id)

      // Set up user preferences
      await setupUserPreferences(supabase, user.user.id)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

async function setupUserPreferences(supabase, userId) {
  try {
    console.log('⚙️  Setting up user preferences...')

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        target_technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'JavaScript'],
        target_categories: ['Web Development', 'Frontend Development', 'Full Stack Development'],
        min_budget: 500,
        max_budget: 5000,
        preferred_platforms: ['Upwork', 'Freelancer', 'Toptal'],
        notification_settings: {
          new_projects: true,
          bid_updates: true,
          email: true
        }
      })

    if (error) {
      console.error('⚠️  Error setting up user preferences:', error.message)
    } else {
      console.log('✅ User preferences configured successfully!')
    }
  } catch (error) {
    console.error('❌ Error in setupUserPreferences:', error)
  }
}

// Run the script
if (require.main === module) {
  createDemoAccount()
    .then(() => {
      console.log('\n🎉 Demo account setup complete!')
      console.log('\nYou can now sign in with:')
      console.log('📧 Email: demo@example.com')
      console.log('🔑 Password: 123456')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Script failed:', error)
      process.exit(1)
    })
}

module.exports = { createDemoAccount }
