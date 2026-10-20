import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type Role = 'admin' | 'owner' | 'customer';

export interface AuthPayload {
  id: number;
  email: string;
  role: Role;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET belum diatur di .env');
  return secret;
};

export const signToken = (payload: AuthPayload): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '1d') as jwt.SignOptions['expiresIn'];
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ status: 'fail', message: 'Unauthorized - Token Missing' });
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ status: 'fail', message: 'Unauthorized - Invalid Token Format' });
    return;
  }

  const secret = getJwtSecret();

  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch {
    res.status(401).json({ status: 'fail', message: 'Unauthorized - Token Invalid or Expired' });
  }
};

export const roleMiddleware = (requiredRole: Role) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role;

    if (!role) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized - Token Required' });
      return;
    }

    const allowed: Record<Role, boolean> = {
      customer: role === 'customer' || role === 'owner' || role === 'admin',
      owner: role === 'owner' || role === 'admin',
      admin: role === 'admin',
    };

    if (!allowed[requiredRole]) {
      res.status(403).json({ status: 'fail', message: 'Forbidden - Insufficient Role' });
      return;
    }

    next();
  };
};