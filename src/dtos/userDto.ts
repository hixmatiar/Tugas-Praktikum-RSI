import { z } from 'zod';
import { registerSchema } from './authDto.ts';

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'customer';
  createdAt: Date | null;
}

export const createUserSchema = registerSchema.extend({
  role: z.enum(['admin', 'owner', 'customer'], {
    error: 'role harus salah satu dari admin, owner, customer',
  }),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;