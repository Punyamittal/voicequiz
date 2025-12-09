# Fix: Quizzes Table Missing

## Error
```
Could not find the table 'public.quizzes' in the schema cache
```

## Solution

The `quizzes` table hasn't been created in your Supabase database yet. Follow these steps:

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Complete Schema

1. Open the file: `server/supabase/COMPLETE_SCHEMA.sql`
2. Copy **ALL** the SQL code from that file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Tables Created

After running, you should see:
- ✅ `users` table
- ✅ `quizzes` table (NEW - this was missing!)
- ✅ `questions` table
- ✅ `quiz_sessions` table
- ✅ `answers` table

### Step 4: Test

1. Restart your server if it's running
2. Try creating a quiz again in the admin dashboard

## Alternative: Run Only Quizzes Schema

If you've already run the main schema, you can just run the quizzes additions:

1. Open `server/supabase/schema_quizzes.sql`
2. Copy and paste into Supabase SQL Editor
3. Run it

## Quick Copy-Paste SQL

If you want to quickly create just the quizzes table:

```sql
-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_questions INTEGER NOT NULL DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_active ON quizzes(is_active);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);

-- Update questions table to link to quizzes
ALTER TABLE questions ADD COLUMN IF NOT EXISTS quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS quiz_question_number INTEGER;

CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_number ON questions(quiz_id, quiz_question_number);

-- Update quiz_sessions to link to quizzes
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz ON quiz_sessions(quiz_id);

-- Update answers to include quiz_id
ALTER TABLE answers ADD COLUMN IF NOT EXISTS quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_answers_quiz ON answers(quiz_id);

-- Function for updated_at (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for quizzes updated_at
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## After Running

1. The error should be resolved
2. You can now create quizzes in the admin dashboard
3. Questions can be linked to specific quizzes

