# Registro de riesgos — PuraVida Trips

Probabilidad e impacto: B = baja/bajo, M = media/medio, A = alta/alto. Los estados describen medidas observadas o pendientes; no equivalen a una auditoría de producción.

| # | Riesgo | Quién sale afectado | Probabilidad (B/M/A) | Impacto (B/M/A) | Mitigación | Estado | Responsable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Contraseñas en texto plano en `db.json` y consulta de usuarios desde el navegador | Personas registradas y equipo responsable | A | A | Sustituir JSON Server público por backend con autenticación y autorización; almacenar hashes con algoritmo adecuado y migrar/eliminar claves de muestra | Pendiente | Andrés Pérez, desarrollador |
| R2 | Manipulación de roles u objetos por una API simulada sin autorización robusta | Turistas, operadores y administración | A | A | Aplicar controles de autorización del lado servidor por recurso y rol; agregar pruebas de acceso indebido | Pendiente | Andrés Pérez, desarrollador |
| R3 | Inyección de instrucciones en preferencias libres enviadas al agente | Turistas y operador de la plataforma | M | A | Tratar texto externo como datos; restringir herramientas; validar JSON de respuesta y comprobar cada ID recomendado contra el catálogo antes de mostrarlo | En curso | Andrés Pérez, desarrollador |
| R4 | Recomendación de tour inexistente por respuesta del modelo | Turistas que consultan sugerencias | M | M | El frontend ya intenta cruzar IDs con catálogo; cambiar el comportamiento para descartar IDs desconocidos y añadir prueba automatizada | En curso | Andrés Pérez, desarrollador |
| R5 | Exposición de datos de cuenta al enviar ID, nombre, rol y texto libre al webhook de n8n | Turistas y personas nombradas en las preferencias | M | A | Minimizar payload a identificadores no personales y preferencias necesarias; confirmar consentimiento, configuración privada, acceso y retención de n8n/Groq | Pendiente | Andrés Pérez, desarrollador |
| R6 | Uso excesivo o no autorizado de webhooks públicos de IA | Equipo del proyecto y proveedor de servicio | M | M | Añadir autenticación, rate limiting y presupuestos/cotas en gateway o servidor; no guardar credenciales Groq en React | Pendiente | Andrés Pérez, desarrollador |
| R7 | Tratar proyecciones generadas por IA como ingresos garantizados | Administradores y responsables de decisiones | M | M | Presentar las proyecciones como estimaciones; validar cifras contra histórico antes de usarlas y conservar aprobación humana | En curso | Andrés Pérez, desarrollador |
| R8 | Subida de archivos inapropiados o datos personales a Cloudinary | Operadores, turistas y personas retratadas | M | A | Restringir tipo/tamaño, autenticar subidas, moderar contenidos y configurar visibilidad y eliminación de archivos | Pendiente | Andrés Pérez, desarrollador |

## Seguimiento

El responsable deberá revisar primero R1 y R2 antes de cualquier despliegue real. R3-R8 requieren verificación en ejecución y evidencias de pruebas antes de marcarse como Hecho.
