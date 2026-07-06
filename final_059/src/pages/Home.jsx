import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatbotIcon from "../components/chatbot/ChatbotIcon";
import "./Home.css";

import photo1 from "../assets/images/bg2.jpeg";
import photo2 from "../assets/images/bg6.png";
import photo3 from "../assets/images/bg9.png";
import photo4 from "../assets/images/bg6.png";

/* ─── Scroll reveal hook ──────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const targets = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-scale"
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

const SLIDES = [photo1, photo2, photo3, photo4];

const FEATURES = [
  {
    num: "01",
    gradient: "linear-gradient(135deg, #fde8d0 0%, #f9c5d1 50%, #e8b4f8 100%)",
    title: "360° Campus View",
    desc: "Immersive panoramic walkthroughs of every iconic campus location.",
    link: "/360",
    badge: "Immersive",
    mockup: (
      <div className="mock-360">
        <div className="mock-360-img">
          <div className="mock-360-ring" />
          <div className="mock-360-ring mock-360-ring--2" />
          <span className="mock-360-icon">⌖</span>
        </div>
        <div className="mock-360-pill">📍 Main Block · Live View</div>
      </div>
    ),
  },
  {
    num: "02",
    gradient: "linear-gradient(135deg, #e0f0ff 0%, #c9d9ff 50%, #d4c5fb 100%)",
    title: "NoteX",
    desc: "Real-time notices, exam schedules and announcements in one feed.",
    link: "/notex",
    badge: "Live Updates",
    mockup: (
      <div className="mock-notex">
        {["Exam Schedule Released", "Holiday Notice — 25 Mar", "New Circular Added"].map((t, i) => (
          <div className="mock-notex-row" key={i}>
            <span className="mock-notex-dot" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: "03",
    gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbc87a 100%)",
    title: "RiseWall",
    desc: "Celebrate student milestones across academics, sports and culture.",
    link: "/risewall",
    badge: "Community",
    mockup: (
      <div className="mock-rise">
        {[
          { name: "Ananya Malik.", tag: "Gold Medal — Science Olympiad" },
          { name: "Anushka Jurel.",   tag: "1st Place — Debate 2024" },
          { name: "Priya Mishra.",  tag: "Best Art Project Award" },
        ].map((a, i) => (
          <div className="mock-rise-row" key={i}>
            <div className="mock-rise-av">{a.name[0]}</div>
            <div>
              <div className="mock-rise-name">{a.name}</div>
              <div className="mock-rise-tag">{a.tag}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const CARDS = [
  { icon: "💬", title: "TalkNest",     desc: "Anonymous peer guidance and faculty mentorship space.", link: "/talknest" },
  { icon: "🎓", title: "Alumni Scroll",desc: "Explore the distinguished journeys and legacy of alumni.", link: "/alumni" },
  { icon: "⭐", title: "Reviews",      desc: "Verified transparent feedback from the campus community.", link: "/reviews" },
];


/* ─── Home Page ───────────────────────────────────── */
export default function Home() {
  const [slide, setSlide]   = useState(0);
  const [loaded, setLoaded] = useState(false);
  useScrollReveal();

  useEffect(() => {
    setLoaded(true);
    const id = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`mm ${loaded ? "mm--in" : ""}`}>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mm-hero">
        <div className="mm-slides">
          {SLIDES.map((s, i) => (
            <div key={i} className={`mm-slide ${i === slide ? "is-on" : ""}`}
              style={{ backgroundImage: `url(${s})` }} />
          ))}
          <div className="mm-mask" />
        </div>

        <div className="mm-hero-body">
<h1 className="mm-h1">
            All‑in‑One Platform<br />
            <span className="mm-h1-purple">for your Campus</span>
          </h1>
          <p className="mm-hero-p">
            Explore, connect and stay informed —<br />
            one platform for every member of your campus community.
          </p>
          <div className="mm-hero-btns">
            <Link to="/notex"  className="mm-btn mm-btn--ghost">See how it works</Link>
          </div>
        </div>

        <div className="mm-dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={`mm-dot ${i === slide ? "is-on" : ""}`}
              onClick={() => setSlide(i)} />
          ))}
        </div>
      </section>

      {/* ── FEATURE SECTIONS ─────────────────────── */}
      {FEATURES.map((f, i) => (
        <div key={f.num} className="mm-feat-wrap">
          <section className={`mm-feat ${i % 2 === 1 ? "mm-feat--flip" : ""}`}>
            <div className="mm-feat-text reveal-left">
              <span className="mm-feat-badge">{f.badge}</span>
              <h2 className="mm-feat-h2">{f.title}</h2>
              <p className="mm-feat-p">{f.desc}</p>
              <Link to={f.link} className="mm-feat-link">
                Explore {f.title}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="mm-feat-visual reveal-right">
              <div className="mm-feat-num">{f.num}</div>
              <div className="mm-feat-card" style={{ background: f.gradient }}>
                <div className="mm-feat-card-hd">
                  <h4 className="mm-feat-card-title">{f.title}</h4>
                  <p className="mm-feat-card-sub">{f.desc}</p>
                </div>
                {f.mockup}
              </div>
            </div>
          </section>
        </div>
      ))}

      {/* ── SMALL FEATURES GRID ──────────────────── */}
      <section className="mm-grid-section">
        <p className="mm-grid-eyebrow reveal-up">More Features</p>
        <h2 className="mm-h2 reveal-up" style={{animationDelay:"0.1s"}}>Everything else you need</h2>
        <div className="mm-cards-grid">
          {CARDS.map(c => (
            <Link to={c.link} key={c.title} className="mm-small-card reveal-left">
              <span className="mm-small-icon">{c.icon}</span>
              <h3 className="mm-small-title">{c.title}</h3>
              <p className="mm-small-desc">{c.desc}</p>
              <span className="mm-small-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

            {/* ── HISTORY ──────────────────────────────── */}
      <section className="mm-cta">
        <div className="mm-cta-badge reveal-up">Est. 6 October 1935 · Banasthali, Rajasthan</div>

        <h2 className="mm-cta-h2 reveal-up">Our Story</h2>

        <div className="mm-history">
          <div className="mm-history-intro reveal-up">
            <p>
              On <strong>6 October 1935</strong>, Smt. Ratan Shastri and Pandit Hiralal Shastri — freedom
              fighters and educationists — founded Banasthali to fill the void left by the sudden
              death of their talented daughter <strong>Shantabai</strong> at the age of 12. Rather than
              succumb to grief, they channelled it into a mission: educating the women of India.
            </p>
            <p>
              Banasthali owes its existence neither to the zeal of a social reformer nor to a
              philanthropist's purse. It arose, as the founders said, <em>"like the fabled phoenix
              from the ashes of a blossoming flower — Shantabai."</em>
            </p>
          </div>

          <div className="mm-history-timeline">
            <div className="mm-ht-item reveal-up">
              <span className="mm-ht-year">1935</span>
              <div className="mm-ht-body">
                <strong>Shri Shantabai Shiksha Kutir founded</strong>
                <p>Started in mud huts at Jiwan Kutir with just six girls, by Pandit Hiralal Shastri and Smt. Ratan Shastri.</p>
              </div>
            </div>
            <div className="mm-ht-item reveal-up">
              <span className="mm-ht-year">1943</span>
              <div className="mm-ht-body">
                <strong>Renamed Banasthali Vidyapith</strong>
                <p>Undergraduate courses introduced. Prof. Sushila Vyas — the very first student — was appointed its first Director.</p>
              </div>
            </div>
            <div className="mm-ht-item reveal-up">
              <span className="mm-ht-year">1983</span>
              <div className="mm-ht-body">
                <strong>Deemed University status</strong>
                <p>Granted full autonomy by the University Grants Commission (UGC) under Section 3 of the UGC Act, 1956.</p>
              </div>
            </div>
            <div className="mm-ht-item reveal-up">
              <span className="mm-ht-year">2022</span>
              <div className="mm-ht-body">
                <strong>NAAC A++ Accreditation</strong>
                <p>Awarded A++ grade with CGPA 3.63/4.00 — India's highest accreditation level, valid through 2027.</p>
              </div>
            </div>
            <div className="mm-ht-item reveal-up">
              <span className="mm-ht-year">Today</span>
              <div className="mm-ht-body">
                <strong>National Centre for Women's Education</strong>
                <p>610-acre residential campus in Tonk, Rajasthan. 15,000+ students. 200+ programmes from primary to Ph.D. One of only five women-only universities in India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="mm-footer">
        <div className="mm-footer-top">
          <div className="mm-footer-brand">
            <div className="mm-footer-logo">
              <span className="mm-footer-logo-icon">🎓</span>
              <span className="mm-footer-logo-name">CampusVerse</span>
            </div>
            <p className="mm-footer-tagline">Banasthali Vidyapith's official digital campus ecosystem.</p>
            <div className="mm-footer-contact">
              <div className="mm-footer-contact-row">
                <span>📍</span>
                <span>Banasthali Vidyapith, P.O. Banasthali — 304022, Rajasthan, India</span>
              </div>
              <div className="mm-footer-contact-row">
                <span>📞</span>
                <span>+91-01438-228456 / 228341</span>
              </div>
              <div className="mm-footer-contact-row">
                <span>✉️</span>
                <span>info@banasthali.in</span>
              </div>
              <div className="mm-footer-contact-row">
                <span>🌐</span>
                <a href="https://www.banasthali.org" target="_blank" rel="noreferrer">www.banasthali.org</a>
              </div>
            </div>
          </div>

          <div className="mm-footer-links">
            <div className="mm-footer-col">
              <h4>Platform</h4>
              <Link to="/360">360° Campus View</Link>
              <Link to="/notex">NoteX</Link>
              <Link to="/risewall">RiseWall</Link>
              <Link to="/talknest">TalkNest</Link>
            </div>
            <div className="mm-footer-col">
              <h4>Community</h4>
              <Link to="/alumni">Alumni Scroll</Link>
              <Link to="/reviews">Reviews</Link>
              <Link to="/risewall">Achievements</Link>
              <Link to="/notex">Announcements</Link>
            </div>
            <div className="mm-footer-col">
              <h4>Institution</h4>
              <a href="https://www.banasthali.org" target="_blank" rel="noreferrer">About Banasthali</a>
              <a href="https://www.banasthali.org/banasthali/wcms/en/home/admission.html" target="_blank" rel="noreferrer">Admissions</a>
              <a href="https://www.banasthali.org/banasthali/wcms/en/home/academics.html" target="_blank" rel="noreferrer">Academics</a>
              <a href="https://www.banasthali.org/banasthali/wcms/en/home/contact-us.html" target="_blank" rel="noreferrer">Contact Us</a>
            </div>
          </div>
        </div>

        <div className="mm-footer-bottom">
          <span>©️ 2025 CampusVerse · Banasthali Vidyapith. All Rights Reserved.</span>
          <div className="mm-footer-socials">
            <a href="https://twitter.com/banasthali_vp" target="_blank" rel="noreferrer" aria-label="Twitter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.837L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.instagram.com/banasthali_vidyapith" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.facebook.com/BanasthaliVidyapith" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.youtube.com/@BanasthaliVidyapith" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* ── CHATBOT ──────────────────────────────── */}
      <div className="mm-bot">
        <span className="mm-bot-tip">Ask me anything</span>
        <ChatbotIcon />
      </div>
    </div>
  );
}