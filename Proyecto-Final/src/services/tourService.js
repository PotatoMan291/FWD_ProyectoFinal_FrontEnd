import {
  createResource,
  deleteResource,
  getResource,
  getResourceById,
  updateResource,
} from "./api";

export function getTours() {
  return getResource("tours");
}

export function getTourById(id) {
  return getResourceById("tours", id);
}

export function createTour(tour) {
  return createResource("tours", tour);
}

export function updateTour(id, tour) {
  return updateResource("tours", id, tour);
}

export function deleteTour(id) {
  return deleteResource("tours", id);
}
