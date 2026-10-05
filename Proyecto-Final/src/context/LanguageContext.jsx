import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LanguageContext = createContext(null);

const LANGUAGE_STORAGE_KEY = "puravida_language";

const defaultLanguage = "es";

const translations = {
  es: {
    language: {
      label: "Idioma",
      spanish: "Español",
      english: "English",
    },

    navbar: {
      home: "Inicio",
      explore: "Explorar",
      login: "Iniciar sesión",
      register: "Crear cuenta",
      exploreTours: "Explorar tours",
      hello: "Hola",
      administrator: "Administrador",
      operator: "Operador",
      tourist: "Turista",
      logout: "Cerrar sesión",
      logoutTitle: "¿Cerrar sesión?",
      logoutText:
        "Tu sesión actual se cerrará en este dispositivo.",
      logoutConfirm: "Cerrar sesión",
      cancel: "Cancelar",
      logoutSuccess: "Sesión cerrada",
      logoutSuccessText:
        "Has cerrado sesión correctamente.",
      brandLabel: "PuraVida Trips - Inicio",
    },

    accessibility: {
      open: "Abrir opciones de accesibilidad",
      close: "Cerrar opciones de accesibilidad",
      title: "Accesibilidad",
      personalization: "PERSONALIZACIÓN",

      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",

      contrast: "Contraste",
      normal: "Normal",
      high: "Alto",

      fontSize: "Tamaño del texto",
      fontNormal: "A",
      fontLarge: "A+",
      fontXLarge: "A++",
      fontHelp:
        "Ajusta el tamaño general del contenido.",

      colorBlind: "Modo de daltonismo",
      none: "Ninguno",
      protanopia: "Protanopia",
      deuteranopia: "Deuteranopia",
      tritanopia: "Tritanopia",
      colorBlindHelp:
        "Mejora la diferenciación visual de los colores.",

      speech: "Texto a voz",
      speechEnable: "Activar texto a voz",
      speechEnabled: "Texto a voz activado",
      speechUnavailable:
        "El texto a voz no está disponible en este navegador.",
      speechReading:
        "Leyendo el elemento seleccionado...",
      speechHelp:
        "Lee el texto bajo el cursor o el elemento enfocado con el teclado.",
      speechStop: "Detener lectura",

      voice: "Voz",
      voiceAuto: "Automática",
      currentVoice: "Voz actual",

      reset: "Restablecer preferencias",
    },

    home: {
      eyebrow:
        "COSTA RICA · EXPERIENCIAS · PURA VIDA",
      title: "Descubre Costa Rica",
      titleAccent: " a tu manera.",
      description:
        "Encuentra, compara y reserva tours y experiencias turísticas pensadas para que vivas Costa Rica.",

      exploreEyebrow: "EXPLORA",
      exploreTitle:
        "Encuentra tu próxima experiencia",
      exploreDescription:
        "Explora diferentes formas de conocer y disfrutar Costa Rica.",

      categories: {
        nature: {
          title: "Naturaleza",
          description:
            "Bosques, volcanes y paisajes únicos.",
        },
        adventure: {
          title: "Aventura",
          description:
            "Experiencias para quienes buscan adrenalina.",
        },
        beach: {
          title: "Playa",
          description:
            "Descubre las costas y playas de Costa Rica.",
        },
        culture: {
          title: "Cultura",
          description:
            "Conoce la historia y cultura local.",
        },
      },

      featuredEyebrow:
        "EXPERIENCIAS DESTACADAS",
      featuredTitle: "Vive algo diferente",
      featuredDescription:
        "Descubre algunas de las experiencias que podrás encontrar en PuraVida Trips.",
      allTours: "Ver todos los tours",

      adventureEyebrow: "TU PRÓXIMA AVENTURA",
      adventureTitle:
        "Costa Rica tiene una experiencia esperándote.",
      adventureDescription:
        "Explora nuevos lugares, apoya experiencias locales y crea recuerdos que duren para siempre.",
      exploreExperiences:
        "Explorar experiencias",

      ctaEyebrow: "PURAVIDA TRIPS",
      ctaTitle:
        "Tu próxima aventura comienza aquí.",
      ctaDescription:
        "Explora experiencias turísticas en Costa Rica y encuentra una que se adapte a ti.",
      startExploring: "Comenzar a explorar",
    },

    search: {
      label: "¿Qué quieres explorar?",
      placeholder:
        "Ej. aventura, playa, naturaleza...",
      button: "Buscar",
    },

    category: {
      explore: "Explorar",
    },

    marketplace: {
      eyebrow: "Explora Costa Rica",
      title: "Encuentra tu próxima experiencia",
      description:
        "Descubre tours y experiencias turísticas para disfrutar Costa Rica.",

      filterEyebrow: "Filtrar",
      filterTitle: "Encuentra lo que buscas",
      clear: "Limpiar",

      search: "Buscar",
      searchPlaceholder: "Ej. aventura, playa...",

      category: "Categoría",
      allCategories: "Todas las categorías",

      location: "Ubicación",
      allLocations: "Todas las ubicaciones",

      maxPrice: "Precio máximo",
      pricePlaceholder: "Ej. 50000",

      sort: "Ordenar por",
      recommended: "Recomendados",
      priceAsc: "Precio: menor a mayor",
      priceDesc: "Precio: mayor a menor",
      nameAsc: "Nombre: A-Z",
      nameDesc: "Nombre: Z-A",

      results: "experiencias",
      available: "Experiencias disponibles",

      loading:
        "Cargando experiencias turísticas...",
      error:
        "No se pudieron cargar las experiencias turísticas.",
      empty:
        "No encontramos experiencias que coincidan con tus filtros.",
      clearFilters:
        "Intenta limpiar los filtros para ver todas las experiencias.",

      comparison: "comparación",
      selected: "seleccionadas",

      compareLimitTitle:
        "Límite de comparación",
      compareLimitText:
        "Solo puedes comparar hasta 3 experiencias al mismo tiempo.",
      understood: "Entendido",
    },

    tour: {
      details: "Ver detalles",
      compare: "Comparar",
      comparing: "Comparando",
      removeFromComparison:
        "Quitar de la comparación",
      addToComparison:
        "Agregar a la comparación",

      operatedBy: "Operado por",
      from: "Desde",
      perPerson: "por persona",

      duration: "Duración",
      capacity: "Capacidad",
      operator: "Operador",

      backToCatalog: "Volver al catálogo",
      maps: "Ver ubicación en Google Maps",
      keepExploring: "Seguir explorando",

      includes: "Incluye",
      featuresTitle:
        "Características de la experiencia",

      destination: "Información del destino",
      currentWeather: "Clima actual",
      checkingWeather: "Consultando el clima...",
      currentConditions:
        "Condiciones actuales en",
      weatherError:
        "No fue posible consultar el clima en este momento.",

      location: "Ubicación",
      where: "¿Dónde se realiza?",
      mapDescription:
        "Consulta la zona aproximada del tour y abre Google Maps para explorar el destino.",

      loading: "Cargando información del tour...",
      notFound: "Tour no encontrado",
      notFoundDescription:
        "No encontramos la experiencia que estás buscando.",

      characteristics: "Características",
      description: "Descripción",
      price: "Precio",
    },

    comparison: {
      eyebrow: "Comparación",
      title: "Compara tus experiencias",
      description:
        "Revisa las características de cada tour antes de elegir tu experiencia.",
      location: "Ubicación",
      price: "Precio",
      duration: "Duración",
      capacity: "Capacidad",
      operator: "Operador",
      descriptionLabel: "Descripción",
      features: "Características",
      details: "Ver detalles del tour",
      clear: "Limpiar comparación",
      continue: "Seguir explorando",
      selected: "experiencias seleccionadas",
      close: "Cerrar comparación",
    },

    footer: {
      description:
        "Descubre Costa Rica, compara experiencias y encuentra tu próxima aventura.",
      explore: "Explorar",
      tours: "Tours",
      adventure: "Aventura",
      nature: "Naturaleza",
      beach: "Playa",
      account: "Cuenta",
      login: "Iniciar sesión",
      register: "Registrarse",
      brand: "PuraVida Trips",
      country: "Costa Rica",
      slogan: "Experiencias que conectan",
      rights:
        "Todos los derechos reservados.",
    },

    auth: {
      brand: "PURAVIDA TRIPS",

      loginTitle: "Iniciar sesión",
      loginDescription:
        "Accede a tu cuenta para continuar explorando experiencias.",
      email: "Correo electrónico",
      password: "Contraseña",
      emailPlaceholder: "correo@ejemplo.com",
      passwordPlaceholder: "Ingresa tu contraseña",
      loginButton: "Iniciar sesión",
      loggingIn: "Iniciando sesión...",

      noAccount: "¿No tienes una cuenta?",
      createAccount: "Crear una cuenta",

      demoTitle: "Usuarios de demostración",

      invalidEmail:
        "Ingresa un correo electrónico válido.",
      emailRequired:
        "Ingresa tu correo electrónico.",
      passwordRequired:
        "Ingresa tu contraseña.",

      invalidCredentialsTitle:
        "No se pudo iniciar sesión",
      invalidCredentials:
        "El correo o la contraseña son incorrectos.",

      serverErrorTitle:
        "Error de conexión",
      serverError:
        "No se pudo conectar con el servidor.",

      registerTitle: "Crear cuenta",
      registerDescription:
        "Regístrate para comenzar a descubrir nuevas experiencias.",

      name: "Nombre completo",
      namePlaceholder: "Tu nombre",
      passwordMinPlaceholder:
        "Mínimo 6 caracteres",
      confirmPassword: "Confirmar contraseña",
      confirmPasswordPlaceholder:
        "Repite tu contraseña",

      createButton: "Crear cuenta",
      creatingAccount: "Creando cuenta...",

      alreadyAccount: "¿Ya tienes una cuenta?",
      accountLogin: "Iniciar sesión",

      nameRequired: "Ingresa tu nombre.",
      nameMin:
        "El nombre debe tener al menos 2 caracteres.",
      passwordMin:
        "La contraseña debe tener al menos 6 caracteres.",
      confirmRequired:
        "Confirma tu contraseña.",
      passwordsMismatch:
        "Las contraseñas no coinciden.",
      existingEmail:
        "Ya existe una cuenta con este correo.",

      accountCreated: "Cuenta creada",
      accountCreatedText:
        "Tu cuenta de PuraVida Trips fue creada correctamente.",

      registerErrorTitle:
        "No se pudo crear la cuenta",
      registerError:
        "Ocurrió un problema al comunicarse con el servidor.",

      accept: "Aceptar",
    },

    role: {
      touristTitle: "Panel del turista",
      touristDescription:
        "Aquí podrás gestionar tus favoritos, reservas y perfil.",

      operatorTitle: "Panel del operador",
      operatorDescription:
        "Aquí podrás administrar tus tours, disponibilidad y reservas.",

      adminTitle: "Panel administrativo",
      adminDescription:
        "Aquí podrás gestionar operadores, tours, categorías y contenido.",

      greeting: "Hola",
      underConstruction:
        "Módulo en construcción",
      moduleDescription:
        "Este espacio será reemplazado por el panel correspondiente durante las siguientes etapas del proyecto.",
      backHome: "Volver al inicio",
    },

    notFound: {
      title: "Página no encontrada",
      description:
        "La página que estás buscando no existe.",
      back: "Volver al inicio",
    },
  },

  en: {
    language: {
      label: "Language",
      spanish: "Español",
      english: "English",
    },

    navbar: {
      home: "Home",
      explore: "Explore",
      login: "Log in",
      register: "Create account",
      exploreTours: "Explore tours",
      hello: "Hello",
      administrator: "Administrator",
      operator: "Operator",
      tourist: "Tourist",
      logout: "Log out",
      logoutTitle: "Log out?",
      logoutText:
        "Your current session will be closed on this device.",
      logoutConfirm: "Log out",
      cancel: "Cancel",
      logoutSuccess: "Logged out",
      logoutSuccessText:
        "You have been logged out successfully.",
      brandLabel: "PuraVida Trips - Home",
    },

    accessibility: {
      open: "Open accessibility options",
      close: "Close accessibility options",
      title: "Accessibility",
      personalization: "PERSONALIZATION",

      theme: "Theme",
      light: "Light",
      dark: "Dark",

      contrast: "Contrast",
      normal: "Normal",
      high: "High",

      fontSize: "Text size",
      fontNormal: "A",
      fontLarge: "A+",
      fontXLarge: "A++",
      fontHelp:
        "Adjust the general content size.",

      colorBlind: "Color blindness mode",
      none: "None",
      protanopia: "Protanopia",
      deuteranopia: "Deuteranopia",
      tritanopia: "Tritanopia",
      colorBlindHelp:
        "Improves visual color differentiation.",

      speech: "Text to speech",
      speechEnable: "Enable text to speech",
      speechEnabled: "Text to speech enabled",
      speechUnavailable:
        "Text to speech is not available in this browser.",
      speechReading:
        "Reading the selected element...",
      speechHelp:
        "Reads the text under the cursor or the element focused with the keyboard.",
      speechStop: "Stop reading",

      voice: "Voice",
      voiceAuto: "Automatic",
      currentVoice: "Current voice",

      reset: "Reset preferences",
    },

    home: {
      eyebrow:
        "COSTA RICA · EXPERIENCES · PURA VIDA",
      title: "Discover Costa Rica",
      titleAccent: " your way.",
      description:
        "Find, compare and book tours and travel experiences designed to help you enjoy Costa Rica.",

      exploreEyebrow: "EXPLORE",
      exploreTitle:
        "Find your next experience",
      exploreDescription:
        "Explore different ways to discover and enjoy Costa Rica.",

      categories: {
        nature: {
          title: "Nature",
          description:
            "Forests, volcanoes and unique landscapes.",
        },
        adventure: {
          title: "Adventure",
          description:
            "Experiences for those looking for adrenaline.",
        },
        beach: {
          title: "Beach",
          description:
            "Discover Costa Rica's coasts and beaches.",
        },
        culture: {
          title: "Culture",
          description:
            "Discover local history and culture.",
        },
      },

      featuredEyebrow:
        "FEATURED EXPERIENCES",
      featuredTitle: "Experience something different",
      featuredDescription:
        "Discover some of the experiences you can find on PuraVida Trips.",
      allTours: "View all tours",

      adventureEyebrow: "YOUR NEXT ADVENTURE",
      adventureTitle:
        "Costa Rica has an experience waiting for you.",
      adventureDescription:
        "Explore new places, support local experiences and create memories that last forever.",
      exploreExperiences:
        "Explore experiences",

      ctaEyebrow: "PURAVIDA TRIPS",
      ctaTitle:
        "Your next adventure starts here.",
      ctaDescription:
        "Explore travel experiences in Costa Rica and find one that suits you.",
      startExploring: "Start exploring",
    },

    search: {
      label: "What do you want to explore?",
      placeholder:
        "E.g. adventure, beach, nature...",
      button: "Search",
    },

    category: {
      explore: "Explore",
    },

    marketplace: {
      eyebrow: "Explore Costa Rica",
      title: "Find your next experience",
      description:
        "Discover tours and travel experiences to enjoy Costa Rica.",

      filterEyebrow: "Filter",
      filterTitle: "Find what you're looking for",
      clear: "Clear",

      search: "Search",
      searchPlaceholder: "E.g. adventure, beach...",

      category: "Category",
      allCategories: "All categories",

      location: "Location",
      allLocations: "All locations",

      maxPrice: "Maximum price",
      pricePlaceholder: "E.g. 50000",

      sort: "Sort by",
      recommended: "Recommended",
      priceAsc: "Price: low to high",
      priceDesc: "Price: high to low",
      nameAsc: "Name: A-Z",
      nameDesc: "Name: Z-A",

      results: "experiences",
      available: "Available experiences",

      loading: "Loading travel experiences...",
      error:
        "The travel experiences could not be loaded.",
      empty:
        "We couldn't find experiences matching your filters.",
      clearFilters:
        "Try clearing the filters to see all experiences.",

      comparison: "comparison",
      selected: "selected",

      compareLimitTitle:
        "Comparison limit",
      compareLimitText:
        "You can only compare up to 3 experiences at a time.",
      understood: "Got it",
    },

    tour: {
      details: "View details",
      compare: "Compare",
      comparing: "Comparing",
      removeFromComparison:
        "Remove from comparison",
      addToComparison:
        "Add to comparison",

      operatedBy: "Operated by",
      from: "From",
      perPerson: "per person",

      duration: "Duration",
      capacity: "Capacity",
      operator: "Operator",

      backToCatalog: "Back to catalog",
      maps: "View location on Google Maps",
      keepExploring: "Keep exploring",

      includes: "Includes",
      featuresTitle:
        "Experience features",

      destination: "Destination information",
      currentWeather: "Current weather",
      checkingWeather: "Checking weather...",
      currentConditions:
        "Current conditions in",
      weatherError:
        "The weather could not be checked at this time.",

      location: "Location",
      where: "Where does it take place?",
      mapDescription:
        "Check the approximate tour area and open Google Maps to explore the destination.",

      loading: "Loading tour information...",
      notFound: "Tour not found",
      notFoundDescription:
        "We couldn't find the experience you're looking for.",

      characteristics: "Features",
      description: "Description",
      price: "Price",
    },

    comparison: {
      eyebrow: "Comparison",
      title: "Compare your experiences",
      description:
        "Review each tour's features before choosing your experience.",
      location: "Location",
      price: "Price",
      duration: "Duration",
      capacity: "Capacity",
      operator: "Operator",
      descriptionLabel: "Description",
      features: "Features",
      details: "View tour details",
      clear: "Clear comparison",
      continue: "Keep exploring",
      selected: "experiences selected",
      close: "Close comparison",
    },

    footer: {
      description:
        "Discover Costa Rica, compare experiences and find your next adventure.",
      explore: "Explore",
      tours: "Tours",
      adventure: "Adventure",
      nature: "Nature",
      beach: "Beach",
      account: "Account",
      login: "Log in",
      register: "Register",
      brand: "PuraVida Trips",
      country: "Costa Rica",
      slogan: "Experiences that connect",
      rights: "All rights reserved.",
    },

    auth: {
      brand: "PURAVIDA TRIPS",

      loginTitle: "Log in",
      loginDescription:
        "Access your account to continue exploring experiences.",
      email: "Email",
      password: "Password",
      emailPlaceholder: "email@example.com",
      passwordPlaceholder: "Enter your password",
      loginButton: "Log in",
      loggingIn: "Logging in...",

      noAccount: "Don't have an account?",
      createAccount: "Create an account",

      demoTitle: "Demo users",

      invalidEmail:
        "Enter a valid email address.",
      emailRequired: "Enter your email address.",
      passwordRequired: "Enter your password.",

      invalidCredentialsTitle:
        "Unable to log in",
      invalidCredentials:
        "The email or password is incorrect.",

      serverErrorTitle: "Connection error",
      serverError:
        "Could not connect to the server.",

      registerTitle: "Create account",
      registerDescription:
        "Sign up to start discovering new experiences.",

      name: "Full name",
      namePlaceholder: "Your name",
      passwordMinPlaceholder:
        "Minimum 6 characters",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder:
        "Repeat your password",

      createButton: "Create account",
      creatingAccount: "Creating account...",

      alreadyAccount: "Already have an account?",
      accountLogin: "Log in",

      nameRequired: "Enter your name.",
      nameMin:
        "Your name must contain at least 2 characters.",
      passwordMin:
        "Your password must contain at least 6 characters.",
      confirmRequired:
        "Confirm your password.",
      passwordsMismatch:
        "Passwords do not match.",
      existingEmail:
        "An account with this email already exists.",

      accountCreated: "Account created",
      accountCreatedText:
        "Your PuraVida Trips account was created successfully.",

      registerErrorTitle:
        "Unable to create account",
      registerError:
        "There was a problem communicating with the server.",

      accept: "Accept",
    },

    role: {
      touristTitle: "Tourist dashboard",
      touristDescription:
        "Here you will be able to manage your favorites, bookings and profile.",

      operatorTitle: "Operator dashboard",
      operatorDescription:
        "Here you will be able to manage your tours, availability and bookings.",

      adminTitle: "Admin dashboard",
      adminDescription:
        "Here you will be able to manage operators, tours, categories and platform content.",

      greeting: "Hello",
      underConstruction: "Module under construction",
      moduleDescription:
        "This space will be replaced by the corresponding dashboard during the following stages of the project.",
      backHome: "Back to home",
    },

    notFound: {
      title: "Page not found",
      description:
        "The page you are looking for does not exist.",
      back: "Back to home",
    },
  },
};

