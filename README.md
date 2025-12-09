# VoiceItQuiz - Multi-Language Quiz Platform

A scalable, high-performance quiz website designed for up to 200 students to log in simultaneously and attempt a 50-question test with real-time leaderboard, multi-language support, and comprehensive analytics.

## Features

### Core Features
- ✅ **User Authentication**: Email + OTP or password login
- ✅ **Multi-Language Support**: Switch between languages (English, Hindi, Tamil, Telugu, Kannada) instantly
- ✅ **One Question at a Time**: Strict one-way flow with auto-save
- ✅ **Dual Timers**: Per-question timer + overall test timer
- ✅ **Smart Scoring**: Accuracy score + speed bonus
  - Correct answer: +4 points
  - Wrong answer: -1 point
  - Speed bonus: Up to +1 point for fast answers
- ✅ **Real-time Leaderboard**: Updates instantly via WebSocket
- ✅ **Result Summary**: Detailed analytics with downloadable report
- ✅ **Admin Dashboard**: Upload questions, view analytics, monitor online users

### Performance
- Optimized for 200 concurrent users
- Real-time updates via Socket.io
- Efficient database queries with MongoDB
- Responsive design for mobile and desktop

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- Socket.io for real-time updates
- JWT authentication
- Nodemailer for OTP emails

### Frontend
- React + TypeScript
- Vite for fast development
- Zustand for state management
- Socket.io-client for real-time updates
- React Router for navigation

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Email service credentials (for OTP)

### Installation

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up Supabase:**
   - Create a project at https://supabase.com
   - Go to Project Settings > API
   - Copy your Project URL and API keys (anon key and service_role key)
   - Go to SQL Editor and run the schema from `server/supabase/schema.sql`

3. **Configure environment variables:**
   
   Create `server/.env` file:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:3000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Run the application:**
   ```bash
   # Development mode (runs both server and client)
   npm run dev

   # Or run separately:
   npm run dev:server  # Backend on port 5000
   npm run dev:client  # Frontend on port 3000
   ```

5. **Seed sample questions (optional):**
   ```bash
   cd server
   npm run seed
   ```
   Note: This seeds 2 sample questions. You'll need to add 48 more via the admin dashboard.

6. **Create an admin user:**
   - Register a user normally
   - In MongoDB, update the user's role to 'admin':
   ```javascript
   db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "admin" } })
   ```

7. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Usage

### Student Flow
1. Register/Login (Email+OTP or Password)
2. Start quiz - redirected to quiz dashboard
3. Answer questions one at a time (auto-saved)
4. Switch languages anytime without losing progress
5. View real-time leaderboard
6. Complete quiz and view detailed results
7. Download report

### Admin Flow
1. Login as admin
2. Access admin dashboard at `/admin`
3. Upload questions in multiple languages
4. View analytics and leaderboard
5. Monitor online users (up to 200 concurrent)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with password
- `POST /api/auth/request-otp` - Request OTP
- `POST /api/auth/login-otp` - Login with OTP
- `GET /api/auth/me` - Get current user

### Quiz
- `POST /api/quiz/start` - Start quiz session
- `GET /api/quiz/current` - Get current question
- `POST /api/quiz/answer` - Submit answer
- `PUT /api/quiz/language` - Update language
- `GET /api/quiz/results` - Get results

### Admin
- `POST /api/admin/questions` - Upload question
- `GET /api/admin/questions` - Get all questions
- `GET /api/admin/leaderboard` - Get leaderboard
- `GET /api/admin/online-users` - Get online users
- `GET /api/admin/analytics` - Get analytics

## Scoring Formula

```
Total Points = Accuracy Score + Speed Bonus

Accuracy Score:
- Correct: +4 points
- Wrong: -1 point

Speed Bonus (only for correct answers):
- ≤10 seconds: +1.0 point
- 10-20 seconds: +0.5 point
- 20-30 seconds: +0.25 point
- >30 seconds: 0 points
```

## Project Structure

```
voiceitquiz/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   └── api/           # API client
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── socket/        # Socket.io setup
│   │   └── utils/         # Utility functions
│   └── package.json
└── package.json           # Root package.json
```

## Performance Optimizations

- Database indexing on frequently queried fields
- Efficient WebSocket broadcasting
- Client-side state management to reduce API calls
- Optimized React rendering with proper key usage
- Connection pooling for MongoDB

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- OTP expiration (10 minutes)
- Rate limiting on authentication endpoints
- Input validation and sanitization
- CORS configuration

## Future Enhancements

- [ ] Question categories and tags
- [ ] Time-based question difficulty
- [ ] Advanced analytics with charts
- [ ] Export leaderboard to CSV
- [ ] Question bank management
- [ ] Custom quiz creation
- [ ] Social features (share results)

## License

MIT

## Support

For issues and questions, please open an issue on the repository.

# voicequiz
