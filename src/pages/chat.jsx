import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { fetchMessages, postMessage, deleteMessage } from "../api/messages";
import SideNav from "../components/sidenav";
import "./chat.css";

export default function Chat({ user: propUser }) {
  const [user, setUser] = useState(propUser || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const token = sessionStorage.getItem("token"); 

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [user]);

  const loadMessages = async () => {
    if (!token) return;
    try {
      const data = await fetchMessages(token);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      if (user) {
        setMessages([
          { _id: "1", userId: user.id, text: "Hi from me!" },
          { _id: "2", userId: 999, text: "Hi from bot!" },
        ]);
      }
    }
  };

  useEffect(() => {
    loadMessages();
  }, [token, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    if (!token) {
      console.error("Ingen token tillgänglig");
      return;
    }

    try {
      
      const res = await postMessage(token, { text: input, userId: user.id });
      const newMessage = res.latestMessage || res;
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      
      setTimeout(() => {
        const botText = generateBotReply(input);
        const botMessage = {
          id: Date.now(),
          text: botText,
          userId: 999,
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const generateBotReply = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("hej")) return "Hej! How are you?";
    if (msg.includes("hur")) return "I'm fine, thank you!";
    return "Hello!";
  };

  const handleDelete = async (id) => {
    try {
      if (!id) return;
      await deleteMessage(id, token);
      await loadMessages();
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  if (!user) return <p>You are not logged in.</p>;

  return (
    <div style={{ display: "flex" }}>
      <SideNav />
      <div className="chat-container" style={{ marginLeft: "100px", width: "100%" }}>
        <div className="chat-card">
          <h2 className="chat-title">Welcome, {user.username || "Guest"}</h2>
          <div className="chat-avatar">
            <img
              src={user.avatar || "https://i.pravatar.cc/200?u=" + user.id}
              alt="Avatar"
            />
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={msg._id || msg.id || index}
                className={`chat-message ${msg.userId === user.id ? "own" : "other"}`}
              >
              
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(msg.text, {
                      ALLOWED_TAGS: ["b", "i", "u", "em", "strong", "br"],
                      ALLOWED_ATTR: [],
                    }),
                  }}
                />
                {msg.userId === user.id && (
                  <button
                    className="chat-delete"
                    onClick={() => handleDelete(msg._id || msg.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <form onSubmit={handleSend} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here..."
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
