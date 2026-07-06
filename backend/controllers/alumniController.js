import Alumni from "../models/Alumni.js";
import path from "path";

// USER + ADMIN (READ)
export const getAlumni = async (req, res) => {
  const { field, sort } = req.query;

  let filter = {};
  if (field && field !== "All") filter.field = field;

  const order = sort === "oldest" ? 1 : -1;

  const alumni = await Alumni.find(filter).sort({ createdAt: order });
  res.json(alumni);
};

// ADMIN (CREATE) with optional image upload
export const createAlumni = async (req, res) => {
  try {
    const { name, field, year, role, company, linkedin } = req.body;

    const alumniData = {
      name,
      field,
      year,
      role,
      company,
      linkedin,
    };

    // If multer has stored a file, build a public URL
    if (req.file) {
      alumniData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const alumni = await Alumni.create(alumniData);
    res.status(201).json(alumni);
  } catch (err) {
    console.error("Error creating alumni:", err);
    res.status(500).json({
      message: "Failed to create alumni",
      error: err.message,
    });
  }
};

// ADMIN (UPDATE) with optional new image upload
export const updateAlumni = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(alumni);
  } catch (err) {
    console.error("Error updating alumni:", err);
    res.status(500).json({ message: "Failed to update alumni" });
  }
};

// ADMIN (DELETE)
export const deleteAlumni = async (req, res) => {
  await Alumni.findByIdAndDelete(req.params.id);
  res.json({ message: "Alumni deleted" });
};
