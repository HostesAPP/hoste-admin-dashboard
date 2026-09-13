import { findUserByEmail, createUser } from '../repositories/userRepository';

export class AuthService {
  static async register(email: string, passwordHash: string, role: string = 'admin') {
    const existing = await findUserByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }
    return createUser(email, passwordHash, role);
  }

  static async validateUser(email: string) {
    return findUserByEmail(email);
  }
}

export default AuthService;
