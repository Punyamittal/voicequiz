# Step-by-Step Supabase Setup Guide

Follow these steps carefully to set up Supabase for your VoiceItQuiz application.

## Step 1: Create Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign in"** (top right)
3. If new user:
   - Click **"Sign up"**
   - Choose to sign up with:
     - GitHub (recommended)
     - Email
     - Google
   - Complete the sign-up process
4. If existing user:
   - Click **"Sign in"**
   - Enter your credentials

---

## Step 2: Create a New Project

1. After logging in, you'll see the Supabase dashboard
2. Click the **"New Project"** button (usually green, top right or center)
3. Fill in the project details:

   **Organization:**
   - If you don't have one, click **"New Organization"**
   - Enter organization name (e.g., "My Projects")
   - Click **"Create organization"**

   **Project Details:**
   - **Name**: `voiceitquiz` (or any name you prefer)
   - **Database Password**: 
     - ⚠️ **IMPORTANT**: Create a strong password (12+ characters)
     - Save this password somewhere safe (you'll need it later)
     - Example: `MySecurePass123!@#`
   - **Region**: 
     - Choose the region closest to your users
     - For India: `Southeast Asia (Singapore)` or `South Asia (Mumbai)`
     - For US: `West US` or `East US`
     - For Europe: `West EU` or `North EU`

4. Click **"Create new project"**
5. ⏳ **Wait 2-3 minutes** for Supabase to set up your project
   - You'll see a progress screen
   - Don't close the browser tab

---

## Step 3: Get Your API Keys

Once your project is ready:

1. In the left sidebar, click **"Settings"** (gear icon at bottom)
2. Click **"API"** in the settings menu
3. You'll see several sections. Find these values:

   **Project URL:**
   - Look for **"Project URL"** or **"Config"** section
   - Copy the URL (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - This is your `SUPABASE_URL`

   **API Keys:**
   - Find the **"Project API keys"** section
   - You'll see two keys:

     **1. anon / public key:**
     - Labeled as **"anon"** or **"public"**
     - Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - Click the **eye icon** to reveal it
     - Click **"Copy"** button
     - This is your `SUPABASE_ANON_KEY`

     **2. service_role key:**
     - Labeled as **"service_role"**
     - ⚠️ **SECRET**: This key has full database access
       - Never expose this in client-side code
       - Only use in backend/server code
     - Click the **eye icon** to reveal it
     - Click **"Copy"** button
     - This is your `SUPABASE_SERVICE_ROLE_KEY`

4. **Save these values** in a text file temporarily:
   ```
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Step 4: Run the Database Schema

1. In the left sidebar, click **"SQL Editor"** (database icon)
2. Click **"New query"** button (top right)
3. Open the file `server/supabase/schema.sql` from your project
4. **Copy the entire contents** of that file
5. **Paste** it into the SQL Editor in Supabase
6. Click **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
7. You should see:
   - ✅ **"Success. No rows returned"** message
   - If you see errors, check the error message and verify the SQL syntax

---

## Step 5: Verify Tables Were Created

1. In the left sidebar, click **"Table Editor"** (table icon)
2. You should see **4 tables**:
   - ✅ `users`
   - ✅ `questions`
   - ✅ `quiz_sessions`
   - ✅ `answers`
3. If tables are missing, go back to Step 4 and run the schema again

---

## Step 6: Configure Environment Variables

1. In your project folder, navigate to `server/` directory
2. Create a file named `.env` (if it doesn't exist)
3. Open `.env` in a text editor
4. Add these lines (replace with YOUR values from Step 3):

```env
PORT=5000
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

5. **Replace the values:**
   - `SUPABASE_URL` → Your Project URL from Step 3
   - `SUPABASE_SERVICE_ROLE_KEY` → Your service_role key from Step 3
   - `SUPABASE_ANON_KEY` → Your anon key from Step 3
   - `JWT_SECRET` → Any random string (e.g., `my-secret-key-12345`)
   - `SMTP_USER` and `SMTP_PASS` → Your email credentials (for OTP)

6. **Save the file**

---

## Step 7: Install Dependencies

1. Open terminal/command prompt
2. Navigate to your project root:
   ```bash
   cd voiceitquiz
   ```
3. Install all dependencies:
   ```bash
   npm run install:all
   ```
   Or install separately:
   ```bash
   npm install
   cd server
   npm install
   cd ../client
   npm install
   ```

---

## Step 8: Test the Connection

1. Navigate to server directory:
   ```bash
   cd server
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
3. You should see:
   ```
   Connected to Supabase
   Server running on port 5000
   ```
4. If you see connection errors:
   - Double-check your `.env` file values
   - Verify Supabase project is active
   - Check your internet connection

---

## Step 9: Seed Sample Data (Optional)

1. In the `server` directory, run:
   ```bash
   npm run seed
   ```
2. You should see:
   ```
   Connected to Supabase
   Seeded 2 sample questions
   ```
3. Verify in Supabase:
   - Go to **Table Editor** → `questions` table
   - You should see 2 questions

---

## Step 10: Create Admin User

1. In the `server` directory, run:
   ```bash
   npm run create-admin your-email@example.com your-password "Admin Name"
   ```
   Replace:
   - `your-email@example.com` → Your email
   - `your-password` → A password for admin login
   - `Admin Name` → Your name (optional)

2. You should see:
   ```
   Connected to Supabase
   Created admin user: your-email@example.com
   ```

---

## Step 11: Start the Application

1. From project root, run:
   ```bash
   npm run dev
   ```
   This starts both server and client

2. Or run separately:
   ```bash
   # Terminal 1 - Server
   npm run dev:server

   # Terminal 2 - Client
   npm run dev:client
   ```

3. Open browser:
   - Frontend: **http://localhost:3000**
   - Backend API: **http://localhost:5000/api**

---

## ✅ Verification Checklist

- [ ] Supabase account created
- [ ] Project created and active
- [ ] API keys copied to `.env` file
- [ ] Database schema executed successfully
- [ ] All 4 tables visible in Table Editor
- [ ] Server connects to Supabase (no errors)
- [ ] Sample questions seeded (optional)
- [ ] Admin user created
- [ ] Application starts without errors

---

## 🆘 Troubleshooting

### "relation does not exist" error
**Solution:** Run the schema.sql script again in SQL Editor

### Connection timeout
**Solution:** 
- Check `SUPABASE_URL` is correct
- Verify project is active in dashboard
- Check internet connection

### "Invalid API key" error
**Solution:**
- Verify keys are copied correctly (no extra spaces)
- Check you're using the right key (service_role for backend)
- Regenerate keys in Supabase if needed

### Tables not showing
**Solution:**
- Refresh the Table Editor page
- Check SQL Editor for any error messages
- Verify schema.sql ran completely

### Can't find SQL Editor
**Solution:**
- Look in left sidebar for "SQL Editor" or "Database" section
- Make sure you're in the correct project

### Forgot database password
**Solution:**
- Go to Settings → Database
- You can reset it, but you'll need to update connection strings

---

## 📚 Additional Resources

- Supabase Docs: https://supabase.com/docs
- Supabase Dashboard: https://app.supabase.com
- SQL Editor Guide: https://supabase.com/docs/guides/database/tables

---

## 🎉 You're All Set!

Your Supabase database is now configured and ready to use with VoiceItQuiz!

Next steps:
1. Start the application
2. Login as admin
3. Add questions via admin dashboard
4. Test the quiz functionality

