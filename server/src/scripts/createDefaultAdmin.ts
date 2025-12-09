import dotenv from 'dotenv';
import { supabase } from '../db/supabase.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function createDefaultAdmin() {
  try {
    console.log('Creating default admin user...');

    const email = 'admin@admin.com';
    const password = '1234';
    const name = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Update existing user to admin
      const { error } = await supabase
        .from('users')
        .update({
          role: 'admin',
          password: hashedPassword,
          name
        })
        .eq('id', existingUser.id);

      if (error) throw error;
      console.log('✅ Updated existing user to admin');
      console.log('   Email: admin@admin.com');
      console.log('   Password: 1234');
    } else {
      // Create new admin user
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          email,
          password: hashedPassword,
          name,
          role: 'admin',
          is_verified: true
        })
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Created default admin user');
      console.log('   Email: admin@admin.com');
      console.log('   Password: 1234');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createDefaultAdmin();

