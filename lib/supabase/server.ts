import { createClient as _createClient } from "@supabase/supabase-js"
import { cache } from "react"
import { supabaseCredentials } from "@/lib/credentials"

// Check if Supabase credentials are configured
export const isSupabaseConfigured =
  typeof supabaseCredentials.url === "string" &&
  supabaseCredentials.url.length > 0 &&
  typeof supabaseCredentials.serviceRoleKey === "string" &&
  supabaseCredentials.serviceRoleKey.length > 0

// Create a cached version of the Supabase client for Server Components
export const createServerClient = cache(() => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase credentials are not configured in credentials.ts")
    return null
  }

  return _createClient(supabaseCredentials.url, supabaseCredentials.serviceRoleKey)
})

export const createClient = createServerClient
