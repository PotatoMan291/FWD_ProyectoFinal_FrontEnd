import api from "./api";

export async function getTours() {
  return api.get("/tours");
}

export async function getTourById(id) {
  return api.get(`/tours/${id}`);
}

export async function createTour(tour) {
  return api.post("/tours", tour);
}

export async function updateTour(id, tour) {
  return api.put(`/tours/${id}`, tour);
}

export async function deleteTour(id) {
  return api.delete(`/tours/${id}`);
}