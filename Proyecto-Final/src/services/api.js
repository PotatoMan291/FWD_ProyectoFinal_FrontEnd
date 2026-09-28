const API_URL = "http://localhost:3001";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return response.json();
}

export function getResource(resource) {
  return request(`/${resource}`);
}

export function getResourceById(resource, id) {
  return request(`/${resource}/${id}`);
}

export function createResource(resource, data) {
  return request(`/${resource}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateResource(resource, id, data) {
  return request(`/${resource}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteResource(resource, id) {
  return request(`/${resource}/${id}`, {
    method: "DELETE",
  });
}
