import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';

const router = Router();

// @route   GET /api/notifications/user/:userId
// @desc    Get all notifications for a user
// @access  Private
router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const { read, type } = req.query;

        const where: any = { userId: req.params.userId };
        if (read !== undefined) where.read = read === 'true';
        if (type) where.type = (type as string).toUpperCase();

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        const unreadCount = await prisma.notification.count({
            where: {
                userId: req.params.userId,
                read: false,
            },
        });

        return res.json({
            success: true,
            data: {
                notifications,
                unreadCount,
            },
        });
    } catch (error: any) {
        console.error('Get notifications error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message,
        });
    }
});

// @route   POST /api/notifications
// @desc    Create new notification
// @access  Private (system)
router.post('/', async (req: Request, res: Response) => {
    try {
        const { userId, type, title, message, eventId, ticketId, transactionId, actionUrl } = req.body;

        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                eventId: eventId || null,
                ticketId: ticketId || null,
                transactionId: transactionId || null,
                actionUrl: actionUrl || null,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Notification created',
            data: { notification },
        });
    } catch (error: any) {
        console.error('Create notification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating notification',
            error: error.message,
        });
    }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', async (req: Request, res: Response) => {
    try {
        const notification = await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true },
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        return res.json({
            success: true,
            message: 'Notification marked as read',
            data: { notification },
        });
    } catch (error: any) {
        console.error('Mark notification read error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating notification',
            error: error.message,
        });
    }
});

// @route   PUT /api/notifications/user/:userId/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/user/:userId/read-all', async (req: Request, res: Response) => {
    try {
        await prisma.notification.updateMany({
            where: {
                userId: req.params.userId,
                read: false,
            },
            data: { read: true },
        });

        return res.json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error: any) {
        console.error('Mark all read error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating notifications',
            error: error.message,
        });
    }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const notification = await prisma.notification.delete({
            where: { id: req.params.id },
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        return res.json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error: any) {
        console.error('Delete notification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message,
        });
    }
});

export default router;
