import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();
const flagController = new FlagController();

flagRouter.get('/', (req, res) => {
  // #swagger.parameters['status'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']   = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']  = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar flag' }
  return flagController.getFlags(req, res);
});

flagRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/FlagInput' } }
  // #swagger.responses[200] = { description: 'Flag ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return flagController.updateFlag(req, res);
});

export { flagRouter };