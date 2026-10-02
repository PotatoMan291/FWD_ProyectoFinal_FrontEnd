const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast";

const LOCATION_COORDINATES = {
  "San José": {
    latitude: 9.9281,
    longitude: -84.0907,
  },

  Alajuela: {
    latitude: 10.0163,
    longitude: -84.2142,
  },

  Cartago: {
    latitude: 9.8644,
    longitude: -83.9194,
  },

  Heredia: {
    latitude: 10.0024,
    longitude: -84.1165,
  },

  Guanacaste: {
    latitude: 10.4958,
    longitude: -85.355,
  },

  Puntarenas: {
    latitude: 9.9763,
    longitude: -84.8384,
  },

  Limón: {
    latitude: 9.9907,
    longitude: -83.036,
  },

  "Monteverde, Puntarenas": {
    latitude: 10.3021,
    longitude: -84.8258,
  },
};

export async function getWeatherByLocation(
  location
) {
  const coordinates =
    LOCATION_COORDINATES[location] ||
    LOCATION_COORDINATES["San José"];

  const params =
    new URLSearchParams({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      current:
        "temperature_2m,weather_code",
      timezone: "America/Costa_Rica",
    });

  const response = await fetch(
    `${WEATHER_API_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo obtener el clima del destino."
    );
  }

  return response.json();
}

export function getGoogleMapsEmbedUrl(
  location
) {
  const query = encodeURIComponent(
    `${location}, Costa Rica`
  );

  return `https://www.google.com/maps?q=${query}&output=embed`;
}

export function getGoogleMapsUrl(location) {
  const query = encodeURIComponent(
    `${location}, Costa Rica`
  );

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getWeatherDescription(code) {
  const descriptions = {
    0: "Cielo despejado",
    1: "Principalmente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos intensos",
    95: "Tormenta eléctrica",
    96: "Tormenta con granizo ligero",
    99: "Tormenta con granizo fuerte",
  };

  return (
    descriptions[code] ||
    "Condiciones variables"
  );
}