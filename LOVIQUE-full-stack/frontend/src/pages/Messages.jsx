import "./Messages.css";
import { useState } from "react";
import {
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  MessageCircle,
  Plus,
  Paperclip,
  Smile
} from "lucide-react";

const initialConversations = [
  {
    id: 1,
    name: "Alex",
    message: "Welcome to the community!",
    time: "10:30 AM",
    unread: 2,
    online: true,
    messages: [
      {
        id: 1,
        sender: "Alex",
        text: "Hey! Welcome to LOVIQUE.",
        time: "10:25 AM"
      },
      {
        id: 2,
        sender: "Alex",
        text: "Welcome to the community!",
        time: "10:30 AM"
      }
    ]
  },
  {
    id: 2,
    name: "Jordan",
    message: "Have you checked out the tech community?",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        sender: "Jordan",
        text: "Hey, how are you doing?",
        time: "Yesterday"
      },
      {
        id: 2,
        sender: "Jordan",
        text: "Have you checked out the tech community?",
        time: "Yesterday"
      }
    ]
  },
  {
    id: 3,
    name: "Taylor",
    message: "Thanks for sharing your ideas.",
    time: "Monday",
    unread: 0,
    online: true,
    messages: [
      {
        id: 1,
        sender: "Taylor",
        text: "I really liked your post!",
        time: "Monday"
      },
      {
        id: 2,
        sender: "Taylor",
        text: "Thanks for sharing your ideas.",
        time: "Monday"
      }
    ]
  }
];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Messages() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");

  const openConversation = (person) => {
    setSelected(person.id);

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === person.id
          ? { ...conversation, unread: 0 }
          : conversation
      )
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!reply.trim() || selected === null) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: reply.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === selected
          ? {
              ...conversation,
              messages: [...conversation.messages, newMessage],
              message: newMessage.text,
              time: "Just now"
            }
          : conversation
      )
    );

    setReply("");
  };

  const activeConversation = conversations.find(
    (person) => person.id === selected
  );

  const filteredConversations = conversations.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="messages-page">

      <div className="messages-heading">
        <div>
          <span className="messages-eyebrow">STAY CONNECTED</span>
          <h1>Messages<span>.</span></h1>
          <p>Your conversations, all in one place.</p>
        </div>

        <button className="new-message-button" type="button">
          <Plus size={18} />
          <span>New message</span>
        </button>
      </div>

      <div className={`messages-container ${selected !== null ? "chat-open" : ""}`}>

        {/* CONVERSATION SIDEBAR */}

        <aside className="conversation-sidebar">

          <div className="conversation-top">
            <div>
              <h2>Inbox</h2>
              <span>{conversations.length} conversations</span>
            </div>

            <button type="button" className="more-button" aria-label="More options">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="conversation-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="conversation-list">

            {filteredConversations.length > 0 ? (
              filteredConversations.map((person) => (
                <button
                  type="button"
                  key={person.id}
                  onClick={() => openConversation(person)}
                  className={`conversation-item ${
                    selected === person.id ? "selected-conversation" : ""
                  }`}
                >
                  <div className="conversation-avatar">
                    {getInitials(person.name)}
                    {person.online && <span className="online-indicator" />}
                  </div>

                  <div className="conversation-details">
                    <div className="conversation-person">
                      <h3>{person.name}</h3>
                      <span>{person.time}</span>
                    </div>

                    <div className="conversation-preview">
                      <p>{person.message}</p>

                      {person.unread > 0 && (
                        <span className="unread-count">
                          {person.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="no-conversations">
                No conversations found.
              </div>
            )}

          </div>

          <div className="sidebar-footer">
            <span className="connection-dot" />
            Your conversations are ready
          </div>

        </aside>

        {/* CHAT AREA */}

        <main className="chat-area">

          {activeConversation ? (
            <>

              <div className="chat-header">

                <button
                  type="button"
                  className="back-to-inbox"
                  onClick={() => setSelected(null)}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="chat-avatar">
                  {getInitials(activeConversation.name)}
                </div>

                <div className="chat-contact-info">
                  <h2>{activeConversation.name}</h2>
                  <span>
                    {activeConversation.online ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="chat-header-actions">
                  <button type="button" aria-label="Voice call">
                    <Phone size={19} />
                  </button>
                  <button type="button" aria-label="Video call">
                    <Video size={20} />
                  </button>
                  <button type="button" aria-label="More options">
                    <MoreVertical size={20} />
                  </button>
                </div>

              </div>

              <div className="chat-messages">

                <div className="conversation-date">
                  <span>CONVERSATION</span>
                </div>

                {activeConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-row ${
                      message.sender === "You" ? "my-message-row" : ""
                    }`}
                  >
                    {message.sender !== "You" && (
                      <div className="small-chat-avatar">
                        {getInitials(activeConversation.name)}
                      </div>
                    )}

                    <div
                      className={`message-bubble ${
                        message.sender === "You" ? "my-message" : "their-message"
                      }`}
                    >
                      <p>{message.text}</p>
                      <span>{message.time}</span>
                    </div>
                  </div>
                ))}

              </div>

              <form className="message-composer" onSubmit={sendMessage}>

                <button
                  type="button"
                  className="composer-icon"
                  aria-label="Attach file"
                >
                  <Paperclip size={20} />
                </button>

                <input
                  type="text"
                  placeholder={`Message ${activeConversation.name}...`}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />

                <button
                  type="button"
                  className="composer-icon"
                  aria-label="Emoji"
                >
                  <Smile size={20} />
                </button>

                <button
                  type="submit"
                  className="send-message-button"
                  disabled={!reply.trim()}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>

              </form>

            </>
          ) : (

            <div className="empty-chat">

              <div className="empty-chat-icon">
                <MessageCircle size={38} />
              </div>

              <h2>Your space to connect.</h2>

              <p>
                Select a conversation from your inbox to start chatting.
                Your messages will appear here.
              </p>

              <span className="empty-chat-brand">LOVIQUE MESSAGES</span>

            </div>

          )}

        </main>

      </div>
    </div>
  );
}
