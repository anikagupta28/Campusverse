import { useEffect, useState } from "react";
import { deleteAchievement, fetchAchievements } from "../../utils/AchivementApi";
import "../RiseWall.css";
import "./AdminRiseWall.css";

export default function RiseWallAdmin() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAchievements();
      setAchievements(data || []);
    } catch (err) {
      setError(err.message || "Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this achievement?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await deleteAchievement(id);
      setAchievements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete achievement");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="risewall-admin-page">
      <header className="risewall-admin-header">
        <div>
          <h1 className="risewall-admin-heading">RiseWall Admin Panel</h1>
          <p className="risewall-admin-subtitle">
            View and manage all submitted achievements.
          </p>
        </div>
      </header>

      <div className="risewall-admin-content">
        {loading ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">⏳</div>
            <h3>Loading achievements...</h3>
          </div>
        ) : error ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">⚠️</div>
            <h3>{error}</h3>
          </div>
        ) : achievements.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">🏆</div>
            <h3>No achievements found</h3>
            <p>When students submit achievements, they will appear here.</p>
          </div>
        ) : (
          <div className="risewall-grid admin-risewall-grid">
            {achievements.map((a) => {
              const student = a.studentName || a.student || "Student";
              const images = Array.isArray(a.images)
                ? a.images.filter(Boolean)
                : [];
              const firstImage = images[0];

              const getInitials = (name) =>
                (name || "Student")
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

              const classText = a.studentClass || a.class || "";
              return (
                <article key={a._id} className="rise-card admin-rise-card">
                  <div className="post-header">
                    <div className="post-top-row">
                      <div className="avatar" title={student}>
                        {getInitials(student)}
                      </div>
                      <span
                        className={`category-tag ${(
                          a.category || ""
                        ).toLowerCase()}`}
                      >
                        {a.category}
                      </span>
                    </div>
                    <div className="user-meta-row">
                      <div className="user-name">{student}</div>
                      <div className="class-text">{classText}</div>
                    </div>
                  </div>

                  {firstImage && (
                    <div className="admin-image-gallery single">
                      <img
                        key={`${a._id}-0`}
                        src={firstImage}
                        alt={`${a.title} 1`}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <h3 className="post-title" style={{ marginTop: "0.75rem" }}>
                    {a.title}
                  </h3>
                  <p className="post-desc">{a.description}</p>

                  <div className="admin-card-actions">
                    <button
                      className="admin-danger-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(a._id);
                      }}
                      disabled={deletingId === a._id}
                    >
                      {deletingId === a._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}