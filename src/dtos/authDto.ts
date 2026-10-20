import { z } from 'zod';
import { emailField, requiredString } from './helpers.ts';

export const registerSchema = z.object({
  name: requiredString('name')
    .trim()
    .min(3, 'name minimal 3 karakter')
    .max(100, 'name maksimal 100 karakter'),
  email: emailField(150),
  password: requiredString('password')
    .min(8, 'password minimal 8 karakter')
    .max(72, 'password maksimal 72 karakter'),
});

export const loginSchema = z.object({
  email: emailField(),
  password: requiredString('password').min(1, 'password wajib diisi'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;