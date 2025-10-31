import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import Event from '../src/models/Event';
import Ticket from '../src/models/Ticket';
import Transaction from '../src/models/Transaction';
import Notification from '../src/models/Notification';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/web3event';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Ticket.deleteMany({});
    await Transaction.deleteMany({});
    await Notification.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Users
    const users = await User.create([
      {
        email: 'host@example.com',
        password: 'password123', // Will be hashed automatically
        name: 'Event Host',
        role: 'host',
        walletAddress: '0.0.12345',
        bio: 'Professional event organizer',
      },
      {
        email: 'attendee@example.com',
        password: 'password123',
        name: 'John Attendee',
        role: 'attendee',
        walletAddress: '0.0.67890',
        bio: 'Music and tech enthusiast',
      },
      {
        email: 'user2@example.com',
        password: 'password123',
        name: 'Jane Smith',
        role: 'attendee',
        walletAddress: '0.0.11111',
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    const [host, attendee1, attendee2] = users;

    // Create Events
    const events = await Event.create([
      {
        title: 'Summer Music Festival 2025',
        description: 'The biggest summer music festival featuring top artists from around the world.',
        host: host._id,
        category: 'Music',
        venue: 'Central Park Amphitheater',
        location: {
          address: '123 Park Ave',
          city: 'New York',
          country: 'USA',
          coordinates: { lat: 40.7829, lng: -73.9654 },
        },
        startDate: new Date('2025-07-15T18:00:00Z'),
        endDate: new Date('2025-07-17T23:00:00Z'),
        image: 'https://picsum.photos/seed/event1/400/300',
        ticketTypes: [
          {
            name: 'General Admission',
            price: 50,
            quantity: 1000,
            sold: 450,
            description: 'Standard entry ticket',
            benefits: ['Access to all stages', 'Festival map'],
          },
          {
            name: 'VIP Pass',
            price: 150,
            quantity: 200,
            sold: 85,
            description: 'VIP experience with exclusive perks',
            benefits: ['Priority entry', 'VIP lounge access', 'Meet & greet', 'Premium viewing area'],
          },
        ],
        status: 'published',
        blockchain: {
          network: 'hedera-testnet',
          contractAddress: '0.0.55555',
          deployedAt: new Date(),
        },
        analytics: {
          views: 1250,
          favorites: 320,
        },
      },
      {
        title: 'Tech Innovation Conference',
        description: 'Annual technology conference showcasing the latest innovations in AI, blockchain, and Web3.',
        host: host._id,
        category: 'Technology',
        venue: 'Convention Center',
        location: {
          address: '456 Tech Blvd',
          city: 'San Francisco',
          country: 'USA',
          coordinates: { lat: 37.7749, lng: -122.4194 },
        },
        startDate: new Date('2025-08-20T09:00:00Z'),
        endDate: new Date('2025-08-22T18:00:00Z'),
        image: 'https://picsum.photos/seed/event2/400/300',
        ticketTypes: [
          {
            name: 'Early Bird',
            price: 299,
            quantity: 500,
            sold: 500,
            description: 'Early bird special pricing',
            benefits: ['All sessions', 'Networking dinner', 'Swag bag'],
          },
          {
            name: 'Standard',
            price: 399,
            quantity: 800,
            sold: 320,
            description: 'Regular admission',
            benefits: ['All sessions', 'Lunch included'],
          },
        ],
        status: 'published',
        blockchain: {
          network: 'hedera-testnet',
          contractAddress: '0.0.55556',
          deployedAt: new Date(),
        },
        analytics: {
          views: 2100,
          favorites: 580,
        },
      },
      {
        title: 'Art Gallery Opening',
        description: 'Exclusive opening of contemporary art exhibition featuring emerging artists.',
        host: host._id,
        category: 'Art',
        venue: 'Modern Art Gallery',
        location: {
          address: '789 Gallery St',
          city: 'Los Angeles',
          country: 'USA',
          coordinates: { lat: 34.0522, lng: -118.2437 },
        },
        startDate: new Date('2025-09-10T19:00:00Z'),
        endDate: new Date('2025-09-10T23:00:00Z'),
        image: 'https://picsum.photos/seed/event3/400/300',
        ticketTypes: [
          {
            name: 'General Entry',
            price: 25,
            quantity: 200,
            sold: 78,
            description: 'Gallery access',
            benefits: ['Gallery tour', 'Complimentary drink'],
          },
          {
            name: 'Collector Pass',
            price: 100,
            quantity: 50,
            sold: 32,
            description: 'VIP collector experience',
            benefits: ['Private viewing', 'Artist meet & greet', 'Champagne reception', 'First purchase priority'],
          },
        ],
        status: 'published',
        blockchain: {
          network: 'hedera-testnet',
          contractAddress: '0.0.55557',
          deployedAt: new Date(),
        },
        analytics: {
          views: 890,
          favorites: 210,
        },
      },
    ]);
    console.log(`✅ Created ${events.length} events`);

    // Create Tickets
    const tickets = await Ticket.create([
      {
        event: events[0]._id,
        owner: attendee1._id,
        ticketType: 'VIP Pass',
        price: 150,
        quantity: 2,
        qrCode: 'QR-SUMMER-VIP-001',
        status: 'active',
        blockchain: {
          transactionHash: '0.0.12345@1234567890.123456789',
          contractAddress: '0.0.55555',
          tokenId: '1',
          network: 'hedera-testnet',
        },
      },
      {
        event: events[0]._id,
        owner: attendee2._id,
        ticketType: 'General Admission',
        price: 50,
        quantity: 1,
        qrCode: 'QR-SUMMER-GA-002',
        status: 'active',
        blockchain: {
          transactionHash: '0.0.12345@1234567891.123456789',
          contractAddress: '0.0.55555',
          tokenId: '2',
          network: 'hedera-testnet',
        },
      },
      {
        event: events[1]._id,
        owner: attendee1._id,
        ticketType: 'Standard',
        price: 399,
        quantity: 1,
        qrCode: 'QR-TECH-STD-003',
        status: 'active',
        blockchain: {
          transactionHash: '0.0.12345@1234567892.123456789',
          contractAddress: '0.0.55556',
          tokenId: '1',
          network: 'hedera-testnet',
        },
      },
    ]);
    console.log(`✅ Created ${tickets.length} tickets`);

    // Create Transactions
    const transactions = await Transaction.create([
      {
        user: attendee1._id,
        event: events[0]._id,
        ticket: tickets[0]._id,
        type: 'purchase',
        amount: 300, // 2 VIP tickets
        currency: 'HBAR',
        status: 'completed',
        paymentMethod: 'crypto',
        blockchain: {
          transactionHash: '0.0.12345@1234567890.123456789',
          blockNumber: 12345678,
          network: 'hedera-testnet',
          gasUsed: '0.05',
          gasPaid: '0.0001',
        },
      },
      {
        user: attendee2._id,
        event: events[0]._id,
        ticket: tickets[1]._id,
        type: 'purchase',
        amount: 50,
        currency: 'HBAR',
        status: 'completed',
        paymentMethod: 'crypto',
        blockchain: {
          transactionHash: '0.0.12345@1234567891.123456789',
          blockNumber: 12345679,
          network: 'hedera-testnet',
          gasUsed: '0.05',
          gasPaid: '0.0001',
        },
      },
      {
        user: attendee1._id,
        event: events[1]._id,
        ticket: tickets[2]._id,
        type: 'purchase',
        amount: 399,
        currency: 'HBAR',
        status: 'completed',
        paymentMethod: 'crypto',
        blockchain: {
          transactionHash: '0.0.12345@1234567892.123456789',
          blockNumber: 12345680,
          network: 'hedera-testnet',
          gasUsed: '0.05',
          gasPaid: '0.0001',
        },
      },
    ]);
    console.log(`✅ Created ${transactions.length} transactions`);

    // Create Notifications
    const notifications = await Notification.create([
      {
        user: attendee1._id,
        type: 'ticket',
        title: 'Ticket Purchased',
        message: 'Your VIP Pass for Summer Music Festival has been confirmed!',
        read: false,
        data: {
          ticketId: tickets[0]._id.toString(),
          eventId: events[0]._id.toString(),
        },
      },
      {
        user: attendee1._id,
        type: 'event',
        title: 'Event Reminder',
        message: 'Summer Music Festival starts in 7 days! Get ready!',
        read: false,
        data: {
          eventId: events[0]._id.toString(),
        },
      },
      {
        user: attendee2._id,
        type: 'ticket',
        title: 'Ticket Purchased',
        message: 'Your General Admission ticket for Summer Music Festival has been confirmed!',
        read: true,
        data: {
          ticketId: tickets[1]._id.toString(),
          eventId: events[0]._id.toString(),
        },
      },
      {
        user: host._id,
        type: 'event',
        title: 'New Ticket Sale',
        message: '2 tickets sold for Summer Music Festival',
        read: false,
        data: {
          eventId: events[0]._id.toString(),
        },
      },
    ]);
    console.log(`✅ Created ${notifications.length} notifications`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Events: ${events.length}`);
    console.log(`   Tickets: ${tickets.length}`);
    console.log(`   Transactions: ${transactions.length}`);
    console.log(`   Notifications: ${notifications.length}`);
    console.log('\n🔐 Test Credentials:');
    console.log('   Host: host@example.com / password123');
    console.log('   Attendee: attendee@example.com / password123');
    console.log('\n🌐 Hedera Wallets:');
    console.log(`   Host: ${host.walletAddress}`);
    console.log(`   Attendee: ${attendee1.walletAddress}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

// Run seeding
seedData();
