import React, { useState, useEffect, useRef } from "react";
// import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

// Default/dummy data for contacts (used if no `contacts` prop is provided)
const defaultContacts = [
  { id: 1, name: "Alice", image: "https://via.placeholder.com/40?text=A" },
  { id: 2, name: "Bob", image: "https://via.placeholder.com/40?text=B" },
  { id: 3, name: "Charlie", image: "https://via.placeholder.com/40?text=C" },
];

/**
 * ContactSidebar
 * Props:
 * - contacts: array of { id, name, image }
 * - onSelect: function(contact) called when a contact is selected
 */
const ContactSidebar = ({ contacts = defaultContacts, onSelect, forceShow = false }) => {
  const [selectedId, setSelectedId] = useState(contacts[0]?.id ?? null);
  const containerRef = useRef(null);

  useEffect(() => {
    // notify parent of initial selection
    const initial = contacts.find((c) => c.id === selectedId) || contacts[0];
    if (initial && onSelect) onSelect(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // keep selectedId in sync if contacts prop changes
    if (!contacts.find((c) => c.id === selectedId)) {
      setSelectedId(contacts[0]?.id ?? null);
    }
  }, [contacts, selectedId]);

  const handleSelect = (contact) => {
    setSelectedId(contact.id);
    if (onSelect) onSelect(contact);
  };

  // keyboard navigation: ArrowUp / ArrowDown / Enter
  const handleKeyDown = (e) => {
    const index = contacts.findIndex((c) => c.id === selectedId);
    if (e.key === "ArrowDown") {
      const next = contacts[index + 1] || contacts[0];
      setSelectedId(next?.id ?? null);
      if (onSelect) onSelect(next);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      const prev = contacts[index - 1] || contacts[contacts.length - 1];
      setSelectedId(prev?.id ?? null);
      if (onSelect) onSelect(prev);
      e.preventDefault();
    } else if (e.key === "Enter") {
      const current = contacts.find((c) => c.id === selectedId);
      if (current && onSelect) onSelect(current);
    }
  };

  const rootVisibilityClass = forceShow ? "flex" : "hidden lg:flex";

  return (
    <div
      ref={containerRef}
      className={`${rootVisibilityClass} flex-col fixed right-0 top-0 h-full w-20 bg-white border-l border-gray-200 p-2 shadow-lg`}
      role="navigation"
      aria-label="Chat contacts"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex justify-center items-center h-16 mb-4 text-2xl text-blue-600">
        <IoChatbubbleEllipsesOutline />
      </div>

      <div className="flex flex-col space-y-4 overflow-y-auto">
        {contacts.map((contact) => {
          const isSelected = contact.id === selectedId;
          return (
            <button
              key={contact.id}
              onClick={() => handleSelect(contact)}
              className={`flex justify-center items-center cursor-pointer p-1 rounded-lg transition duration-150 group focus:outline-none
                ${isSelected ? "bg-blue-50 ring-2 ring-blue-300" : "hover:bg-blue-50"}`}
              title={contact.name}
              aria-pressed={isSelected}
              aria-label={`Open chat with ${contact.name}`}
            >
              <div className="relative">
                <img
                  src={contact.image || "https://via.placeholder.com/40"}
                  alt={contact.name}
                  className={`w-10 h-10 rounded-full object-cover border-2 ${
                    isSelected ? "border-blue-500" : "border-transparent group-hover:border-blue-500"
                  }`}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContactSidebar;
