function MessageList({ chat, currentUserId }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/70">
      {chat.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.senderId === currentUserId ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2.5 rounded-2xl max-w-[75%] shadow-sm ${
              msg.senderId === currentUserId
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                : "bg-slate-800 border border-slate-700"
            }`}
          >
            {msg.message}
            {msg.createdAt && (
              <div className="text-[10px] mt-1 opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
