const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();

// Store connected users per trip
const tripRooms = new Map(); // tripId -> Set of { socketId, userId, userName }

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    try {
      const userId = socket.handshake.auth.userId;
      const userName = socket.handshake.auth.userName;

      if (!userId) {
        return next(new Error('Authentication error'));
      }

      socket.userId = userId;
      socket.userName = userName || 'Anonymous';
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Socket.io connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userName})`);

    // Join trip chat room
    socket.on('join-trip-chat', async ({ tripId }) => {
      try {
        // Verify user is approved attendee or owner
        const trip = await prisma.trip.findUnique({
          where: { id: tripId },
          include: {
            attendees: {
              where: {
                userId: socket.userId,
                status: 'approved',
              },
            },
          },
        });

        if (!trip) {
          socket.emit('error', { message: 'Trip not found' });
          return;
        }

        const isOwner = trip.ownerId === socket.userId;
        const isApprovedAttendee = trip.attendees.length > 0;

        if (!isOwner && !isApprovedAttendee) {
          socket.emit('error', { message: 'Access denied. You must be approved to join this chat.' });
          return;
        }

        // Join the room
        socket.join(tripId);
        socket.currentTripId = tripId;

        // Track online user
        if (!tripRooms.has(tripId)) {
          tripRooms.set(tripId, new Set());
        }
        tripRooms.get(tripId).add({
          socketId: socket.id,
          userId: socket.userId,
          userName: socket.userName,
        });

        // Get online users for this trip
        const onlineUsers = Array.from(tripRooms.get(tripId) || []).map((user) => ({
          userId: user.userId,
          userName: user.userName,
        }));

        // Notify user they joined
        socket.emit('joined-trip-chat', { tripId, onlineUsers });

        // Notify others in the room
        socket.to(tripId).emit('user-joined', {
          userId: socket.userId,
          userName: socket.userName,
          onlineUsers,
        });

        console.log(`User ${socket.userName} joined trip ${tripId}`);
      } catch (error) {
        console.error('Error joining trip chat:', error);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Leave trip chat room
    socket.on('leave-trip-chat', ({ tripId }) => {
      socket.leave(tripId);
      
      // Remove from online users
      if (tripRooms.has(tripId)) {
        const users = tripRooms.get(tripId);
        const updatedUsers = Array.from(users).filter((u) => u.socketId !== socket.id);
        
        if (updatedUsers.length > 0) {
          tripRooms.set(tripId, new Set(updatedUsers));
        } else {
          tripRooms.delete(tripId);
        }

        // Get updated online users
        const onlineUsers = updatedUsers.map((user) => ({
          userId: user.userId,
          userName: user.userName,
        }));

        // Notify others
        socket.to(tripId).emit('user-left', {
          userId: socket.userId,
          userName: socket.userName,
          onlineUsers,
        });
      }

      socket.currentTripId = null;
      console.log(`User ${socket.userName} left trip ${tripId}`);
    });

    // Send message
    socket.on('send-message', async ({ tripId, content }) => {
      try {
        if (!content || content.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        if (content.length > 1000) {
          socket.emit('error', { message: 'Message too long (max 1000 characters)' });
          return;
        }

        // Verify user has access
        const trip = await prisma.trip.findUnique({
          where: { id: tripId },
          include: {
            attendees: {
              where: {
                userId: socket.userId,
                status: 'approved',
              },
            },
          },
        });

        if (!trip) {
          socket.emit('error', { message: 'Trip not found' });
          return;
        }

        const isOwner = trip.ownerId === socket.userId;
        const isApprovedAttendee = trip.attendees.length > 0;

        if (!isOwner && !isApprovedAttendee) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Save message to database
        const message = await prisma.chatMessage.create({
          data: {
            tripId,
            userId: socket.userId,
            content: content.trim(),
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        });

        // Broadcast message to room (including sender)
        io.to(tripId).emit('message', {
          id: message.id,
          tripId: message.tripId,
          content: message.content,
          createdAt: message.createdAt,
          user: {
            id: message.user.id,
            name: message.user.name,
            avatarUrl: message.user.avatarUrl,
          },
        });

        console.log(`Message sent in trip ${tripId} by ${socket.userName}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ tripId, isTyping }) => {
      socket.to(tripId).emit('user-typing', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping,
      });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId} (${socket.userName})`);

      // Remove from all trip rooms
      if (socket.currentTripId) {
        const tripId = socket.currentTripId;
        
        if (tripRooms.has(tripId)) {
          const users = tripRooms.get(tripId);
          const updatedUsers = Array.from(users).filter((u) => u.socketId !== socket.id);
          
          if (updatedUsers.length > 0) {
            tripRooms.set(tripId, new Set(updatedUsers));
          } else {
            tripRooms.delete(tripId);
          }

          // Get updated online users
          const onlineUsers = updatedUsers.map((user) => ({
            userId: user.userId,
            userName: user.userName,
          }));

          // Notify others
          socket.to(tripId).emit('user-left', {
            userId: socket.userId,
            userName: socket.userName,
            onlineUsers,
          });
        }
      }
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log('> Socket.io server is running');
    });
});


