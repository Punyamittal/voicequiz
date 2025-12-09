import dotenv from 'dotenv';
import { supabase } from '../db/supabase.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function createAdmin() {
  try {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin User';

    if (!email || !password) {
      console.error('Usage: npm run create-admin <email> <password> [name]');
      process.exit(1);
    }

    console.log('Connected to Supabase');

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      const { error } = await supabase
        .from('users')
        .update({
          role: 'admin',
          password: hashedPassword,
          name
        })
        .eq('id', existingUser.id);

      if (error) throw error;
      console.log(`Updated user ${email} to admin`);
    } else {
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role: 'admin',
          is_verified: true
        })
        .select()
        .single();

      if (error) throw error;
      console.log(`Created admin user: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
