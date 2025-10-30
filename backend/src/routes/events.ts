import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import Event from '../models/Event';

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

    // Build query
    const query: any = {};

    if (category) query.category = category;
    if (city) query['location.city'] = new RegExp(city as string, 'i');
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate as string);
      if (endDate) query.startDate.$lte = new Date(endDate as string);
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const events = await Event.find(query)
      .populate('host', 'name email profileImage')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Event.countDocuments(query);

    res.json({
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
    res.status(500).json({
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
    const event = await Event.findById(req.params.id)
      .populate('host', 'name email profileImage bio');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Increment view count
    event.analytics.views += 1;
    await event.save();

    res.json({
      success: true,
      data: { event },
    });
  } catch (error: any) {
    console.error('Get event error:', error);
    res.status(500).json({
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
    body('location.address').notEmpty(),
    body('location.city').notEmpty(),
    body('location.country').notEmpty(),
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

      const eventData = req.body;

      // Create event
      const event = await Event.create(eventData);

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: { event },
      });
    } catch (error: any) {
      console.error('Create event error:', error);
      res.status(500).json({
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
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent },
    });
  } catch (error: any) {
    console.error('Update event error:', error);
    res.status(500).json({
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
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete event error:', error);
    res.status(500).json({
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
    const events = await Event.find({ host: req.params.hostId })
      .sort({ startDate: -1 });

    res.json({
      success: true,
      data: { events },
    });
  } catch (error: any) {
    console.error('Get host events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching host events',
      error: error.message,
    });
  }
});

export default router;
