import { and, count, eq, like, sql, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, stalls } from '../db/schema.ts';

export interface FindAllParams {
  stallId?: number;
  userId?: number;
  page: number;
  limit: number;
}

export interface CreateReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string | null;
}

export class ReviewRepository {
  async findAll(params: FindAllParams) {
    const db = await getDb();

    const conditions: SQL[] = [];
    if (params.stallId) conditions.push(eq(reviews.stallId, params.stallId));
    if (params.userId) conditions.push(eq(reviews.userId, params.userId));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select()
      .from(reviews)
      .where(where)
      .orderBy(reviews.id)
      .offset(offset)
      .$dynamic()
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(reviews).where(where);

    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(reviews).where(eq(reviews.id, id));
    return rows[0];
  }

  async create(input: CreateReviewInput) {
    const db = await getDb();
    const rows = await db
      .insert(reviews)
      .output()
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment ?? null,
        likeCount: 0,
      });
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
    return rows[0];
  }

  async recalculateStallRating(stallId: number) {
    const db = await getDb();

    const result = await db
      .select({
        avgRating: sql<number>`AVG(CAST(${reviews.rating} AS FLOAT))`,
        reviewCount: count(),
      })
      .from(reviews)
      .where(eq(reviews.stallId, stallId));

    const avgRating = result[0]?.avgRating ?? 0;
    const reviewCount = Number(result[0]?.reviewCount ?? 0);

    await db
      .update(stalls)
      .set({
        avgRating: avgRating.toFixed(2),
        reviewCount,
      })
      .where(eq(stalls.id, stallId));

    return { avgRating: Number(avgRating.toFixed(2)), reviewCount };
  }

  async update(id: number, input: { likeCount?: number }) {
    const db = await getDb();
    const rows = await db
      .update(reviews)
      .set({
        ...(input.likeCount !== undefined ? { likeCount: input.likeCount } : {}),
      })
      .where(eq(reviews.id, id))
      .output();
    return rows[0];
  }
}