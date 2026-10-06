# Integración PuraVida Trips + n8n + IA

## Objetivo

El dashboard del turista incluye un asistente que recibe preferencias y el catálogo de tours, envía la información a un Webhook de n8n y recibe recomendaciones generadas por un AI Agent.

## Flujo recomendado

Webhook `POST /webhook/puravida-recomendaciones`
→ Code/Set para normalizar datos
→ AI Agent
→ Chat Model (Gemini o DeepSeek)
→ Respond to Webhook

## Payload esperado

```json
{
  "user": { "id": "2", "name": "Turista Demo", "role": "turista" },
  "preferences": "Quiero naturaleza y aventura, máximo 45000 colones",
  "language": "es",
  "tours": []
}
```

## Respuesta esperada

```json
{
  "message": "Encontré experiencias que coinciden con tus preferencias.",
  "recommendations": [
    { "id": "1", "name": "Caminata al Volcán Arenal", "reason": "Combina naturaleza y aventura." }
  ]
}
```

## Prompt del AI Agent

Eres el asistente turístico de PuraVida Trips, una plataforma para descubrir experiencias en Costa Rica.

Recibirás una lista de tours reales del catálogo y las preferencias de un turista.

Reglas:
1. Recomienda únicamente tours cuyo `id` exista en el catálogo recibido.
2. No inventes precios, ubicaciones, duración ni características.
3. Selecciona como máximo 3 tours.
4. Prioriza coincidencia con las preferencias y presupuesto indicado.
5. Responde en el idioma recibido en `language`.
6. Devuelve exclusivamente JSON con esta estructura:

```json
{
  "message": "texto breve",
  "recommendations": [
    { "id": "id del tour", "name": "nombre exacto", "reason": "motivo breve" }
  ]
}
```

Datos del usuario:
`{{ JSON.stringify($json.user) }}`

Preferencias:
`{{ $json.preferences }}`

Idioma:
`{{ $json.language }}`

Catálogo:
`{{ JSON.stringify($json.tours) }}`

## Frontend

Configura en `.env.local`:

```env
VITE_N8N_RECOMMENDATIONS_WEBHOOK_URL=http://localhost:5678/webhook/puravida-recomendaciones
```

En producción debe utilizarse la URL pública HTTPS del webhook de n8n.
