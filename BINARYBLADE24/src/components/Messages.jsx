import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getConversations, getMessages, sendMessage, markConversationRead, uploadFile } from "../api";
import Loader from "./Loader";
import { Paperclip, X, FileIcon, Download, Folder } from "lucide-react";
import FileUpload from "./FileUpload";

const Messages = () => {
  const { user } = useContext(AuthContext);
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

  const handleFileUpload = async (uploadedFiles) => {
    try {
      setShowUploadModal(false);
      setSending(true);

      if (uploadedFiles && uploadedFiles.length > 0) {
        // We only support single file attachment in chat for now
        const uploadResponse = uploadedFiles[0];
        const attachmentId = uploadResponse.id;

        // Send message with attachment
        const sentMessage = await sendMessage(selectedConversation.id, "Sent an attachment", attachmentId);

        setMessages([...messages, sentMessage]);
      }
    } catch (error) {
      console.error("Failed to send attachment:", error);
      alert("Failed to send file.");
    } finally {
      setSending(false);
    }
  };

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
        <Loader size="large" />
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
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-3 flex ${message.sender === user.id ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${message.sender === user.id
                          ? "text-white"
                          : "bg-white text-black-900"
                          }`}
                        style={message.sender === user.id ? { backgroundColor: 'var(--color-accent)' } : {}}
                      >
                        {message.attachment_details && (
                          <div className="mb-2 rounded bg-opacity-20 bg-black p-2">
                            {message.attachment_details.file_type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(message.attachment_details.file?.split('.').pop().toLowerCase()) ? (
                              <img src={message.attachment_details.file} alt="attachment" className="max-w-full h-auto rounded max-h-48" />
                            ) : (
                              <div className="flex items-center text-white-500">
                                <FileIcon size={20} className="mr-2" />
                                <span className="text-sm truncate max-w-[150px]">{message.attachment_details.original_filename}</span>
                              </div>
                            )}
                            <a
                              href={message.attachment_details.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center mt-1 text-xs underline opacity-80 hover:opacity-100"
                            >
                              <Download size={12} className="mr-1" /> Download
                            </a>
                          </div>
                        )}
                        <p className="break-words text-sm">{message.body}</p>
                        <p
                          className={`text-xs mt-1 text-right ${message.sender === user.id ? "text-gray-100" : "text-gray-500"
                            }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Attach file"
                >
                  <Paperclip size={20} />
                </button>
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
      {/* File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">Send a File</h3>
            <FileUpload
              onUploadComplete={handleFileUpload}
              category="other"
            />
            <p className="text-xs text-gray-500 mt-4 text-center">
              Files are securely stored and visible to chat participants.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
