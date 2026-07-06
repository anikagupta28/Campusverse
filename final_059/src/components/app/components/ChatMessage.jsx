const BotAvatar = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="16" fill="#6d4fc2" />
    <g transform="translate(8, 9)">
      <rect x="2" y="3" width="12" height="10" rx="3" fill="white" />
      <line
        x1="8"
        y1="3"
        x2="8"
        y2="1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="0.5" r="1" fill="white" />
      <circle cx="6" cy="7" r="1.2" fill="#6d4fc2" opacity="0.9" />
      <circle cx="10" cy="7" r="1.2" fill="#6d4fc2" opacity="0.9" />
      <path
        d="M 5.5 10 Q 8 11.5 10.5 10"
        stroke="#6d4fc2"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export default function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`message-wrapper ${isBot ? 'bot-message-wrapper' : 'user-message-wrapper'}`}>
      {isBot && (
        <div className="message-avatar">
          <BotAvatar />
        </div>
      )}

      <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
        <p className="message-text">{message.text}</p>
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
