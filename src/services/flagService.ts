import { FlagRepository, type FindAllParams, type UpdateFlagInput } from '../repositories/flagRepository.ts';
import type { FlagResponseDto } from '../dtos/flagDto.ts';

type FlagRow = NonNullable<Awaited<ReturnType<FlagRepository['findById']>>>;

export class FlagService {
  private flagRepository: FlagRepository;

  constructor(flagRepository: FlagRepository = new FlagRepository()) {
    this.flagRepository = flagRepository;
  }

  private toDto(row: FlagRow): FlagResponseDto {
    return {
      id: row.id,
      reviewId: row.reviewId,
      reportedBy: row.reportedBy,
      reason: row.reason,
      status: row.status,
      createdAt: row.createdAt,
    };
  }

  async getAllFlags(params: FindAllParams) {
    const { rows, total } = await this.flagRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async updateFlagStatus(id: number, status: UpdateFlagInput['status']): Promise<FlagResponseDto> {
    const row = await this.flagRepository.update(id, { status });
    if (!row) throw new Error('FLAG_NOT_FOUND');
    return this.toDto(row);
  }
}