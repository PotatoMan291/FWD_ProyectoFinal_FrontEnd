import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLanguage } from "./LanguageContext";

const AccessibilityContext = createContext(null);

const ACCESSIBILITY_STORAGE_KEY =
  "puravida_accessibility";

const defaultPreferences = {
  theme: "light",
  contrast: "normal",
  fontSize: "normal",
  colorBlindMode: "none",
  speechEnabled: false,
  voiceName: "",
};

function getSpeechSupport() {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

function getVoiceScore(
  voice,
  language
) {
  const voiceLanguage =
    voice.lang?.toLowerCase() || "";

  const targetLanguage =
    language === "en"
      ? "en"
      : "es";

  let score = 0;

  if (
    voiceLanguage ===
    (targetLanguage === "en"
      ? "en-us"
      : "es-cr")
  ) {
    score += 100;
  }

  if (
    voiceLanguage.startsWith(
      targetLanguage
    )
  ) {
    score += 70;
  }

  if (
    voice.name
      ?.toLowerCase()
      .includes("google")
  ) {
    score += 20;
  }

  if (
    voice.name
      ?.toLowerCase()
      .includes("microsoft")
  ) {
    score += 15;
  }

  return score;
}

function findBestVoice(
  voices,
  language,
  selectedVoiceName
) {
  if (!voices.length) {
    return null;
  }

  if (selectedVoiceName) {
    const selected =
      voices.find(
        (voice) =>
          voice.name ===
          selectedVoiceName
      );

    if (selected) {
      return selected;
    }
  }

  return [...voices].sort(
    (a, b) =>
      getVoiceScore(
        b,
        language
      ) -
      getVoiceScore(
        a,
        language
      )
  )[0];
}

function AccessibilityProvider({
  children,
}) {
  const { language } =
    useLanguage();

  const [preferences, setPreferences] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            ACCESSIBILITY_STORAGE_KEY
          );

        if (saved) {
          return {
            ...defaultPreferences,
            ...JSON.parse(saved),
          };
        }
      } catch (error) {
        console.error(
          "No se pudieron cargar las preferencias:",
          error
        );
      }

      return defaultPreferences;
    });

  const [voices, setVoices] =
    useState([]);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const speechSupported =
    getSpeechSupport();

  useEffect(() => {
    try {
      localStorage.setItem(
        ACCESSIBILITY_STORAGE_KEY,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error(
        "No se pudieron guardar las preferencias:",
        error
      );
    }
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
    if (!speechSupported) {
      setVoices([]);
      return undefined;
    }

    const loadVoices = () => {
      const available =
        window.speechSynthesis
          .getVoices()
          .filter(
            (voice) =>
              voice?.name
          );

      setVoices(available);
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    const timer =
      window.setTimeout(
        loadVoices,
        500
      );

    return () => {
      window.clearTimeout(timer);

      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );
    };
  }, [speechSupported]);

  const updatePreference =
    useCallback(
      (key, value) => {
        setPreferences(
          (current) => ({
            ...current,
            [key]: value,
          })
        );
      },
      []
    );

  const stopSpeech =
    useCallback(() => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(false);
    }, [speechSupported]);

  const speak = useCallback(
    (text) => {
      if (
        !preferences.speechEnabled ||
        !speechSupported ||
        !text?.trim()
      ) {
        return;
      }

      const cleanText = text
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 500);

      if (!cleanText) {
        return;
      }

      const synth =
        window.speechSynthesis;

      synth.cancel();

      const voice =
        findBestVoice(
          voices,
          language,
          preferences.voiceName
        );

      const utterance =
        new SpeechSynthesisUtterance(
          cleanText
        );

      utterance.lang =
        voice?.lang ||
        (language === "en"
          ? "en-US"
          : "es-CR");

      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.92;
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

      try {
        synth.resume();
      } catch {
        // Algunos navegadores no requieren resume().
      }

      window.setTimeout(() => {
        try {
          synth.speak(utterance);
        } catch (error) {
          console.error(
            "No se pudo iniciar el texto a voz:",
            error
          );

          setIsSpeaking(false);
        }
      }, 50);
    },
    [
      language,
      preferences.speechEnabled,
      preferences.voiceName,
      speechSupported,
      voices,
    ]
  );

  useEffect(() => {
    if (
      !preferences.speechEnabled ||
      !speechSupported
    ) {
      return undefined;
    }

    let hoverTimer = null;
    let lastElement = null;

    const getSpeakableElement =
      (target) => {
        if (
          !(target instanceof Element)
        ) {
          return null;
        }

        return target.closest(
          [
            "[data-speak]",
            "h1",
            "h2",
            "h3",
            "h4",
            "p",
            "a",
            "button",
            "label",
            "legend",
            "li",
          ].join(", ")
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

    const shouldIgnore =
      (element) =>
        !element ||
        element.closest(
          ".accessibility-widget"
        ) ||
        element.matches(
          "input, textarea, select"
        );

    const handlePointerOver =
      (event) => {
        const element =
          getSpeakableElement(
            event.target
          );

        if (shouldIgnore(element)) {
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

        window.clearTimeout(
          hoverTimer
        );

        hoverTimer =
          window.setTimeout(() => {
            speak(
              getText(element)
            );
          }, 550);
      };

    const handleFocusIn = (
      event
    ) => {
      const element =
        getSpeakableElement(
          event.target
        );

      if (shouldIgnore(element)) {
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
      window.clearTimeout(
        hoverTimer
      );

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
    speechSupported,
    speak,
  ]);

  const toggleSpeech =
    useCallback(() => {
      if (!speechSupported) {
        return;
      }

      setPreferences(
        (current) => ({
          ...current,
          speechEnabled:
            !current.speechEnabled,
        })
      );
    }, [speechSupported]);

  const resetPreferences =
    useCallback(() => {
      stopSpeech();

      setPreferences(
        defaultPreferences
      );
    }, [stopSpeech]);

  useEffect(() => {
    if (!preferences.speechEnabled) {
      stopSpeech();
    }
  }, [
    preferences.speechEnabled,
    stopSpeech,
  ]);

  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  const value = useMemo(
    () => ({
      preferences,
      voices,
      isSpeaking,
      speechSupported,
      updatePreference,
      speak,
      stopSpeech,
      toggleSpeech,
      resetPreferences,
    }),
    [
      preferences,
      voices,
      isSpeaking,
      speechSupported,
      updatePreference,
      speak,
      stopSpeech,
      toggleSpeech,
      resetPreferences,
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