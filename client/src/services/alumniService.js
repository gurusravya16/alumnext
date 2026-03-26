import api from "./api";

/**
 * Alumni Directory API
 * Backend: GET /api/alumni
 * Returns: [{ id, name, email, branch, year, linkedin }]
 */

export async function listAlumni({ branch, year } = {}) {
  const params = {};
  if (branch) params.branch = branch;
  if (year) params.year = year;

  const { data } = await api.get("/alumni", { params });
  return Array.isArray(data) ? data : [];
}

export async function getAlumnusById(id) {
  const list = await listAlumni();
  return list.find((a) => String(a.id) === String(id)) || null;
}

