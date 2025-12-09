# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm run install:all
```

This installs dependencies for root, server, and client.

## Step 2: Set Up Supabase

1. **Create Supabase Project:**
   - Go to https://supabase.com and sign up/login
   - Click "New Project"
   - Choose a name, database password, and region
   - Wait for project to be created (takes ~2 minutes)

2. **Get API Keys:**
   - Go to Project Settings > API
   - Copy your:
     - Project URL (SUPABASE_URL)
     - anon/public key (SUPABASE_ANON_KEY)
     - service_role key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

3. **Run Database Schema:**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `server/supabase/schema.sql`
   - Paste and run the SQL script
   - This creates all necessary tables

## Step 3: Configure Environment

Create `server/.env` file:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Email Setup (for OTP)

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASS`

For other email providers, adjust `SMTP_HOST` and `SMTP_PORT` accordingly.

## Step 4: Seed Sample Questions (Optional)

```bash
cd server
npm run seed
```

This creates 2 sample questions. Add 48 more via admin dashboard.

## Step 5: Create Admin User

**Option A: Using Script (Recommended)**
```bash
cd server
npm run create-admin your-email@example.com your-password "Admin Name"
```

**Option B: Manual Method**
1. Start the application
2. Register a user with your email
3. In MongoDB shell or Compass:
   ```javascript
   use voiceitquiz
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## Step 6: Run the Application

```bash
# Development mode (both server and client)
npm run dev

# Or separately:
npm run dev:server  # Backend on port 5000
npm run dev:client  # Frontend on port 3000
```

## Step 7: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Dashboard**: http://localhost:3000/admin (after logging in as admin)

## Testing with Multiple Users

To test with multiple concurrent users:

1. Use different browsers or incognito windows
2. Register/login with different emails
3. All users will see real-time leaderboard updates
4. Monitor online users in admin dashboard

## Troubleshooting

### Supabase Connection Error
- Ensure Supabase project is active
- Check `SUPABASE_URL` and API keys in `.env`
- Verify schema.sql has been run in SQL Editor
- Check Supabase project status in dashboard

### Email Not Sending
- Check SMTP credentials
- For Gmail, use App Password (not regular password)
- Check firewall/network settings

### Port Already in Use
- Change `PORT` in `server/.env`
- Change port in `client/vite.config.ts`

### Socket Connection Failed
- Ensure backend is running on port 5000
- Check CORS settings in `server/src/index.ts`
- Update `VITE_SOCKET_URL` in client if using different port

## Production Deployment

1. Build the client:
   ```bash
   cd client
   npm run build
   ```

2. Build the server:
   ```bash
   cd server
   npm run build
   ```

3. Set production environment variables

4. Use PM2 or similar for process management:
   ```bash
   pm2 start dist/index.js --name voiceitquiz
   ```

5. Serve client build with nginx or similar

6. Supabase is already cloud-hosted, no additional setup needed

7. Use proper email service (SendGrid, AWS SES, etc.)

