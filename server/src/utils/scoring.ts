export const calculateSpeedBonus = (timeTaken: number, maxTime: number = 60): number => {
  // Speed bonus: faster answers get more bonus
  // If answered in less than 10 seconds, get 1 point bonus
  // If answered in 10-20 seconds, get 0.5 point bonus
  // If answered in 20-30 seconds, get 0.25 point bonus
  // No bonus for answers taking more than 30 seconds
  
  if (timeTaken <= 10) return 1.0;
  if (timeTaken <= 20) return 0.5;
  if (timeTaken <= 30) return 0.25;
  return 0;
};

export const calculatePoints = (
  isCorrect: boolean,
  timeTaken: number,
  basePoints: number = 4,
  negativePoints: number = 1
): { points: number; speedBonus: number; totalPoints: number } => {
  const speedBonus = isCorrect ? calculateSpeedBonus(timeTaken) : 0;
  const points = isCorrect ? basePoints : -negativePoints;
  const totalPoints = points + speedBonus;
  
  return { points, speedBonus, totalPoints };
};

