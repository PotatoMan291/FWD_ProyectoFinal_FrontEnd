import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AccessibilityContext =
  createContext();

const ACCESSIBILITY_STORAGE_KEY =
  "puravida_accessibility";

const defaultPreferences = {
  theme: "light",
  contrast: "normal",
  fontSize: "normal",
  colorBlindMode: "none",
  speechEnabled: false,
};

function getPreferredSpanishVoice(voices) {
  if (!voices.length) {
    return null;
  }

  const spanishVoices = voices.filter(
    (voice) =>
      voice.lang
        ?.toLowerCase()
        .startsWith("es")
  );

  return (
    spanishVoices.find((voice) =>
      voice.name
        .toLowerCase()
        .includes("google")
    ) ||
    spanishVoices.find((voice) =>
      voice.lang
        .toLowerCase()
        .includes("es-cr")
    ) ||
    spanishVoices.find((voice) =>
      voice.lang
        .toLowerCase()
        .includes("es-mx")
    ) ||
    spanishVoices.find((voice) =>
      voice.lang
        .toLowerCase()
        .includes("es-es")
    ) ||
    spanishVoices[0] ||
    voices[0]
  );
}

function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] =
    useState(() => {
      try {
        const savedPreferences =
          localStorage.getItem(
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

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [voices, setVoices] =
    useState([]);

  useEffect(() => {
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEY,
      JSON.stringify(preferences)
    );
  }, [preferences]);

  useEffect(() => {
    const root =
      document.documentElement;

    root.dataset.theme =
      preferences.theme;

    root.dataset.contrast =
      preferences.contrast;

    root.dataset.fontSize =
      preferences.fontSize;

    root.dataset.colorBlind =
      preferences.colorBlindMode;
  }, [preferences]);

  useEffect(() => {
    if (
      !("speechSynthesis" in window)
    ) {
      return undefined;
    }

    const loadVoices = () => {
      setVoices(
        window.speechSynthesis.getVoices()
      );
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );
    };
  }, []);

  const updatePreference = useCallback(
    (key, value) => {
      setPreferences(
        (currentPreferences) => ({
          ...currentPreferences,
          [key]: value,
        })
      );
    },
    []
  );

  const stopSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text) => {
      if (
        !preferences.speechEnabled ||
        !("speechSynthesis" in window) ||
        !text?.trim()
      ) {
        return;
      }

      const cleanText = text
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 320);

      if (!cleanText) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          cleanText
        );

      const preferredVoice =
        getPreferredSpanishVoice(
          voices
        );

      utterance.lang =
        preferredVoice?.lang ||
        "es-CR";

      utterance.voice =
        preferredVoice || null;

      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () =>
        setIsSpeaking(true);

      utterance.onend = () =>
        setIsSpeaking(false);

      utterance.onerror = () =>
        setIsSpeaking(false);

      window.speechSynthesis.speak(
        utterance
      );
    },
    [
      preferences.speechEnabled,
      voices,
    ]
  );

  useEffect(() => {
    if (
      !preferences.speechEnabled ||
      !("speechSynthesis" in window)
    ) {
      return undefined;
    }

    let hoverTimer;
    let lastElement = null;

    const getSpeakableElement = (
      target
    ) => {
      if (
        !(target instanceof Element)
      ) {
        return null;
      }

      return target.closest(
        '[data-speak], h1, h2, h3, h4, p, a, button, label, legend, li'
      );
    };

    const getText = (element) => {
      if (!element) {
        return "";
      }

      return (
        element.getAttribute(
          "aria-label"
        ) ||
        element.innerText ||
        element.textContent ||
        ""
      );
    };

    const handlePointerOver = (
      event
    ) => {
      const element =
        getSpeakableElement(
          event.target
        );

      if (
        !element ||
        element.closest(
          ".accessibility-widget"
        )
      ) {
        return;
      }

      if (
        event.relatedTarget instanceof
          Node &&
        element.contains(
          event.relatedTarget
        )
      ) {
        return;
      }

      if (
        element === lastElement
      ) {
        return;
      }

      lastElement = element;

      clearTimeout(hoverTimer);

      hoverTimer =
        window.setTimeout(() => {
          speak(getText(element));
        }, 450);
    };

    const handleFocusIn = (
      event
    ) => {
      const element =
        getSpeakableElement(
          event.target
        );

      if (
        !element ||
        element.closest(
          ".accessibility-widget"
        )
      ) {
        return;
      }

      lastElement = element;

      speak(getText(element));
    };

    document.addEventListener(
      "pointerover",
      handlePointerOver
    );

    document.addEventListener(
      "focusin",
      handleFocusIn
    );

    return () => {
      clearTimeout(hoverTimer);

      document.removeEventListener(
        "pointerover",
        handlePointerOver
      );

      document.removeEventListener(
        "focusin",
        handleFocusIn
      );
    };
  }, [
    preferences.speechEnabled,
    speak,
  ]);

  const resetPreferences =
    useCallback(() => {
      stopSpeech();
      setPreferences(
        defaultPreferences
      );
    }, [stopSpeech]);

  const toggleSpeech =
    useCallback(() => {
      setPreferences(
        (currentPreferences) => ({
          ...currentPreferences,
          speechEnabled:
            !currentPreferences.speechEnabled,
        })
      );
    }, []);

  useEffect(() => {
    if (!preferences.speechEnabled) {
      stopSpeech();
    }
  }, [
    preferences.speechEnabled,
    stopSpeech,
  ]);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  const value = useMemo(
    () => ({
      preferences,
      isSpeaking,
      updatePreference,
      resetPreferences,
      speak,
      stopSpeech,
      toggleSpeech,
    }),
    [
      preferences,
      isSpeaking,
      updatePreference,
      resetPreferences,
      speak,
      stopSpeech,
      toggleSpeech,
    ]
  );

  return (
    <AccessibilityContext.Provider
      value={value}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context =
    useContext(
      AccessibilityContext
    );

  if (!context) {
    throw new Error(
      "useAccessibility debe utilizarse dentro de AccessibilityProvider"
    );
  }

  return context;
}

export default AccessibilityProvider;