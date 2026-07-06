import { useEffect, useState } from 'react'
import './Review.css'

const Review = () => {
  const userId = localStorage.getItem('token')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [sortOrder, setSortOrder] = useState('recent')
  const [courseFilter, setCourseFilter] = useState('All')
  const [selectedReview, setSelectedReview] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [reviews, setReviews] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    course: '',
    rating: 0,
    feedback: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const MAIN_COURSES = ['BBA', 'MBA', 'BTECH', 'MTECH', 'BSC', 'MSC', 'BCA', 'MCA']

  const normalizeCourse = (course) =>
    (course || '')
      .toString()
      .replace(/\./g, '')
      .replace(/\s+/g, '')
      .toUpperCase()

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

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/reviews/')
        
        // Check if response is JSON
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Backend server is not responding. Please make sure the backend server is running on port 5000.')
          setReviews([])
          return
        }

        const data = await res.json()

        if (res.ok) {
          // Transform database reviews to component format
          const transformedReviews = data.map((review) => ({
            id: review._id,
            _id: review._id,
            name: review.userName,
            major: review.course || review.userEmail || 'Student',
            course: review.course || '',
            rating: review.rating || 5,
            text: review.message,
            timestamp: formatTimestamp(new Date(review.createdAt)),
            date: new Date(review.createdAt)
          }))
          setReviews(transformedReviews)
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleStarClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleStarHover = (rating) => {
    setHoveredStar(rating)
  }

  const handleStarLeave = () => {
    setHoveredStar(0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('') // Clear any previous error
    
    if (!formData.name || !formData.course || !formData.rating || !formData.feedback) {
      setErrorMessage('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)

      const res = await fetch('/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.name,
          message: formData.feedback,
          rating: formData.rating,
          course: formData.course,
        }),
      })

      // Check if response is JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend server is not responding. Please make sure the backend server is running on port 5000.')
      }

      const data = await res.json()

      if (!res.ok) {
        // Check if it's an abusive language error
        if (data.message && data.message.includes('inappropriate language')) {
          setErrorMessage(data.message)
        } else {
          setErrorMessage(data.message || 'Failed to submit review')
        }
        return
      }

      const created = data.review

      const newReview = {
        id: created._id,
        _id: created._id,
        name: created.userName,
        major: created.course || formData.course || 'Student',
        course: created.course || formData.course || '',
        rating: created.rating,
        text: created.message,
        timestamp: formatTimestamp(new Date(created.createdAt || new Date())),
        date: created.createdAt ? new Date(created.createdAt) : new Date()
      }

      setReviews(prev => [newReview, ...prev])
      setFormData({
        name: '',
        course: '',
        rating: 0,
        feedback: ''
      })
      setHoveredStar(0)
      setErrorMessage('') // Clear error on success

      const submitButton = e.target.querySelector('.submit-button')
      if (submitButton) {
        submitButton.classList.add('submit-success')
        setTimeout(() => {
          submitButton.classList.remove('submit-success')
        }, 2000)
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRipple = (e) => {
    const button = e.currentTarget
    const ripple = document.createElement('span')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.classList.add('ripple')

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  const renderStars = (rating, interactive = false, onStarClick = null, onStarHover = null, onStarLeave = null, hoverValue = 0) => {
    const displayRating = interactive && hoverValue > 0 ? hoverValue : rating
    const fullStars = Math.floor(displayRating)
    const emptyStars = 5 - fullStars

    return (
      <div className="star-rating">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= fullStars
          return (
            <span
              key={i}
              className={`star ${isFilled ? 'full' : 'empty'} ${interactive ? 'interactive' : ''}`}
              onClick={interactive && onStarClick ? () => onStarClick(starValue) : undefined}
              onMouseEnter={interactive && onStarHover ? () => onStarHover(starValue) : undefined}
              onMouseLeave={interactive && onStarLeave ? onStarLeave : undefined}
            >
              ★
            </span>
          )
        })}
      </div>
    )
  }

  // Apply course filter first, then sort
  const filteredReviews = reviews.filter((r) => {
    const normalizedCourse = normalizeCourse(r.course)
    const isMainCourse = MAIN_COURSES.includes(normalizedCourse)

    if (courseFilter === 'All') return true
    if (courseFilter === 'Other') return !isMainCourse

    const normalizedFilter = normalizeCourse(courseFilter)
    return normalizedCourse === normalizedFilter
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOrder === 'recent') {
      return b.date - a.date
    } else if (sortOrder === 'rating') {
      return b.rating - a.rating
    }
    return 0
  })

  // Show first 3 reviews initially, all reviews when View All is clicked
  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3)

  const handleCardClick = (review) => {
    setSelectedReview(review)
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedReview(null)
  }

  return (
    <div className="review-page">
      <div className="review-container">
        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-section-header">
            <h2 className="reviews-section-title">⭐ Reviews</h2>
            <p className="reviews-section-subtitle">
              Honest voices from our students, shaping a better campus experience.
            </p>
            <div className="sort-container">
              <select
                className="sort-dropdown"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rating</option>
              </select>

              <select
                className="sort-dropdown course-filter-dropdown"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="All">All Courses</option>
                <option value="BBA">BBA</option>
                <option value="MBA">MBA</option>
                <option value="BTech">BTech</option>
                <option value="MTech">MTech</option>
                <option value="BSC">BSC</option>
                <option value="MSC">MSC</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Back button - show when viewing all reviews */}
          {showAllReviews && (
            <div className="back-section">
              <button
                className="back-button"
                onClick={() => setShowAllReviews(false)}
                onMouseDown={handleRipple}
              >
                Back
                <span className="button-shine"></span>
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Loading reviews...
            </div>
          ) : (
            <div className="reviews-grid">
              {displayedReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666', gridColumn: '1 / -1' }}>
                  No reviews yet. Be the first to share your feedback!
                </div>
              ) : (
                displayedReviews.map((review, index) => (
                  <div
                    key={review.id || review._id}
                    className="review-card"
                    style={{ animationDelay: `${index * 0.1}s`, position: 'relative' }}
                    onClick={() => handleCardClick(review)}
                  >
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
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <p className="review-text">{review.text}</p>
                    <div className="review-footer">
                      <span className="review-timestamp">{review.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
<br />
          {/* View All button - place below review cards */}
          {!showAllReviews && (
            <div className="view-all-section">
              <button
                className="view-all-button"
                onClick={() => setShowAllReviews(true)}
                onMouseDown={handleRipple}
              >
                View All Reviews
                <span className="button-shine"></span>
              </button>
            </div>
          )}
        </div>

        {/* Review & Feedback Form Section - Only show when not viewing all reviews */}
        {!showAllReviews && userId && (
        <div className="form-section">
          <div className="form-header">
            <h2 className="form-title">Review & Feedback</h2>
          </div>
          
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-header-inner">
              <h3 className="form-card-title">Submit Your Feedback</h3>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="course">Course</label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  placeholder="Your course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Rating</label>
              <div className="rating-input">
                {renderStars(
                  formData.rating,
                  true,
                  handleStarClick,
                  handleStarHover,
                  handleStarLeave,
                  hoveredStar
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="feedback">Your Feedback</label>
              <textarea
                id="feedback"
                name="feedback"
                placeholder="Share your thoughts about CampusVerse..."
                value={formData.feedback}
                onChange={handleInputChange}
                className="form-textarea"
                rows="5"
              />
            </div>
            
            {errorMessage && (
              <div className="form-error-message">
                {errorMessage}
              </div>
            )}
            
            <button
              type="submit"
              className="submit-button"
              onMouseDown={handleRipple}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
              <span className="button-shine"></span>
            </button>
          </form>
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

export default Review