const tourTranslations = {
  en: {
    "1": {
      nombre: "Arenal Volcano Hiking Tour",
      categoria: "Nature",
      ubicacion: "Alajuela",
      duracion: "6 hours",
      personas: "2 - 10 people",
      descripcion:
        "Explore the trails near Arenal Volcano and enjoy the area's natural landscapes.",
      caracteristicas: [
        "Guide included",
        "Transportation",
        "Lunch",
      ],
    },

    "2": {
      nombre: "Monteverde Canopy & Adventure",
      categoria: "Adventure",
      ubicacion: "Puntarenas",
      duracion: "4 hours",
      personas: "1 - 8 people",
      descripcion:
        "Enjoy an adventure through the treetops of Monteverde.",
      caracteristicas: [
        "Equipment included",
        "Guide included",
        "Insurance",
      ],
    },

    "3": {
      nombre: "Sunset at Tamarindo Beach",
      categoria: "Beach",
      ubicacion: "Guanacaste",
      duracion: "3 hours",
      personas: "2 - 12 people",
      descripcion:
        "Enjoy an afternoon by the ocean and watch the sunset from Tamarindo Beach.",
      caracteristicas: [
        "Drinks",
        "Guide included",
        "Photography",
      ],
    },

    "4": {
      nombre: "San José Cultural Tour",
      categoria: "Culture",
      ubicacion: "San José",
      duracion: "3 hours",
      personas: "2 - 15 people",
      descripcion:
        "Discover some of San José's main historical and cultural landmarks.",
      caracteristicas: [
        "Local guide",
        "Historical tour",
        "Admission included",
      ],
    },

    "5": {
      nombre: "Pacuare River Rafting",
      categoria: "Adventure",
      ubicacion: "Limón",
      duracion: "8 hours",
      personas: "2 - 8 people",
      descripcion:
        "Navigate the rapids of the Pacuare River in an experience full of adrenaline and nature.",
      caracteristicas: [
        "Equipment included",
        "Certified guide",
        "Lunch",
      ],
    },

    "6": {
      nombre: "Manuel Antonio National Park",
      categoria: "Nature",
      ubicacion: "Puntarenas",
      duracion: "5 hours",
      personas: "2 - 12 people",
      descripcion:
        "Discover the biodiversity of Manuel Antonio National Park with a local guide.",
      caracteristicas: [
        "Guide included",
        "Admission included",
        "Wildlife observation",
      ],
    },

    "7": {
      nombre: "La Fortuna Hot Springs",
      categoria: "Nature",
      ubicacion: "Alajuela",
      duracion: "6 hours",
      personas: "1 - 10 people",
      descripcion:
        "Relax in hot springs surrounded by nature in the La Fortuna area.",
      caracteristicas: [
        "Admission included",
        "Dinner",
        "Transportation",
      ],
    },

    "8": {
      nombre: "Snorkeling at Tortuga Island",
      categoria: "Beach",
      ubicacion: "Puntarenas",
      duracion: "7 hours",
      personas: "2 - 15 people",
      descripcion:
        "Sail to Tortuga Island and discover marine life during a snorkeling experience.",
      caracteristicas: [
        "Equipment included",
        "Lunch",
        "Boat transportation",
      ],
    },
  },
};

