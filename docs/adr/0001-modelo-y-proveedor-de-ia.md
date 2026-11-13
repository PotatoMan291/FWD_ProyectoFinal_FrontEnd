# ADR-0001: Groq y Llama 3.3 70B para recomendaciones y proyecciones mediante n8n

- Estado: Propuesto
- Fecha: 2026-11-13
- Decide: Andrés Pérez, desarrollador de PuraVida Trips

## Contexto

PuraVida Trips es una aplicación académica React/Vite que usa dos workflows de n8n para recomendar tours a turistas y estimar métricas del negocio. El frontend envía solicitudes a webhooks configurables. En los archivos exportados de los workflows, el modelo de ambos agentes es `llama-3.3-70b-versatile` mediante el nodo Groq Chat Model. No se ha comprobado aquí la configuración de una instancia de n8n desplegada ni las tarifas o condiciones del proveedor.

## Decisión

Documentar la configuración presente en `Proyecto-Final/docs/n8n/`: Groq como proveedor y `llama-3.3-70b-versatile` como modelo para recomendaciones y proyecciones. Los secretos de Groq corresponden a las credenciales privadas de n8n, nunca al código React. Los clientes llaman a n8n mediante `VITE_N8N_RECOMMENDATIONS_WEBHOOK_URL` y `VITE_N8N_METRICS_WEBHOOK_URL`; estas URL son visibles en el navegador, por lo que requieren controles del lado del servicio si se exponen públicamente. La configuración de un n8n realmente ejecutándose debe confirmarse antes de declarar esta decisión Aceptada.

## Alternativas descartadas

- Consumir Groq directamente desde React: expondría las credenciales y permitiría invocaciones sin controles del servidor.
- Sustituir la lógica por reglas fijas: se descartó para el prototipo por reducir la flexibilidad del texto libre y de las explicaciones; sigue siendo una alternativa si la IA falla.

## Consecuencias

Se obtienen respuestas en español y una integración desacoplada del frontend, con dependencia de n8n y Groq. El costo mensual **no está confirmado**: depende del plan, volumen y tarifas vigentes. Si el servicio falla, `aiService.js` y `metricsService.js` lanzan errores que deben manejarse en la interfaz; no se ha implementado una garantía de disponibilidad ni un fallback automático. Pendiente: verificar credenciales en n8n, límites de uso y política de retención del proveedor.

## Cómo se verifica

Revisar `Proyecto-Final/docs/n8n/PuraVida Trips - Recomendaciones IA.json` y `Proyecto-Final/docs/n8n/PuraVida Trips - Prediccion de Metricas IA.json` (nodos Groq Chat Model); revisar `Proyecto-Final/src/services/aiService.js` y `Proyecto-Final/src/services/metricsService.js` (webhooks). Verificación en ejecución y de costos: **Pendiente**.
