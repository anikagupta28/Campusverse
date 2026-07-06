import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ChatInput({ onSendMessage, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  // Always keep input focused
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');

      // Refocus immediately after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={disabled}
        />

        {inputValue.trim() && (
          <button
            type="submit"
            className="send-button"
            disabled={disabled}
            aria-label="Send message"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>
    </form>
  );
}