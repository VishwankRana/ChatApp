function ChatSidebar({
  currentUsername,
  showSearch,
  setShowSearch,
  handleLogout,
  search,
  setSearch,
  searchUsers,
  searchResults,
  addContact,
  users,
  selectedUser,
  openChat,
  getInitial,
}) {
  return (
    <div className="w-full md:w-80 lg:w-96 bg-slate-900/70 backdrop-blur-xl border-b md:border-b-0 md:border-r border-slate-700/60 flex flex-col z-10">
      <div className="px-4 py-4 flex justify-between items-center border-b border-slate-700/60">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 font-bold grid place-items-center">
            {getInitial(currentUsername)}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight">Contacts</h2>
            <p className="text-xs text-slate-300/80 truncate">
              Logged in as {currentUsername}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-lg font-semibold transition"
          >
            + Add
          </button>

          <button
            onClick={handleLogout}
            className="text-xs bg-rose-500 hover:bg-rose-400 text-white px-3 py-1.5 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="p-3 border-b border-slate-700/60 bg-slate-900/60">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username..."
            className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-lg outline-none focus:border-cyan-400"
          />

          <button
            onClick={searchUsers}
            className="mt-2 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold p-2 rounded-lg transition"
          >
            Search
          </button>

          {searchResults.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-slate-800/80 mt-2 p-2.5 rounded-lg border border-slate-700/70"
            >
              <span>{user.username}</span>

              <button
                onClick={() => addContact(user._id)}
                className="text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-2.5 py-1 rounded-md transition"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => openChat(user)}
            className={`p-3 cursor-pointer border-b border-slate-800/80 hover:bg-slate-800/80 transition ${
              selectedUser?._id === user._id
                ? "bg-slate-800/90 border-l-2 border-l-cyan-400"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-700 grid place-items-center text-sm font-semibold">
                {getInitial(user.username)}
              </div>
              <div className="font-medium">{user.username}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSidebar;
