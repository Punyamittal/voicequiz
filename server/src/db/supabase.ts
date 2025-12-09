import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
  throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://')) {
  console.error('❌ Invalid SUPABASE_URL format. Must start with https://');
  throw new Error('SUPABASE_URL must be a valid HTTPS URL');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// Test connection on import (non-blocking)
(async () => {
  try {
    // Simple health check - just verify we can reach Supabase
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      // PGRST116 = relation does not exist (tables not created yet)
      if (error.code === 'PGRST116') {
        console.log('⚠️  Supabase connected but tables not found. Please run the schema.sql in Supabase SQL Editor.');
      } else {
        console.error('❌ Supabase connection error:', error.message);
        console.error('   Check your SUPABASE_URL and API keys in .env file');
      }
    } else {
      console.log('✅ Connected to Supabase successfully');
    }
  } catch (err: any) {
    if (err.message?.includes('fetch failed')) {
      console.error('❌ Cannot reach Supabase. Check:');
      console.error('   1. SUPABASE_URL is correct in .env file');
      console.error('   2. Your internet connection');
      console.error('   3. Supabase project is active (not paused)');
      console.error('   4. Firewall/proxy settings');
    } else {
      console.error('❌ Supabase connection error:', err.message || err);
    }
  }
})();

