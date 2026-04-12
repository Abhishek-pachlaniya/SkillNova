import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); 
  const [notifications, setNotifications] = useState([]); 

  useEffect(() => {
    if (user?._id) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      
      newSocket.emit("setupUser", String(user._id));

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      
      newSocket.on("userStatusUpdate", (data) => {
      console.log("Status changed:", data);
    });
      newSocket.on("newNotification", (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <ChatContext.Provider value={{ socket, onlineUsers, notifications, setNotifications }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);