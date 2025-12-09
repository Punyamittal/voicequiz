-- Migration to add total_questions column to quiz_sessions table
-- Run this in Supabase SQL Editor if you're getting the "total_questions column not found" error

-- Add total_questions column if it doesn't exist
ALTER TABLE quiz_sessions 
ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 50;

-- Update existing sessions that have null total_questions
-- Get the total_questions from the associated quiz
UPDATE quiz_sessions
SET total_questions = (
  SELECT total_questions 
  FROM quizzes 
  WHERE quizzes.id = quiz_sessions.quiz_id
)
WHERE total_questions IS NULL AND quiz_id IS NOT NULL;

-- Set default for any remaining null values
UPDATE quiz_sessions
SET total_questions = 50
WHERE total_questions IS NULL;

