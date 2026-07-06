import { useEffect, useState } from "react";
import API from "../../utils/api";
import "./AdminNotices.css";

export default function AdminNotices() {

  const [notices, setNotices] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Hostel",
    department: "",
    fileType: "PDF",
    file: null,
    day: "1",
    month: "Jan",
    year: "2025"
  });

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const years = ["2025","2026","2027","2028","2029"];

  const fetchNotices = async () => {
    const res = await API.get("/notices");
    setNotices(res.data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  const handleFileChange = (e) => {

    setForm((prev) => ({
      ...prev,
      file: e.target.files[0]
    }));

  };

  const resetForm = () => {

    setForm({
      title: "",
      description: "",
      category: "Hostel",
      department: "",
      fileType: "PDF",
      file: null,
      day: "1",
      month: "Jan",
      year: "2025"
    });

    setShowForm(false);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    try {

      const formData = new FormData();

      const date = `${form.day} ${form.month} ${form.year}`;

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("department", form.department);
      formData.append("fileType", form.fileType);
      formData.append("date", date);

      if (form.file) {
        formData.append("file", form.file);
      }

      await API.post("/notices", formData);

      alert("Notice added successfully");

      resetForm();
      fetchNotices();

    } catch (err) {

      console.error(err);
      alert("Failed to add notice");

    } finally {

      setSubmitting(false);

    }

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this notice?")) return;

    await API.delete(`/notices/${id}`);

    fetchNotices();

  };

  return (

    <div className="admin-alumni-page">

      {/* HEADER */}

      <div className="admin-alumni-header">

        <h2>Manage Notices</h2>

        <button
          className="add-alumni-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add Notice
        </button>

      </div>


      {/* FORM */}

      {showForm && (

        <form className="admin-form" onSubmit={handleSubmit}>

          <input
            name="title"
            placeholder="Notice Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Notice Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Hostel</option>
            <option>Academic</option>
            <option>Placement</option>
            <option>Cultural</option>
            <option>Sports</option>
            <option>Workshop</option>
            <option>Library</option>
          </select>

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />

          {/* FILE TYPE */}

          <select
            name="fileType"
            value={form.fileType}
            onChange={handleChange}
          >
            <option value="PDF">PDF</option>
            <option value="IMAGE">Image</option>
          </select>

          {/* FILE UPLOAD */}

          {form.fileType !== "NONE" && (
  <input
  type="file"
    name="file" 
  required
  accept={
    form.fileType === "PDF"
      ? "application/pdf"
      : "image/*"
  }
  onChange={handleFileChange}
  />
)}
          {/* DATE DROPDOWN */}

          <div className="admin-date-grid">

            {/* DAY */}

            <select
              name="day"
              value={form.day}
              onChange={handleChange}
            >
              {[...Array(31)].map((_, i) => (
                <option key={i+1} value={i+1}>
                  {i+1}
                </option>
              ))}
            </select>

            {/* MONTH */}

            <select
              name="month"
              value={form.month}
              onChange={handleChange}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* YEAR */}

            <select
              name="year"
              value={form.year}
              onChange={handleChange}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

          </div>

          {/* BUTTONS */}

          <div className="admin-form-actions">

            <button
              type="submit"
              className="admin-primary-btn"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Notice"}
            </button>

            <button
              type="button"
              className="admin-secondary-btn"
              onClick={resetForm}
            >
              Cancel
            </button>

          </div>

        </form>

      )}


      {/* NOTICE LIST */}

      <div className="admin-alumni-grid">

        {notices.map((n) => (

          <div className="admin-card" key={n._id}>

            <h4>{n.title}</h4>

            <p>{n.description}</p>

            <p><b>Category:</b> {n.category}</p>

            <p><b>Department:</b> {n.department}</p>

            <p><b>Type:</b> {n.fileType}</p>

            <p><b>Date:</b> {n.date}</p>

            {n.fileType === "PDF" && (
              <a href={n.attachment} target="_blank" rel="noreferrer">
                View PDF
              </a>
            )}

            {n.fileType === "IMAGE" && (
              <img
                 src={`http://localhost:5050${n.attachment}`}
                alt="notice"
                style={{width:"100%",marginTop:"10px"}}
              />
            )}

            <div className="admin-actions">

              <button
                onClick={() => handleDelete(n._id)}
                style={{
                  background:"#ef4444",
                  color:"white",
                  border:"none",
                  padding:"6px 12px",
                  borderRadius:"6px",
                  cursor:"pointer"
                }}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}