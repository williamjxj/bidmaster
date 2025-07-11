import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Default client for basic operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Client for Next.js client components with auth helpers
export const createSupabaseClient = () => {
  return createClientComponentClient<Database>()
}

// For server-side operations, you would use:
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// export const createServerSupabaseClient = () => {
//   return createServerComponentClient<Database>({ cookies })
// }
