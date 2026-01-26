import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: any = null;

export function createClient() {
  if (typeof window === 'undefined') {
    // Server-side: Always create new client (handled by server action logic usually)
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Client-side: Singleton to prevent connection flood
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return supabaseInstance;
}