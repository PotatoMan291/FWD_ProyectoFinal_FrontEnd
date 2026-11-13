# ADR-0002: La IA recomienda tours y estima métricas; no confirma transacciones

- Estado: Propuesto
- Fecha: 2026-11-13
- Decide: Andrés Pérez, desarrollador de PuraVida Trips

## Contexto

El turista introduce preferencias en un asistente y recibe sugerencias; el panel administrativo solicita estimaciones de usuarios, tours, reservas e ingresos. Estas respuestas podrían influir en decisiones de viaje o de gestión, pero el proyecto es un prototipo académico con reservas y pagos simulados.

## Decisión

- El agente de recomendaciones propone como máximo tres tours y explica motivos, según su prompt configurado en n8n; puede consultar el catálogo y el clima.
- El frontend relaciona cada ID recomendado con el catálogo cargado desde JSON Server para mostrar sus datos. **Limitación actual:** si no encuentra el ID, todavía puede mostrar el nombre o ID proporcionado por el modelo; no hay una validación estricta que descarte toda recomendación desconocida.
- El agente de métricas genera proyecciones orientativas con valores históricos y actuales, no resultados garantizados. No hay un proceso automático que aplique dichas proyecciones al negocio.
- La IA **no ejecuta** acciones de creación de reservas, cobros, eliminación de usuarios ni cambios de roles mediante los workflows exportados. Estas operaciones no aparecen como herramientas de los agentes.
- La persona usuaria decide si abre el detalle de un tour y qué uso da a las recomendaciones. La persona administradora interpreta las predicciones antes de tomar decisiones.
- **Pendiente:** validar con un esquema estricto la respuesta del modelo y bloquear en UI cualquier recomendación con ID que no exista en el catálogo.

## Alternativas descartadas

- Permitir que el agente reserve o cobre automáticamente: no es necesario para el alcance académico y aumentaría el riesgo de acciones incorrectas.
- Usar la predicción para modificar automáticamente precios u objetivos: las proyecciones no son suficientemente verificadas para producir efectos automáticos.

## Consecuencias

Se conserva la decisión humana de continuar con un tour o utilizar la proyección. El sistema evita dar a los agentes herramientas de escritura en la API, pero siguen existiendo riesgos de recomendaciones inventadas, sesgo y respuestas no verificadas. La revisión de calidad por parte de una persona y las validaciones automáticas son tareas pendientes.

## Cómo se verifica

`Proyecto-Final/src/components/AITripAssistant.jsx` muestra sugerencias y enlaces al detalle; `Proyecto-Final/src/services/aiService.js` solo envía un POST al webhook. Los JSON de `Proyecto-Final/docs/n8n/` muestran herramientas de consulta del catálogo/clima y el prompt de predicción, sin nodos que creen reservas o pagos. Prueba automatizada de IDs desconocidos y validación estricta: **Pendiente**.
