import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Transaction from '../models/Transaction';

const router = Router();

// @route   GET /api/transactions/user/:userId
// @desc    Get all transactions for a user
// @access  Private
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { type, status } = req.query;

    const query: any = { user: req.params.userId };
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .populate('event', 'title image startDate')
      .populate('ticket', 'ticketType quantity')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { transactions },
    });
  } catch (error: any) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
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
    const transaction = await Transaction.findById(req.params.id)
      .populate('user', 'name email walletAddress')
      .populate('event', 'title venue startDate')
      .populate('ticket', 'ticketType quantity qrCode');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: { transaction },
    });
  } catch (error: any) {
    console.error('Get transaction error:', error);
    res.status(500).json({
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
        user: req.body.userId,
        event: req.body.eventId,
        ticket: req.body.ticketId,
        type: req.body.type,
        amount: req.body.amount,
        currency: req.body.currency || 'ETH',
        status: req.body.status || 'pending',
        paymentMethod: req.body.paymentMethod || 'crypto',
        blockchain: {
          transactionHash: req.body.transactionHash,
          blockNumber: req.body.blockNumber,
          network: req.body.network || 'sepolia',
          gasUsed: req.body.gasUsed,
          gasPaid: req.body.gasPaid,
        },
        metadata: req.body.metadata,
      };

      const transaction = await Transaction.create(transactionData);

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: { transaction },
      });
    } catch (error: any) {
      console.error('Create transaction error:', error);
      res.status(500).json({
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

    if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      message: 'Transaction status updated',
      data: { transaction },
    });
  } catch (error: any) {
    console.error('Update transaction status error:', error);
    res.status(500).json({
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
    const transactions = await Transaction.find({ event: req.params.eventId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const stats = {
      total: transactions.length,
      totalRevenue: transactions
        .filter(t => t.status === 'completed' && t.type === 'purchase')
        .reduce((sum, t) => sum + t.amount, 0),
      pending: transactions.filter(t => t.status === 'pending').length,
      completed: transactions.filter(t => t.status === 'completed').length,
      failed: transactions.filter(t => t.status === 'failed').length,
    };

    res.json({
      success: true,
      data: { transactions, stats },
    });
  } catch (error: any) {
    console.error('Get event transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event transactions',
      error: error.message,
    });
  }
});

export default router;
