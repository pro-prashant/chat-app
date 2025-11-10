import { useContext, useEffect } from "react";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import { MessageContext } from "../context/messageContext";
import NoChatselected from "../components/NoChatselected";

// Define a fallback User type (you can refine it later)
interface User {
  _id: string;
  username: string;
  profilepic?: string;
}

const Home = () => {
  // Non-null assertion (!) ensures MessageContext is not null
  const { users, selectedUser, setSelectedUser } = useContext(MessageContext)!;

  // Log only when users change
  useEffect(() => {
    console.log("👥 Users list:", users);
  }, [users]);

  // Log only when selectedUser changes
  useEffect(() => {
    console.log("📦 Selected user:", selectedUser);
  }, [selectedUser]);

  return (
    <div className="flex flex-row min-h-screen overflow-hidden bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
      {/* Sidebar receives user list + selection handler */}
      <Sidebar users={users} onUserSelect={setSelectedUser} />

      <main className="flex-1 bg-gray-900">
        {selectedUser ? (
          // Pass user prop safely to ChatContainer
          <ChatContainer user={selectedUser as User} />
        ) : (
          <NoChatselected />
        )}
      </main>
    </div>
  );
};

export default Home;
