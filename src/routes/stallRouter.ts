import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { ReviewController } from '../controllers/reviewController.ts';
import { authMiddleware, roleMiddleware } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';
import { createStallSchema, stallQuerySchema, updateStallSchema } from '../dtos/stallDto.ts';
import { createReviewSchema } from '../dtos/reviewDto.ts';
import { idParamSchema } from '../dtos/helpers.ts';

const stallRouter = Router();
const stallController = new StallController();
const reviewController = new ReviewController();

// PUBLIC: tidak butuh token
stallRouter.get('/', validate({ query: stallQuerySchema }), (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  return stallController.getStalls(req, res);
});

stallRouter.get('/:id', validate({ params: idParamSchema }), (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.get('/:id/menus', validate({ params: idParamSchema }), (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});

// LOGIN (semua role): tambah review, userId dari token
stallRouter.post(
  '/:id/reviews',
  authMiddleware,
  validate({ params: idParamSchema, body: createReviewSchema }),
  (req, res) => {
    // #swagger.tags = ['Stalls']
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
    // #swagger.responses[201] = { description: 'Review dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
    return reviewController.createReview(req, res);
  },
);

// OWNER / ADMIN: buat warung, ownerId dari token
stallRouter.post(
  '/',
  authMiddleware,
  roleMiddleware('owner'),
  validate({ body: createStallSchema }),
  (req, res) => {
    // #swagger.tags = ['Stalls']
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
    // #swagger.responses[201] = { description: 'Warung dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[403] = { description: 'Role tidak cukup' }
    return stallController.createStall(req, res);
  },
);

// OWNER (hanya miliknya) / ADMIN
stallRouter.put(
  '/:id',
  authMiddleware,
  roleMiddleware('owner'),
  validate({ params: idParamSchema, body: updateStallSchema }),
  (req, res) => {
    // #swagger.tags = ['Stalls']
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallUpdateInput' } }
    // #swagger.responses[200] = { description: 'Warung ter-update' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[403] = { description: 'Role tidak cukup atau bukan pemilik warung' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.updateStall(req, res);
  },
);

// ADMIN
stallRouter.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  validate({ params: idParamSchema }),
  (req, res) => {
    // #swagger.tags = ['Stalls']
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Warung terhapus' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[403] = { description: 'Role tidak cukup' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.deleteStall(req, res);
  },
);

export { stallRouter };