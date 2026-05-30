import crypto from 'crypto';

export function generateSecureOTP(length = 6) {
  const otp = crypto
    .randomInt(0, 10 ** length)
    .toString()
    .padStart(length, '0');
  return otp;
}
