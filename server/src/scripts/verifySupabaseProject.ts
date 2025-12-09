import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Supabase Project Verification\n');

const url = process.env.SUPABASE_URL;

if (!url) {
  console.error('❌ SUPABASE_URL not found in .env file');
  process.exit(1);
}

console.log('Current SUPABASE_URL:', url);
console.log('');

// Extract project ID
const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!match) {
  console.error('❌ Invalid URL format!');
  console.error('   Expected format: https://project-id.supabase.co');
  console.error('   Your URL:', url);
  process.exit(1);
}

const projectId = match[1];
console.log('Extracted Project ID:', projectId);
console.log('');

console.log('📋 Next Steps:');
console.log('');
console.log('1. Go to: https://app.supabase.com');
console.log('2. Log in to your account');
console.log('3. Check your project list');
console.log('4. Find project with ID:', projectId);
console.log('5. If project exists:');
console.log('   - Click on it');
console.log('   - Go to Settings → API');
console.log('   - Copy the "Project URL"');
console.log('   - Update your .env file');
console.log('');
console.log('6. If project does NOT exist:');
console.log('   - Create a new project');
console.log('   - Get the new Project URL');
console.log('   - Update your .env file');
console.log('');
console.log('7. After updating .env, test with:');
console.log('   npm run test-connection');
console.log('');

