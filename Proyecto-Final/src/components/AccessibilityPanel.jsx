import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAccessibility,
} from "../context/AccessibilityContext";

import {
  useLanguage,
} from "../context/LanguageContext";

import Icon from "./Icon";

function AccessibilityPanel() {
  const {
    preferences,
    voices,
    isSpeaking,
    speechSupported,
    updatePreference,
    resetPreferences,
    stopSpeech,
    toggleSpeech,
  } = useAccessibility();

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();

  const [isOpen, setIsOpen] =
    useState(false);

  const panelRef = useRef(null);
  const toggleButtonRef =
    useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        isOpen
      ) {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const firstFocusable =
      panelRef.current?.querySelector(
        "button, select"
      );

    firstFocusable?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick =
      (event) => {
        if (
          isOpen &&
          panelRef.current &&
          !panelRef.current.contains(
            event.target
          )
        ) {
          setIsOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [isOpen]);

  const speechVoices =
    voices.filter((voice) =>
      voice.lang
        ?.toLowerCase()
        .startsWith(
          language === "en"
            ? "en"
            : "es"
        )
    );

  return (
    <div
      className="accessibility-widget"
      ref={panelRef}
    >
      <button
        ref={toggleButtonRef}
        type="button"
        className="accessibility-toggle"
        aria-label={t(
          "accessibility.open"
        )}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        title={t(
          "accessibility.title"
        )}
        onClick={() =>
          setIsOpen(
            (current) => !current
          )
        }
      >
        <Icon
          name="accessibility"
          size={21}
        />
      </button>

      {isOpen && (
        <section
          id="accessibility-panel"
          className="accessibility-panel"
          aria-label={t(
            "accessibility.title"
          )}
        >
          <div className="accessibility-panel-header">
            <div>
              <p className="accessibility-eyebrow">
                {t(
                  "accessibility.personalization"
                )}
              </p>

              <h2>
                {t(
                  "accessibility.title"
                )}
              </h2>
            </div>

            <button
              type="button"
              className="accessibility-close"
              aria-label={t(
                "accessibility.close"
              )}
              onClick={() => {
                setIsOpen(false);
                toggleButtonRef.current?.focus();
              }}
            >
              <Icon
                name="close"
                size={18}
              />
            </button>
          </div>

          <div className="accessibility-options">
            <fieldset>
              <legend>
                {t("language.label")}
              </legend>

              <div className="accessibility-option-grid">
                <button
                  type="button"
                  className={
                    language === "es"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    language === "es"
                  }
                  onClick={() =>
                    changeLanguage("es")
                  }
                >
                  ES ·{" "}
                  {t(
                    "language.spanish"
                  )}
                </button>

                <button
                  type="button"
                  className={
                    language === "en"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    language === "en"
                  }
                  onClick={() =>
                    changeLanguage("en")
                  }
                >
                  EN ·{" "}
                  {t(
                    "language.english"
                  )}
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>
                {t("accessibility.theme")}
              </legend>

              <div className="accessibility-option-grid">
                <button
                  type="button"
                  className={
                    preferences.theme ===
                    "light"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.theme ===
                    "light"
                  }
                  onClick={() =>
                    updatePreference(
                      "theme",
                      "light"
                    )
                  }
                >
                  <Icon
                    name="sun"
                    size={17}
                  />

                  {t(
                    "accessibility.light"
                  )}
                </button>

                <button
                  type="button"
                  className={
                    preferences.theme ===
                    "dark"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.theme ===
                    "dark"
                  }
                  onClick={() =>
                    updatePreference(
                      "theme",
                      "dark"
                    )
                  }
                >
                  <Icon
                    name="moon"
                    size={17}
                  />

                  {t(
                    "accessibility.dark"
                  )}
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>
                {t(
                  "accessibility.contrast"
                )}
              </legend>

              <div className="accessibility-option-grid">
                <button
                  type="button"
                  className={
                    preferences.contrast ===
                    "normal"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.contrast ===
                    "normal"
                  }
                  onClick={() =>
                    updatePreference(
                      "contrast",
                      "normal"
                    )
                  }
                >
                  {t(
                    "accessibility.normal"
                  )}
                </button>

                <button
                  type="button"
                  className={
                    preferences.contrast ===
                    "high"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.contrast ===
                    "high"
                  }
                  onClick={() =>
                    updatePreference(
                      "contrast",
                      "high"
                    )
                  }
                >
                  {t(
                    "accessibility.high"
                  )}
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>
                {t(
                  "accessibility.fontSize"
                )}
              </legend>

              <div className="accessibility-option-grid accessibility-font-options">
                {[
                  [
                    "normal",
                    t(
                      "accessibility.fontNormal"
                    ),
                  ],
                  [
                    "large",
                    t(
                      "accessibility.fontLarge"
                    ),
                  ],
                  [
                    "x-large",
                    t(
                      "accessibility.fontXLarge"
                    ),
                  ],
                ].map(
                  ([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      className={
                        preferences.fontSize ===
                        value
                          ? "accessibility-option active"
                          : "accessibility-option"
                      }
                      aria-pressed={
                        preferences.fontSize ===
                        value
                      }
                      onClick={() =>
                        updatePreference(
                          "fontSize",
                          value
                        )
                      }
                    >
                      {label}
                    </button>
                  )
                )}
              </div>

              <p className="accessibility-help">
                {t(
                  "accessibility.fontHelp"
                )}
              </p>
            </fieldset>

            <fieldset>
              <legend>
                {t(
                  "accessibility.colorBlind"
                )}
              </legend>

              <select
                value={
                  preferences.colorBlindMode
                }
                onChange={(event) =>
                  updatePreference(
                    "colorBlindMode",
                    event.target.value
                  )
                }
                aria-label={t(
                  "accessibility.colorBlind"
                )}
              >
                <option value="none">
                  {t(
                    "accessibility.none"
                  )}
                </option>

                <option value="protanopia">
                  {t(
                    "accessibility.protanopia"
                  )}
                </option>

                <option value="deuteranopia">
                  {t(
                    "accessibility.deuteranopia"
                  )}
                </option>

                <option value="tritanopia">
                  {t(
                    "accessibility.tritanopia"
                  )}
                </option>
              </select>

              <p className="accessibility-help">
                {t(
                  "accessibility.colorBlindHelp"
                )}
              </p>
            </fieldset>

            <fieldset>
              <legend>
                {t(
                  "accessibility.speech"
                )}
              </legend>

              <button
                type="button"
                className={
                  preferences.speechEnabled
                    ? "accessibility-option active"
                    : "accessibility-option"
                }
                aria-pressed={
                  preferences.speechEnabled
                }
                disabled={!speechSupported}
                onClick={toggleSpeech}
              >
                <Icon
                  name="volume"
                  size={17}
                />

                {preferences.speechEnabled
                  ? t(
                      "accessibility.speechEnabled"
                    )
                  : t(
                      "accessibility.speechEnable"
                    )}
              </button>

              <p
                className="accessibility-help"
                aria-live="polite"
              >
                {!speechSupported
                  ? t(
                      "accessibility.speechUnavailable"
                    )
                  : isSpeaking
                  ? t(
                      "accessibility.speechReading"
                    )
                  : t(
                      "accessibility.speechHelp"
                    )}
              </p>

              {speechSupported &&
                speechVoices.length >
                  0 && (
                  <div className="accessibility-voice-selector">
                    <label htmlFor="speech-voice">
                      {t(
                        "accessibility.voice"
                      )}
                    </label>

                    <select
                      id="speech-voice"
                      value={
                        preferences.voiceName
                      }
                      onChange={(event) =>
                        updatePreference(
                          "voiceName",
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        {t(
                          "accessibility.voiceAuto"
                        )}
                      </option>

                      {speechVoices.map(
                        (voice) => (
                          <option
                            key={`${voice.name}-${voice.lang}`}
                            value={voice.name}
                          >
                            {voice.name} (
                            {voice.lang})
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

              {isSpeaking && (
                <button
                  type="button"
                  className="accessibility-speech-button"
                  onClick={stopSpeech}
                >
                  {t(
                    "accessibility.speechStop"
                  )}
                </button>
              )}
            </fieldset>
          </div>

          <button
            type="button"
            className="accessibility-reset"
            onClick={resetPreferences}
          >
            {t(
              "accessibility.reset"
            )}
          </button>
        </section>
      )}
    </div>
  );
}

export default AccessibilityPanel;