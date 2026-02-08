export default function InputBar() {
  return (
    <div className="border-t border-gray-700 p-3 flex items-center gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-gray-600"
      />

      <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition">
        Send
      </button>
    </div>
  );
}
