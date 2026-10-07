import api from "./api";

const N8N_METRICS_WEBHOOK_URL =
  import.meta.env.VITE_N8N_METRICS_WEBHOOK_URL;

export async function getHistoricalMetrics() {
  const response = await api.get("/metricasHistoricas");
  return response;
}

export async function getMetricsPrediction({
  current,
  history,
  forecastPeriods = 3,
  language = "es",
}) {
  if (!N8N_METRICS_WEBHOOK_URL) {
    throw new Error(
      "Falta VITE_N8N_METRICS_WEBHOOK_URL en .env.local"
    );
  }

  const response = await fetch(N8N_METRICS_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      language,
      forecastPeriods,
      current,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error(`n8n respondió con ${response.status}`);
  }

  const data = await response.json();

  return data?.data || data;
}