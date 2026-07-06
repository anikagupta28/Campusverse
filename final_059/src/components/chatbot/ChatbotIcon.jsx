import "./ChatbotIcon.css";
import { useNavigate } from "react-router-dom";


export default function ChatbotIcon() {
   const navigate = useNavigate();
  const handleClick = () => {
    navigate("/campusbot");
  };

  return (
    <div
      className="chatbot-icon-wrapper"
      onClick={handleClick}
    >
      <div className="chatbot-icon">🤖</div>
    </div>
  );
}

