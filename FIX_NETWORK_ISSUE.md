# Fix Network Connection Issue

Your environment variables are correct, but Node.js cannot reach Supabase. Here's how to fix it:

## Quick Fixes (Try These First)

### 1. Check Supabase Project Status
1. Go to https://app.supabase.com
2. Find your project: `yztoryjezznjcgvncxfa`
3. Check if it shows **"Active"** or **"Paused"**
4. If paused, click **"Restore"** to activate it

### 2. Test in Browser
Open this URL in your browser:
```
https://yztoryjezznjcgvncxfa.supabase.co/rest/v1/
```

If you see JSON or an error (not "cannot reach"), the server is working.

### 3. Windows Firewall Fix

**Option A: Allow Node.js through Firewall**
1. Open Windows Security → Firewall & network protection
2. Click "Allow an app through firewall"
3. Find "Node.js" or "node.exe"
4. Check both "Private" and "Public"
5. If not found, click "Allow another app" → Browse → Find `node.exe` in your Node.js installation

**Option B: Temporarily Disable Firewall (Test Only)**
1. Windows Security → Firewall & network protection
2. Turn off firewall temporarily
3. Test connection: `npm run test-connection`
4. If it works, re-enable firewall and add Node.js exception

### 4. Antivirus Check
- Temporarily disable antivirus
- Test connection again
- If it works, add Node.js to antivirus exceptions

### 5. Run Advanced Network Test

```bash
cd server
npm run test-network
```

This will give more detailed diagnostics.

## Alternative: Use Different Network

If you're on a corporate network:
1. Try using mobile hotspot
2. Or use a VPN
3. Corporate firewalls often block outbound connections

## Verify Supabase URL

Double-check your Supabase URL is correct:
1. Go to Supabase Dashboard
2. Settings → API
3. Copy the **exact** Project URL
4. Make sure it matches: `https://yztoryjezznjcgvncxfa.supabase.co`

## Test with curl (if available)

```powershell
curl https://yztoryjezznjcgvncxfa.supabase.co/rest/v1/
```

If curl works but Node.js doesn't, it's a Node.js/firewall issue.

## Check Node.js Version

```bash
node --version
```

Should be Node.js 18+. If older, update Node.js.

## Last Resort: Use Supabase Local Development

If network issues persist, you could:
1. Use Supabase CLI for local development
2. Or use a different Supabase project in a different region

## Most Common Solution

**90% of the time, it's Windows Firewall blocking Node.js.**

1. Allow Node.js through Windows Firewall
2. Restart your terminal
3. Run `npm run test-connection` again

Let me know which step fixes it!

