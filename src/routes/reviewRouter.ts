import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/', (req, res) => {
  // #swagger.parameters['stallId'] = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar review' }
  return reviewController.getReviews(req, res);
});

reviewRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Review terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return reviewController.deleteReview(req, res);
});

export { reviewRouter };