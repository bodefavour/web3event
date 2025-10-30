import { Router, Request, Response } from 'express';
import Event from '../models/Event';
import Ticket from '../models/Ticket';
import Transaction from '../models/Transaction';

const router = Router();

// @route   GET /api/analytics/event/:eventId
// @desc    Get analytics for a specific event
// @access  Private (host only)
router.get('/event/:eventId', async (req: Request, res: Response) => {
    try {
        const eventId = req.params.eventId;

        // Get event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Get tickets
        const tickets = await Ticket.find({ event: eventId });

        // Get transactions
        const transactions = await Transaction.find({
            event: eventId,
            status: 'completed',
            type: 'purchase',
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

        const salesOverTime = await Transaction.aggregate([
            {
                $match: {
                    event: event._id,
                    status: 'completed',
                    type: 'purchase',
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$amount' },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        // Demographics (placeholder - would need user data)
        const demographics = {
            ageGroups: [
                { range: '18-24', count: Math.floor(tickets.length * 0.25) },
                { range: '25-34', count: Math.floor(tickets.length * 0.35) },
                { range: '35-44', count: Math.floor(tickets.length * 0.25) },
                { range: '45+', count: Math.floor(tickets.length * 0.15) },
            ],
            locations: [
                { city: event.location.city, count: Math.floor(tickets.length * 0.6) },
                { city: 'Other', count: Math.floor(tickets.length * 0.4) },
            ],
        };

        res.json({
            success: true,
            data: {
                overview: {
                    totalTickets: event.totalTickets,
                    soldTickets: event.soldTickets,
                    availableTickets: event.totalTickets - event.soldTickets,
                    totalRevenue,
                    averageTicketPrice,
                    views: event.analytics.views,
                    favorites: event.analytics.favorites,
                },
                salesByType,
                salesOverTime,
                demographics,
            },
        });
    } catch (error: any) {
        console.error('Get event analytics error:', error);
        res.status(500).json({
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
        const events = await Event.find({ host: hostId });
        const eventIds = events.map(e => e._id);

        // Get tickets for all events
        const tickets = await Ticket.find({ event: { $in: eventIds } });

        // Get transactions
        const transactions = await Transaction.find({
            event: { $in: eventIds },
            status: 'completed',
            type: 'purchase',
        });

        // Calculate totals
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalTicketsSold = tickets.length;
        const totalViews = events.reduce((sum, e) => sum + e.analytics.views, 0);

        // Events by status
        const eventsByStatus = {
            upcoming: events.filter(e => e.status === 'published' && new Date(e.startDate) > new Date()).length,
            ongoing: events.filter(e => e.status === 'ongoing').length,
            completed: events.filter(e => e.status === 'completed').length,
            draft: events.filter(e => e.status === 'draft').length,
        };

        // Top performing events
        const topEvents = events
            .map(event => ({
                id: event._id,
                title: event.title,
                soldTickets: event.soldTickets,
                totalTickets: event.totalTickets,
                revenue: transactions
                    .filter(t => t.event.toString() === event._id.toString())
                    .reduce((sum, t) => sum + t.amount, 0),
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Revenue over time (last 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const revenueOverTime = await Transaction.aggregate([
            {
                $match: {
                    event: { $in: eventIds },
                    status: 'completed',
                    type: 'purchase',
                    createdAt: { $gte: ninetyDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    revenue: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        res.json({
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
        res.status(500).json({
            success: false,
            message: 'Error fetching host analytics',
            error: error.message,
        });
    }
});

// @route   GET /api/analytics/dashboard
// @desc    Get general platform analytics
// @access  Private (admin)
router.get('/dashboard', async (req: Request, res: Response) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalTickets = await Ticket.countDocuments();
        const totalTransactions = await Transaction.countDocuments({ status: 'completed' });

        const totalRevenue = await Transaction.aggregate([
            {
                $match: { status: 'completed', type: 'purchase' },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                },
            },
        ]);

        res.json({
            success: true,
            data: {
                totalEvents,
                totalTickets,
                totalTransactions,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
        });
    } catch (error: any) {
        console.error('Get dashboard analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard analytics',
            error: error.message,
        });
    }
});

export default router;
