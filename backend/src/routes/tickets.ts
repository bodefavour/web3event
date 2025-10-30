import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Ticket from '../models/Ticket';
import Event from '../models/Event';
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
    
    const query: any = { owner: req.params.userId };
    if (status) query.status = status;

    const tickets = await Ticket.find(query)
      .populate('event', 'title startDate endDate venue location image')
      .sort({ purchaseDate: -1 });

    res.json({
      success: true,
      data: { tickets },
    });
  } catch (error: any) {
    console.error('Get user tickets error:', error);
    res.status(500).json({
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
    const ticket = await Ticket.findById(req.params.id)
      .populate('event', 'title description startDate endDate venue location image')
      .populate('owner', 'name email walletAddress');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    res.json({
      success: true,
      data: { ticket },
    });
  } catch (error: any) {
    console.error('Get ticket error:', error);
    res.status(500).json({
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

      // Get event
      const event = await Event.findById(eventId);
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
      const ticket = await Ticket.create({
        event: eventId,
        owner: userId,
        ticketType: ticketType,
        price: ticketTypeData.price,
        quantity,
        qrCode: generateQRCode(),
        blockchain: {
          transactionHash,
          contractAddress: contractAddress || event.blockchain.contractAddress,
          network: event.blockchain.network,
        },
      });

      // Update sold count
      ticketTypeData.sold += quantity;
      await event.save();

      const populatedTicket = await Ticket.findById(ticket._id)
        .populate('event', 'title startDate venue');

      res.status(201).json({
        success: true,
        message: 'Ticket purchased successfully',
        data: { ticket: populatedTicket },
      });
    } catch (error: any) {
      console.error('Purchase ticket error:', error);
      res.status(500).json({
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

    const ticket = await Ticket.findById(req.params.id);

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

    if (ticket.status === 'used') {
      return res.status(400).json({
        success: false,
        message: 'Ticket already used',
      });
    }

    ticket.status = 'used';
    ticket.usedDate = new Date();
    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket verified successfully',
      data: { ticket },
    });
  } catch (error: any) {
    console.error('Verify ticket error:', error);
    res.status(500).json({
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
    const tickets = await Ticket.find({ event: req.params.eventId })
      .populate('owner', 'name email')
      .sort({ purchaseDate: -1 });

    const stats = {
      total: tickets.length,
      active: tickets.filter(t => t.status === 'active').length,
      used: tickets.filter(t => t.status === 'used').length,
    };

    res.json({
      success: true,
      data: { tickets, stats },
    });
  } catch (error: any) {
    console.error('Get event tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event tickets',
      error: error.message,
    });
  }
});

export default router;
