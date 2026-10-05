import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);
const STORAGE_KEY = "puravida_language";

const translations = {
  es: {
    language: "Idioma",
    spanish: "Español",
    english: "English",
    nav: { home: "Inicio", explore: "Explorar", login: "Iniciar sesión", register: "Crear cuenta", logout: "Cerrar sesión", dashboard: "Dashboard" },
    home: {
      eyebrow: "COSTA RICA · EXPERIENCIAS · PURA VIDA",
      title: "Descubre Costa Rica",
      titleAccent: " a tu manera.",
      description: "Encuentra, compara y reserva tours y experiencias turísticas pensadas para que vivas Costa Rica.",
      explore: "Explora Costa Rica", featured: "Experiencias destacadas", seeAll: "Ver todos los tours",
      categories: { nature: "Naturaleza", adventure: "Aventura", beach: "Playa", culture: "Cultura" },
      categoryDescriptions: { nature: "Bosques, volcanes y paisajes únicos.", adventure: "Experiencias para quienes buscan adrenalina.", beach: "Descubre las costas y playas de Costa Rica.", culture: "Conoce la historia y cultura local." },
      different: "Vive algo diferente", differentDescription: "Descubre algunas de las experiencias que podrás encontrar en PuraVida Trips.",
      bannerEyebrow: "TU PRÓXIMA AVENTURA", bannerTitle: "Costa Rica tiene una experiencia esperándote.", bannerText: "Explora nuevos lugares, apoya experiencias locales y crea recuerdos inolvidables.", bannerButton: "Explorar experiencias"
    },
    marketplace: {
      eyebrow: "Explora Costa Rica", title: "Encuentra tu próxima experiencia", description: "Descubre tours y experiencias turísticas para disfrutar Costa Rica.", filter: "Filtrar", find: "Encuentra lo que buscas", clear: "Limpiar", search: "Buscar", searchPlaceholder: "Ej. aventura, playa...", category: "Categoría", allCategories: "Todas las categorías", location: "Ubicación", allLocations: "Todas las ubicaciones", maxPrice: "Precio máximo", sort: "Ordenar por", recommended: "Recomendados", lowHigh: "Precio: menor a mayor", highLow: "Precio: mayor a menor", nameAZ: "Nombre: A-Z", nameZA: "Nombre: Z-A", experiences: "experiencias", available: "Experiencias disponibles", selected: "seleccionadas para comparar", loading: "Cargando experiencias...", emptyTitle: "No encontramos experiencias", emptyText: "Intenta cambiar los filtros de búsqueda.", clearFilters: "Limpiar filtros"
    },
    dashboard: {
      adminTitle: "Panel administrativo", adminDescription: "Supervisa el estado general de PuraVida Trips.", touristTitle: "Panel del turista", touristDescription: "Gestiona tu perfil, favoritos, reservas y recomendaciones.", operatorTitle: "Panel del operador", operatorDescription: "Gestiona tus experiencias, disponibilidad y reservas.", stats: "Estadísticas", totalUsers: "Usuarios", totalTours: "Tours", operators: "Operadores", reservations: "Reservas", revenue: "Ingresos", categories: "Tours por categoría", roles: "Usuarios por rol", profile: "Mi perfil", save: "Guardar cambios", favorites: "Favoritos", reservationHistory: "Historial de reservas", operatorTours: "Mis tours", upload: "Subir imagen o video", aiTitle: "Asistente inteligente", aiDescription: "Cuéntame qué te gustaría hacer y te recomendaré experiencias.", preferences: "¿Qué buscas?", aiPlaceholder: "Ej. naturaleza, aventura, playa tranquila...", askAI: "Recomendar tours", aiLoading: "Analizando tus preferencias...", noRecommendations: "No hay recomendaciones todavía.", mediaReady: "Recurso subido correctamente. Copia la URL para utilizarla en tu tour.", mediaUrl: "URL del recurso"
    },
    accessibility: { title: "Accesibilidad", personalization: "PERSONALIZACIÓN", theme: "Tema", light: "Claro", dark: "Oscuro", contrast: "Contraste", normal: "Normal", high: "Alto", fontSize: "Tamaño de texto", fontNormal: "Normal", fontLarge: "Grande", fontXLarge: "Muy grande", colorBlind: "Modo de daltonismo", none: "Ninguno", protanopia: "Protanopia", deuteranopia: "Deuteranopia", tritanopia: "Tritanopia", speech: "Texto a voz", speechOn: "Activado", speechOff: "Desactivado", stop: "Detener voz", reset: "Restablecer", languageHelp: "Cambia el idioma de la interfaz. La preferencia se guarda en este dispositivo.", speechHelp: "La voz se adapta al idioma seleccionado." },
    footer: { description: "Descubre Costa Rica, compara experiencias y encuentra tu próxima aventura.", explore: "Explorar", tours: "Tours", account: "Cuenta", brand: "PuraVida Trips", country: "Costa Rica", tagline: "Experiencias que conectan", rights: "Todos los derechos reservados." },
    auth: { loginTitle: "Iniciar sesión", loginDescription: "Ingresa a tu cuenta para continuar explorando Costa Rica.", email: "Correo electrónico", password: "Contraseña", loginButton: "Iniciar sesión", noAccount: "¿No tienes una cuenta?", register: "Crear cuenta", welcome: "Bienvenido", loginSuccess: "Inicio de sesión exitoso.", registerTitle: "Crear cuenta", registerDescription: "Regístrate para comenzar a descubrir nuevas experiencias.", name: "Nombre completo", confirmPassword: "Confirmar contraseña", createButton: "Crear cuenta", accountCreated: "Cuenta creada" },
    tour: { details: "Ver detalles", compare: "Comparar", comparing: "Comparando", priceFrom: "Desde", location: "Ubicación", duration: "Duración", capacity: "Capacidad", operator: "Operador", description: "Descripción", features: "Características" }
  },
  en: {
    language: "Language", spanish: "Español", english: "English",
    nav: { home: "Home", explore: "Explore", login: "Sign in", register: "Create account", logout: "Sign out", dashboard: "Dashboard" },
    home: {
      eyebrow: "COSTA RICA · EXPERIENCES · PURA VIDA", title: "Discover Costa Rica", titleAccent: " your way.", description: "Find, compare and book tours and travel experiences designed to help you experience Costa Rica.", explore: "Explore Costa Rica", featured: "Featured experiences", seeAll: "See all tours", categories: { nature: "Nature", adventure: "Adventure", beach: "Beach", culture: "Culture" }, categoryDescriptions: { nature: "Forests, volcanoes and unique landscapes.", adventure: "Experiences for those looking for adrenaline.", beach: "Discover the coasts and beaches of Costa Rica.", culture: "Discover local history and culture." }, different: "Experience something different", differentDescription: "Discover some of the experiences available on PuraVida Trips.", bannerEyebrow: "YOUR NEXT ADVENTURE", bannerTitle: "Costa Rica has an experience waiting for you.", bannerText: "Explore new places, support local experiences and create unforgettable memories.", bannerButton: "Explore experiences"
    },
    marketplace: { eyebrow: "Explore Costa Rica", title: "Find your next experience", description: "Discover tours and travel experiences to enjoy Costa Rica.", filter: "Filter", find: "Find what you are looking for", clear: "Clear", search: "Search", searchPlaceholder: "E.g. adventure, beach...", category: "Category", allCategories: "All categories", location: "Location", allLocations: "All locations", maxPrice: "Maximum price", sort: "Sort by", recommended: "Recommended", lowHigh: "Price: low to high", highLow: "Price: high to low", nameAZ: "Name: A-Z", nameZA: "Name: Z-A", experiences: "experiences", available: "Available experiences", selected: "selected for comparison", loading: "Loading experiences...", emptyTitle: "No experiences found", emptyText: "Try changing your search filters.", clearFilters: "Clear filters" },
    dashboard: { adminTitle: "Admin dashboard", adminDescription: "Monitor the overall state of PuraVida Trips.", touristTitle: "Tourist dashboard", touristDescription: "Manage your profile, favorites, bookings and recommendations.", operatorTitle: "Operator dashboard", operatorDescription: "Manage your experiences, availability and bookings.", stats: "Statistics", totalUsers: "Users", totalTours: "Tours", operators: "Operators", reservations: "Bookings", revenue: "Revenue", categories: "Tours by category", roles: "Users by role", profile: "My profile", save: "Save changes", favorites: "Favorites", reservationHistory: "Booking history", operatorTours: "My tours", upload: "Upload image or video", aiTitle: "Smart assistant", aiDescription: "Tell me what you would like to do and I will recommend experiences.", preferences: "What are you looking for?", aiPlaceholder: "E.g. nature, adventure, quiet beach...", askAI: "Recommend tours", aiLoading: "Analyzing your preferences...", noRecommendations: "No recommendations yet.", mediaReady: "Resource uploaded successfully. Copy the URL to use it in your tour.", mediaUrl: "Resource URL" },
    accessibility: { title: "Accessibility", personalization: "PERSONALIZATION", theme: "Theme", light: "Light", dark: "Dark", contrast: "Contrast", normal: "Normal", high: "High", fontSize: "Text size", fontNormal: "Normal", fontLarge: "Large", fontXLarge: "Very large", colorBlind: "Color blindness mode", none: "None", protanopia: "Protanopia", deuteranopia: "Deuteranopia", tritanopia: "Tritanopia", speech: "Text to speech", speechOn: "On", speechOff: "Off", stop: "Stop speech", reset: "Reset", languageHelp: "Change the interface language. The preference is saved on this device.", speechHelp: "Speech adapts to the selected language." },
    footer: { description: "Discover Costa Rica, compare experiences and find your next adventure.", explore: "Explore", tours: "Tours", account: "Account", brand: "PuraVida Trips", country: "Costa Rica", tagline: "Experiences that connect", rights: "All rights reserved." },
    auth: { loginTitle: "Sign in", loginDescription: "Sign in to continue exploring Costa Rica.", email: "Email", password: "Password", loginButton: "Sign in", noAccount: "Don't have an account?", register: "Create account", welcome: "Welcome", loginSuccess: "Sign in successful.", registerTitle: "Create account", registerDescription: "Register to start discovering new experiences.", name: "Full name", confirmPassword: "Confirm password", createButton: "Create account", accountCreated: "Account created" },
    tour: { details: "View details", compare: "Compare", comparing: "Comparing", priceFrom: "From", location: "Location", duration: "Duration", capacity: "Capacity", operator: "Operator", description: "Description", features: "Features" }
  }
};

function getValue(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || "es");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key, fallback = key) => getValue(translations[language], key) ?? fallback, [language]);

  const value = useMemo(() => ({ language, setLanguage, t, translations }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage debe utilizarse dentro de LanguageProvider");
  return context;
}

export default LanguageProvider;
