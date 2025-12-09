import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

console.log('🔍 Testing Supabase Connection...\n');

// Check environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

console.log('Environment Variables:');
console.log('  SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('  SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? '✅ Set' : '❌ Missing');
console.log('  SUPABASE_ANON_KEY:', anonKey ? '✅ Set' : '❌ Missing');
console.log('');

if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL is missing!');
  console.error('   Add it to your .env file: SUPABASE_URL=https://your-project.supabase.co');
  process.exit(1);
}

if (!serviceKey && !anonKey) {
  console.error('❌ Both SUPABASE_SERVICE_ROLE_KEY and SUPABASE_ANON_KEY are missing!');
  console.error('   Add at least one to your .env file');
  process.exit(1);
}

// Validate URL format
if (!supabaseUrl.startsWith('https://')) {
  console.error('❌ Invalid SUPABASE_URL format!');
  console.error('   URL must start with https://');
  console.error('   Current:', supabaseUrl);
  process.exit(1);
}

// Test connection
const key = serviceKey || anonKey;
const supabase = createClient(supabaseUrl, key);

console.log('Testing connection to:', supabaseUrl);
console.log('Using key:', serviceKey ? 'Service Role Key' : 'Anon Key');
console.log('');

(async () => {
  try {
    console.log('Attempting to connect...');
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ Connection successful!');
        console.log('⚠️  Tables not found - run schema.sql in Supabase SQL Editor');
      } else if (error.message?.includes('fetch failed')) {
        console.error('❌ Network error - cannot reach Supabase');
        console.error('   Check:');
        console.error('   1. Your internet connection');
        console.error('   2. SUPABASE_URL is correct:', supabaseUrl);
        console.error('   3. Supabase project is active (not paused)');
        console.error('   4. Firewall/proxy settings');
      } else {
        console.error('❌ Error:', error.message);
        console.error('   Code:', error.code);
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('✅ Tables exist and accessible');
    }
  } catch (err: any) {
    if (err.message?.includes('fetch failed')) {
      console.error('❌ Network error - cannot reach Supabase');
      console.error('   Error:', err.message);
      console.error('\n   Troubleshooting:');
      console.error('   1. Verify SUPABASE_URL:', supabaseUrl);
      console.error('   2. Check Supabase dashboard - is project active?');
      console.error('   3. Try accessing:', supabaseUrl + '/rest/v1/');
      console.error('   4. Check firewall/antivirus settings');
    } else {
      console.error('❌ Unexpected error:', err.message);
    }
  }
})();

