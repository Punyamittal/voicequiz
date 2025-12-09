-- Migration to fix question_number unique constraint issue
-- Run this in Supabase SQL Editor if you're getting duplicate key errors

-- Step 1: Drop the unique constraint on question_number if it exists
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_question_number_key;

-- Step 2: Make question_number nullable (optional, for backward compatibility)
-- This allows questions to be inserted even if question_number conflicts
ALTER TABLE questions ALTER COLUMN question_number DROP NOT NULL;

-- Step 3: Add a unique constraint on (quiz_id, quiz_question_number) instead
-- This ensures questions are unique per quiz, not globally
CREATE UNIQUE INDEX IF NOT EXISTS idx_questions_quiz_question_unique 
ON questions(quiz_id, quiz_question_number) 
WHERE quiz_id IS NOT NULL AND quiz_question_number IS NOT NULL;

-- Note: question_number is now a legacy field and can be null or have duplicates
-- The system now uses quiz_question_number per quiz_id as the primary identifier

