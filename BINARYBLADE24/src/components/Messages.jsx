import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getConversations, getMessages, sendMessage, markConversationRead } from "../api";

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        console.log('Fetching conversations...');
        const conversations = await getConversations();
        console.log('Conversations loaded:', conversations);

        // The API response is already unwrapped by the axios interceptor
        if (Array.isArray(conversations)) {
          setConversations(conversations);

          // Check if there's a conversation ID from navigation state
          const navState = window.history.state;
          const targetConversationId = navState?.state?.selectedConversationId;

          if (targetConversationId && conversations.length > 0) {
            // Find and select the target conversation
            const targetConv = conversations.find(c => c.id === targetConversationId);
            if (targetConv) {
              setSelectedConversation(targetConv);
            } else if (conversations.length > 0) {
              setSelectedConversation(conversations[0]);
            }
          } else if (conversations.length > 0) {
            setSelectedConversation(conversations[0]);
          }
        } else {
          console.error('Unexpected response format for conversations:', conversations);
          setConversations([]);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setConversations([]);
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
    const fetchConversationMessages = async () => {
      if (!selectedConversation) return;

      try {
        console.log(`Fetching messages for conversation: ${selectedConversation.id}`);
        const messages = await getMessages(selectedConversation.id);
        console.log('Messages loaded:', messages);

        // The API response is already unwrapped by the axios interceptor
        if (Array.isArray(messages)) {
          setMessages(messages);
        } else {
          console.error('Unexpected response format for messages:', messages);
          setMessages([]);
        }

        // Mark as read
        await markConversationRead(selectedConversation.id);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      }
    };

    fetchConversationMessages();
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      console.log('Sending message...');
      const sentMessage = await sendMessage(selectedConversation.id, newMessage);
      console.log('Message sent successfully:', sentMessage);

      // The API response is already unwrapped by the axios interceptor
      setMessages([...messages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!user) return null;
    return conversation.participant_1_details.id === user.id
      ? conversation.participant_2_details
      : conversation.participant_1_details;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)]"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Messages Yet</h2>
          <p className="text-gray-500">
            Start a conversation by accepting a proposal or getting hired for a project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Conversations List */}
      <div className="w-1/3 bg-gray-100 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold">Messages</h2>
        </div>
        <div>
          {conversations.map((conversation) => {
            const otherUser = getOtherParticipant(conversation);
            return (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors ${selectedConversation?.id === conversation.id ? "bg-gray-200" : ""
                  }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {otherUser?.first_name} {otherUser?.last_name}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.project_title}
                    </p>
                    {conversation.last_message && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {conversation.last_message.body}
                      </p>
                    )}
                  </div>
                  {conversation.unread_count > 0 && (
                    <span className="ml-2 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Messages Panel */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {getOtherParticipant(selectedConversation)?.first_name}{" "}
                {getOtherParticipant(selectedConversation)?.last_name}
              </h2>
              <p className="text-sm text-gray-600">
                Project: {selectedConversation.project_title}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ backgroundImage: 'linear-gradient(to bottom, #f0f2f5, #e4e6eb)' }}>
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 flex ${message.sender === user.id ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${message.sender === user.id
                        ? "text-gray-100"
                        : "bg-white text-black-900"
                        }`}
                      style={message.sender === user.id ? { backgroundColor: 'var(--color-message-sent)' } : {}}
                    >
                      <p className="break-words text-sm">{message.body}</p>
                      <p
                        className={`text-xs mt-1 text-right ${message.sender === user.id ? "text-gray-600" : "text-gray-500"
                          }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-3 font-medium text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                  onMouseEnter={(e) => !sending && newMessage.trim() && (e.target.style.backgroundColor = 'var(--color-accent-hover)')}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-accent)'}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
