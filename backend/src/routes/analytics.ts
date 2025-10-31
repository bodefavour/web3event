import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';

const router = Router();

// @route   GET /api/analytics/event/:eventId
// @desc    Get analytics for a specific event
// @access  Private (host only)
router.get('/event/:eventId', async (req: Request, res: Response) => {
    try {
        const eventId = req.params.eventId;

        // Get event with ticket types
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                ticketTypes: true,
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Get tickets
        const tickets = await prisma.ticket.findMany({
            where: { eventId }
        });

        // Get transactions
        const transactions = await prisma.transaction.findMany({
            where: {
                eventId,
                status: 'COMPLETED',
                type: 'PURCHASE',
            }
        });

        // Calculate revenue
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const averageTicketPrice = tickets.length > 0 ? totalRevenue / tickets.length : 0;

        // Ticket sales by type
        const salesByType = event.ticketTypes.map(type => ({
            name: type.name,
            sold: type.sold,
            total: type.quantity,
            revenue: type.sold * type.price,
        }));

        // Sales over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentTransactions = await prisma.transaction.findMany({
            where: {
                eventId,
                status: 'COMPLETED',
                type: 'PURCHASE',
                createdAt: { gte: thirtyDaysAgo },
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by date
        const salesByDate = new Map<string, { count: number; revenue: number }>();
        recentTransactions.forEach(t => {
            const dateKey = t.createdAt.toISOString().split('T')[0];
            const existing = salesByDate.get(dateKey) || { count: 0, revenue: 0 };
            salesByDate.set(dateKey, {
                count: existing.count + 1,
                revenue: existing.revenue + t.amount,
            });
        });

        const salesOverTime = Array.from(salesByDate.entries()).map(([date, data]) => ({
            _id: date,
            count: data.count,
            revenue: data.revenue,
        }));

        // Demographics (placeholder - would need user data)
        const demographics = {
            ageGroups: [
                { range: '18-24', count: Math.floor(tickets.length * 0.25) },
                { range: '25-34', count: Math.floor(tickets.length * 0.35) },
                { range: '35-44', count: Math.floor(tickets.length * 0.25) },
                { range: '45+', count: Math.floor(tickets.length * 0.15) },
            ],
            locations: [
                { city: event.city, count: Math.floor(tickets.length * 0.6) },
                { city: 'Other', count: Math.floor(tickets.length * 0.4) },
            ],
        };

        return res.json({
            success: true,
            data: {
                overview: {
                    totalTickets: event.totalTickets,
                    soldTickets: event.soldTickets,
                    availableTickets: event.totalTickets - event.soldTickets,
                    totalRevenue,
                    averageTicketPrice,
                    views: event.views,
                    favorites: event.favorites,
                },
                salesByType,
                salesOverTime,
                demographics,
            },
        });
    } catch (error: any) {
        console.error('Get event analytics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error.message,
        });
    }
});

// @route   GET /api/analytics/host/:hostId
// @desc    Get analytics for a host (all events)
// @access  Private (host only)
router.get('/host/:hostId', async (req: Request, res: Response) => {
    try {
        const hostId = req.params.hostId;

        // Get all host events
        const events = await prisma.event.findMany({
            where: { hostId },
            include: {
                ticketTypes: true,
            }
        });

        const eventIds = events.map(e => e.id);

        // Get tickets for all events
        const tickets = await prisma.ticket.findMany({
            where: { eventId: { in: eventIds } }
        });

        // Get transactions
        const transactions = await prisma.transaction.findMany({
            where: {
                eventId: { in: eventIds },
                status: 'COMPLETED',
                type: 'PURCHASE',
            }
        });

        // Calculate totals
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalTicketsSold = tickets.length;
        const totalViews = events.reduce((sum, e) => sum + e.views, 0);

        // Events by status
        const now = new Date();
        const eventsByStatus = {
            upcoming: events.filter(e => e.status === 'PUBLISHED' && new Date(e.startDate) > now).length,
            ongoing: events.filter(e => e.status === 'ONGOING').length,
            completed: events.filter(e => e.status === 'COMPLETED').length,
            draft: events.filter(e => e.status === 'DRAFT').length,
        };

        // Top performing events
        const eventsWithRevenue = events.map(event => {
            const eventRevenue = transactions
                .filter(t => t.eventId === event.id)
                .reduce((sum, t) => sum + t.amount, 0);
            
            return {
                id: event.id,
                title: event.title,
                soldTickets: event.soldTickets,
                totalTickets: event.totalTickets,
                revenue: eventRevenue,
            };
        });

        const topEvents = eventsWithRevenue
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Revenue over time (last 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const recentTransactions = await prisma.transaction.findMany({
            where: {
                eventId: { in: eventIds },
                status: 'COMPLETED',
                type: 'PURCHASE',
                createdAt: { gte: ninetyDaysAgo },
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by date
        const revenueByDate = new Map<string, { revenue: number; count: number }>();
        recentTransactions.forEach(t => {
            const dateKey = t.createdAt.toISOString().split('T')[0];
            const existing = revenueByDate.get(dateKey) || { revenue: 0, count: 0 };
            revenueByDate.set(dateKey, {
                revenue: existing.revenue + t.amount,
                count: existing.count + 1,
            });
        });

        const revenueOverTime = Array.from(revenueByDate.entries()).map(([date, data]) => ({
            _id: date,
            revenue: data.revenue,
            count: data.count,
        }));

        return res.json({
            success: true,
            data: {
                overview: {
                    totalEvents: events.length,
                    totalRevenue,
                    totalTicketsSold,
                    totalViews,
                    averageTicketPrice: totalTicketsSold > 0 ? totalRevenue / totalTicketsSold : 0,
                },
                eventsByStatus,
                topEvents,
                revenueOverTime,
            },
        });
    } catch (error: any) {
        console.error('Get host analytics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching host analytics',
            error: error.message,
        });
    }
});

// @route   GET /api/analytics/dashboard
// @desc    Get general platform analytics
// @access  Private (admin)
router.get('/dashboard', async (_req: Request, res: Response) => {
    try {
        const totalEvents = await prisma.event.count();
        const totalTickets = await prisma.ticket.count();
        const totalTransactions = await prisma.transaction.count({
            where: { status: 'COMPLETED' }
        });

        const revenueData = await prisma.transaction.aggregate({
            where: {
                status: 'COMPLETED',
                type: 'PURCHASE',
            },
            _sum: {
                amount: true,
            }
        });

        return res.json({
            success: true,
            data: {
                totalEvents,
                totalTickets,
                totalTransactions,
                totalRevenue: revenueData._sum.amount || 0,
            },
        });
    } catch (error: any) {
        console.error('Get dashboard analytics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard analytics',
            error: error.message,
        });
    }
});

export default router;
