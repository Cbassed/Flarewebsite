import { createClient } from '@supabase/supabase-js';

// Temporary hardcoded values since Vercel env vars aren't working
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zhjtevqmgtntiojuerpa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoanRldnFtZ3RudGlvanVlcnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMDMwNzksImV4cCI6MjA3Mjc3OTA3OX0.aQqIVa24dvmYaHJxmLIdLHj3Q6kF-_Orugp-nPohegs';

// Note: Replace YOUR_FULL_ANON_KEY_HERE with your actual key that starts with eyJ...

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase client initialized');