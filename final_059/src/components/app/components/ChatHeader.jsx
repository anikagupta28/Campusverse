import { MessageSquarePlus, RotateCcw } from 'lucide-react';

const BotIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="white" />
    <g transform="translate(10, 11)">
      <rect x="2" y="3" width="16" height="13" rx="4" fill="#6d4fc2" />
      <line
        x1="10"
        y1="3"
        x2="10"
        y2="1"
        stroke="#6d4fc2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="0.5" r="1.5" fill="#6d4fc2" />
      <circle cx="7" cy="8" r="1.5" fill="white" />
      <circle cx="13" cy="8" r="1.5" fill="white" />
      <path
        d="M 6 12 Q 10 14 14 12"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export default function ChatHeader({ onNewChat, onRefresh, onClose }) {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <BotIcon />
        <h1 className="chat-header-title">CampusBot</h1>
      </div>

      <div className="chat-header-right">
        <button
          className="header-btn"
          onClick={onNewChat}
          title="New Chat"
          aria-label="Start new chat"
        >
          <MessageSquarePlus size={20} />
          <span className="btn-label">New</span>
        </button>

        <button
          className="header-btn"
          onClick={onRefresh}
          title="Refresh Chat"
          aria-label="Refresh chat"
        >
          <RotateCcw size={20} />
          <span className="btn-label">Refresh</span>
        </button>

        
      </div>
    </div>
  );
}
