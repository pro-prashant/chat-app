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

  // ✅ Create socket connection (dynamic URL for both local & deployed)
  const connectedSocket = () => {
    if (!socket && updateProfile?._id) {
      const newSocket = io(API_URL, {
        query: { userId: updateProfile._id },
        withCredentials: true,
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        console.log("🟢 Socket connected:", newSocket.id);
      });

      newSocket.on("getOnlineUsers", (userIds: string[]) => {
        setOnlineUsers(userIds);
        console.log("👥 Online users:", userIds);
      });

      newSocket.on("disconnect", () => {
        console.log("🔴 Socket disconnected from server");
      });

      setSocket(newSocket);
    }
  };

  // ✅ Disconnect socket
  const disconnectedSocket = () => {
    if (socket) {
      socket.disconnect();
      console.log("🔴 Socket disconnected manually");
      setSocket(null);
      setOnlineUsers([]);
    }
  };

  // ✅ Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/getprofile`, {
        withCredentials: true,
      });
      const user = res.data?.user;
      console.log("✅ User profile fetched:", user);

      if (user) {
        setUpdateProfile(user);
        setName(user.username || "");
        setEmail(user.email || "");
        setBackendImage(user.profilepic || null);
      }
    } catch (err: any) {
      console.error("❌ Fetch user profile failed:", err.response?.data || err.message);
    }
  };

  // ✅ Signup
  const handleSignup = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/signup`,
        { username: name, email, password },
        { withCredentials: true }
      );
      console.log("✅ Signup successful:", res.data);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error("❌ Signup failed:", err.response?.data || err.message);
    }
  };

  // ✅ Login
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("✅ Login successful:", res.data);
      await fetchUserProfile();
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error("❌ Login failed:", err.response?.data || err.message);
    }
  };

  // ✅ Auto connect socket when profile is loaded
  useEffect(() => {
    if (updateProfile?._id) {
      connectedSocket();
    }
    return () => {
      disconnectedSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProfile?._id]);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      console.log("✅ Logout successful:", res.data);
      setUpdateProfile(null);
      setName("");
      setEmail("");
      setBackendImage(null);
      disconnectedSocket();
    } catch (err: any) {
      console.error("❌ Logout failed:", err.response?.data || err.message);
    }
  };

  // ✅ Update profile picture
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

      console.log("✅ Profile picture updated:", res.data);
      setUpdateProfile(res.data.user);
      setBackendImage(res.data.user.profilepic);
    } catch (err: any) {
      console.error("❌ Profile update failed:", err.response?.data || err.message);
    }
  };

  // ✅ Context Value
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
  };

  return <AuthDataContext.Provider value={value}>{children}</AuthDataContext.Provider>;
};

export default AuthDataContextProvider;
