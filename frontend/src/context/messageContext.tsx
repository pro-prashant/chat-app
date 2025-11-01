import { createContext, useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../lib/utils";

// ✅ Types
interface Message {
  _id?: string;
  text?: string;
  image?: string;
  senderId?: string;
  receiverId?: string;
  createdAt?: string;
}

interface User {
  _id: string;
  name?: string;
  email?: string;
}

interface MessageContextType {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  users: User[];
  loading: boolean;
  getUser: () => Promise<void>;
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  getMessage: (receiverId: string) => Promise<Message[]>;
  sendMessage: (receiverId: string, text: string, image?: File | null) => Promise<Message | null>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  onlineUsers: string[];
}

export const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);

  // ✅ Get backend users
  const getUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/message/users`, { withCredentials: true });

      const userList: User[] =
        res.data?.user ||
        res.data?.users ||
        (Array.isArray(res.data) ? res.data : []);

      setUsers(userList);

      if (!selectedUser && userList.length > 0) {
        setSelectedUser(userList[0]);
      }

      if (res.data?.currentUser) {
        setCurrentUser(res.data.currentUser);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get messages
  const getMessage = async (receiverId: string): Promise<Message[]> => {
    if (!receiverId) return [];
    try {
      const res = await axios.get(`${API_URL}/message/getMessage/${receiverId}`, {
        withCredentials: true,
      });
      const msgs = res.data?.data ?? res.data?.messages ?? [];
      setMessages(Array.isArray(msgs) ? msgs : []);
      return msgs;
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      setMessages([]);
      return [];
    }
  };

  // ✅ Send message
  const sendMessage = async (receiverId: string, text: string, image?: File | null) => {
    try {
      let imageBase64: string | null = null;
      if (image) {
        const reader = new FileReader();
        const imagePromise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject("Image read failed");
          reader.readAsDataURL(image);
        });
        imageBase64 = await imagePromise;
      }

      const payload = { text, image: imageBase64 };
      const res = await axios.post(`${API_URL}/message/sendMessage/${receiverId}`, payload, {
        withCredentials: true,
      });

      const sentMessage = res.data?.data ?? res.data;

      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === sentMessage._id);
        if (exists) return prev;
        return [...prev, sentMessage];
      });

      if (socketRef.current) {
        socketRef.current.emit("sendMessage", sentMessage);
      }

      return sentMessage;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      return null;
    }
  };

  // ✅ Socket setup
  useEffect(() => {
    if (!currentUser || socketRef.current) return;

    console.log("⚡ Connecting socket for:", currentUser._id);
    const socket = io(API_URL, {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId: currentUser._id },
    });

    socketRef.current = socket;

    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));
    socket.on("getOnlineUsers", (users: string[]) => setOnlineUsers(users));
    socket.on("newMessage", (newMessage: Message) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === newMessage._id);
        if (exists) return prev;
        if (
          selectedUser &&
          (newMessage.senderId === selectedUser._id ||
            newMessage.receiverId === selectedUser._id)
        ) {
          return [...prev, newMessage];
        }
        return prev;
      });
    });

    return () => {
      console.log("🧹 Cleaning up socket...");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser]);

  // ✅ Update messages when user changes
  useEffect(() => {
    if (selectedUser?._id) getMessage(selectedUser._id);
  }, [selectedUser]);

  // ✅ Initial load
  useEffect(() => {
    getUser();
  }, []);

  const value: MessageContextType = {
    name,
    setName,
    users,
    loading,
    getUser,
    selectedUser,
    setSelectedUser,
    messages,
    setMessages,
    getMessage,
    sendMessage,
    currentUser,
    setCurrentUser,
    onlineUsers,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};
