export default function Sidebar({ setActiveChat }) {
  return (
    <div className="h-[41.3em] w-64 bg-gray-900 text-white flex flex-col rounded-xl">
      <div className="p-4 text-xl font-semibold border-b border-gray-700">
        Chats
      </div>

      <div className="flex-1 p-2 space-y-2">
        <button
          onClick={() => setActiveChat("Vishwank")}
          className="w-full text-left px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
        >
          Vishwank
        </button>
        <button
          onClick={() => setActiveChat("Kohli")}
          className="w-full text-left px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
        >
          Kohli
        </button>
      </div>
    </div>
  );
}
