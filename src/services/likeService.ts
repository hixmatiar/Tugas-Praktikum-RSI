import { LikeRepository, type CreateLikeInput } from '../repositories/likeRepository.ts';
import { ReviewRepository } from '../repositories/reviewRepository.ts';
import type { LikeResponseDto } from '../dtos/likeDto.ts';

type LikeRow = NonNullable<Awaited<ReturnType<LikeRepository['findById']>>>;

export class LikeService {
  private likeRepository: LikeRepository;
  private reviewRepository: ReviewRepository;

  constructor(
    likeRepository: LikeRepository = new LikeRepository(),
    reviewRepository: ReviewRepository = new ReviewRepository(),
  ) {
    this.likeRepository = likeRepository;
    this.reviewRepository = reviewRepository;
  }

  private toDto(row: LikeRow): LikeResponseDto {
    return {
      id: row.id,
      reviewId: row.reviewId,
      userId: row.userId,
      createdAt: row.createdAt,
    };
  }

  async toggleLike(reviewId: number, userId: number): Promise<LikeResponseDto> {
    const existing = await this.likeRepository.findByReviewAndUser(reviewId, userId);
    if (existing) {
      await this.likeRepository.remove(existing.id);
      const count = await this.likeRepository.countByReviewId(reviewId);
      await this.reviewRepository.update(reviewId, { likeCount: count });
      return this.toDto(existing);
    }

    const row = await this.likeRepository.create({ reviewId, userId });
    if (!row) throw new Error('LIKE_NOT_FOUND');
    const count = await this.likeRepository.countByReviewId(reviewId);
    await this.reviewRepository.update(reviewId, { likeCount: count });
    return this.toDto(row);
  }

  async removeLike(id: number): Promise<LikeResponseDto> {
    const row = await this.likeRepository.findById(id);
    if (!row) throw new Error('LIKE_NOT_FOUND');
    const reviewId = row.reviewId;
    const deleted = await this.likeRepository.remove(id);
    if (!deleted) throw new Error('LIKE_NOT_FOUND');
    const count = await this.likeRepository.countByReviewId(reviewId);
    await this.reviewRepository.update(reviewId, { likeCount: count });
    return this.toDto(deleted);
  }
}