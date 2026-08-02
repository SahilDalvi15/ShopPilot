const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      logger.info(`User ${userId} joined their room`);
    });

    // Leave user-specific room
    socket.on('leave', (userId) => {
      socket.leave(`user:${userId}`);
      logger.info(`User ${userId} left their room`);
    });

    // Join admin room for notifications
    socket.on('join-admin', () => {
      socket.join('admin');
      logger.info(`User joined admin room`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Emit notification to specific user
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
    logger.info(`Emitted ${event} to user ${userId}`);
  }
};

// Emit notification to all admins
const emitToAdmins = (event, data) => {
  if (io) {
    io.to('admin').emit(event, data);
    logger.info(`Emitted ${event} to admins`);
  }
};

// Emit notification to all connected users
const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
    logger.info(`Emitted ${event} to all users`);
  }
};

module.exports = {
  initializeSocket,
  emitToUser,
  emitToAdmins,
  emitToAll,
  getIO: () => io,
};
