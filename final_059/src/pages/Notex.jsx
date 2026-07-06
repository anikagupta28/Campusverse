import { useState, useEffect } from "react";
import "./Notex.css";
import API from "../utils/api";

export default function Notex() {
  const [activeNotice, setActiveNotice] = useState(null);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const notices = [
    {
      id: 1,
      title: "Semester Examination Datesheet DEC 2025-MAY 2026",
      description: "Semester exams schedule released for all departments.",
      type: "pdf",
      file: "/SemExam.pdf",
      tag: "Examination",
      date: "28/02/2026",
      department: "Vani Mandir",
    },
    {
      id: 2,
      title: "Student Feedback Notice (Even Semester 2025–26) ",
      description: "Please find attached the Feedback Notice for the session 2025–26 (Even Semester). All students are requested to go through the notice carefully and complete the feedback process within the given timeline.",
      type: "pdf",
      file: "/feedback.pdf",
      tag: "Academic",
      date: "22/03/2026",
      department: "Vani Mandir",
    },
    {
      id: 3,
      title: "2-Day Startup Bootcamp – AIC Banasthali Vidyapith",
      description: "Join the 2-Day Startup Bootcamp by AIC Banasthali Vidyapith. Learn Idea Generation, Lean Canvas & Pitching.\n22–23 March | Nav Mandir. Apply now!",
      type: "image",
      file: "boot.jpeg",
      tag: "Workshop",
      date: "5/03/2026",
      department: "AIC Banasthali Vidyapith",
    },
    {
      id: 4,
      title: "Second Periodical Test Programme – April 2025–26",
        description: "Dear Students,\n\nThe programme of the Second Periodical Test for the Second Term (Session 2025–26) has been released. Please find the attached schedule and review it carefully.",
      type: "pdf",
      file: "/second.pdf",
      tag: "Examination",
      date: "19/02/2026",
      department: "Vani Mandir",
    },
    {
      id: 5,
      title: " FinSpark Hackathon for Batch 2027",
      description: "Interested B.Tech students can register for the hackathon",
      type: "pdf",
      file: "/hackfin.pdf",
      tag: "Placement",
      date: "25/02/2026",
      department: "Placement Cell",
    },
    {
      id: 6,
      title: "Third Workshop on Applications of Computational Intelligence and Interactive Systems (WACIIS-2025)",
      description: "Banasthali Vidyapith is organizing the Third Workshop on Applications of Computational Intelligence and Interactive Systems (WACIIS-2025) on 30–31 August 2025 in association with IHCI-2025 and DBT, Govt. of India.Students and researchers are invited to participate and submit short papers (3–4 pages) in LNCS Springer format for poster presentations.",
      type: "pdf",
      file: "/waciis.pdf",
      tag: "Workshop",
      date: "11/08/2025",
      department: "Centre for Artificial Intelligence",
    },
  ];

  const [dbNotices, setDbNotices] = useState([]);

  useEffect(() => {
  if (activeNotice) {
    document.body.classList.add("modal-open");
  } else {
    document.body.classList.remove("modal-open");
  }
}, [activeNotice]);

  useEffect(() => {
  const fetchNotices = async () => {
    try {
      const res = await API.get("/notices");

      const formatted = res.data.map((notice) => ({
  id: notice._id,
  title: notice.title,
  description: notice.description,
  type: notice.fileType
    ? notice.fileType.toLowerCase()
    : notice.attachment
    ? notice.attachment.endsWith(".pdf")
      ? "pdf"
      : "image"
    : "text",
  file: notice.attachment
    ? `http://localhost:5050${notice.attachment}`
    : "",
  tag: notice.category || "Notice",
  date: notice.date
    ? new Date(notice.date).toLocaleDateString("en-GB")
    : "",
  department: notice.department || "Administration",
}));
      setDbNotices(formatted);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  fetchNotices();
}, []);

  const filters = [
    { id: "all", label: "All Notices", icon: "📋" },
    { id: "Examination", label: "Examination", icon: "📝" },
    { id: "Placement", label: "Placement", icon: "💼" },
    { id: "Cultural", label: "Cultural", icon: "🎭" },
    { id: "Sports", label: "Sports", icon: "⚽" },
    { id: "Workshop", label: "Workshop", icon: "⚙️" },
    { id: "Academic", label: "Academic", icon: "🎓" },
  ];

  const sortOptions = [
    { id: "latest", label: "Latest First", icon: "⬇️" },
    { id: "oldest", label: "Oldest First", icon: "⬆️" },
    { id: "title", label: "A to Z", icon: "🔤" },
  ];

  useEffect(() => {
    let results = [...notices, ...dbNotices];

      results = results.filter(n => n.type !== "text");

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter( 
        notice =>
          notice.title.toLowerCase().includes(query) ||
          notice.description.toLowerCase().includes(query) ||
          notice.tag.toLowerCase().includes(query) ||
          notice.department.toLowerCase().includes(query)
      );
    }

    if (selectedFilter !== "all") {
      results = results.filter(notice => notice.tag === selectedFilter);
    }

    switch (sortBy) {
      case "latest":
        results.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        results.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "title":
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredNotices(results);
  }, [searchQuery, selectedFilter, sortBy, dbNotices]);

  const getTagColor = (tag) => {
    const colors = {
      Examination: "#ef4444",
      Placement: "#10b981",
      Cultural: "#8b5cf6",
      Sports: "#f59e0b",
      Workshop: "#3b82f6",
      Library: "#06b6d4",
      Notice: "#64748b",
      Fee: "#f97316",
      Academic: "#6366f1",
      Hostel: "#84cc16",
    };
    return colors[tag] || "#6366f1";
  };

  const downloadNotice = (notice) => {
    if (notice.type === "text") {
      const content = `
NOTICE: ${notice.title}
Date: ${notice.date}
Department: ${notice.department}
Tag: ${notice.tag}

${notice.description}

---
Issued by: University Notice Board
`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${notice.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (notice.file) {
      const a = document.createElement('a');
      a.href = notice.file;
      a.download = notice.file.split('/').pop() || `notice_${notice.id}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="notex-page">
     {/* Header */}
      <div className="notex-header">
        <div className="header-content center-header">
          <div>
            <h1>📢 Notex</h1>
            <p>Official announcements & important updates</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="notex-controls">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter & Sort */}
        <div className="filter-sort-container">
          {/* Filters */}
          <div className="filter-group">
            <div className="filter-scroll">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-btn ${selectedFilter === filter.id ? "active" : ""}`}
                  onClick={() => setSelectedFilter(filter.id)}
                  style={selectedFilter === filter.id ? { 
                    backgroundColor: getTagColor(filter.id) 
                  } : {}}
                >
                  <span className="filter-icon">{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {selectedFilter !== "all" && (
        <div className="active-filter">
          <span className="active-filter-tag" style={{ backgroundColor: getTagColor(selectedFilter) }}>
            {filters.find(f => f.id === selectedFilter)?.icon} {selectedFilter}
          </span>
          <button className="clear-filter" onClick={() => setSelectedFilter("all")}>
            ✕ Clear Filter
          </button>
        </div>
      )}

      {/* Notices Grid */}
      <div className="notex-grid">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => {
            const tagColor = getTagColor(notice.tag);
            return (
              <div
                key={notice.id}
                className="notex-card fixed-card"
                onClick={() => setActiveNotice(notice)}
              >
                {/* Card Content */}
                <div className="card-content">
                  <h3 className="truncate">{notice.title}</h3>
                  <p className="desc truncate-2">{notice.description}</p>

                  {/* Preview */}
                  <div className="preview-container">
                    {notice.type === "image" && (
                      <div className="preview-box pdf-preview">
                        <div className="image-preview-inner">
                        <img src={notice.file} alt="preview" />
                        </div>
                        <div className="preview-overlay">👁️ View Image</div>
                      </div>
                    )}

                    {notice.type === "pdf" && (
  <div className="preview-box pdf-preview">
    <div className="pdf-preview-inner">
      <iframe
        src={notice.file}
        title="PDF Preview"
      />
    </div>
    <div className="preview-overlay">📄 View PDF</div>
  </div>
)}
                    {notice.type === "text" && (
                      <div className="preview-box text-preview">
                        <div className="text-icon">📝</div>
                        <div className="text-content">
                          <strong>Text Notice</strong>
                          <small>No attachment file</small>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    <div className="footer-left">
                      <span className="date">📅 {notice.date}</span>
                      <span className="department">🏛️ {notice.department}</span>
                    </div>
                    <div className="footer-right">
                      <span className="notice-type">{notice.type.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No notices found</h3>
            <p>Try changing your search or filter criteria</p>
            <button
              className="reset-btn"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
     {/* Modal */}
{activeNotice && (
  <div className="notex-modal" onClick={() => setActiveNotice(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

      {/* HEADER */}
      <div className="modal-header-clean">
        <div className="modal-title-row">
          <h2>{activeNotice.title}</h2>
          <button className="close" onClick={() => setActiveNotice(null)}>✕</button>
        </div>

        <div className="modal-meta-clean">
          <span>📅 {activeNotice.date}</span>
          <span>🏛️ {activeNotice.department}</span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="modal-section">
        <h4>Description</h4>
        <p>{activeNotice.description}</p>
      </div>

      {/* MEDIA */}
      <div className="modal-media-clean">
        {activeNotice.type === "image" && (
          <img src={activeNotice.file} alt="preview" />
        )}

        {activeNotice.type === "pdf" && (
          <iframe
            src={activeNotice.file}
            title="PDF Viewer"
          />
        )}
      </div>

      {/* DOWNLOAD */}
      <div className="modal-download">
        <button onClick={() => downloadNotice(activeNotice)}>
          ⬇ Download File
        </button>
      </div>
     </div>
    </div>
)}
</div>
  );
}