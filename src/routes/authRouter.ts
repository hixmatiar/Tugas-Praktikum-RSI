import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { authMiddleware } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';
import { loginSchema, registerSchema } from '../dtos/authDto.ts';

const authRouter = Router();
const authController = new AuthController();

// PUBLIC
authRouter.post('/register', validate({ body: registerSchema }), (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RegisterInput' } }
  // #swagger.responses[201] = { description: 'Registrasi berhasil (role customer)' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  return authController.register(req, res);
});

authRouter.post('/login', validate({ body: loginSchema }), (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LoginInput' } }
  // #swagger.responses[200] = { description: 'Login berhasil, mengembalikan token JWT' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[401] = { description: 'Email atau password salah' }
  return authController.login(req, res);
});

// LOGIN (semua role)
authRouter.get('/me', authMiddleware, (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Data user dari token' }
  // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
  return authController.me(req, res);
});

export { authRouter };