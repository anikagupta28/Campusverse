/* eslint-env node */
import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "change-me-in-env";

export const createAdminToken = (admin) => {
  const payload = {
    name: admin.name,
    email: admin.email,
    role: "admin",
  };

  return jwt.sign(payload, getJwtSecret(), { expiresIn: "1d" });
};

export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: not an admin" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

export default requireAdmin;

