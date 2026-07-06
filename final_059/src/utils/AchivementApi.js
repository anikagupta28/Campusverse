const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/risewall`
    : "/api/risewall";

// Fetch all achievements
export const fetchAchievements = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch achievements");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
};

// Create a new achievement with file upload
export const createAchievement = async (formData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: formData, // FormData with files
      // Don't set Content-Type header - browser will set it automatically with boundary for FormData
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        responseData.message ||
          `Failed to create achievement (${response.status})`
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error creating achievement:", error);
    throw error;
  }
};

// Admin login (backend route should handle admin auth and return a token)
export const adminLogin = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Failed to login as admin");
    }

    return data; // { token, admin }
  } catch (error) {
    console.error("Error logging in admin:", error);
    throw error;
  }
};

// Delete an achievement (admin panel)
export const deleteAchievement = async (id, token = null) => {
  try {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete achievement");
    }

    return data;
  } catch (error) {
    console.error("Error deleting achievement:", error);
    throw error;
  }
};

// Update likes on an achievement (public)
export const updateAchievementLikes = async (id, delta) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ delta }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Failed to update likes");
    }

    return data; // { likes }
  } catch (error) {
    console.error("Error updating likes:", error);
    throw error;
  }
};

// Add a comment to an achievement (public)
export const addAchievementComment = async (id, { user, text }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, text }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Failed to add comment");
    }

    return data; // saved comment
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

