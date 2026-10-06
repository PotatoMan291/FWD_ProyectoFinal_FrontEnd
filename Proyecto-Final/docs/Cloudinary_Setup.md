# Configuración de Cloudinary - PuraVida Trips

## 1. Crear el recurso en Cloudinary

1. Crear una cuenta en Cloudinary.
2. Copiar el **Cloud Name** desde el Dashboard.
3. Crear un **Upload Preset** de tipo **Unsigned** para el proyecto.
4. Guardar el nombre del preset.

El frontend solo necesita el Cloud Name y el Upload Preset. **Nunca se debe colocar el API Secret en React/Vite.**

## 2. Variables de entorno

Crear `.env.local` en `Proyecto-Final` a partir de `.env.example`:

```env
VITE_API_URL=http://localhost:3001
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_unsigned_upload_preset
VITE_CLOUDINARY_HERO_VIDEO_URL=
```

`.env.local` no debe subirse al repositorio.

## 3. Imágenes de tours

Después de subir una imagen desde Cloudinary, utilizar su `secure_url` como valor de `imagen` en el tour de `db.json`.

Ejemplo:

```json
{
  "id": "1",
  "imagen": "https://res.cloudinary.com/tu_cloud_name/image/upload/v1234567890/puravida-trips/tours/arenal.jpg"
}
```

Esto permite que `TourCard`, la página de inicio, el detalle y la comparación utilicen la imagen remota sin cambios adicionales.

## 4. Video del hero

Subir el video de Costa Rica como recurso de video en Cloudinary y copiar su `secure_url` en:

```env
VITE_CLOUDINARY_HERO_VIDEO_URL=https://res.cloudinary.com/tu_cloud_name/video/upload/v1234567890/puravida-trips/costa-rica.mp4
```

`Home.jsx` utilizará esa URL automáticamente. Si la variable está vacía, seguirá usando el video local como respaldo.

## 5. Servicio incluido

`src/services/cloudinaryService.js` contiene:

- `uploadToCloudinary(file, options)` para cargas unsigned desde el frontend.
- `buildCloudinaryImageUrl(publicId, transformations)` para construir URLs de imágenes.
- `buildCloudinaryVideoUrl(publicId, transformations)` para construir URLs de video.

El servicio queda listo para conectarse posteriormente al CRUD de operador/administrador.

## 6. Widget para imágenes y videos grandes

El dashboard del operador incluye `CloudinaryUploadButton.jsx`, que utiliza el Upload Widget de Cloudinary. Esto es preferible para el video grande del proyecto porque el widget gestiona el proceso de subida desde el navegador.

En Cloudinary, el preset unsigned debe limitar los formatos permitidos y las transformaciones según las necesidades del proyecto. El nombre del preset será visible en el frontend, por lo que no debe considerarse un secreto.

Al subir desde el dashboard:

1. Selecciona un tour.
2. Pulsa `Subir imagen o video`.
3. Selecciona el archivo.
4. Cuando Cloudinary termine, el recurso se asocia al tour automáticamente:
   - imagen → campo `imagen` de `db.json`.
   - video → campo `video` de `db.json`.

Cloudinary recomienda utilizar cargas unsigned para escenarios públicos desde el navegador y cargas firmadas cuando se necesita mayor control de seguridad. Para el proyecto académico se utiliza unsigned.
