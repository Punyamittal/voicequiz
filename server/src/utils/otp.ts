export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isOTPValid = (otpExpiry?: Date): boolean => {
  if (!otpExpiry) return false;
  return new Date() < otpExpiry;
};

