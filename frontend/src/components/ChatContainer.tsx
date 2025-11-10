
import Chatheader from "./Chatheader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

const ChatContainer = () => {
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-blue-100 via-cyan-50 to-white shadow-lg rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <Chatheader />
      </div>

      {/* Messages Area */}
      <div className="flex-1 relative overflow-y-auto p-2 md:p-4 bg-white/70 backdrop-blur-sm">
        <Messages />

        {/* Floating Message Input (right side) */}
        <div className="absolute bottom-4 right-4 w-full max-w-[70%] md:max-w-[60%]">
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;