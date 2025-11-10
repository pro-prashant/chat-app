import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../lib/utils";
import { io, Socket } from "socket.io-client";

export const AuthDataContext = createContext<any>(null);

export const AuthDataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [frontEndImage, setFrontEndImage] = useState<File | null>(null);
  const [backendImage, setBackendImage] = useState<string | null>(null);
  const [updateProfile, setUpdateProfile] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/getprofile`, { withCredentials: true });
      const user = res.data?.user;
      if (user) {
        setUpdateProfile(user);
        setName(user.username || "");
        setEmail(user.email || "");
        setBackendImage(user.profilepic || null);
      } else {
        setUpdateProfile(null);
      }
    } catch (err: any) {
      setUpdateProfile(null);
      console.error("❌ Fetch user profile failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run only once on app load (check session)
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ✅ Socket connect once logged in
  const connectedSocket = () => {
    if (!socket && updateProfile?._id) {
      const newSocket = io(API_URL, {
        query: { userId: updateProfile._id },
        withCredentials: true,
        transports: ["websocket"],
      });

      newSocket.on("connect", () => console.log("🟢 Socket connected:", newSocket.id));
      newSocket.on("getOnlineUsers", (userIds: string[]) => setOnlineUsers(userIds));
      newSocket.on("disconnect", () => console.log("🔴 Socket disconnected"));

      setSocket(newSocket);
    }
  };

  const disconnectedSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    }
  };

  useEffect(() => {
    if (updateProfile?._id) connectedSocket();
    else disconnectedSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProfile?._id]);

  // ✅ Signup
  const handleSignup = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/signup`,
        { username: name, email, password },
        { withCredentials: true }
      );
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error("❌ Signup failed:", err.response?.data || err.message);
    }
  };

  // ✅ Login
  const handleLogin = async (): Promise<boolean> => {
    try {
      await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      await fetchUserProfile();
      setEmail("");
      setPassword("");
      return true;
    } catch (err: any) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      return false;
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUpdateProfile(null);
      setName("");
      setEmail("");
      setBackendImage(null);
      disconnectedSocket();
    } catch (err: any) {
      console.error("❌ Logout failed:", err.response?.data || err.message);
    }
  };

  // ✅ Profile picture update
  const handleProfileUpdate = async (file?: File) => {
    try {
      const imageFile = file || frontEndImage;
      if (!imageFile) return console.error("⚠️ No image selected");

      const formData = new FormData();
      formData.append("profilepic", imageFile);

      const res = await axios.put(`${API_URL}/auth/update-profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUpdateProfile(res.data.user);
      setBackendImage(res.data.user.profilepic);
    } catch (err: any) {
      console.error("❌ Profile update failed:", err.response?.data || err.message);
    }
  };

  const value = {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    frontEndImage,
    setFrontEndImage,
    backendImage,
    setBackendImage,
    updateProfile,
    setUpdateProfile,
    handleSignup,
    handleLogin,
    handleLogout,
    handleProfileUpdate,
    fetchUserProfile,
    connectedSocket,
    disconnectedSocket,
    socket,
    onlineUsers,
    loading,
  };

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  );
};

export default AuthDataContextProvider;
