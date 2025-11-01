import { useContext, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { MdEmail } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { AuthDataContext } from "../context/authContext";

const Profile = () => {
  const {
    handleProfileUpdate,
    updateProfile,
    backendImage,
    setBackendImage,
    setFrontEndImage,
    fetchUserProfile, // ✅ get it from context
  } = useContext(AuthDataContext);

  // ✅ Auto-fetch profile when page loads
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ✅ Handle image change and upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontEndImage(file);
      setBackendImage(URL.createObjectURL(file)); // local preview
      await handleProfileUpdate(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <label htmlFor="profileImage" className="cursor-pointer relative block">
              <img
                src={
                  backendImage ||
                  updateProfile?.profilepic || // ✅ correct backend field
                  "/upload.png"
                }
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-purple-600 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full text-white hover:bg-purple-700 transition">
                <FiUpload size={16} />
              </div>
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Username */}
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {updateProfile?.username || "Loading..."}
          </h2>
          <p className="text-gray-500 text-sm">Full Stack Developer</p>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-700 border-b pb-2">
            <CgProfile className="text-purple-600 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">
                {updateProfile?.username || "Fetching username..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700 border-b pb-2">
            <MdEmail className="text-purple-600 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">
                {updateProfile?.email || "Fetching email..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
