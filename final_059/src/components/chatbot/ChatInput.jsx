import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === "Enter") {
          onSend(value);
          setValue("");
        }
      }}
      placeholder="Type and press Enter"
    />
  );
}


