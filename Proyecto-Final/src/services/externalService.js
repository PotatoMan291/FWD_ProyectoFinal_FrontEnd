const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast";

const SAN_JOSE_COORDINATES = {
  latitude: 9.9981,
  longitude: -84.1169,
};

export async function getSanJoseWeather() {
  const params = new URLSearchParams({
    latitude: SAN_JOSE_COORDINATES.latitude,
    longitude: SAN_JOSE_COORDINATES.longitude,
    current: "temperature_2m,weather_code",
    timezone: "America/Costa_Rica",
  });

  const response = await fetch(
    `${WEATHER_API_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo obtener el clima de San José."
    );
  }

  return response.json();
}