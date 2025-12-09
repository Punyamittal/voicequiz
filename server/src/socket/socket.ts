import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { supabase } from '../db/supabase.js';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketIO = (io: Server) => {
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    console.log('User connected:', socket.userId);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });

    // Join user's room for personalized updates
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Broadcast leaderboard updates
    socket.on('request-leaderboard', async () => {
      await broadcastLeaderboard(io);
    });
  });

  // Periodically update leaderboard
  setInterval(async () => {
    await broadcastLeaderboard(io);
  }, 5000); // Update every 5 seconds
};

const broadcastLeaderboard = async (io: Server) => {
  try {
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('is_completed', true)
      .order('total_score', { ascending: false })
      .order('accuracy', { ascending: false })
      .limit(200);

    if (sessionsError) {
      // Only log if it's not a connection/table error
      if (sessionsError.code !== 'PGRST116' && !sessionsError.message?.includes('fetch failed')) {
        console.error('Error fetching leaderboard:', sessionsError.message);
      }
      return;
    }

    if (!sessions || sessions.length === 0) {
      io.emit('leaderboard-update', { leaderboard: [] });
      return;
    }

    // Get all user IDs
    const userIds = [...new Set(sessions.map((s: any) => s.user_id))];
    
    // Fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', userIds);

    if (usersError) {
      if (usersError.code !== 'PGRST116' && !usersError.message?.includes('fetch failed')) {
        console.error('Error fetching users:', usersError.message);
      }
      return;
    }

    // Create user map
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const leaderboard = sessions.map((session: any, index: number) => {
      const user = userMap.get(session.user_id);
      return {
        rank: index + 1,
        name: user?.name || 'Unknown',
        email: user?.email || 'Unknown',
        totalScore: parseFloat(session.total_score.toString()),
        accuracy: parseFloat(session.accuracy.toString()),
        averageSpeed: parseFloat(session.average_speed.toString()),
        totalCorrect: session.total_correct,
        totalWrong: session.total_wrong
      };
    });

    io.emit('leaderboard-update', { leaderboard });
  } catch (error) {
    console.error('Error broadcasting leaderboard:', error);
  }
};
