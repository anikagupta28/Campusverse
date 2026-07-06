import { useEffect, useState } from "react";
import API from "../../utils/api";
import "./AdminTalkNest.css";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function AdminTalkNest() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/talknest");
      setPosts(res.data);
    } catch {
      showToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const deletePost = async (id) => {
    try {
      await API.delete(`/talknest/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      showToast("Post deleted successfully");
    } catch {
      showToast("Failed to delete post", "error");
    }
    setConfirm(null);
  };

const deleteReply = async (postId, replyId) => {
  await API.delete(`/talknest/${postId}/reply/${replyId}`);

  setPosts(prev =>
    prev.map(p =>
      p._id === postId
        ? {
            ...p,
            replies: p.replies.filter(r => r._id !== replyId)
          }
        : p
    )
  );
  setConfirm(null);
};

  const filtered = posts.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (p.content || p.text || "").toLowerCase().includes(q) ||
      (p.user || "").toLowerCase().includes(q)
    );
  });

  const totalReplies = posts.reduce((s, p) => s + (p.replies?.length || 0), 0);

  return (
    <div className="atn-root">

      {toast && (
        <div className={`atn-toast ${toast.type === "error" ? "atn-toast--error" : ""}`}>
          {toast.type === "error" ? "✕" : "✓"} {toast.msg}
        </div>
      )}

      {confirm && (
        <div className="atn-overlay" onClick={() => setConfirm(null)}>
          <div className="atn-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="atn-dialog-icon">🗑️</div>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this <strong>{confirm.type}</strong>?</p>
            <p className="atn-dialog-label">"{confirm.label}"</p>
            <div className="atn-dialog-btns">
              <button className="atn-dialog-cancel" onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className="atn-dialog-confirm"
                onClick={() =>
                  confirm.type === "post"
                    ? deletePost(confirm.postId)
                    : deleteReply(confirm.postId, confirm.replyId)
                }
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="atn-header">
        <div className="atn-header-left">
          <h2>🕊️ TalkNest Moderation</h2>
          <p>Review and remove inappropriate questions and replies</p>
        </div>
        <div className="atn-stats">
          <div className="atn-stat">
            <span className="atn-stat-val">{posts.length}</span>
            <span className="atn-stat-lbl">Posts</span>
          </div>
          <div className="atn-stat">
            <span className="atn-stat-val">{totalReplies}</span>
            <span className="atn-stat-lbl">Replies</span>
          </div>
          <div className="atn-stat">
            <span className="atn-stat-val">{filtered.length}</span>
            <span className="atn-stat-lbl">Showing</span>
          </div>
        </div>
      </div>

      <div className="atn-search-wrap">
        <span className="atn-search-icon">🔍</span>
        <input
          type="text"
          className="atn-search"
          placeholder="Search posts by content or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="atn-search-clear" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {loading ? (
        <div className="atn-loading">
          <div className="atn-spinner" />
          <p>Loading posts…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="atn-empty">
          <div className="atn-empty-icon">📭</div>
          <h3>{search ? "No posts match your search" : "No posts yet"}</h3>
          <p>{search ? "Try a different keyword" : "TalkNest has no content to moderate"}</p>
        </div>
      ) : (
        <div className="atn-list">
          {filtered.map((post) => {
            const postText = post.content || post.text || "(no content)";
            const isExpanded = expandedId === (post._id || post.id);
            const replies = post.replies || [];

            return (
              <div key={post._id || post.id} className="atn-card">
                <div className="atn-card-header">
                  <div className="atn-card-meta">
                    <span className="atn-avatar">👤</span>
                    <div>
                      <span className="atn-user">{post.author || post.user || "Anonymous"}</span>
                      {post.status === "flagged" && <span style={{ color: "red", fontWeight: "bold", marginLeft: "10px", fontSize: "12px", border: "1px solid red", padding: "2px 6px", borderRadius: "10px"}}>FLAGGED: PROFANITY</span>}

                      {post.course && <span className="atn-course">{post.course}</span>}
                      <span className="atn-time">{timeAgo(post.createdAt || post.timestamp)}</span>
                    </div>
                  </div>
                  <div className="atn-card-actions">
                    {replies.length > 0 && (
                      <button
                        className="atn-expand-btn"
                        onClick={() => setExpandedId(isExpanded ? null : (post._id || post.id))}
                      >
                        {isExpanded ? "▲ Hide" : `▼ ${replies.length} Repl${replies.length === 1 ? "y" : "ies"}`}
                      </button>
                    )}
                     {post.status === "flagged" && (
                      <button
                        className="atn-approve-btn"
                        style={{ background: "#10b981", color: "white", padding: "4px 8px", borderRadius: "4px", border: "none", cursor: "pointer", marginRight: "8px" }}
                        onClick={async () => {
                           try {
                             await API.put(`/talknest/${post._id || post.id}/approve`);
                             setPosts((prev) =>
                               prev.map((p) =>
                                 (p._id || p.id) === (post._id || post.id) ? { ...p, status: "approved" } : p
                               )
                             );
                             showToast("Post approved");
                           } catch (err) {
                             showToast("Failed to approve post", "error");
                           }
                        }}
                      >
                        ✅ Approve
                      </button>
                    )}
                    <button
                      className="atn-delete-btn"
                      onClick={() =>
                        setConfirm({
                          type: "post",
                          postId: post._id || post.id,
                          label: postText.slice(0, 60) + (postText.length > 60 ? "…" : ""),
                        })
                      }
                    >
                      🗑 Delete Post
                    </button>

                  </div>
                </div>

                <p className="atn-card-text">{postText}</p>

                {post.tags?.length > 0 && (
                  <div className="atn-tags">
                    {post.tags.map((t) => (
                      <span key={t} className="atn-tag">#{t}</span>
                    ))}
                  </div>
                )}

                {isExpanded && replies.length > 0 && (
                  <div className="atn-replies">
                    <div className="atn-replies-title">💬 Replies ({replies.length})</div>
                    {replies.map((r) => (
                      <div key={r.id || r._id} className="atn-reply">
                        <div className="atn-reply-meta">
                          <span className="atn-reply-avatar">💬</span>
                          <span className="atn-reply-user">{r.user || "Anonymous"}</span>
                          <span className="atn-reply-time">{r.time || timeAgo(r.createdAt)}</span>
                        </div>
                        <p className="atn-reply-text">{r.text || r.content}</p>
                        <button
                          className="atn-reply-delete"
                          onClick={() =>
                            setConfirm({
                              type: "reply",
                              postId: post._id || post.id,
                              replyId: r.id || r._id,
                              label: (r.text || r.content || "").slice(0, 60),
                            })
                          }
                        >
                          🗑 Remove Reply
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
