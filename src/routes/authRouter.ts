import { auth } from '../middlewares/auth.ts';
import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { validate } from '../middlewares/validate.ts';
import { loginSchema, registerSchema } from '../schemas/authSchema.ts';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', validate(registerSchema, 'body'), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RegisterInput' } }
  // #swagger.responses[201] = { description: 'Registrasi berhasil' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  return authController.register(req, res);
});

authRouter.post('/login', validate(loginSchema, 'body'), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LoginInput' } }
  // #swagger.responses[200] = { description: 'Login berhasil, mengembalikan token JWT' }
  // #swagger.responses[401] = { description: 'Email atau password salah' }
  return authController.login(req, res);
});

authRouter.get('/me', auth, (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Profil user dari token' }
  // #swagger.responses[401] = { description: 'Belum login' }
  return authController.me(req, res);
});

export { authRouter };