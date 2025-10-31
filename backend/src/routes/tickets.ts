import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../utils/prisma';
import crypto from 'crypto';

const router = Router();

// Generate unique QR code
const generateQRCode = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

// @route   GET /api/tickets/user/:userId
// @desc    Get all tickets for a user
// @access  Private
router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const { status } = req.query;

        const where: any = { ownerId: req.params.userId };
        if (status) where.status = (status as string).toUpperCase();

        const tickets = await prisma.ticket.findMany({
            where,
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        startDate: true,
                        endDate: true,
                        venue: true,
                        address: true,
                        city: true,
                        image: true,
                    }
                }
            },
            orderBy: { purchaseDate: 'desc' }
        });

        return res.json({
            success: true,
            data: { tickets },
        });
    } catch (error: any) {
        console.error('Get user tickets error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching tickets',
            error: error.message,
        });
    }
});

// @route   GET /api/tickets/:id
// @desc    Get single ticket details
// @access  Private
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: req.params.id },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        startDate: true,
                        endDate: true,
                        venue: true,
                        address: true,
                        city: true,
                        image: true,
                    }
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        walletAddress: true,
                    }
                }
            }
        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        return res.json({
            success: true,
            data: { ticket },
        });
    } catch (error: any) {
        console.error('Get ticket error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching ticket',
            error: error.message,
        });
    }
});

// @route   POST /api/tickets
// @desc    Purchase ticket (mint NFT)
// @access  Private
router.post(
    '/',
    [
        body('eventId').notEmpty(),
        body('userId').notEmpty(),
        body('ticketType').notEmpty(),
        body('quantity').isInt({ min: 1 }),
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

            const { eventId, userId, ticketType, quantity, transactionHash, contractAddress } = req.body;

            // Get event with ticket types
            const event = await prisma.event.findUnique({
                where: { id: eventId },
                include: { ticketTypes: true }
            });

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found',
                });
            }

            // Find ticket type
            const ticketTypeData = event.ticketTypes.find(t => t.name === ticketType);
            if (!ticketTypeData) {
                return res.status(404).json({
                    success: false,
                    message: 'Ticket type not found',
                });
            }

            // Check availability
            if (ticketTypeData.sold + quantity > ticketTypeData.quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Not enough tickets available',
                });
            }

            // Create ticket
            const ticket = await prisma.ticket.create({
                data: {
                    eventId,
                    ownerId: userId,
                    ticketType: ticketType,
                    price: ticketTypeData.price,
                    quantity,
                    qrCode: generateQRCode(),
                    transactionHash,
                    contractAddress: contractAddress || event.contractAddress || '0.0.0',
                    network: event.network,
                },
                include: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            startDate: true,
                            venue: true,
                        }
                    }
                }
            });

            // Update sold count
            await prisma.ticketType.update({
                where: { id: ticketTypeData.id },
                data: { sold: { increment: quantity } }
            });

            return res.status(201).json({
                success: true,
                message: 'Ticket purchased successfully',
                data: { ticket },
            });
        } catch (error: any) {
            console.error('Purchase ticket error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error purchasing ticket',
                error: error.message,
            });
        }
    }
);

// @route   PUT /api/tickets/:id/verify
// @desc    Verify and use ticket
// @access  Private (host only)
router.put('/:id/verify', async (req: Request, res: Response) => {
    try {
        const { qrCode } = req.body;

        const ticket = await prisma.ticket.findUnique({
            where: { id: req.params.id }
        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        if (ticket.qrCode !== qrCode) {
            return res.status(400).json({
                success: false,
                message: 'Invalid QR code',
            });
        }

        if (ticket.status === 'USED') {
            return res.status(400).json({
                success: false,
                message: 'Ticket already used',
            });
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: req.params.id },
            data: {
                status: 'USED',
                usedDate: new Date(),
            }
        });

        return res.json({
            success: true,
            message: 'Ticket verified successfully',
            data: { ticket: updatedTicket },
        });
    } catch (error: any) {
        console.error('Verify ticket error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying ticket',
            error: error.message,
        });
    }
});

// @route   GET /api/tickets/event/:eventId
// @desc    Get all tickets for an event
// @access  Private (host only)
router.get('/event/:eventId', async (req: Request, res: Response) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: { eventId: req.params.eventId },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { purchaseDate: 'desc' }
        });

        const stats = {
            total: tickets.length,
            active: tickets.filter(t => t.status === 'ACTIVE').length,
            used: tickets.filter(t => t.status === 'USED').length,
        };

        return res.json({
            success: true,
            data: { tickets, stats },
        });
    } catch (error: any) {
        console.error('Get event tickets error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching event tickets',
            error: error.message,
        });
    }
});

export default router;
