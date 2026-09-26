import { AuditLogRepository, type FindAllParams, type CreateAuditLogInput } from '../repositories/auditLogRepository.ts';
import type { AuditLogResponseDto } from '../dtos/auditLogDto.ts';

type AuditLogRow = NonNullable<Awaited<ReturnType<AuditLogRepository['findById']>>>;

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(auditLogRepository: AuditLogRepository = new AuditLogRepository()) {
    this.auditLogRepository = auditLogRepository;
  }

  private toDto(row: AuditLogRow): AuditLogResponseDto {
    return {
      id: row.id,
      userId: row.userId,
      action: row.action,
      targetTable: row.targetTable,
      targetId: row.targetId,
      metadata: row.metadata,
      createdAt: row.createdAt,
    };
  }

  async getAllLogs(params: FindAllParams) {
    const { rows, total } = await this.auditLogRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async createLog(input: CreateAuditLogInput): Promise<AuditLogResponseDto> {
    const row = await this.auditLogRepository.create(input);
    if (!row) throw new Error('AUDIT_LOG_NOT_FOUND');
    return this.toDto(row);
  }
}