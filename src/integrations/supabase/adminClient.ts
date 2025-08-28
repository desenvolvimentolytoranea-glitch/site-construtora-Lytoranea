import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vitxtbotmtxfytusptbf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpdHh0Ym90bXR4Znl0dXNwdGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MTg3MjIsImV4cCI6MjA3MTI5NDcyMn0.zb2DJltnhMuBcHjf3Rl1qCSlXVQYdfOCQVQS16Svahw";

// Create a separate admin client that includes the admin token in headers
export const createAdminClient = () => {
  const adminToken = sessionStorage.getItem('admin_token');
  
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: adminToken ? {
        'x-admin-token': adminToken
      } : undefined
    }
  });
};

// Default export for admin operations
export const adminSupabase = createAdminClient();