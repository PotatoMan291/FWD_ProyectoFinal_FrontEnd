import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AccessibilityContext = createContext();

const ACCESSIBILITY_STORAGE_KEY = "puravida_accessibility";

const defaultPreferences = {
  theme: "light",
  contrast: "normal",
  fontSize: "normal",
  colorBlindMode: "none",
  speechEnabled: false,
};

function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const savedPreferences = localStorage.getItem(
        ACCESSIBILITY_STORAGE_KEY
      );

      if (savedPreferences) {
        return {
          ...defaultPreferences,
          ...JSON.parse(savedPreferences),
        };
      }
    } catch (error) {
      console.error(
        "Error al cargar las preferencias de accesibilidad:",
        error
      );
    }

    return defaultPreferences;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEY,
      JSON.stringify(preferences)
    );
  }, [preferences]);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = preferences.theme;
    root.dataset.contrast = preferences.contrast;
    root.dataset.fontSize = preferences.fontSize;
    root.dataset.colorBlind = preferences.colorBlindMode;
  }, [preferences]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const updatePreference = (key, value) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: value,
    }));
  };

  const resetPreferences = () => {
    stopSpeech();

    setPreferences(defaultPreferences);
  };

  const speak = (text) => {
    if (
      !preferences.speechEnabled ||
      !("speechSynthesis" in window) ||
      !text?.trim()
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "es-CR";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);

    window.speechSynthesis.speak(utterance);
  };

  const speakPageContent = () => {
    const mainContent = document.querySelector("main");

    if (!mainContent) {
      return;
    }

    const text = mainContent.innerText
      .replace(/\s+/g, " ")
      .trim();

    if (!text) {
      return;
    }

    speak(text);
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    updatePreference(
      "speechEnabled",
      !preferences.speechEnabled
    );

    if (preferences.speechEnabled) {
      stopSpeech();
    }
  };

  const value = useMemo(
    () => ({
      preferences,
      isSpeaking,
      updatePreference,
      resetPreferences,
      speak,
      speakPageContent,
      stopSpeech,
      toggleSpeech,
    }),
    [preferences, isSpeaking]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility debe utilizarse dentro de AccessibilityProvider"
    );
  }

  return context;
}

export default AccessibilityProvider;