import { useEffect, useState } from "react";
import API from "../../utils/api";
import "./AdminAlumni.css";

export default function AdminAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [form, setForm] = useState({
    name: "",
    course: "",
    batch: "",
    company: "",
    linkedin: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchAlumni = async () => {
    const res = await API.get("/alumni");
    setAlumni(res.data);
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      course: "",
      batch: "",
      company: "",
      linkedin: "",
      image: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic required-field validation
    if (!form.name.trim() || !form.course.trim() || !form.batch.trim()) {
      alert("Please fill Name, Course and Batch before posting.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("field", form.course);
    formData.append("year", form.batch);
    formData.append("company", form.company);
    if (form.linkedin) {
      formData.append("linkedin", form.linkedin);
    }
    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    try {
      if (editingId) {
        await API.put(`/alumni/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/alumni", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Alumni added successfully.");
      resetForm();
      fetchAlumni();
    } catch (err) {
      console.error("Failed to save alumni", err);
      alert(err?.response?.data?.message || "Failed to save alumni. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      course: item.field || "",
      batch: item.year?.toString() || "",
      company: item.company || "",
      linkedin: item.linkedin || "",
      image: null,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alumni?")) return;
    await API.delete(`/alumni/${id}`);
    fetchAlumni();
  };

  return (
    <div className="admin-alumni-page">
      <div className="admin-alumni-header">
        <h2>Manage Alumni</h2>
        <button
          type="button"
          className="add-alumni-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Add Alumni
        </button>
      </div>

      {showForm && (
        <form className="admin-form admin-alumni-form" onSubmit={handleSubmit}>
          <div className="admin-alumni-form-grid">
            <div className="admin-alumni-form-column">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
              <input
                name="batch"
                placeholder="Batch (e.g. 2024)"
                value={form.batch}
                onChange={handleInputChange}
                required
              />
              <input
                name="linkedin"
                placeholder="LinkedIn Profile URL"
                value={form.linkedin}
                onChange={handleInputChange}
              />
            </div>

            <div className="admin-alumni-form-column">
              <input
                name="course"
                placeholder="Course / Department"
                value={form.course}
                onChange={handleInputChange}
                required
              />
              <input
                name="company"
                placeholder="Company"
                value={form.company}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="admin-alumni-upload-wrapper">
            <input
              id="alumni-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="admin-upload-btn"
              onClick={() =>
                document.getElementById("alumni-image-input")?.click()
              }
            >
              {form.image ? "Change Image" : "Upload Image"}
            </button>
            {form.image && (
              <span className="admin-upload-filename">{form.image.name}</span>
            )}
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="admin-primary-btn"
            >
              {editingId
                ? submitting
                  ? "Updating..."
                  : "Update Alumni"
                : submitting
                  ? "Adding..."
                  : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="admin-secondary-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="admin-alumni-grid">
        {alumni.map((a) => (
          <div className="admin-card alumni-card" key={a._id}>
            <div className="alumni-image-wrapper">
              {a.image ? (
                <img src={a.image} alt={a.name} className="alumni-image" />
              ) : (
                <div className="alumni-image-placeholder">
                  {a.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h4 className="alumni-name">{a.name}</h4>
            <p className="alumni-field">{a.field}</p>
            <p className="alumni-year">Batch {a.year}</p>
            {a.company && <p className="alumni-role">{a.company}</p>}
            {a.linkedin && (
              <a
                href={a.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="alumni-linkedin"
              >
                View LinkedIn
              </a>
            )}
            <div className="admin-actions">
              <button
                className="edit-btn"
                type="button"
                onClick={() => handleEdit(a)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                type="button"
                onClick={() => handleDelete(a._id)}
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
