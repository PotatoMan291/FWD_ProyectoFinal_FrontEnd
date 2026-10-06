const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_RECOMMENDATIONS_WEBHOOK_URL;

export async function getTourRecommendations({
  user,
  preferences,
  tours,
  language = "es",
}) {
  if (!N8N_WEBHOOK_URL)
    throw new Error("Falta VITE_N8N_RECOMMENDATIONS_WEBHOOK_URL en .env.local");
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      user: { id: user?.id, name: user?.nombre, role: user?.rol },
      preferences,
      language,
      tours: tours.map(
        ({
          id,
          nombre,
          categoria,
          ubicacion,
          precio,
          duracion,
          personas,
          descripcion,
        }) => ({
          id,
          nombre,
          categoria,
          ubicacion,
          precio,
          duracion,
          personas,
          descripcion,
        }),
      ),
    }),
  });
  if (!response.ok) throw new Error(`n8n respondió con ${response.status}`);
  const data = await response.json();
  return data?.data || data;
}
