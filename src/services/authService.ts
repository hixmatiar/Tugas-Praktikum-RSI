import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository.ts';
import { UserService } from './userService.ts';
import { signToken } from '../middleware/auth.ts';
import { BCRYPT_COST } from '../utils/password.ts';
import type { LoginInput, RegisterInput } from '../dtos/authDto.ts';
import type { UserResponseDto } from '../dtos/userDto.ts';

const DUMMY_HASH = bcrypt.hashSync('dummy-password', BCRYPT_COST);

export class AuthService {
  private userService: UserService;
  private userRepository: UserRepository;

  constructor(
    userService: UserService = new UserService(),
    userRepository: UserRepository = new UserRepository(),
  ) {
    this.userService = userService;
    this.userRepository = userRepository;
  }

  async register(input: RegisterInput): Promise<UserResponseDto> {
    return this.userService.createUser({ ...input, role: 'customer' });
  }

  async login(input: LoginInput): Promise<{ token: string; user: UserResponseDto }> {
    const user = await this.userRepository.findByEmail(input.email);
    const passwordMatch = await bcrypt.compare(input.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !passwordMatch) throw new Error('INVALID_CREDENTIALS');

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return { token, user: this.userService.toDto(user) };
  }

  async me(userId: number): Promise<UserResponseDto> {
    return this.userService.getUserById(userId);
  }
}