import { useEffect, useState } from "react";
import AlumniForm from "../components/AlumniForm";
import { fetchAlumni } from "../utils/alumniApi";
import "./Alumni.css";

export default function Alumni() {
  const [alumniData, setAlumniData] = useState([]);
  const [filterField, setFilterField] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [viewMode, setViewMode] = useState("carousel"); // "carousel" or "grid"

  useEffect(() => {
    loadAlumni();
  }, [filterField, sortOrder]);

  async function loadAlumni() {
    try {
      const data = await fetchAlumni(filterField, sortOrder);
      setAlumniData(data);
    } catch (err) {
      console.error("Failed to load alumni:", err);
    }
  }

  function handleEdit(alumni) {
    setEditingAlumni(alumni);
    setShowForm(true);
  }

  function handleAdd() {
    setEditingAlumni(null);
    setShowForm(true);
  }

  function handleFormSuccess() {
    loadAlumni();
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingAlumni(null);
  }

  // Get unique fields for filter
  const uniqueFields = ["All", ...new Set(alumniData.map(a => a.field).filter(Boolean))];

  // LinkedIn icon SVG
  const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  return (
    <div className="alumni-section">
      <div className="alumni-container">
        <div className="alumni-header">
          <h1 className="alumni-title">Meet Our Alumni</h1>
          <p className="alumni-subtitle">Connect with successful graduates and learn from their journey</p>
        </div>

        {/* Controls - Only show in grid view */}
        {viewMode === "grid" && (
          <div className="grid-controls">
            <button className="back-to-carousel-button" onClick={() => setViewMode("carousel")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Carousel
            </button>

            <div className="filter-sort-container">
              <div className="filter-group">
                <label>Filter by Stream</label>
                <select
                  className="filter-select"
                  value={filterField}
                  onChange={(e) => setFilterField(e.target.value)}
                >
                  {uniqueFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Sort by Date</label>
                <select
                  className="filter-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div className="results-count">
                {alumniData.length} {alumniData.length === 1 ? "Alumni" : "Alumni"}
              </div>
            </div>
          </div>
        )}

        {/* Carousel View */}
        {viewMode === "carousel" && (
          <>
            <div className="alumni-carousel-wrapper">
              <button
                className="scroll-button scroll-button-left"
                onClick={(e) => {
                  const carousel = e.target.closest(".alumni-carousel-wrapper").querySelector(".alumni-carousel");
                  carousel.scrollBy({ left: -400, behavior: "smooth" });
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              <div className="alumni-carousel">
                {alumniData.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
                    No alumni found.
                  </div>
                ) : (
                  alumniData.map((item, index) => (
                    <div
                      key={item._id}
                      className="alumni-card"
                      style={{ "--card-index": index }}
                    >
                      <div className="alumni-image-wrapper">
                        {item.image ? (
                          <img
  src={item.image.replace(
    "${import.meta.env.VITE_API_URL}",
    import.meta.env.VITE_API_URL
  )}
  alt={item.name}
  className="alumni-image"
/>
                        ) : (
                          <div className="alumni-image-placeholder">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <h3 className="alumni-name">{item.name}</h3>
                      <p className="alumni-field">{item.field}</p>
                      <p className="alumni-year">Class of {item.year}</p>
                      
                      {(item.role || item.company) && (
                        <p className="alumni-role">
                          {item.role ? item.role : ""}
                          {item.company &&
                            `${item.role ? " at " : ""}${item.company}`}
                        </p>
                      )}

                      {item.linkedin && (
                        <a
                          href={item.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="alumni-linkedin"
                        >
                          <LinkedInIcon />
                          LinkedIn Profile
                        </a>
                      )}

                    </div>
                  ))
                )}
              </div>

              <button
                className="scroll-button scroll-button-right"
                onClick={(e) => {
                  const carousel = e.target.closest(".alumni-carousel-wrapper").querySelector(".alumni-carousel");
                  carousel.scrollBy({ left: 400, behavior: "smooth" });
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>

            <div className="view-all-container">
              <button className="view-all-button" onClick={() => setViewMode("grid")}>
                View All Alumni
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="alumni-grid">
            {alumniData.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: "2rem", textAlign: "center", color: "#6b7280" }}>
                No alumni found.
              </div>
            ) : (
              alumniData.map((item, index) => (
                <div
                  key={item._id}
                  className="alumni-card-grid"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="alumni-image-wrapper">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="alumni-image" />
                    ) : (
                      <div className="alumni-image-placeholder">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h3 className="alumni-name">{item.name}</h3>
                  <p className="alumni-field">{item.field}</p>
                  <p className="alumni-year">Class of {item.year}</p>
                  
                  {(item.role || item.company) && (
                    <p className="alumni-role">
                      {item.role ? item.role : ""}
                      {item.company &&
                        `${item.role ? " at " : ""}${item.company}`}
                    </p>
                  )}

                  {item.linkedin && (
                    <a
                      href={item.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="alumni-linkedin"
                    >
                      <LinkedInIcon />
                      LinkedIn Profile
                    </a>
                  )}

                </div>
              ))
            )}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <AlumniForm
            alumni={editingAlumni}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
}