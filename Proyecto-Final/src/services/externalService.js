const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=9.9981&longitude=-84.1169&current=temperature_2m,weather_code&timezone=America%2FCosta_Rica";

export async function getSanJoseWeather() {
  const response = await fetch(WEATHER_URL);

  if (!response.ok) {
    throw new Error("No se pudo obtener el clima de San José.");
  }

  return response.json();
}
