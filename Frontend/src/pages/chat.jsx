import { useState } from 'react';
import { Send, User, Search, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

export default function Chat() {
  // ----------------- DUMMY DATA (Step 2 mein isko hata denge) -----------------
  const [contacts] = useState([
    { id: 1, name: 'Abhishek Pachlaniya', role: 'Full Stack Engineer', avatar: '', unread: 2, online: true },
    { id: 2, name: 'Rahul Sharma', role: 'UI/UX Designer', avatar: '', unread: 0, online: false },
    { id: 3, name: 'Priya Singh', role: 'Data Scientist', avatar: '', unread: 0, online: true },
  ]);

  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Bhai, naya project dekha tune?", sender: 'them', time: '10:00 AM' },
    { id: 2, text: "Haan lala, ekdum faadu requirements hain!", sender: 'me', time: '10:05 AM' },
    { id: 3, text: "Kab tak complete kar dega?", sender: 'them', time: '10:06 AM' },
  ]);
  // ---------------------------------------------------------------------------

  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [message, setMessage] = useState('');

  // Message Send karne ka function (Abhi sirf UI update karega)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[85vh] bg-slate-50 flex rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl max-w-6xl mx-auto my-4">
      
      {/* ================= LEFT SIDE: CONTACTS LIST ================= */}
      <div className={`w-full md:w-80 bg-white border-r border-slate-100 flex flex-col ${activeContact ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Search Header */}
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800 mb-4">Messages</h2>
          <div className="bg-slate-50 rounded-xl px-4 py-2.5 flex items-center gap-3 border border-slate-100 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => setActiveContact(contact)}
              className={`p-4 flex items-center gap-4 cursor-pointer transition-colors border-b border-slate-50
                ${activeContact?.id === contact.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                  {contact.name.charAt(0)}
                </div>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* Name & Role */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate text-sm">{contact.name}</h4>
                <p className="text-xs text-slate-500 truncate">{contact.role}</p>
              </div>

              {/* Unread Badge */}
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* ================= RIGHT SIDE: ACTIVE CHAT ================= */}
      {activeContact ? (
        <div className={`flex-1 flex flex-col bg-[#F8FAFC] ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Chat Header */}
          <div className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveContact(null)}
                className="md:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  {activeContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{activeContact.name}</h3>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <button className="p-2 hover:bg-slate-50 rounded-full transition"><Phone size={20} /></button>
              <button className="p-2 hover:bg-slate-50 rounded-full transition"><Video size={20} /></button>
              <button className="p-2 hover:bg-slate-50 rounded-full transition"><MoreVertical size={20} /></button>
            </div>
          </div>

          {/* Chat Area (Messages) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full uppercase tracking-widest">
                Today
              </span>
            </div>

            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[75%] md:max-w-[60%] p-4 rounded-2xl shadow-sm relative group
                    ${msg.sender === 'me' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-2 font-medium text-right ${msg.sender === 'me' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <form 
              onSubmit={handleSendMessage} 
              className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all"
            >
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-slate-700"
              />
              <button 
                type="submit" 
                disabled={!message.trim()}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-indigo-200"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* Empty State (When no contact is selected on Desktop) */
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50/50 text-slate-400">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <User size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-600 mb-2">Your AI-Hire Messages</h3>
          <p className="text-sm font-medium text-slate-400">Select a conversation to start chatting</p>
        </div>
      )}

    </div>
  );
}