import { UserRepository, type CreateUserInput, type FindAllParams } from '../repositories/userRepository.ts';
import type { UserResponseDto } from '../dtos/userDto.ts';

type UserRow = NonNullable<Awaited<ReturnType<UserRepository['findById']>>>;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  private toDto(row: UserRow): UserResponseDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt,
    };
  }

  async getAllUsers(params: FindAllParams) {
    const { rows, total } = await this.userRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async createUser(input: CreateUserInput): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new Error('EMAIL_EXISTS');

    const row = await this.userRepository.create(input);
    if (!row) throw new Error('USER_NOT_FOUND');
    return this.toDto(row);
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const row = await this.userRepository.findById(id);
    if (!row) throw new Error('USER_NOT_FOUND');
    return this.toDto(row);
  }
}