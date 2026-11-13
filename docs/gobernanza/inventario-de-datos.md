# Inventario de datos — PuraVida Trips

Alcance: código y archivos de ejemplo del proyecto académico. Los plazos para almacenamiento de terceros y la instancia real de n8n no están confirmados; en esos casos se indica **Pendiente** y no se presume un cumplimiento implementado. Los datos presentes en `db.json` son de demostración; no deben sustituirse por datos personales reales.

| Dato | ¿Personal? | Categoría (Ley 8968, art. 9) | De dónde viene | Dónde se guarda | ¿Sale a un tercero? ¿A quién? | Cuánto se conserva | Quién puede verlo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ID, nombre, correo y rol de cuenta | Sí | Acceso restringido | Registro y datos de muestra | `Proyecto-Final/db.json`, `usuarios`; sesión: `localStorage` | Sí, ID/nombre/rol llegan a webhook n8n en recomendaciones | Hasta modificación/eliminación manual en JSON Server; sesión hasta cierre o limpieza | Cualquier cliente que acceda a la API simulada; sesión en el navegador |
| Contraseña de usuario | Sí | Acceso restringido | Formulario de registro y cuentas de prueba | `Proyecto-Final/db.json`, `usuarios`, texto plano | No se envía a Groq en el código revisado; la API simulada la devuelve a clientes que consultan usuarios | Hasta modificación/eliminación manual; sin purga definida | Clientes con acceso a `/usuarios` (riesgo crítico) |
| Preferencias libres de viajes | Potencialmente sí | Acceso restringido | Texto escrito por turista (puede contener detalles personales) | Estado React durante la sesión; el almacenamiento en n8n/Groq no está confirmado | Sí, webhook n8n y potencialmente Groq | En React hasta cambio/recarga; terceros: Pendiente de verificar | Turista y servicios n8n/Groq según configuración |
| Identificador, nombre y rol remitidos a IA | Sí | Acceso restringido | Sesión autenticada | Payload temporal en el navegador y n8n; retención n8n Pendiente | Sí, webhook n8n y modelo según configuración del workflow | Pendiente de verificar en n8n y Groq | Servicios que procesen el webhook y sus administradores |
| Tours: nombre, destino, precio, categoría, ubicación, operador | No | No aplica | Catálogo de muestra o gestión de tours | `Proyecto-Final/db.json`, `tours` | Sí, n8n consulta el catálogo y Groq puede procesarlo | Hasta edición o eliminación manual de datos de muestra | Usuarios del catálogo; sistemas conectados |
| Coordenadas del destino turístico | No | No aplica | Catálogo de tours | `Proyecto-Final/db.json`, `tours` | Sí, Open-Meteo y Google Maps reciben coordenadas del destino al consultarlos | En el catálogo hasta edición; terceros: Pendiente | Usuarios y servicios externos correspondientes |
| Archivo multimedia seleccionado para subir | Potencialmente sí | Acceso restringido si identifica a una persona; No aplica si no | Selección por el operador/administrador | Cloudinary al subir; URL pública referenciada en catálogo si se utiliza | Sí, Cloudinary | Según configuración de Cloudinary; Pendiente de verificar | Quien tenga permisos en Cloudinary y usuarios con URL pública |
| Favoritos, reservas, pagos y disponibilidades simulados | Potencialmente sí | Acceso restringido si se vinculan a cuenta | Acciones del usuario o datos simulados | Colecciones de `db.json` (vacías en ZIP); información futura depende de uso | No observado en los workflows revisados | Sin plazo automático; Pendiente | Clientes que accedan a JSON Server; permisos reales Pendiente |
| Métricas históricas y actuales de usuarios, tours, reservas e ingresos | No, si se mantienen agregadas | No aplica si agregadas y no reidentificables | `metricasHistoricas` y cálculos del dashboard | Consulta HTTP y estado de UI; configuración de n8n Pendiente | Sí, webhook n8n y Groq según workflow | Historial de muestra y retención en terceros: Pendiente | Administrador de dashboard y servicios externos |
| Preferencias de accesibilidad e idioma | No, en la implementación de preferencias generales | No aplica | Controles de interfaz | Estado/contexto del navegador y almacenamiento local según implementación | No se observa envío directo a Groq salvo idioma de la solicitud | Hasta modificación o limpieza del navegador | Navegador de la persona usuaria |

## Lo que NO recolectamos

- Número de tarjeta y CVV: no hay procesamiento de pagos reales en el alcance académico revisado.
- Documento nacional de identidad: el registro no lo solicita.
- Datos de salud o afiliaciones políticas: no forman parte de los campos de registro; el campo libre de preferencias **podría** recibir información de este tipo de forma voluntaria y se debe advertir que no se introduzca.
- Ubicación GPS del dispositivo: se consultan coordenadas de destinos, no geolocalización del visitante en el código revisado.

## Observaciones de revisión

Las colecciones `reservas`, `pagos`, `favoritos` y `disponibilidades` están vacías en el `db.json` entregado, pero pueden recibir registros durante la ejecución. No se ha verificado una política de retención o eliminación automática para estos datos. Para producción se requiere un nuevo inventario ajustado a los datos reales y a cada tercero.
