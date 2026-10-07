# PuraVida Trips

PuraVida Trips es una plataforma web de turismo desarrollada con React y Vite, orientada a facilitar la búsqueda, comparación y reserva de tours y experiencias turísticas en Costa Rica.

El proyecto centraliza diferentes experiencias turísticas en un catálogo donde los usuarios pueden explorar tours, realizar búsquedas y filtros, consultar información detallada, comparar alternativas y gestionar sus preferencias.

La plataforma cuenta con diferentes perfiles de usuario:

- Turista: puede explorar tours, comparar experiencias, gestionar favoritos y consultar su información.
- Operador: puede administrar información relacionada con sus tours y recursos multimedia.
- Administrador: puede consultar métricas, gestionar usuarios, supervisar información del sistema y utilizar herramientas de análisis.

La aplicación implementa autenticación y autorización mediante React Context y LocalStorage, utilizando rutas protegidas según el rol del usuario. También incorpora JSON Server como API simulada para la gestión de datos.

Entre las principales integraciones del proyecto se encuentran Cloudinary para la gestión de recursos multimedia, Open-Meteo para información meteorológica y Google Maps para la visualización de ubicaciones. Además, se integraron workflows de n8n y modelos de inteligencia artificial para recomendaciones turísticas y proyecciones de métricas administrativas.

El proyecto también incluye funcionalidades de accesibilidad y personalización, como cambio de tema, alto contraste, ajuste del tamaño de fuente, modos para daltonismo, lectura mediante síntesis de voz y selección de idioma.

## Tecnologías

- React
- Vite
- JavaScript
- React Router
- JSON Server
- SweetAlert2
- Jest
- Cloudinary
- Open-Meteo API
- Google Maps
- n8n
- Groq / modelos de inteligencia artificial
- Git y GitHub

## Principales funcionalidades

- Página de inicio
- Catálogo de tours
- Búsqueda y filtrado
- Comparación de tours
- Detalle de experiencias
- Autenticación y registro
- Control de acceso por roles
- Dashboard para turistas
- Dashboard para operadores
- Dashboard administrativo
- Gestión de usuarios
- Favoritos
- Disponibilidad y reservas simuladas
- Integración con Cloudinary
- Consulta de clima
- Integración con Google Maps
- Recomendaciones turísticas mediante IA
- Predicción de métricas mediante IA
- Workflows de automatización con n8n
- Accesibilidad y preferencias de usuario
- Manejo de errores 403 y 404
- Pruebas unitarias con Jest

## Arquitectura

El proyecto utiliza una estructura modular basada en componentes, páginas, rutas, contextos, servicios y utilidades.

```text
src/
├── components/
├── context/
├── pages/
├── routes/
├── services/
└── utils/
```

JSON Server se utiliza como API simulada para almacenar y gestionar la información utilizada por la aplicación.

## Ejecución

Instalar las dependencias:

```bash
npm install
```

Iniciar el frontend:

```bash
npm run dev
```

Iniciar JSON Server:

```bash
npm run server
```

Ejecutar las pruebas:

```bash
npm test
```

Ejecutar ESLint:

```bash
npm run lint
```

Generar la versión de producción:

```bash
npm run build
```

## Variables de entorno

Las integraciones externas requieren variables de entorno para funcionar correctamente.

Entre ellas se encuentran:

- URL de JSON Server
- Configuración de Cloudinary
- URL del webhook de recomendaciones de n8n
- URL del webhook de predicción de métricas de n8n
- URL opcional del video principal alojado en Cloudinary

Las credenciales y claves privadas no deben almacenarse directamente en el código fuente.

## Inteligencia artificial y automatización

PuraVida Trips incorpora dos flujos principales mediante n8n:

1. Recomendaciones turísticas:
   analiza las preferencias introducidas por el usuario y consulta información del catálogo para generar recomendaciones.

2. Predicción de métricas:
   utiliza datos históricos y actuales del sistema para generar proyecciones de usuarios, tours, reservas e ingresos.

Los workflows utilizados para estas funcionalidades se encuentran documentados dentro de la carpeta `docs/n8n`.

## Pruebas

El proyecto utiliza Jest para realizar pruebas unitarias sobre las funciones de utilidad relacionadas con tours y usuarios.

Las pruebas cubren casos normales, búsquedas, agrupaciones, normalización, validaciones y manejo de información de usuarios.

## Alcance académico

PuraVida Trips corresponde a un proyecto académico de Front-End. Algunas funcionalidades, como autenticación, reservas, pagos y disponibilidad, utilizan simulaciones mediante React, LocalStorage y JSON Server.

La arquitectura está diseñada para permitir que estas funcionalidades puedan evolucionar posteriormente hacia servicios reales.
