import React, { useState } from "react";

const Messages = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      email: "john.doe@example.com",
      messages: [
        { sender: "John Doe", text: "Hello!" },
        { sender: "Me", text: "Hi there!" },
      ],
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      messages: [
        { sender: "Jane Smith", text: "Are you available for a project?" },
        { sender: "Me", text: "Yes, I am. Please send me the details." },
      ],
    },
  ]);
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-gray-100 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 cursor-pointer ${
                selectedConversation.id === conversation.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <p className="font-semibold">{conversation.email}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold">{selectedConversation.email}</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedConversation.messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded-lg ${
                message.sender === "Me"
                  ? "bg-blue-500 gap-1 inline-block m-10 text-white self-end"
                  : "bg-gray-200 inline-block m-10 gap-2"
              }`}
            >
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button className="ml-2 px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;








