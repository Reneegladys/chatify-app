import React, { useState, useEffect, useRef } from "react";
import "./chat.css";
import SideNav from "../components/sidenav";

export default function Chat({ user: propUser }) {
  const [user, setUser] = useState(propUser || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Hämta användardata från localStorage om user inte finns
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("User från localStorage:", parsedUser); // För presentation
        setUser(parsedUser);
      }
    }
  }, [user]);

  // Mock-meddelanden
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([
        { id: 1, userId: user.id, text: "Hi from me!" },
        { id: 2, userId: 999, text: "Hi, from another person!" },
      ]);
    }
  }, [user]);

  // Scrolla ner automatiskt
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Skicka meddelande
  const handleSend = () => {
    if (!input.trim() || !user) return;

    const userMessage = { id: Date.now(), userId: user.id, text: sanitize(input) };
    setMessages([...messages, userMessage]);
    setInput("");

    // Mock bot-svar
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        userId: 999,
        text: generateBotReply(input),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  // Ta bort meddelande
  const handleDelete = (id) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  // Sanera användarinput
  const sanitize = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  // Enkel botlogik
  const generateBotReply = (userText) => {
    const lower = userText.toLowerCase();
    if (lower.includes("hej")) return "Hi! How are you?";
    if (lower.includes("hur")) return "I'm fine, thanks!";
    if (lower.includes("vad")) return "I'm a bot, I can answer simple questions.";
    return "Hmm, interesting...";
  };

  if (!user) return <p>You are not logged in.</p>;

  return (
    <div style={{ display: "flex" }}>
      <SideNav />
      <div className="chat-container" style={{ marginLeft: "100px", width: "100%" }}>
        <div className="chat-card">
          <h2 className="chat-title">Welcome, {user.username || "Guest"}</h2>
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
