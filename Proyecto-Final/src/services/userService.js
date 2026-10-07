import api from "./api";

export async function getUsers() {
  return await api.get("/usuarios");
}

export async function createUser(userData) {
  return await api.post("/usuarios", userData);
}

export async function updateUser(id, userData) {
  return await api.patch(`/usuarios/${id}`, userData);
}

export async function deleteUser(id) {
  return await api.delete(`/usuarios/${id}`);
}