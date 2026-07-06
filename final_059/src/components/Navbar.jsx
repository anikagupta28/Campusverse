import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "360° View", to: "/360" },
  { label: "NoteX", to: "/notex" },
  { label: "RiseWall", to: "/risewall" },
  { label: "TalkNest", to: "/talknest" },
  { label: "Alumni", to: "/alumni" },
  { label: "Reviews", to: "/reviews" },
];
export default function Navbar({ onLoginClick }) {
  const [token, setToken] = useState(null);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const onLogoutClick = () => {
    // remove token
    localStorage.removeItem("token");
    setToken(null);
    // redirect to login page
    //window.location.href = "/login";
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`cv-nav ${scrolled ? "cv-nav--scrolled" : ""} ${menuOpen ? "cv-nav--open" : ""}`}
    >
      <div className="cv-nav-inner">
        {/* Logo */}
        <Link to="/" className="cv-nav-logo">
          <img
            src="Banasthali_Vidyapeeth_Logo.png"
            alt="Banasthali Vidyapith"
            className="cv-nav-logo-img"
          />
          <span className="cv-nav-logo-text">CampusVerse</span>
        </Link>

        {/* Desktop links */}
        <ul className="cv-nav-links cv-nav-links-right">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`cv-nav-link ${location.pathname === l.to ? "is-active" : ""}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — Login button */}
        <div className="cv-nav-right">
          {token ? (
            <button className="cv-nav-cta" onClick={onLogoutClick}>
              Logout
            </button>
          ) : (
            <button className="cv-nav-cta" onClick={onLoginClick}>
              Login
            </button>
          )}

          <button
            className={`cv-nav-burger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="cv-nav-mobile">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`cv-nav-mobile-link ${location.pathname === l.to ? "is-active" : ""}`}
          >
            {l.label}
          </Link>
        ))}
        {token ? (
          <button className="cv-nav-mobile-cta" onClick={onLogoutClick}>
            Logout
          </button>
        ) : (
          <button className="cv-nav-mobile-cta" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}