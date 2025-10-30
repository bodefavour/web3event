import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
    event: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    ticketType: string;
    price: number;
    quantity: number;
    qrCode: string;
    tokenId?: string;
    nftMetadata?: {
        tokenURI: string;
        imageURI: string;
    };
    status: 'active' | 'used' | 'transferred' | 'cancelled';
    purchaseDate: Date;
    usedDate?: Date;
    blockchain: {
        transactionHash: string;
        contractAddress: string;
        tokenId?: string;
        network: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
    {
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        ticketType: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },
        qrCode: {
            type: String,
            required: true,
            unique: true,
        },
        tokenId: {
            type: String,
        },
        nftMetadata: {
            tokenURI: String,
            imageURI: String,
        },
        status: {
            type: String,
            enum: ['active', 'used', 'transferred', 'cancelled'],
            default: 'active',
        },
        purchaseDate: {
            type: Date,
            default: Date.now,
        },
        usedDate: {
            type: Date,
        },
        blockchain: {
            transactionHash: {
                type: String,
                required: true,
            },
            contractAddress: {
                type: String,
                required: true,
            },
            tokenId: String,
            network: {
                type: String,
                default: 'sepolia',
            },
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
ticketSchema.index({ owner: 1, status: 1 });
ticketSchema.index({ event: 1, status: 1 });

export default mongoose.model<ITicket>('Ticket', ticketSchema);
