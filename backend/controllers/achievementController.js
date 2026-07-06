import Achievement from "../models/Achievement.js";
import { sanitizeText, containsProfanity } from "../middleware/profanityFilter.js";

export const getAchievements = async (req, res) => {
  try {
    // Only fetch achievements from database - no auto-seeding
    const achievements = await Achievement.find().sort({ createdAt: -1 });

    res.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch achievements", error: error.message });
  }
};

export const createAchievement = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    // Validate required fields
    if (!req.body.title || !req.body.category || !req.body.description) {
      return res.status(400).json({ 
        message: "Missing required fields: title, category, and description are required" 
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const images = req.files && req.files.length > 0
      ? req.files.map(file => `${baseUrl}/uploads/${file.filename}`)
      : [];

    if (!images || images.length === 0) {
      return res.status(400).json({
        message: "At least one image is required for an achievement",
      });
    }

    const studentName =
      (req.body.name && req.body.name.trim()) ||
      (req.body.class && req.body.class.trim()) ||
      "Student";

    const studentClass =
      (req.body.class && req.body.class.trim()) || "";

    // Explicitly block abusive content in post fields
    if (
      containsProfanity(req.body.title) ||
      containsProfanity(req.body.category) ||
      containsProfanity(req.body.description) ||
      containsProfanity(req.body.name) ||
      containsProfanity(req.body.class)
    ) {
      return res.status(400).json({
        message:
          "Your post contains inappropriate language. Please use respectful and appropriate language.",
      });
    }

    // Sanitize all text fields to remove any profanity
    const achievement = new Achievement({
      title: sanitizeText(req.body.title.trim()),
      category: sanitizeText(req.body.category.trim()),
      description: sanitizeText(req.body.description.trim()),
      // legacy + new fields
      student: sanitizeText(studentName),
      studentName: sanitizeText(studentName),
      studentClass: sanitizeText(studentClass),
      images,
      likes: 0,
      comments: [],
    });

    const saved = await achievement.save();
    console.log("Achievement saved successfully:", saved._id);
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating achievement:", error);
    res.status(500).json({ 
      message: "Failed to create achievement", 
      error: error.message 
    });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Achievement.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    return res.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    res.status(500).json({
      message: "Failed to delete achievement",
      error: error.message,
    });
  }
};

export const updateAchievementLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const { delta } = req.body || {};

    if (delta !== 1 && delta !== -1) {
      return res.status(400).json({ message: "Invalid like delta" });
    }

    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    const currentLikes = typeof achievement.likes === "number" ? achievement.likes : 0;
    achievement.likes = Math.max(0, currentLikes + delta);

    const saved = await achievement.save();

    return res.json({ likes: saved.likes });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({
      message: "Failed to update likes",
      error: error.message,
    });
  }
};

export const addAchievementComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, text } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Explicitly block abusive comments
    if (containsProfanity(text) || containsProfanity(user)) {
      return res.status(400).json({
        message:
          "Your comment contains inappropriate language. Please use respectful and appropriate language.",
      });
    }

    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    // Sanitize comment text and user name
    const comment = {
      user: sanitizeText((user || "Anonymous").trim()),
      text: sanitizeText(text.trim()),
    };

    achievement.comments = achievement.comments || [];
    achievement.comments.push(comment);

    await achievement.save();

    // Return the last comment (with createdAt)
    const savedComment = achievement.comments[achievement.comments.length - 1];

    return res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};
