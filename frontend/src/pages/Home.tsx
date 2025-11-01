import { useContext, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import { MessageContext } from "../context/messageContext";
import NoChatselected from "../components/NoChatselected";

const Home = () => {
  const { users,selectedUser, setSelectedUser } = useContext(MessageContext);
     console.log('check user', users);

  console.log("📦 selected data:", selectedUser);

  return (
    <div className="flex flex-row min-h-screen overflow-hidden bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
      {/* pass setSelectedUser to Sidebar so clicking a user updates it */}
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
