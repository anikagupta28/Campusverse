import { useEffect, useState } from "react";
import {
  addAchievementComment,
  createAchievement,
  fetchAchievements,
  updateAchievementLikes,
} from "../utils/AchivementApi";
import "./RiseWall.css";

export default function RiseWall() {
  const [filter, setFilter] = useState("All");
  const [showSubmit, setShowSubmit] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePost, setActivePost] = useState(null);

  // Fetch achievements from backend
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setLoading(true);
        const data = await fetchAchievements();
        // Map backend data to frontend format
        const mappedPosts = (data || []).map((achievement) => ({
          id: achievement._id,
          class: achievement.studentClass || "",
          category: achievement.category,
          title: achievement.title,
          description: achievement.description,
          images: achievement.images || [],
          likes:
            typeof achievement.likes === "number" ? achievement.likes : 0,
          comments: achievement.comments || [],
          userName:
            achievement.studentName ||
            achievement.student ||
            "Anonymous",
          createdAt: achievement.createdAt,
        }));

        setPosts(mappedPosts);
        setError(null);
      } catch (err) {
        console.error("Failed to load achievements:", err);
        setError("Failed to load achievements. Please try again later.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  const filteredPosts = filter === "All" 
    ? posts 
    : posts.filter((p) => p.category === filter);

  // Handle achievement submission and refresh list
  const handleAchievementCreated = async () => {
    try {
      const data = await fetchAchievements();
      const mappedPosts = (data || []).map((achievement) => ({
        id: achievement._id,
        class: achievement.studentClass || "",
        category: achievement.category,
        title: achievement.title,
        description: achievement.description,
        images: achievement.images || [],
        likes: typeof achievement.likes === "number" ? achievement.likes : 0,
        comments: achievement.comments || [],
        userName:
          achievement.studentName ||
          achievement.student ||
          "Anonymous",
        createdAt: achievement.createdAt,
      }));
      setPosts(mappedPosts);
    } catch (err) {
      console.error("Failed to refresh achievements:", err);
    }
  };

  return (
    <div className="risewall-page">
      {/* HEADER SECTION */}
      <header className="header-section">
        <h1 className="risewall-heading">🏆 RiseWall</h1>
        <p className="risewall-subtitle">
          "Celebrating achievements, big and small. Every milestone tells a story of perseverance and passion."
        </p>
      </header>

      {/* CONTROLS BAR */}
      <div className="top-bar">
        <div className="filter-container">
          <select
            className="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Academic">🎓 Academic</option>
            <option value="Sports">⚽ Sports</option>
            <option value="Cultural">🎭 Cultural</option>
            <option value="Technical">💻 Technical</option>
          </select>
          <span className="filter-count">{filteredPosts.length} achievements</span>
        </div>

        <button 
          className="submit-btn-top"
          onClick={() => setShowSubmit(true)}
        >
          <span>+</span>
          Share Your Achievement
        </button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading achievements...</h3>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3>{error}</h3>
        </div>
      )}

      {/* ACHIEVEMENTS GRID */}
      {!loading && !error && (
        <main className="risewall-grid">
          {filteredPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onOpen={() => setActivePost(post)}
            />
          ))}
        </main>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filteredPosts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3>No achievements found</h3>
          <p>Try selecting a different category or share an achievement using the button above.</p>
        </div>
      )}

      {/* MODAL */}
      {showSubmit && (
        <SubmitModal 
          close={() => setShowSubmit(false)} 
          onSuccess={handleAchievementCreated}
        />
      )}

      {/* POST DETAIL MODAL */}
      {activePost && (
        <PostModal post={activePost} onClose={() => setActivePost(null)} />
      )}
    </div>
  );
}

