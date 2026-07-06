export default function ChatMessage({ sender, text }) {
  return (
    <div>
      <strong>{sender}:</strong> {text}
    </div>
  );
}

