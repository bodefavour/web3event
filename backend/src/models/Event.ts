import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketType {
    name: string;
    price: number;
    quantity: number;
    sold: number;
    description?: string;
    benefits?: string[];
}

export interface IEvent extends Document {
    title: string;
    description: string;
    host: mongoose.Types.ObjectId;
    category: string;
    venue: string;
    location: {
        address: string;
        city: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    startDate: Date;
    endDate: Date;
    image?: string;
    ticketTypes: ITicketType[];
    totalTickets: number;
    soldTickets: number;
    status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
    contractAddress?: string;
    blockchain: {
        network: string;
        contractAddress?: string;
        deployedAt?: Date;
    };
    analytics: {
        views: number;
        favorites: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ticketTypeSchema = new Schema<ITicketType>({
    name: {
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
        min: 0,
    },
    sold: {
        type: Number,
        default: 0,
        min: 0,
    },
    description: {
        type: String,
    },
    benefits: [String],
});

const eventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        host: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        venue: {
            type: String,
            required: true,
        },
        location: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true },
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        image: {
            type: String,
        },
        ticketTypes: [ticketTypeSchema],
        totalTickets: {
            type: Number,
            default: 0,
        },
        soldTickets: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
            default: 'draft',
        },
        blockchain: {
            network: {
                type: String,
                default: 'sepolia',
            },
            contractAddress: String,
            deployedAt: Date,
        },
        analytics: {
            views: {
                type: Number,
                default: 0,
            },
            favorites: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Calculate total tickets from ticket types
eventSchema.pre('save', function (next) {
    if (this.ticketTypes && this.ticketTypes.length > 0) {
        this.totalTickets = this.ticketTypes.reduce(
            (sum, type) => sum + type.quantity,
            0
        );
        this.soldTickets = this.ticketTypes.reduce(
            (sum, type) => sum + type.sold,
            0
        );
    }
    next();
});

export default mongoose.model<IEvent>('Event', eventSchema);
