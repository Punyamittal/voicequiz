# Setup Admin and Quiz Creation

## Step 1: Create Default Admin User

Run this command to create the default admin:

```bash
cd server
npm run create-default-admin
```

This creates:
- **Email**: `admin@admin.com`
- **Password**: `1234`
- **Role**: `admin`

## Step 2: Run Database Schema Updates

1. Go to Supabase Dashboard → SQL Editor
2. Run the main schema: Copy and paste `server/supabase/schema.sql`
3. Run the quiz schema: Copy and paste `server/supabase/schema_quizzes.sql`

This adds:
- `quizzes` table
- Links questions to quizzes
- Links quiz_sessions to quizzes

## Step 3: Login as Admin

1. Start the application: `npm run dev`
2. Go to http://localhost:3000
3. Login with:
   - Email: `admin@admin.com`
   - Password: `1234`
4. You'll be redirected to `/quizzes` (quiz selection)
5. Go to `/admin` to access admin dashboard

## Step 4: Create Your First Quiz

1. In Admin Dashboard, click **"Quizzes"** tab
2. Fill in:
   - **Quiz Title**: e.g., "General Knowledge Quiz"
   - **Description**: e.g., "Test your knowledge"
   - **Total Questions**: e.g., 50
3. Click **"Create Quiz"**
4. The quiz will appear in the list

## Step 5: Add Questions to Quiz

1. Click **"Questions"** tab
2. Select a quiz from the list
3. Fill in question details:
   - **Question Number**: 1, 2, 3, etc.
   - **Language**: Select language
   - **Question Text**: Enter the question
   - **Options**: Enter 4 options, mark one as correct
   - **Points**: +4 for correct (default)
   - **Negative Points**: -1 for wrong (default)
4. Click **"Save Question"**
5. Repeat for all questions

## Step 6: Students Can Now Take Quiz

1. Students login normally
2. They see all active quizzes on `/quizzes` page
3. They select a quiz and click "Start Quiz"
4. Quiz begins with questions you created

## Features

✅ **Admin can:**
- Create multiple quizzes
- Add questions to each quiz
- View all quizzes
- Manage quiz settings (active/inactive)
- View analytics and leaderboard

✅ **Students can:**
- See all available quizzes
- Select and start any quiz
- Take quiz with questions admin created
- View results and leaderboard

## Notes

- Questions are linked to specific quizzes
- Each quiz can have different number of questions
- Admin can create unlimited quizzes
- Students see only active quizzes
- All existing features (multi-language, leaderboard, etc.) work with quizzes

