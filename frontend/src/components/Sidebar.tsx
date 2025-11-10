import { useContext, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AuthDataContext } from "../context/authContext";

// ✅ Define User type (based on your MessageContext user interface)
interface User {
  _id: string;
  username?: string;
  profilepic?: string;
  email?: string;
}

// ✅ Define props type for Sidebar
interface SidebarProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, onUserSelect }) => {
  const { onlineUsers } = useContext(AuthDataContext);

  useEffect(() => {
    console.log("check user online", onlineUsers);
  }, [onlineUsers]);

  return (
    <aside className="h-full w-20 lg:w-72 flex flex-col transition-all duration-200 bg-gradient-to-b from-base-200 to-base-100">
      {/* Header */}
      <div className="w-full p-5 bg-base-100/80 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <FaUserCircle className="size-7 text-primary" />
          <span className="font-semibold text-lg hidden lg:block tracking-wide text-primary">
            Contacts
          </span>
        </div>
      </div>

      {/* Contacts List */}
      <div className="overflow-y-auto w-full py-4 px-2 flex-1">
        {users.length === 0 && (
          <div className="text-center text-base-content/60 py-10">
            No contacts found.
          </div>
        )}

        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => onUserSelect(user)}
            className="w-full flex items-center gap-4 p-2 my-2 rounded-xl hover:bg-primary/10 transition-colors bg-base-100 shadow-lg group"
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.profilepic || "/upload.png"}
                alt="profile"
                className="size-12 object-cover rounded-full border-2 border-transparent group-hover:border-primary/60 transition-all"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow"></span>
              )}
            </div>

            <div className="hidden lg:flex flex-col items-start flex-1 min-w-0">
              <span className="font-medium text-base-content truncate">
                {user.username}
              </span>
              <span
                className={`text-xs font-medium ${
                  onlineUsers.includes(user._id) ? "text-green-600" : "text-gray-500"
                }`}
              >
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
