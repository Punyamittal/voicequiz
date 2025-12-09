# Quick Start: Admin Access & Quiz Creation

## 🚀 Quick Setup (3 Steps)

### 1. Create Admin User
```bash
cd server
npm run create-default-admin
```

**Login Credentials:**
- Email: `admin@admin.com`
- Password: `1234`

### 2. Update Database Schema
Go to Supabase SQL Editor and run:
- `server/supabase/schema.sql` (if not already run)
- `server/supabase/schema_quizzes.sql` (NEW - adds quiz support)

### 3. Start Application
```bash
npm run dev
```

## 📝 How to Use

### As Admin:
1. Login with `admin@admin.com` / `1234`
2. Go to `/admin` (or click admin link)
3. **Create Quiz:**
   - Click "Quizzes" tab
   - Fill in title, description, total questions
   - Click "Create Quiz"
4. **Add Questions:**
   - Click "Questions" tab
   - Select a quiz
   - Fill in question details
   - Add multiple language translations
   - Click "Save Question"
   - Repeat for all questions

### As Student:
1. Login/Register normally
2. See all available quizzes on `/quizzes` page
3. Click "Start Quiz" on any quiz
4. Take the quiz with questions admin created

## ✅ What's New

- ✅ Default admin user (admin@admin.com / 1234)
- ✅ Quiz creation form in admin dashboard
- ✅ Question management linked to quizzes
- ✅ Quiz selection page for students
- ✅ Multiple quizzes support
- ✅ All existing features work with quizzes

## 🎯 Features

**Admin Dashboard:**
- Create unlimited quizzes
- Add questions with multi-language support
- View all quizzes
- Manage quiz settings
- View analytics and leaderboard

**Student Experience:**
- Browse available quizzes
- Select and start any quiz
- Take quiz with admin-created questions
- View results and leaderboard

