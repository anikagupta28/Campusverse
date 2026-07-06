import { useState, useEffect, useRef } from "react";
import "./CampusBot.css";

const INITIAL_MESSAGE = {
  id: "init",
  text: "Hey 👋 I'm CampusBot AI. Ask me anything!",
  sender: "bot",
};

export default function CampusBot() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // 🔥 Streaming typing effect
  const streamMessage = (text) => {
    let i = 0;

    const interval = setInterval(() => {
      i++;

      setMessages((prev) => {
        const last = prev[prev.length - 1];

        if (last?.sender === "bot") {
          return [
            ...prev.slice(0, -1),
            { ...last, text: text.slice(0, i) },
          ];
        }

        return [
          ...prev,
          { id: Date.now(), sender: "bot", text: text.slice(0, i) },
        ];
      });

      if (i >= text.length) clearInterval(interval);
    }, 12);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: userText, sender: "user" },
    ]);

    setInput("");
    setIsThinking(true);

    setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:5000/chatbot/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userText }),
        });

        const data = await res.json();
        streamMessage(data.reply);
      } catch {
        streamMessage("⚠️ Server not responding.");
      }

      setIsThinking(false);
    }, 500);
  };

  return (
    <div className="campusbot-container">
      <div className="campusbot-main">
        
        {/* Header */}
        <div className="chat-header">
          <h3>
            CampusBot <span className="ai-badge">AI</span>
          </h3>
        </div>

        {/* Messages */}
        <div className="chat-body" ref={chatRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}

          {isThinking && <div className="typing">Typing...</div>}
        </div>

        {/* Input */}
        <div className="chat-input-container">
          <div className="input-wrapper">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="chat-input"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="send-button">
              ➤
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
