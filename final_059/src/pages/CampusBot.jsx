import { useState } from "react";

import ChatHeader from "../components/chatbot/ChatHeader";
import ChatMessage from "../components/chatbot/ChatMessage";
import ChatInput from "../components/chatbot/ChatInput";

import {
  INITIAL_MESSAGE,
  DEFAULT_REPLY
} from "../components/data/chatbotQA";

export default function CampusBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: INITIAL_MESSAGE }
  ]);

  const handleSend = (text) => {
    setMessages(prev => [
      ...prev,
      { sender: "user", text },
      { sender: "bot", text: DEFAULT_REPLY }
    ]);
  };

  return (
    <div>
      <ChatHeader />
      {messages.map((m, i) => (
        <ChatMessage key={i} sender={m.sender} text={m.text} />
      ))}
      <ChatInput onSend={handleSend} />
    </div>
  );
}

