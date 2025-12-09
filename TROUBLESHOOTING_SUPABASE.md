# Troubleshooting Supabase Connection Errors

## Error: "TypeError: fetch failed"

This error means your server cannot reach Supabase. Here's how to fix it:

### ✅ Step 1: Verify Your .env File

Make sure your `.env` file in the `server/` directory has:

```env
SUPABASE_URL=https://yztoryjezznjcgvncxfa.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

**Check:**
- ✅ URL starts with `https://`
- ✅ No extra spaces or quotes
- ✅ Keys are complete (not truncated)

### ✅ Step 2: Verify Supabase Project Status

1. Go to https://app.supabase.com
2. Check if your project shows as **"Active"** (not paused)
3. If paused, click **"Restore"** to activate it

### ✅ Step 3: Verify Internet Connection

- Check if you can access https://supabase.com in your browser
- Try pinging: `ping yztoryjezznjcgvncxfa.supabase.co` (replace with your project)

### ✅ Step 4: Check Firewall/Proxy

If you're behind a corporate firewall or proxy:
- Add Supabase domains to allowlist
- Configure proxy settings if needed

### ✅ Step 5: Verify API Keys

1. Go to Supabase Dashboard → Settings → API
2. Verify:
   - **Project URL** matches your `SUPABASE_URL`
   - **service_role key** matches your `SUPABASE_SERVICE_ROLE_KEY`
   - Keys haven't been rotated/changed

### ✅ Step 6: Test Connection Manually

Try this in a new terminal:

```bash
# Test if you can reach Supabase
curl https://yztoryjezznjcgvncxfa.supabase.co/rest/v1/
```

If this fails, it's a network/connectivity issue.

### ✅ Step 7: Check Node.js Version

Make sure you're using Node.js 18+:
```bash
node --version
```

### ✅ Step 8: Try Using Service Role Key

The code prefers `SUPABASE_SERVICE_ROLE_KEY` over `SUPABASE_ANON_KEY`. Make sure you have:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Not just the anon key.

## Common Issues

### Issue: "relation does not exist"
**Solution:** Run the schema.sql in Supabase SQL Editor

### Issue: "Invalid API key"
**Solution:** Regenerate keys in Supabase Dashboard → Settings → API

### Issue: Project paused
**Solution:** Go to Supabase Dashboard and restore/activate project

### Issue: Wrong URL format
**Solution:** URL must be: `https://project-id.supabase.co` (no trailing slash)

## Quick Fix Checklist

- [ ] `.env` file is in `server/` directory (not root)
- [ ] `SUPABASE_URL` starts with `https://`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)
- [ ] No extra spaces/quotes in .env values
- [ ] Supabase project is active (not paused)
- [ ] Internet connection is working
- [ ] Node.js version is 18+

## Still Not Working?

1. **Check Supabase Status**: https://status.supabase.com
2. **Check Supabase Logs**: Dashboard → Logs → API Logs
3. **Try creating a new Supabase project** (if current one has issues)
4. **Check Windows Firewall** (if on Windows)

