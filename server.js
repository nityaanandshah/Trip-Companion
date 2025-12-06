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
// tripId -> Map of userId -> { socketId, userName }
const tripRooms = new Map();

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

      // Fetch user details including avatar
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, avatarUrl: true },
      });

      socket.userId = userId;
      socket.userName = user?.name || userName || 'Anonymous';
      socket.userAvatarUrl = user?.avatarUrl || null;
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

        // Track online user (use Map to prevent duplicates by userId)
        if (!tripRooms.has(tripId)) {
          tripRooms.set(tripId, new Map());
        }
        // If user already exists, update their socket ID (handles reconnections)
        tripRooms.get(tripId).set(socket.userId, {
          socketId: socket.id,
          userName: socket.userName,
          avatarUrl: socket.userAvatarUrl,
        });

        // Get online users for this trip (now deduplicated by userId)
        const onlineUsers = Array.from(tripRooms.get(tripId).entries()).map(([userId, user]) => ({
          userId,
          userName: user.userName,
          avatarUrl: user.avatarUrl,
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
      
      // Remove from online users (by userId)
      if (tripRooms.has(tripId)) {
        const usersMap = tripRooms.get(tripId);
        usersMap.delete(socket.userId);
        
        if (usersMap.size === 0) {
          tripRooms.delete(tripId);
        }

        // Get updated online users
        const onlineUsers = Array.from(usersMap.entries()).map(([userId, user]) => ({
          userId,
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

        // Create notifications for users NOT currently in the chat room
        // Get all approved members + owner
        const allApprovedAttendees = await prisma.tripAttendee.findMany({
          where: {
            tripId,
            status: 'approved',
          },
          select: { userId: true },
        });

        const allMemberIds = [
          trip.ownerId,
          ...allApprovedAttendees.map(a => a.userId),
        ];

        // Get users currently in the chat room
        const onlineUserIds = tripRooms.has(tripId)
          ? Array.from(tripRooms.get(tripId).keys())
          : [];

        // Find users who are NOT in the chat (offline or online but not viewing this chat)
        const offlineUserIds = allMemberIds.filter(
          uid => uid !== socket.userId && !onlineUserIds.includes(uid)
        );

        console.log(`💬 Message sent in trip ${tripId} by ${socket.userName}`);
        console.log(`   All members: ${allMemberIds.length} users`);
        console.log(`   Online in chat: ${onlineUserIds.length} users (${onlineUserIds.join(', ') || 'none'})`);
        console.log(`   Need notifications: ${offlineUserIds.length} users (${offlineUserIds.join(', ') || 'none'})`);

        // Create notifications for offline users
        // Only create ONE notification per trip per user (don't spam with multiple notifications)
        if (offlineUserIds.length > 0) {
          for (const userId of offlineUserIds) {
            // Check if user already has an unread notification for this trip
            const existingNotification = await prisma.notification.findFirst({
              where: {
                userId,
                type: 'new_chat_message',
                referenceId: tripId,
                read: false,
              },
            });

            // Only create notification if one doesn't already exist
            if (!existingNotification) {
              await prisma.notification.create({
                data: {
                  userId,
                  type: 'new_chat_message',
                  referenceId: tripId,
                  message: `You have new messages from "${trip.title}"`,
                  read: false,
                },
              });
            }
          }
          console.log(`   ✅ Checked/created notifications for ${offlineUserIds.length} offline users`);
        } else {
          console.log(`   ⚠️ No notifications created - all users are online in chat`);
        }
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

      // Remove from all trip rooms (by userId)
      if (socket.currentTripId) {
        const tripId = socket.currentTripId;
        
        if (tripRooms.has(tripId)) {
          const usersMap = tripRooms.get(tripId);
          usersMap.delete(socket.userId);
          
          if (usersMap.size === 0) {
            tripRooms.delete(tripId);
          }

          // Get updated online users
          const onlineUsers = Array.from(usersMap.entries()).map(([userId, user]) => ({
            userId,
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


