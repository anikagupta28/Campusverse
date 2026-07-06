import { useState } from "react";
import { addAlumni } from "../utils/alumniApi";
import { useAuth } from "../context/AuthContext";

const AddAlumniForm = ({ onAlumniAdded }) => {
  const { token } = useAuth();

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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const newAlumni = await addAlumni(formData, token);
      onAlumniAdded(newAlumni);

      // reset form
      setFormData({
        name: "",
        field: "",
        year: "",
        role: "",
        company: "",
        linkedin: "",
        image: ""
      });
    } catch (err) {
      alert("Failed to add alumni");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-alumni-form">
      <h3>Add Alumni</h3>

      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="field" placeholder="Field / Department" value={formData.field} onChange={handleChange} required />
      <input name="year" type="number" placeholder="Graduation Year" value={formData.year} onChange={handleChange} required />
      <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} />
      <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} />
      <input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} />
      <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Alumni"}
      </button>
    </form>
  );
};

export default AddAlumniForm;
