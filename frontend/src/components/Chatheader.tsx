import { useContext } from "react";
import { MessageContext } from "../context/messageContext";
import { AuthDataContext } from "../context/authContext";

const Chatheader = () => {
  const messageContext = useContext(MessageContext);
  const authContext = useContext(AuthDataContext);

  if (!messageContext || !authContext) return null; // ✅ prevents runtime null errors

  const { selectedUser, setSelectedUser } = messageContext;
  const { onlineUsers } = authContext;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 text-white shadow-lg rounded-md lg:rounded-none w-full border-b border-cyan-400 backdrop-blur-md">
      <div className="flex items-center gap-3 relative">
        <img
          src={selectedUser?.profilepic}
          alt="User Avatar"
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-cyan-300 shadow"
        />
        <div>
          <h2 className="text-lg lg:text-xl font-semibold truncate text-white">
            {selectedUser?.username}
          </h2>
          <p className="text-sm lg:text-base text-blue-100">
            {onlineUsers.includes(selectedUser?._id || "") ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <button
        className="p-2 cursor-pointer lg:p-3 rounded-full hover:bg-cyan-500/30 transition"
        onClick={() => setSelectedUser(null)}
      >
        <span className="material-icons text-lg lg:text-xl text-white">close</span>
      </button>
    </div>
  );
};

export default Chatheader;
