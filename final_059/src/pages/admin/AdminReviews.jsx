import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Review.css';
import './AdminReviews.css';
import "./AdminRiseWall.css";

const AdminReviews = () => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [selectedReview, setSelectedReview] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  const isAdminLoggedIn = () => localStorage.getItem("adminAuth") === "true"

  // Format timestamp for display
  const formatTimestamp = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  // Fetch reviews from database (Admin only)
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      // AdminLogin route name is "/admin-login" in this project
      navigate("/admin-login")
      return
    }

    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await fetch('/api/reviews/all', {
        })

        // Check if response is JSON
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Backend server is not responding. Please make sure the backend server is running on port 5000.')
        }

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load reviews')
        }

        // Transform reviews to card format
        const transformedReviews = data.map((review) => ({
          id: review._id,
          _id: review._id,
          name: review.userName,
          major: review.course || review.userEmail || 'Student',
          rating: review.rating || 5,
          text: review.message,
          timestamp: formatTimestamp(new Date(review.createdAt)),
          date: new Date(review.createdAt)
        }))
        
        setReviews(transformedReviews)
      } catch (err) {
        setError(err.message || 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [navigate])

  // Render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= fullStars
          return (
            <span
              key={i}
              className={`star ${isFilled ? 'full' : 'empty'}`}
            >
              ★
            </span>
          )
        })}
      </div>
    )
  }

  const sortedReviews = [...reviews].sort((a, b) => b.date - a.date)

  const handleCardClick = (review) => {
    setSelectedReview(review)
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedReview(null)
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation() // Prevent card click
    
    if (!isAdminLoggedIn()) {
      navigate("/admin-login")
      return
    }

    if (!window.confirm('Are you sure you want to delete this review permanently?')) return

    try {
      setDeletingId(id)
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      })

      // Check if response is JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend server is not responding. Please make sure the backend server is running on port 5000.')
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Delete failed')
      }

      setReviews((prev) => prev.filter((r) => r._id !== id))
      
      // Close popup if deleted review was selected
      if (selectedReview && selectedReview._id === id) {
        setShowPopup(false)
        setSelectedReview(null)
      }
    } catch (err) {
      alert(err.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="risewall-admin-page">
      <header className="risewall-admin-header">
        <div>
          <h1 className="risewall-admin-heading">Review Admin Panel</h1>
          <p className="risewall-admin-subtitle">
            View and manage all submitted reviews.
          </p>
        </div>
      </header>

      <div className="risewall-admin-content">
        {loading ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">⏳</div>
            <h3>Loading reviews...</h3>
          </div>
        ) : error ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">⚠️</div>
            <h3>{error}</h3>
          </div>
        ) : reviews.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">⭐</div>
            <h3>No reviews found</h3>
            <p>When students submit reviews, they will appear here.</p>
          </div>
        ) : (
          <div className="reviews-grid" style={{ marginTop: "0.75rem" }}>
            {sortedReviews.map((review, index) => (
              <div
                key={review.id || review._id}
                className="review-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(review)}
              >
                <button
                  className="review-delete-btn"
                  onClick={(e) => handleDelete(e, review._id || review.id)}
                  disabled={deletingId === (review._id || review.id)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    cursor:
                      deletingId === (review._id || review.id)
                        ? "not-allowed"
                        : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    zIndex: 10,
                    opacity:
                      deletingId === (review._id || review.id) ? 0.6 : 1,
                    transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {deletingId === (review._id || review.id)
                    ? "Deleting..."
                    : "Delete"}
                </button>

                <div className="review-card-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.name.charAt(0)}
                    </div>
                    <div className="reviewer-details">
                      <h3 className="reviewer-name">{review.name}</h3>
                      <p className="reviewer-major">{review.major}</p>
                    </div>
                  </div>
                </div>

                <div className="review-rating">{renderStars(review.rating)}</div>
                <p className="review-text">{review.text}</p>
                <div className="review-footer">
                  <span className="review-timestamp">{review.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Popup Modal */}
      {showPopup && selectedReview && (
        <div className="review-popup-overlay" onClick={handleClosePopup}>
          <div className="review-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="review-popup-close" onClick={handleClosePopup}>
              ×
            </button>
            <div className="review-popup-header">
              <div className="review-popup-avatar">
                {selectedReview.name.charAt(0)}
              </div>
              <div className="review-popup-user-info">
                <h3 className="review-popup-name">{selectedReview.name}</h3>
                <p className="review-popup-major">{selectedReview.major}</p>
              </div>
            </div>
            <div className="review-popup-rating">
              {renderStars(selectedReview.rating)}
            </div>
            <div className="review-popup-text">
              <p>{selectedReview.text}</p>
            </div>
            <div className="review-popup-footer">
              <span className="review-popup-timestamp">{selectedReview.timestamp}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReviews