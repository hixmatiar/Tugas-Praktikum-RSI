import type { Request, Response } from 'express';
import { AuthService } from '../services/authService.ts';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ status: 'fail', message: 'Email Sudah Terdaftar' });
    }
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ status: 'fail', message: 'Email atau Password Salah' });
    }
    if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized - User Tidak Ditemukan' });
    }
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.authService.register(req.body);
      return res.status(201).json({ status: 'success', message: 'Registrasi Berhasil', data: user });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.authService.login(req.body);
      return res.status(200).json({ status: 'success', message: 'Login Berhasil', data: result });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  me = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.authService.me(req.user!.id);
      return res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}