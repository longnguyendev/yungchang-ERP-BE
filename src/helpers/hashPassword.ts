import { SALT_OR_ROUNDS } from '@/constants';
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_OR_ROUNDS);
};
