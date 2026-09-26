import { and, count, eq, like, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';

export interface FindAllParams {
  search?: string;
  page: number;
  limit: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'owner' | 'customer';
}

export class UserRepository {
  async findAll(params: FindAllParams) {
    const db = await getDb();

    const conditions: SQL[] = [];
    if (params.search) {
      conditions.push(
        like(users.name, `%${params.search}%`),
        like(users.email, `%${params.search}%`)
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select()
      .from(users)
      .where(where)
      .orderBy(users.id)
      .offset(offset)
      .$dynamic()
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(users).where(where);

    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(users).where(eq(users.id, id));
    return rows[0];
  }

  async findByEmail(email: string) {
    const db = await getDb();
    const rows = await db.select().from(users).where(eq(users.email, email));
    return rows[0];
  }

  async create(input: CreateUserInput) {
    const db = await getDb();
    const rows = await db
      .insert(users)
      .output()
      .values({
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
      });
    return rows[0];
  }
}