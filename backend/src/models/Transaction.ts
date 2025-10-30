import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    event: mongoose.Types.ObjectId;
    ticket: mongoose.Types.ObjectId;
    type: 'purchase' | 'refund' | 'transfer';
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: 'crypto' | 'card' | 'other';
    blockchain: {
        transactionHash: string;
        blockNumber?: number;
        network: string;
        gasUsed?: string;
        gasPaid?: string;
    };
    metadata?: {
        walletAddress?: string;
        fromAddress?: string;
        toAddress?: string;
        errorMessage?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        ticket: {
            type: Schema.Types.ObjectId,
            ref: 'Ticket',
        },
        type: {
            type: String,
            enum: ['purchase', 'refund', 'transfer'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            required: true,
            default: 'ETH',
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['crypto', 'card', 'other'],
            default: 'crypto',
        },
        blockchain: {
            transactionHash: {
                type: String,
                required: true,
                unique: true,
            },
            blockNumber: Number,
            network: {
                type: String,
                default: 'sepolia',
            },
            gasUsed: String,
            gasPaid: String,
        },
        metadata: {
            walletAddress: String,
            fromAddress: String,
            toAddress: String,
            errorMessage: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
transactionSchema.index({ user: 1, status: 1 });
transactionSchema.index({ event: 1 });
transactionSchema.index({ 'blockchain.transactionHash': 1 });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
