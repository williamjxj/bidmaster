// Re-export the modern utility functions for client-side use
export { createClient as createBrowserClient } from '@/utils/supabase/client'
// Note: Server client should be imported directly from '@/utils/supabase/server' in server components

// For backward compatibility, keep a default client export
// Note: This should primarily be used for client-side operations
import { createClient } from '@/utils/supabase/client'
export const supabase = createClient()

// Legacy function for backward compatibility
// Prefer using createBrowserClient() directly
export const createSupabaseClient = () => {
  return createClient()
}
