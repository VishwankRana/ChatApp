import Sidebar from "./Components/Sidebar";
import ChatPage from "./Components/ChatPage";
import { useState } from "react";

export default function App() {
  const [activeChat, setActiveChat] = useState("Vishwank");

  return (
    <div className="flex h-full p-5 bg-black">
      <Sidebar setActiveChat={setActiveChat} />
      <ChatPage activeChat={activeChat} />
    </div>
  );
}
