# Fix Your Supabase URL

## The Problem

Your MCP config shows the correct project ID: `yztoryjecznjcgvncxfa`

But your `.env` file likely has: `yztoryjezznjcgvncxfa` (wrong - extra 'z')

## The Fix

Update your `server/.env` file:

**Change from:**
```env
SUPABASE_URL=https://yztoryjezznjcgvncxfa.supabase.co
```

**To:**
```env
SUPABASE_URL=https://yztoryjecznjcgvncxfa.supabase.co
```

Notice the difference:
- ❌ Wrong: `yztoryjezznjcgvncxfa` (double 'z')
- ✅ Correct: `yztoryjecznjcgvncxfa` (single 'z', 'c' instead of 'zz')

## After Updating

1. Save the `.env` file
2. Test the connection:
   ```bash
   cd server
   npm run test-connection
   ```

You should now see: ✅ Connection successful!

## Verify in Browser

Test if the correct URL works:
```
https://yztoryjecznjcgvncxfa.supabase.co/rest/v1/
```

If you see a response (even an error), it means the URL is correct!

