import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getConversations, getMessages, sendMessage, markConversationRead, uploadFile } from "../api";
import {
  Paperclip,
  X,
  FileIcon,
  Download,
  Send,
  User,
  MoreVertical,
  Search,
  CheckCheck,
  Loader2
} from "lucide-react";



const Messages = () => {
  const { user } = useContext(AuthContext);

  // App State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await getConversations();

        if (Array.isArray(data)) {
          setConversations(data);

          // Check if there's a conversation ID from navigation state
          const navState = window.history.state;
          const targetConversationId = navState?.state?.selectedConversationId;

          if (targetConversationId) {
            const targetConv = data.find(c => c.id === targetConversationId);
            if (targetConv) setSelectedConversation(targetConv);
            else if (data.length > 0) setSelectedConversation(data[0]);
          } else if (data.length > 0) {
            setSelectedConversation(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.isLoggedIn) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMsgs = async () => {
      try {
        const data = await getMessages(selectedConversation.id);
        if (Array.isArray(data)) {
          setMessages(data);
        }
        // Mark as read
        await markConversationRead(selectedConversation.id);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMsgs();
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const sentMessage = await sendMessage(selectedConversation.id, newMessage);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!user || !conversation) return null;
    const currentUserId = user.userId || user.id;
    return conversation.participant_1_details.id === currentUserId
      ? conversation.participant_2_details
      : conversation.participant_1_details;
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-primary-bg)] flex-col gap-4">
      <Loader2 className="animate-spin text-[var(--color-accent)]" size={48} />
      <span className="text-[var(--color-accent)] font-medium">Loading your chats...</span>
    </div>
  );

  const otherUser = getOtherParticipant(selectedConversation);

  return (
    <div className="flex h-screen bg-[var(--color-primary-bg)] overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-80 lg:w-96 flex flex-col border-r border-[var(--color-border)] bg-white">
        <div className="p-4 bg-[var(--color-primary-bg)] border-b border-[var(--color-border)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Chats</h2>
            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)] font-bold border-2 border-white shadow-sm overflow-hidden text-sm">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : (user?.first_name?.charAt(0) || 'U')}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const participant = getOtherParticipant(conv);
            const isSelected = selectedConversation?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`flex items-center p-4 cursor-pointer transition-all border-b border-[var(--color-primary-bg)] ${isSelected ? "bg-[var(--color-accent-light)]" : "hover:bg-[var(--color-primary-bg)]"}`}
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)] mr-3 flex-shrink-0 shadow-sm border border-white">
                  <User size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-[var(--color-text-primary)] truncate">{participant?.first_name} {participant?.last_name}</h3>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {conv.last_message ? new Date(conv.last_message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] font-medium truncate">{conv.project_title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{conv.last_message?.body}</p>
                </div>
                {conv.unread_count > 0 && (
                  <div className="ml-2 bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {conv.unread_count}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[var(--color-primary-bg)]">
        {selectedConversation ? (
          <>
            {/* Header */}
            <header className="px-6 py-3 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)] flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white shadow-sm ring-2 ring-[var(--color-accent-light)]">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)] leading-tight">
                    {otherUser?.first_name} {otherUser?.last_name}
                  </h3>
                  <p className="text-[10px] text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                    {selectedConversation.project_title}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-[var(--color-text-muted)]">
                <Search size={20} className="cursor-pointer hover:text-[var(--color-accent)] transition-colors" />
                <MoreVertical size={20} className="cursor-pointer hover:text-[var(--color-accent)] transition-colors" />
              </div>
            </header>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
              style={{
                backgroundImage: 'radial-gradient(circle, var(--color-border) 0.5px, transparent 0.5px)',
                backgroundSize: '24px 24px'
              }}
            >
              {messages.map((msg) => {
                const currentUserId = user.userId || user.id;
                const isMe = msg.sender === currentUserId;
                return (
                  <div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`relative max-w-[70%] group ${isMe ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-2.5 rounded-2xl shadow-sm transition-all ${isMe
                        ? "bg-[var(--color-accent)] text-white rounded-tr-none"
                        : "bg-white text-[var(--color-text-primary)] rounded-tl-none border border-[var(--color-border)]"
                        }`}>
                        {/* Body */}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>

                        {/* Meta: Time and Status */}
                        <div className={`text-[9px] mt-1 flex items-center justify-end space-x-1 ${isMe ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && <CheckCheck size={12} className="text-white/90" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Footer Input */}
            <footer className="p-4 bg-white border-t border-[var(--color-border)] shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3 max-w-6xl mx-auto">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-primary-bg)] rounded-full transition-all"
                  title="Attach file"
                >
                  <Paperclip size={22} />
                </button>

                <div className="flex-1 relative group">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message..."
                    className="w-full px-6 py-3 bg-[var(--color-primary-bg)] border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[var(--color-accent-light)] focus:ring-4 focus:ring-[var(--color-accent)]/5 transition-all"
                    disabled={sending}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="p-3 bg-[var(--color-accent)] text-white rounded-full hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:bg-[var(--color-text-muted)] shadow-lg shadow-[var(--color-accent-light)] transition-all transform active:scale-90 flex items-center justify-center"
                >
                  {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-[var(--color-text-muted)] space-y-4">
            <div className="w-24 h-24 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center animate-pulse">
              <User size={48} className="text-[var(--color-accent)] opacity-40" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Your Messages</h3>
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Attach File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative border border-[var(--color-border)] animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-2 hover:bg-[var(--color-primary-bg)] rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Send File</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8 font-medium">Select a document or image to share with this participant.</p>

            <div className="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-10 flex flex-col items-center justify-center bg-[var(--color-primary-bg)] hover:bg-[var(--color-accent-light)]/30 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-[var(--color-accent)] group-hover:scale-110 transition-transform mb-4">
                <FileIcon size={32} />
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Click to upload or drag & drop</p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1 uppercase tracking-widest font-bold">Max 25MB</p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-3 text-sm font-bold text-[var(--color-text-secondary)] bg-[var(--color-primary-bg)] rounded-xl hover:bg-[var(--color-border)] transition-all"
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 text-sm font-bold text-white bg-[var(--color-accent)] rounded-xl hover:bg-[var(--color-accent-hover)] shadow-md shadow-[var(--color-accent-light)] transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;