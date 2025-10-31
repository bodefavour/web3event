import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../utils/prisma';

const router = Router();

// @route   GET /api/events
// @desc    Get all events with filters
// @access  Public
router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            category,
            city,
            status,
            startDate,
            endDate,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        // Build where clause
        const where: any = {};

        if (category) where.category = category as string;
        if (city) where.city = { contains: city as string, mode: 'insensitive' };
        if (status) where.status = status as string;
        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        // Date range filter
        if (startDate || endDate) {
            where.startDate = {};
            if (startDate) where.startDate.gte = new Date(startDate as string);
            if (endDate) where.startDate.lte = new Date(endDate as string);
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const events = await prisma.event.findMany({
            where,
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true,
                    }
                },
                ticketTypes: true,
            },
            orderBy: { startDate: 'asc' },
            skip,
            take: parseInt(limit as string),
        });

        const total = await prisma.event.count({ where });

        return res.json({
            success: true,
            data: {
                events,
                pagination: {
                    total,
                    page: parseInt(page as string),
                    pages: Math.ceil(total / parseInt(limit as string)),
                },
            },
        });
    } catch (error: any) {
        console.error('Get events error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message,
        });
    }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id },
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true,
                        bio: true,
                    }
                },
                ticketTypes: true,
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Increment view count
        await prisma.event.update({
            where: { id: req.params.id },
            data: { views: { increment: 1 } }
        });

        return res.json({
            success: true,
            data: { event },
        });
    } catch (error: any) {
        console.error('Get event error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message,
        });
    }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (add auth middleware)
router.post(
    '/',
    [
        body('title').trim().notEmpty(),
        body('description').trim().notEmpty(),
        body('category').notEmpty(),
        body('venue').trim().notEmpty(),
        body('address').notEmpty(),
        body('city').notEmpty(),
        body('country').notEmpty(),
        body('startDate').isISO8601(),
        body('endDate').isISO8601(),
        body('ticketTypes').isArray({ min: 1 }),
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

            const { 
                hostId,
                title, 
                description, 
                category, 
                venue, 
                address, 
                city, 
                country,
                latitude,
                longitude,
                startDate, 
                endDate, 
                image,
                ticketTypes,
                status
            } = req.body;

            // Create event with ticket types
            const event = await prisma.event.create({
                data: {
                    hostId,
                    title,
                    description,
                    category,
                    venue,
                    address,
                    city,
                    country,
                    latitude: latitude || 0,
                    longitude: longitude || 0,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    image: image || null,
                    status: status || 'DRAFT',
                    ticketTypes: {
                        create: ticketTypes.map((tt: any) => ({
                            name: tt.name,
                            price: tt.price,
                            quantity: tt.quantity,
                            sold: 0,
                            benefits: tt.benefits || [],
                        }))
                    }
                },
                include: {
                    ticketTypes: true,
                    host: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                }
            });

            return res.status(201).json({
                success: true,
                message: 'Event created successfully',
                data: { event },
            });
        } catch (error: any) {
            console.error('Create event error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating event',
                error: error.message,
            });
        }
    }
);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (host only)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        const { ticketTypes, ...updateData } = req.body;

        // Update event
        const updatedEvent = await prisma.event.update({
            where: { id: req.params.id },
            data: updateData,
            include: {
                ticketTypes: true,
                host: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return res.json({
            success: true,
            message: 'Event updated successfully',
            data: { event: updatedEvent },
        });
    } catch (error: any) {
        console.error('Update event error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message,
        });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (host only)
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        await prisma.event.delete({
            where: { id: req.params.id }
        });

        return res.json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete event error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message,
        });
    }
});

// @route   GET /api/events/host/:hostId
// @desc    Get events by host
// @access  Public
router.get('/host/:hostId', async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            where: { hostId: req.params.hostId },
            include: {
                ticketTypes: true,
            },
            orderBy: { startDate: 'desc' }
        });

        return res.json({
            success: true,
            data: { events },
        });
    } catch (error: any) {
        console.error('Get host events error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching host events',
            error: error.message,
        });
    }
});

export default router;
