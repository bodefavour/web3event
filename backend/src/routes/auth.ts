import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const router = Router();

// Generate JWT token
const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('name').trim().notEmpty(),
        body('role').optional().isIn(['host', 'attendee']),
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

            const { email, password, name, role } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email',
                });
            }

            // Create user
            const user = await User.create({
                email,
                password,
                name,
                role: role || 'attendee',
            });

            // Generate token
            const token = generateToken(String(user._id));

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    },
                },
            });
        } catch (error: any) {
            console.error('Register error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error registering user',
                error: error.message,
            });
        }
    }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
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

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }

            // Generate token
            const token = generateToken(String(user._id));

            return res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        walletAddress: user.walletAddress,
                    },
                },
            });
        } catch (error: any) {
            console.error('Login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error logging in',
                error: error.message,
            });
        }
    }
);

// @route   POST /api/auth/wallet
// @desc    Connect wallet address to user
// @access  Private (add auth middleware later)
router.post(
    '/wallet',
    [body('walletAddress').notEmpty().trim()],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { walletAddress, userId } = req.body;

            // Check if wallet already connected to another user
            const existingWallet = await User.findOne({ walletAddress });
            if (existingWallet && String(existingWallet._id) !== userId) {
                return res.status(400).json({
                    success: false,
                    message: 'This wallet is already connected to another account',
                });
            }

            // Update user with wallet address
            const user = await User.findByIdAndUpdate(
                userId,
                { walletAddress },
                { new: true }
            ).select('-password');

            return res.json({
                success: true,
                message: 'Wallet connected successfully',
                data: { user },
            });
        } catch (error: any) {
            console.error('Wallet connect error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error connecting wallet',
                error: error.message,
            });
        }
    }
);

export default router;
