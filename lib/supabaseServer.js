import ws from 'ws'
import { createClient } from '@supabase/supabase-js'

// Polyfill native WebSocket for Node.js < 22 environments (Node 20, serverless, etc.)
if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
  globalThis.WebSocket = ws
}

const DEFAULT_SUPABASE_URL = 'https://vgbrjmqiigqjuyeowvfo.supabase.co'
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnJqbXFpaWdxanV5ZW93dmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxOTk1MTcsImV4cCI6MjEwNDc3NTUxN30.c_7rPTiLUSdgbvNv7O7wGv2tcm9VDYjKKJCPlwV2Kmc'

export function getSupabaseServer() {
  if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
    globalThis.WebSocket = ws
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  // Service role bypasses RLS, so tables can stay locked from the public anon key
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

// Helper to fetch settings from Supabase (tries 'settings' table first, then 'guests' table fallback)
export async function fetchSupabaseSettings() {
  const supabase = getSupabaseServer()

  // 1. Try public.settings table
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .eq('id', 'general')
      .limit(1)

    if (!error && data && data.length > 0 && data[0]?.data && Object.keys(data[0].data).length > 0) {
      return data[0].data
    }
  } catch (e) {}

  // 2. Fallback to public.guests table row (name = 'SYSTEM_SETTINGS')
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('id, invited_by')
      .eq('name', 'SYSTEM_SETTINGS')
      .order('created_at', { ascending: false })
      .limit(1)

    if (!error && data && data.length > 0 && data[0]?.invited_by) {
      const parsed = JSON.parse(data[0].invited_by)
      if (parsed && typeof parsed === 'object') {
        return parsed
      }
    }
  } catch (e) {}

  return null
}
