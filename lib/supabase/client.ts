"use client"

import { createClient } from "@supabase/supabase-js"
import { supabaseCredentials } from "@/lib/credentials"

// Check if Supabase credentials are configured
export const isSupabaseConfigured =
  typeof supabaseCredentials.url === "string" &&
  supabaseCredentials.url.length > 0 &&
  typeof supabaseCredentials.anonKey === "string" &&
  supabaseCredentials.anonKey.length > 0

let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance && isSupabaseConfigured) {
    try {
      supabaseInstance = createClient(supabaseCredentials.url, supabaseCredentials.anonKey)
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      return null
    }
  }
  return supabaseInstance
}

export const supabase = getSupabaseClient()
