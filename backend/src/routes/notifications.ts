import { Router, Request, Response } from 'express';
import Notification from '../models/Notification';

const router = Router();

// @route   GET /api/notifications/user/:userId
// @desc    Get all notifications for a user
// @access  Private
router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const { read, type } = req.query;

        const query: any = { user: req.params.userId };
        if (read !== undefined) query.read = read === 'true';
        if (type) query.type = type;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            user: req.params.userId,
            read: false,
        });

        res.json({
            success: true,
            data: {
                notifications,
                unreadCount,
            },
        });
    } catch (error: any) {
        console.error('Get notifications error:', error);
        res.status(500).json({
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
        const { userId, type, title, message, data } = req.body;

        const notification = await Notification.create({
            user: userId,
            type,
            title,
            message,
            data,
        });

        res.status(201).json({
            success: true,
            message: 'Notification created',
            data: { notification },
        });
    } catch (error: any) {
        console.error('Create notification error:', error);
        res.status(500).json({
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
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        res.json({
            success: true,
            message: 'Notification marked as read',
            data: { notification },
        });
    } catch (error: any) {
        console.error('Mark notification read error:', error);
        res.status(500).json({
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
        await Notification.updateMany(
            { user: req.params.userId, read: false },
            { read: true }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error: any) {
        console.error('Mark all read error:', error);
        res.status(500).json({
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
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error: any) {
        console.error('Delete notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message,
        });
    }
});

export default router;