/* ---------- POST COMPONENT ---------- */
function Post({ post, onOpen }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState(null);
  const userId =
    localStorage.getItem("email") ||
    localStorage.getItem("anonId") ||
    "anon";
  const likeStorageKey = `risewall_like_${userId}_${post.id}`;
  const [liked, setLiked] = useState(
    () => localStorage.getItem(likeStorageKey) === "true"
  );

  const handleLike = async (e) => {
    e.stopPropagation();
    const nextLiked = !liked;
    const delta = nextLiked ? 1 : -1;

    // Persist per-user liked state so it survives refresh.
    localStorage.setItem(likeStorageKey, String(nextLiked));
    setLikes((prev) => Math.max(0, prev + delta));
    setLiked(nextLiked);

    try {
      const data = await updateAchievementLikes(post.id, delta);
      if (typeof data?.likes === "number") setLikes(data.likes);
    } catch (error) {
      console.error("Failed to update likes:", error);
      // Rollback optimistic UI
      localStorage.setItem(likeStorageKey, String(!nextLiked));
      setLiked(!nextLiked);
      setLikes((prev) => Math.max(0, prev - delta));
    }
  };

  const submitComment = async () => {
    // called from handlers that already stopped propagation
    if (!commentText.trim()) return;

    // Clear previous error
    setCommentError(null);

    const textToSend = commentText;
    setCommentText("");

    try {
      const saved = await addAchievementComment(post.id, {
        user: "You",
        text: textToSend,
      });

      // Only add comment to UI if backend accepted it
      setComments((prev) => [...prev, saved]);
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Show backend validation message (e.g. profanity) in red box like share achievement
      setCommentError(
        error.message ||
          "Failed to add comment. Please use respectful and appropriate language."
      );
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <article className="rise-card" onClick={onOpen}>
      {/* CARD HEADER */}
      <div className="post-header">
        <div className="post-top-row">
          <div className="avatar" title={post.userName}>
            {getInitials(post.userName)}
          </div>
          <span className={`category-tag ${post.category.toLowerCase()}`}>
            {post.category === "Academic" && "🎓"}
            {post.category === "Sports" && "⚽"}
            {post.category === "Cultural" && "🎭"}
            {post.category === "Technical" && "💻"}
            {post.category}
          </span>
        </div>
        <div className="user-meta-row">
          <div className="user-name">{post.userName}</div>
          <div className="class-text">{post.class}</div>
        </div>
      </div>

      {/* IMAGE SLIDER */}
      {post.images && post.images.length > 0 && (
        <div className="image-slider">
          <img 
            src={post.images[imgIndex]} 
            alt={`${post.title} - Achievement visual`}
            loading="lazy"
          />
          
          {post.images.length > 1 && (
            <>
              <button 
                className="slider-btn prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIndex((imgIndex - 1 + post.images.length) % post.images.length);
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button 
                className="slider-btn next"
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIndex((imgIndex + 1) % post.images.length);
                }}
                aria-label="Next image"
              >
                ›
              </button>

              <div className="dots-indicator">
                {post.images.map((_, i) => (
                  <span 
                    key={i} 
                    className={i === imgIndex ? "active" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImgIndex(i);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* CONTENT */}
      <h3 className="post-title">{post.title}</h3>
      <p className="post-desc">{post.description}</p>

      {/* INTERACTIONS */}
      <div className="actions">
        <span 
          onClick={handleLike}
          className={liked ? "liked" : ""}
        >
          {liked ? '❤️' : '🤍'} {likes}
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(!showComments);
          }}
        >
          💬 {comments.length}
        </span>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div
          className="comments"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="comments-header">
            <h4>Comments ({comments.length})</h4>
          </div>

          {commentError && (
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: "8px",
                marginBottom: "10px",
                fontSize: "0.85rem",
              }}
            >
              {commentError}
            </div>
          )}
          
          {comments.length > 0 ? (
            <div className="comments-list">
              {comments.map((comment, i) => (
                <div key={i} className="comment">
                  <div className="avatar small">
                    {getInitials(comment.user)}
                  </div>
                  <div className="comment-content">
                    <div className="comment-user">{comment.user}</div>
                    <div className="comment-text">{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}

          <div className="comment-input-container">
            <input
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && commentText.trim()) {
                  e.preventDefault();
                  submitComment();
                }
              }}
            />
            <button 
              className="comment-submit"
              onClick={(e) => {
                e.stopPropagation();
                submitComment();
              }}
              disabled={!commentText.trim()}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/* ---------- SUBMIT MODAL ---------- */
function SubmitModal({ close, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    studentClass: "",
    category: "Academic",
    description: "",
    files: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.files || formData.files.length === 0) {
        setError("Please upload at least one image (certificate or photo).");
        setIsSubmitting(false);
        return;
      }
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("class", formData.studentClass);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("description", formData.description);
      
      // Append selected files (max 5)
      for (const file of formData.files) {
        formDataToSend.append("images", file);
      }

      console.log("Submitting achievement:", {
        title: formData.title,
        category: formData.category,
        filesCount: formData.files?.length || 0,
      });

      await createAchievement(formDataToSend);
      alert("Achievement submitted successfully! 🎉");
      // Reset form
      setFormData({
        title: "",
        name: "",
        studentClass: "",
        category: "Academic",
        description: "",
        files: []
      });
      close();
      // Refresh the achievements list
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit achievement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError(null);
    if (files && files.length > 0) {
      const selected = Array.from(files);

      if (selected.length > 5) {
        setError("You can select max 5 photos.");
      }

      const limited = selected.slice(0, 5);
      const invalid = limited.find((f) => !f.type.startsWith("image/"));
      if (invalid) {
        setError("Please select only image files (JPEG, JPG, PNG, GIF, etc.)");
        return;
      }

      setFormData((prev) => ({ ...prev, files: limited }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="overlay" onClick={close}>
      <div className="submit-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-top" onClick={close} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <h2 className="submit-title">🏆 Share Your Achievement</h2>
        </div>

        <form className="submit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">🎯 Title of Achievement</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., National Hackathon Winner"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">👤 Your Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Meitriyee"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentClass">🎓 Your Class</label>
              <input
                id="studentClass"
                name="studentClass"
                type="text"
                placeholder="e.g., B.Tech CSE"
                value={formData.studentClass}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">📚 Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Technical">Technical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">📝 Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Tell us about your achievement, challenges faced, and lessons learned..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">📎 Upload Proof (Max 5 photos)</label>
            <div className="file-upload">
              <input
                id="file"
                name="file"
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml,image/*"
                onChange={handleChange}
              />
              {formData.files && formData.files.length > 0 && (
                <div className="upload-selected">
                  Selected: {formData.files.length} photo(s) (
                  {formData.files[0]?.name})
                </div>
              )}
            </div>
          </div>

          {error && (
            <div style={{ 
              padding: "12px", 
              backgroundColor: "#ffebee", 
              color: "#c62828", 
              borderRadius: "8px",
              marginBottom: "16px"
            }}>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={close}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn-main"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Share Achievement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- POST DETAIL MODAL ---------- */
function PostModal({ post, onClose }) {
  const [imgIndex, setImgIndex] = useState(0);

  const getInitials = (name) =>
    (name || "")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="submit-card post-detail-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-top"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="post-header">
          <div className="post-top-row">
            <div className="avatar" title={post.userName}>
              {getInitials(post.userName)}
            </div>
            <span className={`category-tag ${(post.category || "").toLowerCase()}`}>
              {post.category === "Academic" && "🎓"}
              {post.category === "Sports" && "⚽"}
              {post.category === "Cultural" && "🎭"}
              {post.category === "Technical" && "💻"}
              {post.category}
            </span>
          </div>
          <div className="user-meta-row">
            <div className="user-name">{post.userName}</div>
            <div className="class-text">{post.class}</div>
          </div>
        </div>

        {post.images && post.images.length > 0 && (
          <div className="image-slider">
            <img
              src={post.images[imgIndex]}
              alt={post.title}
              loading="lazy"
            />

            {post.images.length > 1 && (
              <>
                <button
                  className="slider-btn prev"
                  onClick={() =>
                    setImgIndex(
                      (imgIndex - 1 + post.images.length) % post.images.length
                    )
                  }
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="slider-btn next"
                  onClick={() =>
                    setImgIndex((imgIndex + 1) % post.images.length)
                  }
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}

        <h3 className="post-title" style={{ marginTop: "1rem" }}>
          {post.title}
        </h3>
        <p className="post-desc">{post.description}</p>
      </div>
    </div>
  );
}