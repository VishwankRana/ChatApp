import InputBar from "./InputBar";

export default function ChatPage({ activeChat }) {
  return (
    <div className="h-[41.3em] w-full bg-gray-900 rounded-xl ml-5 flex flex-col">
      <div className="text-white text-2xl font-semibold border-b border-gray-700 p-3.5">
        <h1>{activeChat}</h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto text-white">
        Messages will go here
      </div>
      <InputBar />
    </div>
  );
}
