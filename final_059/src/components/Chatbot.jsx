import { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div
        className="chatbot-icon"
        onClick={() => setOpen(!open)}
        title="Chat with CampusVerse AI"
      >
        🤖
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          
          {/* Header */}
          <div className="chatbot-header">
            <span>CampusVerse AI</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Body */}
          <div className="chatbot-body">
            <div className="bot-msg">
              👋 Hi! I’m <b>CampusVerse AI</b><br/>
              Ask me about:
              <br/>• Departments
              <br/>• Notices
              <br/>• Weather
            </div>
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Feature coming soon..."
              disabled
            />
            <button disabled>Send</button>
          </div>

        </div>
      )}
    </>
  );
}