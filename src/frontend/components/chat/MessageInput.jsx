function MessageInput({ message, setMessage, sendMessage }) {
  return (
    <div className="p-4 border-t border-slate-700/60 bg-slate-900/70 backdrop-blur-xl flex gap-3">
      <input
        className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 px-5 py-2 rounded-xl font-semibold transition"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
