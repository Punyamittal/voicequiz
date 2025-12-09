-- Additional schema for quiz management
-- Run this AFTER the main schema.sql

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

-- Update answers to include quiz_id for better querying
ALTER TABLE answers ADD COLUMN IF NOT EXISTS quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_answers_quiz ON answers(quiz_id);

-- Trigger for quizzes updated_at
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

