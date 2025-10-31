import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import '../prisma.config';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.notification.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create users
    const hostPassword = await bcrypt.hash('password123', 10);
    const attendeePassword = await bcrypt.hash('password123', 10);

    const host = await prisma.user.create({
        data: {
            email: 'host@example.com',
            password: hostPassword,
            name: 'Event Host',
            role: 'HOST',
            bio: 'Experienced event organizer specializing in tech and blockchain events',
            profileImage: 'https://via.placeholder.com/150',
            walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        },
    });

    const attendee = await prisma.user.create({
        data: {
            email: 'attendee@example.com',
            password: attendeePassword,
            name: 'John Attendee',
            role: 'ATTENDEE',
            bio: 'Crypto enthusiast and event lover',
            profileImage: 'https://via.placeholder.com/150',
            walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        },
    });

    console.log('✅ Created users');

    // Create events
    const event1 = await prisma.event.create({
        data: {
            title: 'Web3 Developer Conference 2024',
            description: 'Join us for the biggest Web3 developer conference of the year. Learn about the latest in blockchain technology, DeFi, NFTs, and more.',
            hostId: host.id,
            category: 'TECHNOLOGY',
            venue: 'Convention Center',
            address: '123 Main St',
            city: 'San Francisco',
            country: 'USA',
            latitude: 37.7749,
            longitude: -122.4194,
            startDate: new Date('2024-06-15T09:00:00Z'),
            endDate: new Date('2024-06-17T18:00:00Z'),
            image: 'https://via.placeholder.com/800x400',
            status: 'PUBLISHED',
            ticketTypes: {
                create: [
                    {
                        name: 'Early Bird',
                        price: 299.99,
                        quantity: 100,
                        sold: 45,
                        benefits: ['Access to all sessions', 'Conference swag bag', 'Networking dinner'],
                    },
                    {
                        name: 'General Admission',
                        price: 499.99,
                        quantity: 500,
                        sold: 128,
                        benefits: ['Access to all sessions', 'Conference swag bag'],
                    },
                    {
                        name: 'VIP Pass',
                        price: 999.99,
                        quantity: 50,
                        sold: 12,
                        benefits: ['Access to all sessions', 'VIP lounge access', 'Private meetup with speakers', 'Premium swag'],
                    },
                ],
            },
        },
    });

    const event2 = await prisma.event.create({
        data: {
            title: 'NFT Art Exhibition',
            description: 'Explore the intersection of art and technology in this exclusive NFT showcase featuring digital artists from around the world.',
            hostId: host.id,
            category: 'ART',
            venue: 'Digital Art Gallery',
            address: '456 Art Ave',
            city: 'New York',
            country: 'USA',
            latitude: 40.7128,
            longitude: -74.0060,
            startDate: new Date('2024-07-20T10:00:00Z'),
            endDate: new Date('2024-07-20T20:00:00Z'),
            image: 'https://via.placeholder.com/800x400',
            status: 'PUBLISHED',
            ticketTypes: {
                create: [
                    {
                        name: 'Standard Entry',
                        price: 50.00,
                        quantity: 200,
                        sold: 89,
                        benefits: ['Gallery access', 'Digital catalog'],
                    },
                    {
                        name: 'Collector Pass',
                        price: 250.00,
                        quantity: 50,
                        sold: 22,
                        benefits: ['Gallery access', 'Meet the artists', 'Exclusive NFT airdrop', 'Private viewing'],
                    },
                ],
            },
        },
    });

    console.log('✅ Created events');

    // Create tickets for attendee
    const event1TicketTypes = await prisma.ticketType.findMany({
        where: { eventId: event1.id },
    });

    await prisma.ticket.create({
        data: {
            eventId: event1.id,
            ownerId: attendee.id,
            ticketType: event1TicketTypes[0].name,
            price: event1TicketTypes[0].price,
            qrCode: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'ACTIVE',
            transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            contractAddress: '0.0.12345',
            tokenId: '1',
            network: 'hedera-testnet',
        },
    });

    console.log('✅ Created tickets');

    // Create transaction
    await prisma.transaction.create({
        data: {
            userId: attendee.id,
            eventId: event1.id,
            type: 'PURCHASE',
            amount: event1TicketTypes[0].price,
            status: 'COMPLETED',
            transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        },
    });

    console.log('✅ Created transactions');

    // Create notifications
    await prisma.notification.create({
        data: {
            userId: attendee.id,
            type: 'TICKET',
            title: 'Ticket Purchase Confirmed',
            message: `Your ticket for "${event1.title}" has been confirmed! Check your tickets to view details.`,
            read: false,
        },
    });

    await prisma.notification.create({
        data: {
            userId: host.id,
            type: 'TICKET',
            title: 'New Ticket Sale',
            message: `Someone just purchased an Early Bird ticket for "${event1.title}"`,
            read: false,
        },
    });

    console.log('✅ Created notifications');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📧 Test Accounts:');
    console.log('Host: host@example.com / password123');
    console.log('Attendee: attendee@example.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
