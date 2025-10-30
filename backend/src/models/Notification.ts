import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'event' | 'ticket' | 'transaction' | 'system';
  title: string;
  message: string;
  read: boolean;
  data?: {
    eventId?: string;
    ticketId?: string;
    transactionId?: string;
    actionUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['event', 'ticket', 'transaction', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    data: {
      eventId: String,
      ticketId: String,
      transactionId: String,
      actionUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
