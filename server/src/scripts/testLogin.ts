import dotenv from 'dotenv';
import { supabase } from '../db/supabase.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function testLogin() {
  try {
    console.log('Testing login credentials...\n');

    const email = 'admin@admin.com';
    const password = '1234';
    const normalizedEmail = email.toLowerCase().trim();

    console.log(`Email: ${email}`);
    console.log(`Normalized: ${normalizedEmail}`);
    console.log(`Password: ${password}\n`);

    // Simulate login query
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (error) {
      console.error('❌ Query error:', error);
      if (error.code === 'PGRST116') {
        console.error('   User not found!');
      }
      process.exit(1);
    }

    if (!user) {
      console.error('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Has Password: ${!!user.password}\n`);

    if (!user.password) {
      console.error('❌ User has no password set');
      process.exit(1);
    }

    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Password verification:');
    console.log(`   Result: ${isValid ? '✅ VALID' : '❌ INVALID'}\n`);

    if (isValid) {
      console.log('✅ Login credentials are correct!');
      console.log('   If login still fails, try:');
      console.log('   1. Restart the server (Ctrl+C, then npm run dev)');
      console.log('   2. Check server console for error messages');
      console.log('   3. Verify SUPABASE_URL and API keys in .env');
    } else {
      console.error('❌ Password mismatch!');
      console.log('   Run: npm run create-default-admin');
    }

    process.exit(isValid ? 0 : 1);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLogin();

