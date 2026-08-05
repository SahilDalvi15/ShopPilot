import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const socketInstance = io((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').replace('/api/v1', ''), {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to WebSocket server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Join user room when authenticated
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit('join', user._id);
      if (user.role === 'admin' || user.role === 'super_admin') {
        socket.emit('join-admin');
      }
    }
  }, [socket, user]);

  const value = {
    socket,
    isConnected,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
