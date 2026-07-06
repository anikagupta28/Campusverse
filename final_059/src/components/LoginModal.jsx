import Login from "./Login";

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalWrapper}>
        <button style={closeBtn} onClick={onClose}>
          ✕
        </button>

        <Login />
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalWrapper = {
  position: "relative",
  zIndex: 1001,   // 👈 important
};

const closeBtn = {
  position: "absolute",
  top: "-15px",
  right: "-15px",
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  border: "none",
  background: "#fff",
  fontSize: "18px",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  zIndex: 2000,   // 👈 VERY IMPORTANT
};

export default LoginModal;
