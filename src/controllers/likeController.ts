import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  private likeService: LikeService;

  constructor(likeService: LikeService = new LikeService()) {
    this.likeService = likeService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'LIKE_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Like tidak ditemukan' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  toggleLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { reviewId, userId } = req.body;
      const like = await this.likeService.toggleLike(reviewId, userId);
      return res.status(200).json({ status: 'success', data: like });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  removeLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.likeService.removeLike(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: like });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}