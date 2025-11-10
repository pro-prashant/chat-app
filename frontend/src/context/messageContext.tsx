import { createContext, useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../lib/utils";

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

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/message/users`, { withCredentials: true });
      const userList: User[] = res.data?.user || res.data?.users || (Array.isArray(res.data) ? res.data : []);
      setUsers(userList);
      if (!selectedUser && userList.length > 0) setSelectedUser(userList[0]);
      if (res.data?.currentUser) setCurrentUser(res.data.currentUser);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMessage = async (receiverId: string): Promise<Message[]> => {
    if (!receiverId) return [];
    try {
      const res = await axios.get(`${API_URL}/message/getMessage/${receiverId}`, { withCredentials: true });
      const msgs: Message[] = res.data?.data ?? res.data?.messages ?? [];
      setMessages(Array.isArray(msgs) ? msgs : []);
      return msgs;
    } catch (err) {
      console.error(err);
      setMessages([]);
      return [];
    }
  };

  const sendMessage = async (receiverId: string, text: string, image?: File | null): Promise<Message | null> => {
    try {
      let imageBase64: string | null = null;
      if (image) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject("Image read failed");
          reader.readAsDataURL(image);
        });
      }
      const payload = { text, image: imageBase64 };
      const res = await axios.post(`${API_URL}/message/sendMessage/${receiverId}`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const sentMessage: Message = res.data?.data ?? res.data;
      setMessages((prev) => [...prev, sentMessage]);
      socketRef.current?.emit("sendMessage", sentMessage);
      return sentMessage;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    if (!currentUser || socketRef.current) return;
    const socket = io(API_URL, {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId: currentUser._id },
    });
    socketRef.current = socket;
    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("getOnlineUsers", setOnlineUsers);
    socket.on("newMessage", (newMessage: Message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) return prev;
        if (selectedUser && (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id)) {
          return [...prev, newMessage];
        }
        return prev;
      });
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (selectedUser?._id) getMessage(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <MessageContext.Provider
      value={{
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
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
