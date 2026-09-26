import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
  // #swagger.responses[200] = { description: 'Like toggle' }
  return likeController.toggleLike(req, res);
});

likeRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Like dihapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return likeController.removeLike(req, res);
});

export { likeRouter };