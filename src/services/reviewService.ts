import { ReviewRepository, type CreateReviewInput, type FindAllParams } from '../repositories/reviewRepository.ts';
import { UserRepository } from '../repositories/userRepository.ts';
import type { ReviewResponseDto } from '../dtos/reviewDto.ts';

type ReviewRow = NonNullable<Awaited<ReturnType<ReviewRepository['findById']>>>;
type UserRow = NonNullable<Awaited<ReturnType<UserRepository['findById']>>>;

export class ReviewService {
  private reviewRepository: ReviewRepository;
  private userRepository: UserRepository;

  constructor(
    reviewRepository: ReviewRepository = new ReviewRepository(),
    userRepository: UserRepository = new UserRepository(),
  ) {
    this.reviewRepository = reviewRepository;
    this.userRepository = userRepository;
  }

  private async toDto(row: ReviewRow): Promise<ReviewResponseDto> {
    const user = await this.userRepository.findById(row.userId);
    return {
      id: row.id,
      stallId: row.stallId,
      userId: row.userId,
      rating: row.rating,
      comment: row.comment,
      likeCount: row.likeCount,
      createdAt: row.createdAt,
      userName: user?.name ?? null,
    };
  }

  async getReviewsByStall(stallId: number) {
    const { rows } = await this.reviewRepository.findAll({ stallId, page: 1, limit: 100 });
    return Promise.all(rows.map((row) => this.toDto(row)));
  }

  async createReview(input: CreateReviewInput): Promise<ReviewResponseDto> {
    const row = await this.reviewRepository.create(input);
    if (!row) throw new Error('REVIEW_NOT_FOUND');
    await this.reviewRepository.recalculateStallRating(input.stallId);
    return this.toDto(row);
  }

  async deleteReview(id: number): Promise<ReviewResponseDto> {
    const row = await this.reviewRepository.findById(id);
    if (!row) throw new Error('REVIEW_NOT_FOUND');
    const stallId = row.stallId;
    const deleted = await this.reviewRepository.remove(id);
    if (!deleted) throw new Error('REVIEW_NOT_FOUND');
    await this.reviewRepository.recalculateStallRating(stallId);
    return this.toDto(deleted);
  }
}