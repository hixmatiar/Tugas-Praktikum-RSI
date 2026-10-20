import { z } from 'zod';
import { optionalString, requiredInt } from './helpers.ts';

export const createReviewSchema = z.object({
  rating: requiredInt('rating').min(1, 'rating minimal 1').max(5, 'rating maksimal 5'),
  comment: optionalString('comment').trim().max(1000, 'comment maksimal 1000 karakter').optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export interface ReviewResponseDto {
  id: number;
  stallId: number;
  userId: number;
  rating: number;
  comment: string | null;
  likeCount: number;
  createdAt: Date | null;
  userName: string | null;
}