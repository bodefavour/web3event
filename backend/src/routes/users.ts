import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';

const router = Router();

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                walletAddress: true,
                bio: true,
                profileImage: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.json({
            success: true,
            data: { user },
        });
    } catch (error: any) {
        console.error('Get user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message,
        });
    }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { name, bio, profileImage, role } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (profileImage !== undefined) updateData.profileImage = profileImage;
        if (role) updateData.role = role;

        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                walletAddress: true,
                bio: true,
                profileImage: true,
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user },
        });
    } catch (error: any) {
        console.error('Update user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message,
        });
    }
});

export default router;
