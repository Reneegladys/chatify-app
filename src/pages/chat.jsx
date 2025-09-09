import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import SideNav from "../components/sidenav"; // Add this import

export default function Chat({ user: propUser }) {
  const [user, setUser] = useState(propUser || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Load user from localStorage if not passed as prop
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [user]);

  // Initialize mock messages
  useEffect(() => {
    if (user) {
      setMessages([
        { id: 1, userId: user.id, text: "Hi from me!" },
        { id: 2, userId: 999, text: "Hi, from another person!" },
      ]);
    }
  }, [user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !user) return;

    const userMessage = { id: Date.now(), userId: user.id, text: sanitize(input) };
    setMessages([...messages, userMessage]);
    setInput("");

    // Fake bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        userId: 999,
        text: generateBotReply(input),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleDelete = (id) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const sanitize = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  const generateBotReply = (userText) => {
    const lower = userText.toLowerCase();
    if (lower.includes("hej")) return "Hi! How are you?";
    if (lower.includes("hur")) return "Im fine, thanks!";
    if (lower.includes("vad")) return "Im a bot, I can answer simple questions.";
    return "Hmm, interesting...";
  };

  if (!user) return <p>You are not logged in.</p>;

  return (
    <div style={{ display: "flex" }}>
      <SideNav /> {/* Add this line */}
      <div className="chat-container" style={{ marginLeft: "100px", width: "100%" }}>
        <div className="chat-card">
          <h2 className="chat-title">Welcome, {user.username}</h2>
          <div className="chat-avatar">
            <img src={user.avatar || "https://i.pravatar.cc/200"} alt="Avatar" />
          </div>

          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`chat-message ${m.userId === user.id ? "own" : "other"}`}>
                <p>{m.text}</p>
                {m.userId === user.id && (
                  <button className="chat-delete" onClick={() => handleDelete(m.id)}>
                    Delete
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skriv meddelande..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
