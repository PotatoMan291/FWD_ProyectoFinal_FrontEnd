import { useState } from "react";
import Swal from "sweetalert2";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function loadWidgetScript() {
  return new Promise((resolve, reject) => {
    if (window.cloudinary?.createUploadWidget) return resolve();
    const existing = document.querySelector('script[data-cloudinary-widget]');
    if (existing) { existing.addEventListener("load", resolve, { once: true }); existing.addEventListener("error", reject, { once: true }); return; }
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    script.async = true; script.dataset.cloudinaryWidget = "true";
    script.onload = resolve; script.onerror = reject; document.body.appendChild(script);
  });
}

function CloudinaryUploadButton({ onUploaded }) {
  const [loading, setLoading] = useState(false);
  const openWidget = async () => {
    if (!CLOUD_NAME || !PRESET) {
      Swal.fire({ icon: "warning", title: "Cloudinary no configurado", text: "Configura VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET en .env.local." });
      return;
    }
    try {
      setLoading(true); await loadWidgetScript();
      const widget = window.cloudinary.createUploadWidget({ cloudName: CLOUD_NAME, uploadPreset: PRESET, multiple: false, sources: ["local", "url", "camera"], resourceType: "auto", maxFileSize: 150 * 1024 * 1024, styles: { palette: { window: "#FFFDF8", windowBorder: "#176A4E", tabIcon: "#176A4E", menuIcons: "#176A4E", textDark: "#123B2B", textLight: "#FFFFFF", link: "#176A4E", action: "#EDB83E", inactiveTabIcon: "#56665F", error: "#B42318", inProgress: "#176A4E", complete: "#176A4E", sourceBg: "#F3F5EF" } } }, (error, result) => {
        if (error) { console.error(error); return; }
        if (result?.event === "success") { onUploaded?.(result.info); Swal.fire({ icon: "success", title: "Recurso subido", text: "Cloudinary recibió el archivo correctamente.", timer: 1500, showConfirmButton: false }); }
      });
      widget.open();
    } catch (error) { console.error(error); Swal.fire({ icon: "error", title: "No se pudo abrir Cloudinary", text: error.message }); }
    finally { setLoading(false); }
  };
  return <button type="button" className="button button-primary" onClick={openWidget} disabled={loading}>{loading ? "Cargando..." : "Subir imagen o video"}</button>;
}
export default CloudinaryUploadButton;
