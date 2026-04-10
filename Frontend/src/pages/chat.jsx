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
  const { socket, onlineUsers } = useChat(); 
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const messagesEndRef = useRef(null);

  // === LOGIC PRESERVED: Fetch Conversations ===
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
    if (location.state?.newChat) {
      setActiveContact(location.state.newChat);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // === LOGIC PRESERVED: Socket Listeners ===
  useEffect(() => {
    if (!socket || !user) return;

    const handleReceive = (incomingMessage) => {
      if (activeContact && String(incomingMessage.conversationId) === String(activeContact._id)) {
        setChatHistory((prev) => [...prev, { ...incomingMessage, sender: 'them' }]);
      }

      setConversations((prevConvs) => {
        const exists = prevConvs.find(c => String(c._id) === String(incomingMessage.conversationId));
        if (!exists) fetchConversations(); 
        return prevConvs;
      });
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [socket, activeContact, fetchConversations, user]);

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
    }
  }, [activeContact, socket, user]);

  // === LOGIC PRESERVED: Send Handler ===
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

    } catch (error) {
      console.error("Send error:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants.find(p => {
      const pId = p?._id ? String(p._id) : String(p);
      return user && pId !== String(user._id);
    });
    return otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!user) {
    return (
      <div className="h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-center bg-slate-950 rounded-[3rem] border border-white/5">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Neural Links...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex overflow-hidden bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-2xl relative animate-in fade-in duration-700">
      
      {/* 🚀 SIDEBAR: Conversations List */}
      <div className={`w-full md:w-[380px] flex-shrink-0 flex flex-col bg-slate-900/30 backdrop-blur-xl border-r border-white/5 transition-all ${activeContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-[1000] text-white tracking-tighter uppercase italic">Secure <span className="text-indigo-500">Node</span></h2>
            <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400 border border-indigo-500/10">
              <Cpu size={18} />
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search data nodes..." 
              className="w-full bg-black/40 border border-white/5 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500/30 transition-all text-xs font-bold uppercase tracking-widest placeholder:text-slate-600 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6">
          {filteredConversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 p-8 text-center opacity-40">
              <MessageSquare size={40} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">No active links found</p>
            </div>
          ) : (
            <div className="space-y-2">
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
                    className={`relative p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 rounded-[1.5rem] border
                      ${isActive 
                        ? 'bg-indigo-600/10 border-indigo-500/20 shadow-lg shadow-indigo-600/5' 
                        : 'bg-transparent border-transparent hover:bg-white/[0.03]'}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden group-hover:scale-110 transition-transform shadow-xl">
                        {otherUser.avatar ? (
                          <img src={otherUser.avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-indigo-400 font-black text-lg">{otherUser.name?.charAt(0)}</span>
                        )}
                      </div>
                      {isOnline && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-4 border-slate-950 rounded-full shadow-lg shadow-emerald-500/20"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-black truncate text-sm tracking-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {otherUser.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border
                           ${isActive ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/10' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                           {otherUser.role || 'Agent'}
                         </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🗨️ CHAT INTERFACE */}
      {activeContact ? (() => {
        const otherUser = activeContact.participants.find(p => {
          const pId = p?._id ? String(p._id) : String(p);
          return pId !== String(user._id);
        });
        const isOnline = onlineUsers?.includes(otherUser?._id);

        return (
        <div className="flex-1 flex flex-col bg-[#020617] relative overflow-hidden">
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0z' fill='%23ffffff'/%3E%3C/svg%3E")` }}></div>

          {/* Chat Header */}
          <div className="h-[80px] bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveContact(null)} className="md:hidden p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 shadow-2xl">
                  {otherUser?.avatar ? (
                    <img src={otherUser.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <User size={20} className="text-slate-600" />
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-black text-white text-[15px] tracking-tight leading-none mb-1.5">{otherUser?.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isOnline ? 'Active Sync' : 'Offline Mode'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-slate-400">
              <button className="p-3 hover:bg-white/5 hover:text-indigo-400 rounded-xl transition-all border border-transparent hover:border-white/5"><Phone size={18} /></button>
              <button className="p-3 hover:bg-white/5 hover:text-indigo-400 rounded-xl transition-all border border-transparent hover:border-white/5"><Video size={18} /></button>
              <div className="w-px h-6 bg-white/5 mx-2"></div>
              <button className="p-3 hover:bg-white/5 hover:text-white rounded-xl transition-all"><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10 custom-scrollbar bg-slate-950/20">
            
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 shadow-2xl">
                <ShieldCheck size={12} className="text-indigo-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Encrypted Data Link Active</span>
              </div>
            </div>

            {chatHistory.map((msg, index) => {
              const isMe = msg.sender === 'me';
              const prevMsg = index > 0 ? chatHistory[index - 1] : null;
              const isGrouped = prevMsg && prevMsg.sender === msg.sender;

              return (
                <div key={msg.id || msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`relative max-w-[85%] md:max-w-[65%] px-5 py-3.5 shadow-2xl flex flex-col transition-all group
                    ${isMe 
                      ? `bg-indigo-600 text-white ${isGrouped ? 'rounded-[1.5rem]' : 'rounded-t-[1.5rem] rounded-bl-[1.5rem] rounded-br-[0.4rem]'}` 
                      : `bg-slate-900 text-slate-200 border border-white/5 ${isGrouped ? 'rounded-[1.5rem]' : 'rounded-t-[1.5rem] rounded-br-[1.5rem] rounded-bl-[0.4rem]'}`
                    }`}
                  >
                    <p className="text-[14px] font-medium leading-relaxed whitespace-pre-wrap break-words pr-14">{msg.text}</p>
                    
                    <div className={`absolute bottom-2 right-3 flex items-center gap-1.5 ${isMe ? 'text-white/60' : 'text-slate-500'}`}>
                      <span className="text-[9px] font-black tracking-tighter uppercase italic">{msg.time}</span>
                      {isMe && <CheckCheck size={14} className="text-white/80" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Message Input Area */}
          <div className="p-6 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 z-20">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4 max-w-5xl mx-auto">
              
              <button type="button" className="p-4 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5 shrink-0">
                <Paperclip size={20} />
              </button>

              <div className="flex-1 relative flex items-center bg-black/40 rounded-[1.5rem] border border-white/5 focus-within:border-indigo-500/30 transition-all overflow-hidden shadow-inner">
                <button type="button" className="absolute left-4 p-1 text-slate-600 hover:text-amber-400 transition-colors">
                  <Smile size={20} />
                </button>
                <input 
                  type="text" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Initiate communication..." 
                  className="w-full bg-transparent border-none py-4.5 pl-14 pr-6 text-[14px] text-white font-bold tracking-tight placeholder:text-slate-700 focus:outline-none"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                disabled={!message.trim()} 
                className="bg-indigo-600 text-white p-4.5 rounded-[1.5rem] shadow-2xl shadow-indigo-600/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center group shrink-0"
              >
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>
          </div>
        </div>
      );})() : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#020617] relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0z' fill='%23ffffff'/%3E%3C/svg%3E")` }}></div>
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-[80px] group-hover:blur-[100px] transition-all" />
            <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/10 relative z-10 shadow-2xl">
              <MessageSquare size={44} className="text-indigo-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-[1000] text-white mb-3 tracking-tighter uppercase italic relative z-10">Neural Hub</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] relative z-10">Waiting for peer handshakes...</p>
        </div>
      )}
    </div>
  );
}