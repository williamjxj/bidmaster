// For backward compatibility, keep a default client export
// Note: This should primarily be used for client-side operations
import { createClient } from '@/utils/supabase/client'
export const supabase = createClient()

// Legacy function for backward compatibility
// Prefer using createClient() directly from '@/utils/supabase/client'
const createSupabaseClient = () => {
  return createClient()
}
