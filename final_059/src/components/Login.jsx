import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  // ⚠️ IMPORTANT: NO /api/auth
  const API_BASE = "http://localhost:5050";

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+@banasthali\.in$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!collegeEmailRegex.test(formData.email)) {
      setError("Only @banasthali.in email is allowed");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/login" : "/signup";

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Authentication failed");
        setLoading(false);
        return;
      }

      // OTP sent
      setOtpSent(true);

    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Invalid OTP");
        setLoading(false);
        return;
      }

      // SAVE TOKEN
      localStorage.setItem("token", result.token);
      if (result.email) {
  localStorage.setItem("email", result.email);
} else {
  localStorage.setItem("email", formData.email); // fallback
}

      alert("Login successful!");
      navigate("/");

    } catch (err) {
      setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="login-container">

    {/* LEFT SIDE */}
    <div className="login-left">
      <h2>{isLogin ? "LOGIN" : "SIGN UP"}</h2>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleSubmit}>

       {!isLogin && (
    <div className="login-input-group">
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        required
      />
    </div>
  )}

  <div className="login-input-group">
    <input
      type="email"
      placeholder="Email"
      value={formData.email}
      onChange={(e) =>
        setFormData({ ...formData, email: e.target.value })
      }
      required
    />
  </div>

  <div className="login-input-group">
    <input
      type="password"
      placeholder="Password"
      value={formData.password}
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
      required
    />
  </div>

  {otpSent && (
    <>
      <div className="login-input-group">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>

      <button
        type="button"
        className="login-btn"
        onClick={verifyOtp}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </>
  )}

  {!otpSent && (
    <button
      className="login-btn"
      type="submit"
      disabled={loading}
    >
      {loading
        ? "Please wait..."
        : isLogin
        ? "Login"
        : "Sign Up"}
    </button>
  )}
</form>
      {/* SWITCH */}
      <p className="switch-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span
          onClick={() => {
            setIsLogin(!isLogin);
            setOtpSent(false);
            setError("");
          }}
        >
          {isLogin ? " Sign Up" : " Login"}
        </span>
      </p>
    </div>

    {/* RIGHT SIDE */}
    <div className="login-right">
      <img src="/loginpic.jpeg" alt="login visual" />
    </div>

  </div>
);
}