const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

const LOCATION_COORDINATES = {
  "San José": { latitude: 9.9281, longitude: -84.0907 },
  Alajuela: { latitude: 10.0163, longitude: -84.2142 },
  Cartago: { latitude: 9.8644, longitude: -83.9194 },
  Heredia: { latitude: 10.0024, longitude: -84.1165 },
  Guanacaste: { latitude: 10.4958, longitude: -85.355 },
  Puntarenas: { latitude: 9.9763, longitude: -84.8384 },
  Limón: { latitude: 9.9907, longitude: -83.036 },
  "Monteverde, Puntarenas": { latitude: 10.3021, longitude: -84.8258 },
};

function resolveCoordinates(locationOrTour) {
  if (
    locationOrTour &&
    typeof locationOrTour === "object" &&
    Number.isFinite(Number(locationOrTour.latitud)) &&
    Number.isFinite(Number(locationOrTour.longitud))
  ) {
    return {
      latitude: Number(locationOrTour.latitud),
      longitude: Number(locationOrTour.longitud),
    };
  }

  return LOCATION_COORDINATES[locationOrTour];
}

export async function getWeatherByLocation(locationOrTour) {
  const coordinates = resolveCoordinates(locationOrTour);

  if (!coordinates) {
    throw new Error("No existen coordenadas para esta ubicación.");
  }

  const params = new URLSearchParams({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    current: "temperature_2m,weather_code",
    timezone: "America/Costa_Rica",
  });

  const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el clima del destino.");
  }

  return response.json();
}

export function getGoogleMapsEmbedUrl(locationOrTour) {
  const coordinates = resolveCoordinates(locationOrTour);

  if (coordinates) {
    return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&output=embed`;
  }

  const query = encodeURIComponent(`${locationOrTour}, Costa Rica`);
  return `https://www.google.com/maps?q=${query}&output=embed`;
}

export function getGoogleMapsUrl(locationOrTour) {
  const coordinates = resolveCoordinates(locationOrTour);

  if (coordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
  }

  const query = encodeURIComponent(`${locationOrTour}, Costa Rica`);
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

  return descriptions[code] || "Condiciones variables";
}