function getNestedValue(object, path) {
  return path
    .split(".")
    .reduce(
      (current, key) =>
        current?.[key],
      object
    );
}

function LanguageProvider({ children }) {
  const [language, setLanguage] =
    useState(() => {
      try {
        return (
          localStorage.getItem(
            LANGUAGE_STORAGE_KEY
          ) || defaultLanguage
        );
      } catch {
        return defaultLanguage;
      }
    });

  useEffect(() => {
    localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language
    );

    document.documentElement.lang =
      language === "en" ? "en" : "es";

    document.title =
      language === "en"
        ? "PuraVida Trips | Costa Rica Tours"
        : "PuraVida Trips | Tours en Costa Rica";
  }, [language]);

  const changeLanguage = useCallback(
    (nextLanguage) => {
      if (
        nextLanguage !== "es" &&
        nextLanguage !== "en"
      ) {
        return;
      }

      setLanguage(nextLanguage);
    },
    []
  );

  const t = useCallback(
    (key) => {
      return (
        getNestedValue(
          translations[language],
          key
        ) || key
      );
    },
    [language]
  );

  const getTour = useCallback(
    (tour) => {
      if (!tour) {
        return tour;
      }

      const translation =
        tourTranslations[language]?.[
          String(tour.id)
        ];

      if (!translation) {
        return tour;
      }

      return {
        ...tour,
        ...translation,
      };
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      changeLanguage,
      t,
      getTour,
    }),
    [language, changeLanguage, t, getTour]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage debe utilizarse dentro de LanguageProvider"
    );
  }

  return context;
}

export default LanguageProvider;