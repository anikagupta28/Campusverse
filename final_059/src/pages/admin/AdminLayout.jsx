import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Guard: only admins can access
  useEffect(() => {
    if (localStorage.getItem("adminAuth") !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("role");
    navigate("/admin-login");
  };

  const links = [
    { to: "notices",  label: "📋 Notex" },
    { to: "alumni",   label: "🎓 Alumni" },
    { to: "risewall", label: "📌 RiseWall" },
    { to: "talknest", label: "🕊️ TalkNest" },
    { to: "reviews",  label: "⭐ Reviews" },
  ];

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">🛡️</div>
          <div>
            <h2>Admin Panel</h2>
            <span className="admin-brand-sub">CampusVerse</span>
          </div>
        </div>

        <nav className="admin-nav">
          {links.map((l) => (
            <Link
              key={l.to}
              to={`/admin/${l.to}`}
              className={`admin-nav-link ${location.pathname.includes(l.to) ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}