import { useState, useRef, useContext } from "react";
import { MdImage } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { MessageContext } from "../context/messageContext";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { selectedUser, sendMessage, getMessage } = useContext(MessageContext);

  // 📸 Handle image selection
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  // 🚀 Handle sending message
  const handleSendMessage = async () => {
    if (!text && !image) return alert("Please type a message or select an image.");
    if (!selectedUser) return alert("No user selected.");

    try {
      const newMsg = await sendMessage(selectedUser._id, text, image);
      if (newMsg) {
        setText("");
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await getMessage(selectedUser._id); // Refresh messages
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  return (
    <div className="p-1 md:p-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 fixed bottom-2 left-0 right-0 rounded-md shadow-lg text-white">
      <div className="flex items-center gap-2 justify-center">
        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg hover:bg-cyan-500/30 flex items-center justify-center transition"
          title="Attach image"
        >
          <MdImage className="size-8 text-white" />
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImage}
        />

        {/* Message input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-300 text-gray-900 shadow-sm border border-cyan-300 text-sm md:text-base w-full max-w-[800px]"
        />

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          className="p-2 md:p-3 bg-cyan-600 text-white rounded-lg md:rounded-xl hover:bg-cyan-500 flex items-center justify-center shadow-md transition"
        >
          <LuSendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
