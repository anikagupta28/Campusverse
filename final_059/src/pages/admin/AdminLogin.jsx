import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

// Hardcoded admin credentials (change as needed)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "campusverse@2024";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        form.username === ADMIN_USERNAME &&
        form.password === ADMIN_PASSWORD
      ) {
        localStorage.setItem("adminAuth", "true");
        navigate("/admin/talknest");
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="al-root">
      {/* Animated grid background */}
      <div className="al-grid" />

      <div className="al-card">
        {/* Shield icon */}
        <div className="al-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" className="al-shield">
            <path
              d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
              fill="url(#shieldGrad)"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="shieldGrad" x1="3" y1="2" x2="21" y2="23.25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="al-title">Admin Portal</h1>
        <p className="al-subtitle">CampusVerse — Restricted Access</p>

        {error && (
          <div className="al-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="al-form">
          <div className="al-field">
            <label>Username</label>
            <div className="al-input-wrap">
              <span className="al-icon">👤</span>
              <input
                type="text"
                placeholder="Enter admin username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="al-field">
            <label>Password</label>
            <div className="al-input-wrap">
              <span className="al-icon">🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter admin password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="al-toggle-pass"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="al-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="al-spinner" />
            ) : (
              <>
                <span>🛡️</span> Login as Admin
              </>
            )}
          </button>
        </form>

        <p className="al-back">
          <a href="/">← Back to CampusVerse</a>
        </p>
      </div>
    </div>
  );
}
