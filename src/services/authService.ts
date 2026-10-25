import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/userRepository.ts';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { AppError } from '../errors/AppError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { signToken } from './tokenService.ts';
import type { LoginInput, RegisterInput } from '../schemas/authSchema.ts';

export class AuthService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  async register(input: RegisterInput) {
    const sudahAda = await this.userRepository.findByEmail(input.email);
    if (sudahAda) throw new AppError(409, 'Email sudah terdaftar');

    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const passwordHash = await bcrypt.hash(input.password, rounds);

    const row = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'customer',
    });
    if (!row) throw new Error('Gagal membuat user');

    return { id: row.id, name: row.name, email: row.email, role: row.role };
  }

  async login(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    // Pesan sengaja sama untuk email salah dan password salah
    const cocok = user ? await bcrypt.compare(input.password, user.passwordHash) : false;
    if (!user || !cocok) throw new UnauthorizedError('Email atau password salah');

    const token = signToken({ userId: user.id, role: user.role });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User tidak ditemukan');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}