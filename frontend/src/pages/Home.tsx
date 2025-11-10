import { useContext, useEffect } from "react";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import { MessageContext } from "../context/messageContext";
import NoChatselected from "../components/NoChatselected";

const Home = () => {
  const { users, selectedUser, setSelectedUser } = useContext(MessageContext);

  // Log only when users change
  useEffect(() => {
    console.log('check user', users);
  }, [users]);

  // Log only when selectedUser changes
  useEffect(() => {
    console.log("📦 selected data:", selectedUser);
  }, [selectedUser]);

  return (
    <div className="flex flex-row min-h-screen overflow-hidden bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
      {/* pass setSelectedUser to Sidebar */}
      <Sidebar users={users} onUserSelect={setSelectedUser} />
      
      <main className="flex-1 bg-gray-900">
        {selectedUser ? (
          <ChatContainer user={selectedUser} />
        ) : (
          <NoChatselected />
        )}
      </main>
    </div>
  );
};

export default Home;
