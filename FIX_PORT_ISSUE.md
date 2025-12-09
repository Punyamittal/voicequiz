# Fix Port 5000 Already in Use

## Quick Fix: Kill Process on Port 5000

### Option 1: Find and Kill the Process (Windows)

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# You'll see something like:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
# The last number (12345) is the Process ID (PID)

# Kill the process (replace 12345 with your actual PID)
taskkill /PID 12345 /F
```

### Option 2: Kill All Node Processes (Quick but aggressive)

```powershell
taskkill /IM node.exe /F
```

### Option 3: Use a Different Port

Change your `.env` file:
```env
PORT=5001
```

Then update `client/vite.config.ts` proxy to point to port 5001.

## After Fixing

1. Kill the process on port 5000
2. Make sure your `.env` has the correct SUPABASE_URL
3. Run `npm run dev` again

