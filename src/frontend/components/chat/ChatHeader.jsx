function ChatHeader({ selectedUser, getInitial }) {
  return (
    <div className="p-4 border-b border-slate-700/60 bg-slate-900/70 backdrop-blur-xl font-semibold flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-slate-700 grid place-items-center">
        {getInitial(selectedUser.username)}
      </div>
      <div>
        <div className="font-semibold tracking-tight">{selectedUser.username}</div>
        <div className="text-xs text-slate-300/80">Private chat</div>
      </div>
    </div>
  );
}

export default ChatHeader;
