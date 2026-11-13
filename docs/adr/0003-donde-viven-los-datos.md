# ADR-0003: JSON Server y LocalStorage para datos académicos; n8n recibe entradas de IA

- Estado: Propuesto
- Fecha: 2026-11-13
- Decide: Andrés Pérez, desarrollador de PuraVida Trips

## Contexto

El repositorio usa `Proyecto-Final/db.json` con JSON Server para usuarios, tours y tablas simuladas; el navegador guarda una copia de la sesión en LocalStorage. Los formularios de IA envían información a webhooks de n8n; también existen integraciones de imágenes con Cloudinary y datos meteorológicos mediante Open-Meteo. El despliegue, región y retención de n8n/Groq no constan en el ZIP revisado.

## Decisión

- Para este **prototipo local**, JSON Server usa `Proyecto-Final/db.json`, expuesto por defecto en `http://localhost:3001` según `Proyecto-Final/src/services/api.js` y el script `server` de `package.json`.
- La sesión del navegador se almacena en `localStorage` con la clave `puravida_auth` e incluye ID, nombre, correo y rol, según `AuthContext.jsx`; el navegador conserva esa copia hasta cerrar sesión o eliminar el almacenamiento.
- El registro guarda nombre, correo, contraseña y rol en `/usuarios`. **Riesgo presente:** las contraseñas se conservan en texto plano y la API simulada no aplica controles robustos de acceso; esto **no está aprobado para producción**.
- A n8n, para recomendaciones, se remiten el ID, nombre y rol del usuario, sus preferencias libres y el idioma. Para métricas, se remiten métricas actuales, historial, períodos e idioma. Groq recibe lo que los agentes envíen desde sus workflows; no se ha verificado el tráfico real en ejecución.
- Cloudinary recibe archivos seleccionados al usar la función de subida; Open-Meteo recibe coordenadas de destinos turísticos. No se observan pagos reales en el proyecto.
- **Pendiente para producción:** sustituir JSON Server por backend con autorización, cifrar conexiones, guardar hashes seguros de contraseñas, minimizar el payload de n8n, definir región y contratos de terceros, implementar consentimiento, eliminación y plazos de retención.

## Alternativas descartadas

- Usar una base de datos de producción con credenciales desde el navegador: expondría accesos sensibles; se mantiene JSON Server solo para evaluación académica.
- Guardar identificadores personales adicionales en LocalStorage: no son necesarios para mantener la navegación por roles y aumentarían exposición.

## Consecuencias

El prototipo resulta fácil de ejecutar y demostrar, pero no satisface por sí mismo los requisitos de seguridad y privacidad de un sistema real. En el tratamiento de datos personales deben evaluarse la Ley 8968, la información al usuario, la transferencia internacional, los derechos de acceso y supresión y la retención del proveedor. No se ha confirmado una región de almacenamiento externa ni un período de purga; ambos son **Pendiente**.

## Cómo se verifica

Inspeccionar `Proyecto-Final/db.json`, `Proyecto-Final/src/pages/Register.jsx`, `Proyecto-Final/src/pages/Login.jsx`, `Proyecto-Final/src/context/AuthContext.jsx`, `Proyecto-Final/src/services/aiService.js`, `Proyecto-Final/src/services/metricsService.js`, `Proyecto-Final/src/services/cloudinaryService.js` y `Proyecto-Final/src/services/externalService.js`. Pruebas de permisos, borrado real y auditoría de transferencia de datos: **Pendiente**.
