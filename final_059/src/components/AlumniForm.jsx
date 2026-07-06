import { useState, useEffect } from "react";
import { addAlumni, updateAlumni } from "../utils/alumniApi";
import { useAuth } from "../context/AuthContext";
import "./AlumniForm.css";

const AlumniForm = ({ alumni, onClose, onSuccess }) => {
  const { token } = useAuth();
  const isEditMode = !!alumni;

  const [formData, setFormData] = useState({
    name: "",
    field: "",
    year: "",
    role: "",
    company: "",
    linkedin: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (alumni) {
      setFormData({
        name: alumni.name || "",
        field: alumni.field || "",
        year: alumni.year || "",
        role: alumni.role || "",
        company: alumni.company || "",
        linkedin: alumni.linkedin || "",
        image: alumni.image || ""
      });
    }
  }, [alumni]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert year to number
      const dataToSubmit = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : ""
      };

      if (isEditMode) {
        await updateAlumni(alumni._id, dataToSubmit, token);
      } else {
        await addAlumni(dataToSubmit, token);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? "update" : "add"} alumni`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="alumni-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{isEditMode ? "Edit Alumni" : "Add New Alumni"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="alumni-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="field">Department/Field *</label>
            <input
              id="field"
              name="field"
              type="text"
              placeholder="e.g., Computer Science, Engineering"
              value={formData.field}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Graduation Year *</label>
            <input
              id="year"
              name="year"
              type="number"
              placeholder="e.g., 2024"
              value={formData.year}
              onChange={handleChange}
              required
              min="1900"
              max="2100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Current Role</label>
            <input
              id="role"
              name="role"
              type="text"
              placeholder="e.g., Software Engineer, Product Manager"
              value={formData.role}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn Profile URL</label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Profile Picture URL</label>
            <input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/profile.jpg"
              value={formData.image}
              onChange={handleChange}
            />
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" onError={(e) => e.target.style.display = "none"} />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Alumni" : "Add Alumni")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlumniForm;
