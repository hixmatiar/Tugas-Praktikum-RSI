import { and, count, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes } from '../db/schema.ts';

export interface CreateLikeInput {
  reviewId: number;
  userId: number;
}

export class LikeRepository {
  async findByReviewAndUser(reviewId: number, userId: number) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(likes)
      .where(and(eq(likes.reviewId, reviewId), eq(likes.userId, userId)));
    return rows[0];
  }

  async create(input: CreateLikeInput) {
    const db = await getDb();
    const rows = await db
      .insert(likes)
      .output()
      .values({
        reviewId: input.reviewId,
        userId: input.userId,
      });
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(likes).where(eq(likes.id, id)).output();
    return rows[0];
  }

  async countByReviewId(reviewId: number) {
    const db = await getDb();
    const result = await db
      .select({ total: count() })
      .from(likes)
      .where(eq(likes.reviewId, reviewId));
    return Number(result[0]?.total ?? 0);
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(likes).where(eq(likes.id, id));
    return rows[0];
  }
}