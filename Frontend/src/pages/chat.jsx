import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, Search, ArrowLeft, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Paperclip, MessageSquare, Loader2,
  Cpu, ShieldCheck, Globe, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext'; 
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat() {
  const { user } = useAuth();
  const { socket, onlineUsers, setNotifications } = useChat(); 
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (activeContact && user) {
      const token = user?.token || localStorage.getItem('token');
      axios.put(`http://localhost:5000/api/messages/mark-read/${activeContact._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Mark read error:", err));

      setConversations(prev => prev.map(c => 
        c._id === activeContact._id ? { ...c, unreadCount: 0 } : c
      ));
      setNotifications(prev => (prev || []).map(n => 
      String(n.conversationId) === String(activeContact._id) 
        ? { ...n, unread: false, isRead: true } 
        : n
      ));
    }
  }, [activeContact, user, setNotifications]);

  const fetchConversations = useCallback(async () => {
    const token = user?.token || localStorage.getItem('token');
    if (!token || !user) return; 

    try {
      const res = await axios.get('http://localhost:5000/api/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
    } catch (error) {
      console.error("Chats fetch error:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchConversations();
  }, [fetchConversations, user]);

  useEffect(() => {
    isInitialLoad.current = true;
  }, [activeContact]);

  useEffect(() => {
    if (location.state?.newChat) {
      setActiveContact(location.state.newChat);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleReceive = (incomingMessage) => {
      if (activeContact && String(incomingMessage.conversationId) === String(activeContact._id)) {
        setChatHistory((prev) => [...prev, { ...incomingMessage, sender: 'them' }]);
        const token = user?.token || localStorage.getItem('token');
        axios.put(`http://localhost:5000/api/messages/mark-read/${activeContact._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        setConversations((prevConvs) =>
          prevConvs.map((c) =>
            String(c._id) === String(incomingMessage.conversationId)
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1, updatedAt: new Date().toISOString() }
              : c
          )
        );
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [socket, activeContact, user]);

  useEffect(() => {
    if (activeContact && socket && user) {
      socket.emit("joinChatRoom", activeContact._id);

      const fetchMessages = async () => {
        const token = user?.token || localStorage.getItem('token');
        try {
          const res = await axios.get(`http://localhost:5000/api/messages/${activeContact._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const formattedMessages = res.data.map(m => {
            const senderId = m.sender?._id ? String(m.sender._id) : String(m.sender);
            return {
              ...m,
              sender: senderId === String(user._id) ? 'me' : 'them',
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          });
          setChatHistory(formattedMessages);
        } catch (error) {
          console.error("Purane messages fetch failed", error);
        }
      };
      fetchMessages();

      return () => {
        socket.emit("leaveChatRoom", activeContact._id);
      };
    }
  }, [activeContact, socket, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeContact || !user || !socket) return;

    const receiver = activeContact.participants.find(p => {
      const pId = p?._id ? String(p._id) : String(p);
      return pId !== String(user._id);
    });
    
    if (!receiver) return;
    const receiverId = receiver?._id ? String(receiver._id) : String(receiver);

    const messageData = {
      conversationId: activeContact._id,
      receiverId: receiverId, 
      text: message,
      senderId: String(user._id),
      senderName: user.name
    };

    const token = user?.token || localStorage.getItem('token');

    try {
      const dbRes = await axios.post('http://localhost:5000/api/messages', messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const finalMessage = {
        ...dbRes.data,
        receiverId: messageData.receiverId, 
        senderName: user.name,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, finalMessage]);
      setMessage('');
      socket.emit("sendMessage", finalMessage);

      setConversations(prev => prev.map(c => 
        c._id === activeContact._id ? { ...c, updatedAt: new Date().toISOString() } : c
      ));

    } catch (error) {
      console.error("Send error:", error);
    }
  };

  useEffect(() => {
    if (isInitialLoad.current && chatHistory.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      isInitialLoad.current = false;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants.find(p => {
      const pId = p?._id ? String(p._id) : String(p);
      return user && pId !== String(user._id);
    });
    return otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!user) return null;

  return (
    <div className="h-full w-full flex overflow-hidden bg-slate-950 border-r border-white/5 relative animate-in fade-in duration-700">
      
      {/* 🚀 SIDEBAR: Conversations List - Ghatai gayi width (md:w-[300px]) */}
      <div className={`w-full md:w-[300px] flex-shrink-0 flex flex-col bg-slate-900/30 backdrop-blur-xl border-r border-white/5 transition-all ${activeContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 space-y-4"> {/* Padding kam ki gayi */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-[1000] text-white tracking-tighter uppercase italic">Secure <span className="text-indigo-500">Node</span></h2>
            <div className="bg-indigo-500/10 p-1.5 rounded-lg text-indigo-400 border border-indigo-500/10">
              <Cpu size={16} />
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search data nodes..." 
              className="w-full bg-black/40 border border-white/5 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-indigo-500/30 transition-all text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-600 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-6"> {/* Horizontal padding kam ki gayi */}
          {filteredConversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 p-8 text-center opacity-40">
              <MessageSquare size={32} className="mb-4" />
              <p className="text-[9px] font-black uppercase tracking-widest">No active links</p>
            </div>
          ) : (
            <div className="space-y-1.5"> {/* Items ke beech ka gap kam kiya gaya */}
              {filteredConversations.map((conv) => {
                const otherUser = conv.participants.find(p => {
                  const pId = p?._id ? String(p._id) : String(p);
                  return pId !== String(user._id);
                });
                
                if (!otherUser) return null;
                const isOnline = onlineUsers?.includes(otherUser._id);
                const isActive = activeContact?._id === conv._id;

                return (
                  <motion.div 
                    key={conv._id} 
                    onClick={() => setActiveContact(conv)}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-2.5 flex items-center gap-3 cursor-pointer transition-all duration-300 rounded-xl border
                      ${isActive 
                        ? 'bg-indigo-600/10 border-indigo-500/20 shadow-lg shadow-indigo-600/5' 
                        : 'bg-transparent border-transparent hover:bg-white/[0.03]'}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/5 overflow-hidden shadow-xl"> {/* Avatar size w-12 -> w-10 */}
                        {otherUser.avatar ? (
                          <img src={otherUser.avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-indigo-400 font-black text-sm">{otherUser.name?.charAt(0)}</span>
                        )}
                      </div>
                      {isOnline && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg shadow-emerald-500/20"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className={`font-black truncate text-[13px] tracking-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {otherUser.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border
                           ${isActive ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/10' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                           {otherUser.role || 'Agent'}
                         </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0 ml-auto">
                        <span className="text-[7px] font-black text-slate-600 uppercase tracking-tighter italic">
                          {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        
                        {conv.unreadCount > 0 && !isActive && (
                          <div className="min-w-[16px] h-[16px] px-1 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20">
                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                          </div>
                        )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🗨️ CHAT INTERFACE - flex-1 isey automatically baaki bachi space dilwayega */}
      {activeContact ? (() => {
        const otherUser = activeContact.participants.find(p => {
          const pId = p?._id ? String(p._id) : String(p);
          return pId !== String(user._id);
        });
        const isOnline = onlineUsers?.includes(otherUser?._id);

        return (
        <div className="flex-1 flex flex-col bg-[#020617] relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0z' fill='%23ffffff'/%3E%3C/svg%3E")` }}></div>

          <div className="h-[65px] bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveContact(null)} className="md:hidden p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
                <ArrowLeft size={18} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 shadow-2xl">
                  {otherUser?.avatar ? (
                    <img src={otherUser.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <User size={18} className="text-slate-600" />
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-black text-white text-sm tracking-tight leading-none mb-1">{otherUser?.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1 h-1 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className={`text-[8px] font-black uppercase tracking-[0.15em] ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isOnline ? 'Active Sync' : 'Offline Mode'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-400">
              <button className="p-2.5 hover:bg-white/5 hover:text-indigo-400 rounded-lg transition-all"><Phone size={16} /></button>
              <button className="p-2.5 hover:bg-white/5 hover:text-indigo-400 rounded-lg transition-all"><Video size={16} /></button>
              <div className="w-px h-5 bg-white/5 mx-1.5"></div>
              <button className="p-2.5 hover:bg-white/5 hover:text-white rounded-lg transition-all"><MoreVertical size={16} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 z-10 custom-scrollbar bg-slate-950/20">
            {chatHistory.map((msg, index) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id || msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`relative max-w-[80%] md:max-w-[60%] px-4 py-3 shadow-2xl flex flex-col transition-all group
                    ${isMe ? 'bg-indigo-600 text-white rounded-t-2xl rounded-bl-2xl rounded-br-md' 
                          : 'bg-slate-900 text-slate-200 border border-white/5 rounded-t-2xl rounded-br-2xl rounded-bl-md'}`}>
                    <p className="text-[13px] font-medium leading-relaxed pr-12">{msg.text}</p>
                    <div className={`absolute bottom-2 right-2.5 flex items-center gap-1 ${isMe ? 'text-white/60' : 'text-slate-500'}`}>
                      <span className="text-[8px] font-black tracking-tighter uppercase italic">{msg.time}</span>
                      {isMe && <CheckCheck size={12} className="text-white/80" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          <div className="p-3 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 z-20">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-5xl mx-auto">
              <button type="button" className="p-3 text-slate-500 hover:text-white rounded-xl transition-all shrink-0"><Paperclip size={18} /></button>
              <div className="flex-1 relative flex items-center bg-black/40 rounded-2xl border border-white/5 transition-all overflow-hidden shadow-inner">
                <input 
                  type="text" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Initiate communication..." 
                  className="w-full bg-transparent border-none py-3.5 px-5 text-[13px] text-white font-bold placeholder:text-slate-700 focus:outline-none"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                disabled={!message.trim()} 
                className="bg-indigo-600 text-white p-3.5 rounded-2xl shadow-2xl transition-all shrink-0"
              >
                <Send size={16} />
              </motion.button>
            </form>
          </div>
        </div>
      );})() : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#020617] relative">
          <MessageSquare size={44} className="text-indigo-500 animate-pulse mb-8" />
          <h2 className="text-3xl font-[1000] text-white tracking-tighter uppercase italic">Neural Hub</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Waiting for peer handshakes...</p>
        </div>
      )}
    </div>
  );
}