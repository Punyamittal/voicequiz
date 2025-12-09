-- Migration to remove UNIQUE constraint on user_id in quiz_sessions
-- This allows users to have multiple quiz sessions (for different quizzes or retakes)
-- Run this in Supabase SQL Editor

-- Drop the unique constraint on user_id if it exists
ALTER TABLE quiz_sessions 
DROP CONSTRAINT IF EXISTS quiz_sessions_user_id_key;

-- Note: Users can now have multiple quiz sessions
-- The system should check for incomplete sessions per quiz_id, not just per user_id

