# Environment Variables Checklist

## ✅ Required Variables

Your `.env` file should be in the `server/` directory and contain:

```env
# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=your-anon-key-here

# JWT Secret (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 📋 Optional (but recommended)

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000
```

## ✅ What You Have

Based on your file, you have:
- ✅ `SUPABASE_ANON_KEY` (line 5)

## ❌ What You're Missing

You need to add:

1. **SUPABASE_URL** - Your Supabase project URL
   - Format: `https://xxxxxxxxxxxxx.supabase.co`
   - Find it in: Supabase Dashboard → Settings → API → Project URL

2. **SUPABASE_SERVICE_ROLE_KEY** - Your service role key (IMPORTANT!)
   - This is the "secret key" or "service API key" from Supabase
   - ⚠️ Keep this secret! Never expose in client code
   - Find it in: Supabase Dashboard → Settings → API → service_role key

3. **JWT_SECRET** - A random secret string for JWT tokens
   - Can be any random string: `my-secret-key-12345` or generate one
   - Used to sign authentication tokens

## 📝 Complete .env Example

```env
# Supabase
SUPABASE_URL=https://yztoryjezznjcgvncxfa.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6dG9yeWplY3puamNndm5jeGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDY4NjUsImV4cCI6MjA4MDc4Mjg2NX0.hsgTFL1ALem4IlvOs62YBK5iZS1XfQUjhGNFurZ1uyM

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional
PORT=5000
CLIENT_URL=http://localhost:3000
```

## 🔍 How to Find Missing Values

### SUPABASE_URL
1. Go to Supabase Dashboard
2. Click **Settings** (gear icon)
3. Click **API**
4. Look for **"Project URL"** or **"Config"** section
5. Copy the URL (starts with `https://`)

### SUPABASE_SERVICE_ROLE_KEY
1. Same page (Settings → API)
2. Find **"Project API keys"** section
3. Look for **"service_role"** or **"secret key"**
4. Click the eye icon to reveal
5. Click **"Copy"** button
6. ⚠️ This key has full database access - keep it secret!

### JWT_SECRET
- Can be any random string
- Example: `my-secret-key-12345`
- Or generate one: `openssl rand -base64 32`

## ✅ Verification

After adding all variables, test with:

```bash
cd server
npm run dev
```

You should see:
```
Connected to Supabase
Server running on port 5000
```

If you see errors about missing variables, double-check your `.env` file!

