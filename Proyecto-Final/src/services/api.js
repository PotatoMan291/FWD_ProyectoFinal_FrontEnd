const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

async function request(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
}

const api = {
  get(endpoint) {
    return request(endpoint);
  },

  post(endpoint, data) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data) {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint) {
    return request(endpoint, {
      method: "DELETE",
    });
  },
};

export default api;