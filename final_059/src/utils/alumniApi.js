const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// GET – user + admin
export async function fetchAlumni(field, sort) {
  const res = await fetch(
    `${BASE_URL}/alumni?field=${field}&sort=${sort}`
  );
  return res.json();
}

// DELETE – admin only
export async function deleteAlumni(id, token) {
  const res = await fetch(`${BASE_URL}/alumni/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete alumni");
  }
  return res.json();
}

// CREATE – admin only
export async function addAlumni(data, token) {
  const res = await fetch(`${BASE_URL}/alumni`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add alumni");
  }
  return res.json();
}

// UPDATE – admin only
export async function updateAlumni(id, data, token) {
  const res = await fetch(`${BASE_URL}/alumni/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update alumni");
  }
  return res.json();
}
