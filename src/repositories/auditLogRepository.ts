import { and, count, eq, like, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs } from '../db/schema.ts';

export interface FindAllParams {
  userId?: number;
  action?: string;
  targetTable?: string;
  page: number;
  limit: number;
}

export interface CreateAuditLogInput {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: string | null;
}

export class AuditLogRepository {
  async findAll(params: FindAllParams) {
    const db = await getDb();

    const conditions: SQL[] = [];
    if (params.userId) conditions.push(eq(auditLogs.userId, params.userId));
    if (params.action) conditions.push(eq(auditLogs.action, params.action));
    if (params.targetTable) conditions.push(eq(auditLogs.targetTable, params.targetTable));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select()
      .from(auditLogs)
      .where(where)
      .orderBy(auditLogs.id)
      .offset(offset)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(auditLogs).where(where);

    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(auditLogs).where(eq(auditLogs.id, id));
    return rows[0];
  }

  async create(input: CreateAuditLogInput) {
    const db = await getDb();
    const rows = await db
      .insert(auditLogs)
      .output()
      .values({
        userId: input.userId,
        action: input.action,
        targetTable: input.targetTable,
        targetId: input.targetId,
        metadata: input.metadata ?? null,
      });
    return rows[0];
  }
}