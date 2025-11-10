import { useContext, useEffect, useRef } from "react";
import { MessageContext } from "../context/messageContext";
import { AuthDataContext } from "../context/authContext";

const Messages = () => {
  const { selectedUser, messages } = useContext(MessageContext);
  const { fetchUserProfile, updateProfile } = useContext(AuthDataContext);
  const messagesEndRef = useRef(null);

  // Fetch logged-in user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages?.length]);

  // If no user selected yet
  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a user to start chatting 💬
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-md bg-white dark:bg-gray-900">
      {messages && messages.length > 0 ? (
        [...messages].map((msg) => {
          const isOtherUser =
            msg.senderId === selectedUser._id ||
            msg.senderId?._id === selectedUser._id;

          return isOtherUser ? (
            // Message from other user
            <div className="flex items-start gap-3" key={msg._id || Math.random()}>
              <img
                src={selectedUser.profilepic || "/default-avatar.png"}
                alt={selectedUser.name || "User Avatar"}
                className="w-10 h-10 rounded-full object-cover shadow-md"
              />
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-sm max-w-xs lg:max-w-md">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {msg.text}
                </p>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="mt-2 rounded-lg max-h-40"
                  />
                )}
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            </div>
          ) : (
            // Message from logged-in user
            <div
              className="flex items-end gap-3 justify-end"
              key={msg._id || Math.random()}
            >
              <div className="bg-blue-500 text-white p-3 rounded-lg shadow-md max-w-xs lg:max-w-md">
                <p className="text-sm">{msg.text}</p>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="mt-2 rounded-lg max-h-40"
                  />
                )}
                <div className="text-xs text-gray-200 mt-1 text-right flex items-center gap-1">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                  {msg.status === "read" ? (
                    <span className="text-blue-300">✔✔</span>
                  ) : msg.status === "delivered" ? (
                    <span className="text-gray-300">✔✔</span>
                  ) : (
                    <span className="text-gray-300">✔</span>
                  )}
                </div>
              </div>
              <img
                src={updateProfile?.profilepic || "/default-avatar.png"}
                alt={updateProfile?.name || "Your Avatar"}
                className="w-10 h-10 rounded-full object-cover shadow-md"
              />
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No messages yet.</p>
      )}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default Messages;