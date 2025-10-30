import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    userId?: string;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided',
            });
        }

        const secret = process.env.JWT_SECRET || 'fallback_secret_key';
        const decoded = jwt.verify(token, secret) as { userId: string };

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

export const isHost = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // This would check if user has host role
        // For now, just pass through
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Host privileges required',
        });
    }
};
