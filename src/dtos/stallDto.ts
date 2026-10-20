import { z } from 'zod';
import { coercedInt, optionalString, requiredString } from './helpers.ts';

export const stallQuerySchema = z.object({
  search: optionalString('search').trim().max(100, 'search maksimal 100 karakter').optional(),
  category: optionalString('category').trim().max(50, 'category maksimal 50 karakter').optional(),
  page: coercedInt('page').min(1, 'page minimal 1').default(1),
  limit: coercedInt('limit')
    .min(1, 'limit minimal 1')
    .max(100, 'limit maksimal 100')
    .default(10),
});

export const createStallSchema = z.object({
  name: requiredString('name')
    .trim()
    .min(3, 'name minimal 3 karakter')
    .max(100, 'name maksimal 100 karakter'),
  category: optionalString('category').trim().max(50, 'category maksimal 50 karakter').optional(),
  location: optionalString('location').max(100, 'location maksimal 100 karakter').optional(),
  description: optionalString('description')
    .max(1000, 'description maksimal 1000 karakter')
    .optional(),
});

export const updateStallSchema = createStallSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'minimal satu field harus diisi',
  });

export type StallQueryInput = z.infer<typeof stallQuerySchema>;
export type CreateStallInput = z.infer<typeof createStallSchema>;
export type UpdateStallInput = z.infer<typeof updateStallSchema>;

export interface StallResponseDto {
  id: number;
  ownerId: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  isPopular: boolean;
}

export interface MenuItemDto {
  id: number;
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}