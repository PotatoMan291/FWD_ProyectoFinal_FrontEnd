const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function getUploadUrl() {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "Falta VITE_CLOUDINARY_CLOUD_NAME en las variables de entorno."
    );
  }

  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
}

export async function uploadToCloudinary(file, options = {}) {
  if (!(file instanceof File)) {
    throw new Error("Debes seleccionar un archivo válido.");
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Falta VITE_CLOUDINARY_UPLOAD_PRESET en las variables de entorno."
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  if (options.publicId) {
    formData.append("public_id", options.publicId);
  }

  const response = await fetch(getUploadUrl(), {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        "No se pudo subir el archivo a Cloudinary."
    );
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    width: data.width,
    height: data.height,
    duration: data.duration,
  };
}

export function buildCloudinaryImageUrl(
  publicId,
  transformations = ""
) {
  if (!CLOUDINARY_CLOUD_NAME || !publicId) {
    return "";
  }

  const transformationSegment = transformations
    ? `${transformations}/`
    : "";

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformationSegment}${publicId}`;
}

export function buildCloudinaryVideoUrl(
  publicId,
  transformations = ""
) {
  if (!CLOUDINARY_CLOUD_NAME || !publicId) {
    return "";
  }

  const transformationSegment = transformations
    ? `${transformations}/`
    : "";

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${transformationSegment}${publicId}`;
}
