import dotenv from 'dotenv';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;

console.log('🔍 Advanced Network Diagnostics...\n');

// Test 1: Basic HTTPS connection
console.log('Test 1: Testing HTTPS connection to Supabase...');
const testUrl = new URL(supabaseUrl);
const options = {
  hostname: testUrl.hostname,
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  timeout: 5000,
  headers: {
    'apikey': process.env.SUPABASE_ANON_KEY || '',
    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
  }
};

const req = https.request(options, (res) => {
  console.log(`✅ HTTPS Connection: Status ${res.statusCode}`);
  console.log(`   Headers:`, res.headers);
  
  if (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 404) {
    console.log('   ✅ Server is reachable!\n');
    testSupabaseClient();
  } else {
    console.log(`   ⚠️  Unexpected status: ${res.statusCode}\n`);
  }
  
  res.on('data', () => {});
  res.on('end', () => {});
});

req.on('error', (error: any) => {
  console.error('❌ HTTPS Connection Failed:', error.message);
  console.error('\n   Possible causes:');
  console.error('   1. Windows Firewall blocking Node.js');
  console.error('   2. Antivirus blocking connection');
  console.error('   3. Corporate proxy/firewall');
  console.error('   4. Supabase project is paused');
  console.error('   5. Network configuration issue\n');
  
  console.log('   Solutions to try:');
  console.log('   1. Open Windows Firewall and allow Node.js');
  console.log('   2. Temporarily disable antivirus');
  console.log('   3. Check if you can access:', supabaseUrl, 'in browser');
  console.log('   4. Verify Supabase project is active in dashboard');
  console.log('   5. Try using a VPN or different network');
});

req.on('timeout', () => {
  console.error('❌ Connection timeout');
  req.destroy();
});

req.end();

// Test 2: Supabase client
function testSupabaseClient() {
  console.log('Test 2: Testing Supabase client...');
  const supabase = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
  );
  
  supabase.from('users').select('count', { count: 'exact', head: true })
    .then(({ data, error }) => {
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('✅ Supabase client works!');
          console.log('⚠️  Tables not created yet - run schema.sql');
        } else {
          console.error('❌ Supabase error:', error.message);
        }
      } else {
        console.log('✅ Supabase client works!');
        console.log('✅ Tables exist');
      }
    })
    .catch((err) => {
      console.error('❌ Supabase client error:', err.message);
    });
}

// Keep process alive
setTimeout(() => process.exit(0), 10000);

