import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

function ChatPane({
  selectedUser,
  getInitial,
  chat,
  currentUserId,
  message,
  setMessage,
  sendMessage,
}) {
  if (!selectedUser) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-200">
            Start a conversation
          </div>
          <div className="text-sm mt-1">Select a contact from the left panel.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ChatHeader selectedUser={selectedUser} getInitial={getInitial} />
      <MessageList chat={chat} currentUserId={currentUserId} />
      <MessageInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </>
  );
}

export default ChatPane;
