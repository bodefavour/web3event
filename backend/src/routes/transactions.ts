import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../utils/prisma';

const router = Router();

// @route   GET /api/transactions/user/:userId
// @desc    Get all transactions for a user
// @access  Private
router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const { type, status } = req.query;

        const where: any = { userId: req.params.userId };
        if (type) where.type = (type as string).toUpperCase();
        if (status) where.status = (status as string).toUpperCase();

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        image: true,
                        startDate: true,
                    }
                },
                ticket: {
                    select: {
                        id: true,
                        ticketType: true,
                        quantity: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return res.json({
            success: true,
            data: { transactions },
        });
    } catch (error: any) {
        console.error('Get user transactions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message,
        });
    }
});

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: req.params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        walletAddress: true,
                    }
                },
                event: {
                    select: {
                        id: true,
                        title: true,
                        venue: true,
                        startDate: true,
                    }
                },
                ticket: {
                    select: {
                        id: true,
                        ticketType: true,
                        quantity: true,
                        qrCode: true,
                    }
                }
            }
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        return res.json({
            success: true,
            data: { transaction },
        });
    } catch (error: any) {
        console.error('Get transaction error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching transaction',
            error: error.message,
        });
    }
});

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post(
    '/',
    [
        body('userId').notEmpty(),
        body('eventId').notEmpty(),
        body('type').isIn(['purchase', 'refund', 'transfer']),
        body('amount').isFloat({ min: 0 }),
        body('transactionHash').notEmpty(),
    ],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const transactionData = {
                userId: req.body.userId,
                eventId: req.body.eventId,
                ticketId: req.body.ticketId,
                type: req.body.type.toUpperCase(),
                amount: req.body.amount,
                currency: req.body.currency || 'ETH',
                status: req.body.status ? req.body.status.toUpperCase() : 'PENDING',
                paymentMethod: req.body.paymentMethod || 'crypto',
                transactionHash: req.body.transactionHash,
                blockNumber: req.body.blockNumber,
                network: req.body.network || 'sepolia',
                gasUsed: req.body.gasUsed,
                gasPaid: req.body.gasPaid,
                metadata: req.body.metadata,
            };

            const transaction = await prisma.transaction.create({
                data: transactionData,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                    event: {
                        select: {
                            id: true,
                            title: true,
                        }
                    },
                    ticket: true
                }
            });

            return res.status(201).json({
                success: true,
                message: 'Transaction created successfully',
                data: { transaction },
            });
        } catch (error: any) {
            console.error('Create transaction error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating transaction',
                error: error.message,
            });
        }
    }
);

// @route   PUT /api/transactions/:id/status
// @desc    Update transaction status
// @access  Private
router.put('/:id/status', async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        if (!['pending', 'completed', 'failed', 'refunded'].includes(status?.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
            });
        }

        const transaction = await prisma.transaction.update({
            where: { id: req.params.id },
            data: { status: status.toUpperCase() },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                event: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                ticket: true
            }
        });

        return res.json({
            success: true,
            message: 'Transaction status updated',
            data: { transaction },
        });
    } catch (error: any) {
        console.error('Update transaction status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating transaction',
            error: error.message,
        });
    }
});

// @route   GET /api/transactions/event/:eventId
// @desc    Get all transactions for an event
// @access  Private (host only)
router.get('/event/:eventId', async (req: Request, res: Response) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { eventId: req.params.eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const stats = {
            total: transactions.length,
            totalRevenue: transactions
                .filter(t => t.status === 'COMPLETED' && t.type === 'PURCHASE')
                .reduce((sum, t) => sum + t.amount, 0),
            pending: transactions.filter(t => t.status === 'PENDING').length,
            completed: transactions.filter(t => t.status === 'COMPLETED').length,
            failed: transactions.filter(t => t.status === 'FAILED').length,
        };

        return res.json({
            success: true,
            data: { transactions, stats },
        });
    } catch (error: any) {
        console.error('Get event transactions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching event transactions',
            error: error.message,
        });
    }
});

export default router;
