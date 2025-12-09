# Supabase Setup Guide

## Quick Start

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up or log in

2. **Create New Project**
   - Click "New Project"
   - Fill in:
     - Organization (create one if needed)
     - Project Name: `voiceitquiz` (or any name)
     - Database Password: (choose a strong password, save it!)
     - Region: Choose closest to your users
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get API Keys**
   - Once project is ready, go to **Settings** > **API**
   - Copy:
     - **Project URL** → `SUPABASE_URL`
     - **anon public** key → `SUPABASE_ANON_KEY`
     - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

4. **Run Database Schema**
   - Go to **SQL Editor** in left sidebar
   - Click "New query"
   - Copy entire contents of `server/supabase/schema.sql`
   - Paste into editor
   - Click "Run" (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

5. **Verify Tables Created**
   - Go to **Table Editor** in left sidebar
   - You should see 4 tables:
     - `users`
     - `questions`
     - `quiz_sessions`
     - `answers`

## Environment Variables

Add to `server/.env`:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security Notes

- **Service Role Key**: Has full database access. Never expose in client-side code!
- **Anon Key**: Safe for client-side, but we're using service role in backend
- Use **Row Level Security (RLS)** in production for additional security

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the schema.sql script
- Check that tables appear in Table Editor

### Connection timeout
- Check your `SUPABASE_URL` is correct
- Verify project is active in Supabase dashboard
- Check network/firewall settings

### Authentication errors
- Verify API keys are correct
- Check key hasn't been rotated in Supabase dashboard

### Foreign key errors
- Ensure schema.sql ran completely
- Check that all tables were created successfully

## Next Steps

After setup:
1. Run `npm run seed` to add sample questions
2. Run `npm run create-admin` to create admin user
3. Start the application with `npm run dev`

