import { useContext, useEffect } from "react";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import { MessageContext } from "../context/messageContext";
import NoChatselected from "../components/NoChatselected";

interface User {
  _id: string;
  username: string;
  profilepic?: string;
}

const Home = () => {
  const messageContext = useContext(MessageContext);

  if (!messageContext) {
    return <div className="text-white text-center mt-10">Loading context...</div>;
  }

  const { users, selectedUser, setSelectedUser } = messageContext;

  useEffect(() => {
    console.log("👥 Users list:", users);
  }, [users]);

  useEffect(() => {
    console.log("📦 Selected user:", selectedUser);
  }, [selectedUser]);

  return (
    <div className="flex flex-row min-h-screen overflow-hidden bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
      <Sidebar users={users} onUserSelect={setSelectedUser} />

      <main className="flex-1 bg-gray-900">
        {selectedUser ? (
          <ChatContainer user={selectedUser as User} />
        ) : (
          <NoChatselected />
        )}
      </main>
    </div>
  );
};

export default Home;
