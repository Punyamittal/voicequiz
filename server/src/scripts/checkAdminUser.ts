import dotenv from 'dotenv';
import { supabase } from '../db/supabase.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function checkAdminUser() {
  try {
    console.log('Checking admin user...\n');

    const email = 'admin@admin.com';
    const password = '1234';

    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ Admin user does not exist');
        console.log('   Run: npm run create-default-admin');
        process.exit(1);
      } else {
        throw error;
      }
    }

    if (!user) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Has Password: ${!!user.password}`);

    // Test password
    if (user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`\n🔐 Password Test:`);
      console.log(`   Expected: ${password}`);
      console.log(`   Valid: ${isValid ? '✅ YES' : '❌ NO'}`);
      
      if (!isValid) {
        console.log('\n⚠️  Password mismatch! Recreating admin user...');
        const hashedPassword = await bcrypt.hash(password, 10);
        const { error: updateError } = await supabase
          .from('users')
          .update({ password: hashedPassword })
          .eq('id', user.id);
        
        if (updateError) throw updateError;
        console.log('✅ Password updated successfully');
      }
    } else {
      console.log('\n⚠️  No password set! Setting password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      console.log('✅ Password set successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin:', error);
    process.exit(1);
  }
}

checkAdminUser();

