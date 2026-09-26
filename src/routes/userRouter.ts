import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar user' }
  return userController.getUsers(req, res);
});

userRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserInput' } }
  // #swagger.responses[201] = { description: 'User dibuat' }
  // #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  return userController.createUser(req, res);
});

userRouter.get('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail user' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return userController.getUserById(req, res);
});

export { userRouter };