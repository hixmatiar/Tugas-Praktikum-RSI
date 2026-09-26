import { and, count, eq, like, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems } from '../db/schema.ts';

export interface FindAllParams {
  stallId?: number;
  search?: string;
  page: number;
  limit: number;
}

export interface CreateMenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export class MenuItemRepository {
  async findAll(params: FindAllParams) {
    const db = await getDb();

    const conditions: SQL[] = [];
    if (params.stallId) conditions.push(eq(menuItems.stallId, params.stallId));
    if (params.search) conditions.push(like(menuItems.name, `%${params.search}%`));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select()
      .from(menuItems)
      .where(where)
      .orderBy(menuItems.id)
      .offset(offset)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(menuItems).where(where);

    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return rows[0];
  }

  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select().from(menuItems).where(eq(menuItems.stallId, stallId));
  }

  async create(input: CreateMenuItemInput) {
    const db = await getDb();
    const rows = await db
      .insert(menuItems)
      .output()
      .values({
        stallId: input.stallId,
        name: input.name,
        price: input.price,
        isAvailable: input.isAvailable,
      });
    return rows[0];
  }

  async update(id: number, input: Partial<CreateMenuItemInput>) {
    const db = await getDb();
    const rows = await db
      .update(menuItems)
      .set({
        ...(input.stallId !== undefined ? { stallId: input.stallId } : {}),
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.isAvailable !== undefined ? { isAvailable: input.isAvailable } : {}),
      })
      .where(eq(menuItems.id, id))
      .output();
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(menuItems).where(eq(menuItems.id, id)).output();
    return rows[0];
  }
}