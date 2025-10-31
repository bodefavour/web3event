# MongoDB Database Setup Guide

## Quick Setup for Development

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create Free Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select your preferred region
   - Click "Create Cluster"

3. **Configure Access**
   - Click "Database Access" → "Add New Database User"
   - Create username and password
   - Set privileges to "Read and write to any database"
   
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   
   Example:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/web3event?retryWrites=true&w=majority
   ```

5. **Update Backend .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/web3event?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB**
   - Windows: MongoDB runs as a service automatically
   - Mac/Linux: `brew services start mongodb-community` or `sudo systemctl start mongod`

3. **Verify Running**
   ```bash
   # Check if MongoDB is running
   mongosh
   ```

4. **Update Backend .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/web3event
   ```

## Database Schema

### Collections Created Automatically:

1. **users**
   - Authentication and profile data
   - Wallet addresses
   - Role (host/attendee)

2. **events**
   - Event details
   - Ticket types
   - Blockchain references (Hedera token IDs)

3. **tickets**
   - NFT ticket data
   - QR codes
   - Blockchain transaction hashes

4. **transactions**
   - Purchase history
   - Hedera transaction records

5. **notifications**
   - User notifications
   - Read status

## Testing Database Connection

### From Backend:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Using MongoDB Compass (GUI):

1. Download: https://www.mongodb.com/try/download/compass
2. Install and open
3. Connect using your connection string
4. Browse collections and data

## Seed Data (Optional)

Create sample data for testing:

```bash
cd backend
node scripts/seed-data.js
```

This will create:
- 2 sample users (host and attendee)
- 3 sample events
- 5 sample tickets

## Environment Variables

### Backend `.env`:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/web3event

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Hedera
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...

# Server
NODE_ENV=development
PORT=5000
```

## Database Operations

### Create User:
```javascript
const user = await User.create({
  email: 'user@example.com',
  password: 'hashed_password',
  name: 'John Doe',
  role: 'attendee'
});
```

### Create Event:
```javascript
const event = await Event.create({
  title: 'Summer Festival',
  host: userId,
  startDate: new Date('2025-07-01'),
  ticketTypes: [
    { name: 'General', price: 50, quantity: 500 }
  ]
});
```

### Create Ticket:
```javascript
const ticket = await Ticket.create({
  event: eventId,
  owner: userId,
  ticketType: 'VIP',
  qrCode: 'unique_qr_code',
  blockchain: {
    transactionHash: 'hedera_tx_id',
    network: 'hedera-testnet'
  }
});
```

## Troubleshooting

### "MongoDB connection error"
- Check if MongoDB is running
- Verify connection string is correct
- Check firewall/network access
- For Atlas: Verify IP whitelist

### "Authentication failed"
- Check username/password in connection string
- Verify database user has correct permissions

### "Connection timeout"
- Check internet connection
- Verify MongoDB Atlas cluster is active
- Check if IP is whitelisted

## Monitoring

### Atlas Dashboard:
- View real-time metrics
- Monitor queries
- Track storage usage
- Set up alerts

### Logs:
```bash
# Backend logs show MongoDB operations
npm run dev
```

## Backup

### MongoDB Atlas:
- Automatic backups included in free tier
- Point-in-time recovery available

### Local MongoDB:
```bash
# Export database
mongodump --db web3event --out ./backup

# Import database
mongorestore --db web3event ./backup/web3event
```

## Production Considerations

1. **Security**:
   - Use strong passwords
   - Restrict IP access
   - Enable SSL/TLS
   - Use connection pooling

2. **Performance**:
   - Create indexes on frequently queried fields
   - Monitor slow queries
   - Optimize query patterns

3. **Scaling**:
   - Upgrade to paid tier for more storage
   - Enable sharding for horizontal scaling
   - Use read replicas

## Status Checklist

- [ ] MongoDB installed or Atlas account created
- [ ] Connection string added to `.env`
- [ ] Backend starts without errors
- [ ] Can create/read database records
- [ ] Collections are created automatically
- [ ] Database operations work in API endpoints

## Next Steps

1. Start backend: `cd backend && npm run dev`
2. Test API: `curl http://localhost:5000/health`
3. Register user: `POST /api/auth/register`
4. Create event: `POST /api/events`
5. Monitor database in Compass or Atlas

---

**Current Status**: Database configuration ready, needs connection string in `.env`
