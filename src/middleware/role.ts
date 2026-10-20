import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from './auth';

export const roleMiddleware = (requiredRole?: 'public' | 'customer' | 'owner' | 'admin'): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!requiredRole) {
      if ((req.user as AuthPayload)?.id) {
        next();
        return;
      }
      res.status(401).json({ status: 'fail', message: 'Unauthorized - Token Required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized - Token Required' });
      return;
    }

    const userRole = (req.user as AuthPayload).role;
    const roleCheck = {
      customer: userRole === 'customer' || userRole === 'owner' || userRole === 'admin',
      owner: userRole === 'owner' || userRole === 'admin',
      admin: userRole === 'admin',
    };

    if (roleCheck[requiredRole as keyof typeof roleCheck]) {
      next();
      return;
    }
    res.status(403).json({ status: 'fail', message: 'Forbidden - Insufficient Role' });
    return;
  };
};

export const ownerCheckMiddleware = (stallOwnerId: number, req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as AuthPayload | undefined;

  if (!user || !user.id) {
    res.status(419).json({ status: 'fail', message: 'Unauthorized - Token Required' });
    return;
  }

  if (user.role === 'admin') {
    next();
    return;
  }

  if (user.role === 'owner' && user.id === stallOwnerId) {
    next();
    return;
  }

  res.status(403).json({ status: 'fail', message: 'Forbidden - Bukan Pemilik Warung' });
  return;
};
