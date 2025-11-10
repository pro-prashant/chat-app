import { useContext, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { AuthDataContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const { handleLogout, updateProfile } = useContext(AuthDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("profile", updateProfile);
  }, [updateProfile]);

  const handlelogout = () => {
    try {
      handleLogout();
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout Error");
      console.log(error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 shadow-md border-b border-cyan-400">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-white">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-wide hover:scale-105 transition-transform duration-200">
            ChatApp
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md hover:bg-cyan-500/30 transition-all duration-200"
            onClick={() => navigate("/profile")}
          >
            {updateProfile?.profilepic ? (
              <img
                src={updateProfile.profilepic}
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <CgProfile className="text-2xl text-gray-400" />
            )}
            <span className="text-lg font-medium">Profile</span>
          </button>

          <button
            onClick={handlelogout}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md hover:bg-red-500/30 transition-all duration-200"
          >
            <MdLogout className="text-2xl" />
            <span className="text-lg font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
