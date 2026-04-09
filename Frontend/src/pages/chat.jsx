import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search, ArrowLeft, MoreVertical, Phone, Video, CheckCheck, Smile, Paperclip, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext'; 
import axios from 'axios';
import { useLocation } from 'react-router-dom';

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

  const fetchConversations = useCallback(async () => {
    // FIX: Safely check for token
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

  // FIX: Added guard for user object in filter
  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants.find(p => {
      const pId = p?._id ? String(p._id) : String(p);
      return user && pId !== String(user._id);
    });
    return otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // CRITICAL FIX: Agar user nahi hai, toh white screen ki jagah loading dikhao
  if (!user) {
    return (
      <div className="h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium italic">Loading your chats...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex overflow-hidden bg-[#f8fafc] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 animate-in fade-in duration-500">
      
      <div className={`w-full md:w-[340px] flex-shrink-0 flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200/60 transition-all ${activeContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-slate-100/80">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-4">Messages</h2>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-slate-100/50 text-slate-700 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 border border-transparent transition-all text-[15px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <MessageSquare size={40} className="mb-3 opacity-20" />
              <p className="font-medium text-sm">No conversations found</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredConversations.map((conv) => {
                const otherUser = conv.participants.find(p => {
                  const pId = p?._id ? String(p._id) : String(p);
                  return pId !== String(user._id);
                });
                
                if (!otherUser) return null;
                const isOnline = onlineUsers?.includes(otherUser._id);
                const isActive = activeContact?._id === conv._id;

                return (
                  <div 
                    key={conv._id} 
                    onClick={() => setActiveContact(conv)}
                    className={`relative p-3 flex items-center gap-4 cursor-pointer transition-all duration-200 rounded-2xl mx-1
                      ${isActive ? 'bg-indigo-50/80 shadow-sm ring-1 ring-indigo-100/50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-700 font-bold uppercase overflow-hidden shadow-inner border border-white">
                        {otherUser.avatar ? <img src={otherUser.avatar} className="w-full h-full object-cover" alt="" /> : otherUser.name?.charAt(0)}
                      </div>
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className={`font-semibold truncate text-[15px] ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {otherUser.name}
                        </h4>
                      </div>
                      <p className={`text-[13px] truncate ${isActive ? 'text-indigo-600/80 font-medium' : 'text-slate-500'}`}>
                        {otherUser.role || 'User'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activeContact ? (() => {
        const otherUser = activeContact.participants.find(p => {
          const pId = p?._id ? String(p._id) : String(p);
          return pId !== String(user._id);
        });
        const isOnline = onlineUsers?.includes(otherUser?._id);

        return (
        <div className="flex-1 flex flex-col bg-[#f0f2f5] relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

          <div className="h-[72px] bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-5 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveContact(null)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold uppercase overflow-hidden border border-slate-200 shadow-sm">
                  {otherUser?.avatar ? <img src={otherUser.avatar} className="w-full h-full object-cover" alt="" /> : otherUser?.name?.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-slate-800 text-[15px] leading-tight">{otherUser?.name}</h3>
                  <span className={`text-[12px] font-medium transition-colors ${isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-400">
              <button className="p-2 hover:bg-slate-100 hover:text-indigo-600 rounded-full transition-colors"><Phone size={18} /></button>
              <button className="p-2 hover:bg-slate-100 hover:text-indigo-600 rounded-full transition-colors"><Video size={18} /></button>
              <div className="w-px h-5 bg-slate-200 mx-1"></div>
              <button className="p-2 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"><MoreVertical size={18} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 z-10 custom-scrollbar">
            
            <div className="flex justify-center mb-6 mt-2">
              <span className="bg-yellow-50/80 text-yellow-800/80 text-[11px] font-medium px-4 py-1.5 rounded-full shadow-sm border border-yellow-200/50 backdrop-blur-sm">
                🔒 End-to-end encrypted discussion
              </span>
            </div>

            {chatHistory.map((msg, index) => {
              const isMe = msg.sender === 'me';
              const prevMsg = index > 0 ? chatHistory[index - 1] : null;
              const isGrouped = prevMsg && prevMsg.sender === msg.sender;

              return (
                <div key={msg.id || msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                  <div className={`relative max-w-[85%] md:max-w-[70%] px-4 py-2.5 text-[15px] shadow-sm flex flex-col
                    ${isMe 
                      ? `bg-indigo-600 text-white ${isGrouped ? 'rounded-2xl' : 'rounded-2xl rounded-tr-sm'}` 
                      : `bg-white text-slate-800 border border-slate-100 ${isGrouped ? 'rounded-2xl' : 'rounded-2xl rounded-tl-sm'}`
                    }`}
                  >
                    <span className="leading-relaxed whitespace-pre-wrap break-words pr-12">{msg.text}</span>
                    
                    <div className={`absolute bottom-1 right-2 flex items-center gap-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                      <span className="text-[10px] tracking-wide font-medium">{msg.time}</span>
                      {isMe && (
                        <CheckCheck size={14} className="text-white opacity-90" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-200/60 z-10">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-5xl mx-auto">
              
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
                <Paperclip size={20} />
              </button>

              <div className="flex-1 relative flex items-center bg-slate-100/80 rounded-2xl border border-slate-200/50 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all overflow-hidden">
                <button type="button" className="absolute left-3 p-1 text-slate-400 hover:text-yellow-500 transition-colors">
                  <Smile size={20} />
                </button>
                <input 
                  type="text" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..." 
                  className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={!message.trim()} 
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-3.5 rounded-2xl hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95 shrink-0"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      );})() : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#f8fafc]">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <MessageSquare size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Your Messages</h2>
          <p className="text-slate-500 font-medium">Select a conversation to start chatting securely.</p>
        </div>
      )}
    </div>
  );
}