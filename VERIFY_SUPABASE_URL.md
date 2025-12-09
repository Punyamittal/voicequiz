# Verify Your Supabase URL

The error "No such host is known" means the URL `yztoryjezznjcgvncxfa.supabase.co` doesn't exist.

## This Could Mean:

1. **Wrong Project ID** - The URL might be incorrect
2. **Project Deleted** - The project might have been deleted
3. **Project Paused** - Project might be paused (but this usually still resolves DNS)
4. **Typo in URL** - There might be a typo

## How to Get the Correct URL:

### Step 1: Go to Supabase Dashboard
1. Open https://app.supabase.com
2. Log in to your account

### Step 2: Find Your Project
1. Look at your project list
2. Find the project you want to use
3. Click on it to open

### Step 3: Get the Correct URL
1. Click **Settings** (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. Look for **"Project URL"** or **"Config"** section
4. You'll see something like:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
5. **Copy this EXACT URL**

### Step 4: Update Your .env File
1. Open `server/.env`
2. Replace the `SUPABASE_URL` with the correct one:
   ```env
   SUPABASE_URL=https://your-actual-project-id.supabase.co
   ```
3. Make sure there are:
   - No extra spaces
   - No trailing slash
   - Starts with `https://`

## If You Don't Have a Project:

### Create a New Supabase Project:
1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name**: voiceitquiz (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup
6. Then get the URL from Settings → API

## Test the Correct URL:

Once you have the correct URL, test it:

```powershell
# Replace with your actual URL
Invoke-WebRequest -Uri "https://your-actual-project-id.supabase.co/rest/v1/" -Method GET
```

If it works, you'll see a response (even if it's an error, that's fine - it means the server is reachable).

## Common Mistakes:

❌ Wrong: `https://yztoryjezznjcgvncxfa.supabase.co/` (trailing slash)
✅ Correct: `https://yztoryjezznjcgvncxfa.supabase.co`

❌ Wrong: `yztoryjezznjcgvncxfa.supabase.co` (missing https://)
✅ Correct: `https://yztoryjezznjcgvncxfa.supabase.co`

❌ Wrong: Copying from wrong place
✅ Correct: Get from Settings → API → Project URL

