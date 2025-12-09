import dotenv from 'dotenv';
import { supabase } from '../db/supabase.js';

dotenv.config();

const sampleQuestions = [
  {
    question_number: 1,
    translations: [
      {
        language: 'en',
        questionText: 'What is the capital of India?',
        options: [
          { text: 'Mumbai', isCorrect: false },
          { text: 'New Delhi', isCorrect: true },
          { text: 'Kolkata', isCorrect: false },
          { text: 'Chennai', isCorrect: false }
        ]
      },
      {
        language: 'hi',
        questionText: 'भारत की राजधानी क्या है?',
        options: [
          { text: 'मुंबई', isCorrect: false },
          { text: 'नई दिल्ली', isCorrect: true },
          { text: 'कोलकाता', isCorrect: false },
          { text: 'चेन्नई', isCorrect: false }
        ]
      }
    ],
    points: 4,
    negative_points: 1
  },
  {
    question_number: 2,
    translations: [
      {
        language: 'en',
        questionText: 'What is 2 + 2?',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false }
        ]
      },
      {
        language: 'hi',
        questionText: '2 + 2 क्या है?',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false }
        ]
      }
    ],
    points: 4,
    negative_points: 1
  }
];

async function seedQuestions() {
  try {
    console.log('Connected to Supabase');

    // Clear existing questions
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.log('Note: Could not clear existing questions (may not exist yet)');
    } else {
      console.log('Cleared existing questions');
    }

    // Insert sample questions
    for (const q of sampleQuestions) {
      const { error } = await supabase
        .from('questions')
        .upsert(q, { onConflict: 'question_number' });

      if (error) {
        console.error(`Error inserting question ${q.question_number}:`, error);
      }
    }

    console.log(`Seeded ${sampleQuestions.length} sample questions`);
    console.log('Note: You need to add 48 more questions to reach 50 total questions');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
}

seedQuestions();
