  import { useState, useEffect, useRef } from "react";
  import "./TalkNest.css";

  // ─── Profanity Filter ────────────────────────────────────────────────────────
  const BAD_WORDS = [
    "fuck", "shit", "bitch", "bastard", "asshole", "ass", "crap", "damn",
    "hell", "cunt", "dick", "piss", "cock", "whore", "slut", "idiot",
    "stupid", "moron", "retard", "nigger", "nigga", "faggot", "fag",
    "motherfucker", "motherfucking", "fucker", "bullshit", "wtf", "stfu",
    "dumbass", "jackass", "loser", "jerk", "prick", "twat", "wanker",
    "arsehole", "arse", "bollocks", "bugger", "bloody hell",
    "madarchod", "behenchod", "behen ke lode", "bhen ka loda",
    "bhosadike", "bhosadi", "bhosda", "chutiya", "chutiye", "chut",
    "lund", "lode", "loda", "gaand", "gandu", "haramzada", "haramzadi",
    "harami", "kamina", "kamini", "randi", "randwa", "maderchod",
    "mc", "bc", "bkl", "bsdke", "bsdk",
    "saala", "saali", "sala", "sali",
    "kutte", "kutta", "kuttiya", "kutiya", "suar", "suwar",
    "ullu ka pattha", "ullu", "bakwaas", "bakwas",
    "teri maa ki", "teri maa", "teri behen ki",
    "jhant", "jhatu", "jhaatu", "hijra", "chakka",
    "chodu", "chodna", "chodne",
    "randi ka bacha", "randi ke", "randike",
    "maa ki aankh", "maa ki", "tatte", "tatti",
    "gaandu", "gadha", "gadhe", "nalayak", "nikamma",
  ];

  const filterProfanity = (text) => {
    let filtered = text;
    BAD_WORDS.forEach((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(?<![\\w])${escaped}(?![\\w])`, "gi");
      filtered = filtered.replace(regex, (match) => "*".repeat(match.length));
    });
    return filtered;
  };



const getAnon = (userId) => {
  return {
    id: userId ? userId.split("@")[0] : "Anonymous", // ✅ UNIQUE
    avatar: "👤",
    color: "#6366f1"
  };
};

  const reactions = ["👍", "❤️", "🔥", "👏", "🤔", "🎯"];

  export default function TalkNest() {
    const userId = localStorage.getItem("email");
    const user = getAnon(userId);
    console.log("userid",userId);
    const [courseFilter, setCourseFilter] = useState("All");
    const [showAsk, setShowAsk] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("votes");
    const [newPost, setNewPost] = useState({ text: "", course: "B.Tech" });
    const [replyInputs, setReplyInputs] = useState({});
    const [postReactions, setPostReactions] = useState({});
  const [posts, setPosts] = useState([]);
  const [userStats, setUserStats] = useState({
    solved: 0,
    totalLikes: 0,
    totalFires: 0
  });

  const getUserStats = (authorId) => {
    let solved = 0;
    let likes = 0;
    let fires = 0;

    posts.forEach(p => {
      p.replies?.forEach(r => {
        if (r.author === authorId) {
          solved += 1;

          // ✅ only count THIS user's reply likes
          likes += r.likes?.length || 0;
          fires += r.fires?.length || 0;
        }
      });
    });

    return { solved, likes, fires };
  };

  const fetchUserStats = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/talknest/user-stats/${userId}`)
      .then(res => res.json())
      .then(data => setUserStats(data));
  };


    const visiblePosts = posts
      .filter(p => {
        const courseMatch = courseFilter === "All" || p.course === courseFilter;
        const searchMatch = searchQuery === "" ||
          p.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return courseMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === "votes") return b.votes - a.votes;
        if (sortBy === "recent") return new Date(b.timestamp) - new Date(a.timestamp);
        if (sortBy === "replies") return b.replies.length - a.replies.length;
        return 0;
      });

    const vote = (id, type) => {
      setPosts(posts.map(p =>
        p.id === id ? { ...p, votes: type === "up" ? p.votes + 1 : p.votes - 1 } : p
      ));
    };

    const addReaction = (postId, reaction) => {
      setPostReactions(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), { reaction, user: user.id }]
      }));
    };


  const addReply = async (postId) => {
    if (!postId) return;
    const text = replyInputs[postId];
    if (!text?.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/talknest/${postId}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
      body: JSON.stringify({
    text,
    userId   // ✅ send real user
  })
      });

      const updatedPost = await res.json();

      setPosts(prev =>
    prev.map(p =>
      p._id === postId ? updatedPost : p
    )
  );

      setReplyInputs(prev => ({ ...prev, [postId]: "" }));
      fetchUserStats();   // ✅ ADD HERE

    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const toggleLike = async (postId) => {
    if (!postId) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/talknest${postId}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();  // ✅ now valid

  setPosts(prev =>
    prev.map(p =>
      p._id === postId
        ? { ...p, likes: data.likes }
        : p
    )
  );

  fetchUserStats(); 
  };


  const toggleFire = async (postId) => {
    if (!postId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/talknest${postId}/fire`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();

      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, fires: data.fires }
            : p
        )
      );
  fetchUserStats(); 
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReplyLike = async (postId, replyId) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/talknest/${postId}/reply/${replyId}/like`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      }
    );

    const updatedReply = await res.json();

    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? {
              ...p,
              replies: p.replies.map(r =>
                r._id === replyId ? updatedReply : r
              )
            }
          : p
      )
    );

    fetchUserStats();   // ✅ ADD THIS
  };

  const toggleReplyFire = async (postId, replyId) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/talknest/${postId}/reply/${replyId}/fire`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      }
    );

    const updatedReply = await res.json();

    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? {
              ...p,
              replies: p.replies.map(r =>
                r._id === replyId ? updatedReply : r
              )
            }
          : p
      )
    );
    fetchUserStats();   // ✅ ADD SAME HERE
  };



  const submitQuestion = async () => {
    console.log(userId);
    
    if (!newPost.text.trim()) return;

    if (!userId) {
      alert("User not logged in");
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/talknest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newPost.text,
        userId   // ✅ IMPORTANT
      })
    });

    const data = await res.json();

    setPosts(prev => [
      {
        ...data.post,
        showAll: false,
        showReply: false
      },
      ...prev
    ]);

    setNewPost({ text: "", course: "B.Tech" });
  };
    const menuRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/talknest`)
      .then(res => res.json())
      .then(data => {
        const fixed = data.map(p => ({
          ...p,
          likes: Array.isArray(p.likes) ? p.likes : [],
          fires: Array.isArray(p.fires) ? p.fires : [],
          replies: Array.isArray(p.replies) ? p.replies : [],
          showAll: false,
          showReply: false
        }));

        setPosts(fixed);
      });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserStats();   // ✅ ADD THIS
    }
  }, [userId]);
    return (
      <div className="talknest-page">
        {/* HEADER */}
        <header className="talknest-header">
          <div className="header-left">
            <div className="logo" style={{ backgroundColor: user.color }}>
              {user.avatar}
            </div>
            <div className="user-info">
    <span className="user-id">Anonymus</span>
    <div className="user-meta">
      <span>✅ Solved: {userStats.solved}</span>
    </div>
  </div>
          </div>

          <div className="header-center">
            <h1 className="logo-text">🕊️ TalkNest</h1>
            <p className="tagline">Anonymously connect, discuss, and grow together</p>
          </div>

          <div className="header-right">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search questions or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            <button className="ask-btn" onClick={() => setShowAsk(true)}>
              <span className="btn-icon">+</span> Ask Question
            </button>
          </div>
        </header>

        {/* MAIN */}
        <div className="main-content">
          {/* SIDEBAR */}
          

          {/* FEED */}
          <main className="feed modern-feed">
    {visiblePosts.map(post => (
      <div key={post._id} className="qa-card">

        {/* USER HEADER */}
        <div className="qa-header">
          <div className="avatar">{user.avatar}</div>
          <div>
            <div className="username">
 Anonymous
</div>
            {(() => {
  const stats = getUserStats(post.author);
  return (
    <div className="user-stats">
      <span>✅ Solved: {stats.solved}</span>
      <span>👍 Appreciation: {stats.likes}</span>
      <span>🔥 Fire: {stats.fires}</span>
    </div>
  );
})()}
          </div>
        </div>

        {/* QUESTION */}
        <div className="qa-question">
          {post.text}
        </div>

        {/* STATS */}


        {/* ACTION BAR */}
        <div className="qa-actions">
          <button
            className="link-btn"
            onClick={() =>
              setPosts(posts.map(p =>
    p._id === post._id ? { ...p, showAll: !p.showAll } : p
  ))
            }
          >
            {post.showAll
              ? "Hide Answers"
              : `View Replies / Answers (${post.replies.length})`}
          </button>

          <button
            className="link-btn"
            onClick={() =>
            setPosts(posts.map(p =>
    p._id === post._id ? { ...p, showReply: !p.showReply } : p
  ))
            }
          >
            Write Answer
          </button>
        </div>

        {/* ANSWERS */}
        {post.showAll && (
          <div className="answers-section">
            <h4>{post.replies.length} Answers</h4>

            {post.replies?.map((reply, i) => (
              <div key={reply._id || i} className="answer-card">
    <div className="answer-header">
      <div className="avatar small">👤</div>
      <div>
       <div className="username">
  Anonymous
</div>

        {(() => {
          const stats = getUserStats(reply.author);
          return (
            <div className="user-stats">
              <span>✅ Solved: {stats.solved}</span>
              <span>👍 Appreciation: {stats.likes}</span>
            </div>
          );
        })()}
      </div>
    </div>

    {/* ✅ ANSWER TEXT */}
    <p className="answer-text">{reply.text}</p>

    {/* ✅ ADD THIS PART (LIKE + FIRE BUTTONS) */}
    <div className="qa-stats">
      <button
        className={`react-btn ${
          reply.likes?.includes(userId) ? "liked" : ""
        }`}
        onClick={() => toggleReplyLike(post._id, reply._id)}
      >
        👍 {reply.likes?.length || 0}
      </button>

      <button
        className={`react-btn ${
          reply.fires?.includes(userId) ? "fired" : ""
        }`}
        onClick={() => toggleReplyFire(post._id, reply._id)}
      >
        🔥 {reply.fires?.length || 0}
      </button>
    </div>

  </div>
            ))}
          </div>
        )}

        {/* WRITE ANSWER */}
        {post.showReply && (
          <div className="write-answer">
            <textarea
              placeholder="Write your answer..."
              value={replyInputs[post._id] || ""}
              onChange={(e) =>
                setReplyInputs(prev => ({ ...prev, [post._id]: e.target.value }))
              }
            />
            <button onClick={() => addReply(post._id)}>Post Answer</button>
          </div>
        )}
      </div>
    ))}
  </main>
        </div>

        {/* Floating Ask Button */}
        {/* <button className="floating-ask-btn" onClick={() => setShowAsk(true)}>
          <span className="plus-icon">+</span>
          <span className="btn-text">Ask Question</span>
        </button> */}

        {showAsk && (
          <AskModal
            close={() => setShowAsk(false)}
            newPost={newPost}
            setNewPost={setNewPost}
            submitQuestion={submitQuestion}
          />
        )}
      </div>
    );
  }

  function AskModal({ close, newPost, setNewPost, submitQuestion }) {
    const textareaRef = useRef(null);
    useEffect(() => { textareaRef.current?.focus(); }, []);

    return (
      <div className="modal-overlay" onClick={close}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2><span className="modal-icon">💭</span> Ask Your Question</h2>
            <button className="close-btn" onClick={close}>✕</button>
          </div>
          <div className="modal-body">
            <p className="modal-subtext">
              Your identity stays anonymous. Ask anything related to your academic journey!
            </p>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📝</span> Your Question
              </label>
              <textarea
                ref={textareaRef}
                className="question-input"
                placeholder="What's on your mind? Be specific for better answers..."
                value={newPost.text}
                onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                maxLength={500}
                rows={4}
              />
              <div className="char-count">{newPost.text.length}/500</div>
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎓</span> Select Course
              </label>
              <select
                className="course-select"
                value={newPost.course}
                onChange={(e) => setNewPost({ ...newPost, course: e.target.value })}
              >
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="BCA">BCA</option>
                <option value="B.Sc">B.Sc</option>
                <option value="B.Com + LLB">B.Com + LLB</option>
                <option value="Nursing">Nursing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🏷️</span> Add Tags (Optional)
              </label>
              <input type="text" className="tags-input" placeholder="e.g., career, study-tips, mental-health" />
              <small className="form-hint">Separate with commas</small>
            </div>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={close}>Cancel</button>
            <button
              className="submit-btn"
              onClick={submitQuestion}
              disabled={!newPost.text.trim()}
            >
              <span className="btn-icon">🚀</span> Post Question
            </button>
          </div>
        </div>
      </div>
    );
  }