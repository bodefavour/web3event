import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    const decoded = jwt.verify(token, secret) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
    return;
  }
};

export const isHost = async (
  _req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // This would check if user has host role
    // For now, just pass through
    next();
  } catch (error) {
    _res.status(403).json({
      success: false,
      message: 'Access denied: Host privileges required',
    });
    return;
  }
};