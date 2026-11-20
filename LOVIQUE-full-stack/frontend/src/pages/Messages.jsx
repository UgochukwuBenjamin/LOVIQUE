
import { useState } from "react";

const initialMessages = [
  {
    id: 1,
    name: "Alex",
    message: "Welcome to the community!",
    time: "10:30 AM"
  },
  {
    id: 2,
    name: "Jordan",
    message: "Have you checked out the tech community?",
    time: "Yesterday"
  },
  {
    id: 3,
    name: "Taylor",
    message: "Thanks for sharing your ideas.",
    time: "Monday"
  }
];

export default function Messages() {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState(initialMessages[0]);
  const [reply, setReply] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();

    if (!reply.trim()) return;

    const newMessage = {
      id: Date.now(),
      name: "You",
      message: reply,
      time: "Just now"
    };

    setMessages((previous) => [...previous, newMessage]);
    setReply("");
  };

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-2">Messages</h1>

      <p className="text-gray-400 mb-8">
        Keep up with your conversations.
      </p>

      <div className="grid md:grid-cols-3 border border-gray-800 rounded-xl overflow-hidden min-h-[500px]">

        {/* Conversation list */}
        <div className="bg-[#171717] border-r border-gray-800">

          <div className="p-5 border-b border-gray-800">
            <h2 className="font-semibold">Conversations</h2>
          </div>

          {initialMessages.map((person) => (
            <button
              type="button"
              key={person.id}
              onClick={() => setSelected(person)}
              className={`w-full text-left p-5 border-b border-gray-800 hover:bg-[#242424] ${
                selected.id === person.id ? "bg-[#242424]" : ""
              }`}
            >
              <h3 className="font-semibold">{person.name}</h3>
              <p className="text-sm text-gray-400 truncate mt-1">
                {person.message}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {person.time}
              </p>
            </button>
          ))}

        </div>

        {/* Chat area */}
        <div className="md:col-span-2 bg-[#101010] flex flex-col">

          <div className="p-5 border-b border-gray-800">
            <h2 className="font-semibold">{selected.name}</h2>
            <p className="text-xs text-gray-500">Sample conversation</p>
          </div>

          <div className="flex-1 p-5 space-y-4">

            <div className="bg-[#242424] rounded-xl p-4 max-w-xs">
              <p className="text-sm">
                {selected.message}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {selected.time}
              </p>
            </div>

            {messages
              .filter((message) => message.name === "You")
              .map((message) => (
                <div
                  key={message.id}
                  className="bg-[#C11235] rounded-xl p-4 max-w-xs ml-auto"
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs text-gray-200 mt-2">
                    {message.time}
                  </p>
                </div>
              ))}

          </div>

          <form
            onSubmit={sendMessage}
            className="p-5 border-t border-gray-800 flex gap-3"
          >
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 min-w-0 bg-[#242424] rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-[#C11235]"
            />

            <button
              type="submit"
              className="bg-[#C11235] px-5 rounded-lg font-semibold"
            >
              Send
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
