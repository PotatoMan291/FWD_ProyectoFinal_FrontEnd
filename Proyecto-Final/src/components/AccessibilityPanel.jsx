import { useEffect, useRef, useState } from "react";
import { useAccessibility } from "../context/AccessibilityContext";

function AccessibilityPanel() {
  const {
    preferences,
    isSpeaking,
    updatePreference,
    resetPreferences,
    speakPageContent,
    stopSpeech,
    toggleSpeech,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  const panelRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const firstFocusableElement =
        panelRef.current?.querySelector(
          "button, select"
        );

      firstFocusableElement?.focus();
    }
  }, [isOpen]);

  const handleTogglePanel = () => {
    setIsOpen((currentState) => !currentState);
  };

  return (
    <div
      className="accessibility-widget"
      ref={panelRef}
    >
      <button
        ref={toggleButtonRef}
        type="button"
        className="accessibility-toggle"
        aria-label="Abrir opciones de accesibilidad"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        onClick={handleTogglePanel}
      >
        <span aria-hidden="true">♿</span>

        <span>Accesibilidad</span>
      </button>

      {isOpen && (
        <section
          id="accessibility-panel"
          className="accessibility-panel"
          aria-label="Opciones de accesibilidad"
        >
          <div className="accessibility-panel-header">
            <div>
              <p className="accessibility-eyebrow">
                PERSONALIZACIÓN
              </p>

              <h2>Accesibilidad</h2>
            </div>

            <button
              type="button"
              className="accessibility-close"
              aria-label="Cerrar opciones de accesibilidad"
              onClick={() => {
                setIsOpen(false);
                toggleButtonRef.current?.focus();
              }}
            >
              ×
            </button>
          </div>

          <div className="accessibility-options">
            {/* Tema */}
            <fieldset>
              <legend>Tema</legend>

              <div className="accessibility-option-grid">
                <button
                  type="button"
                  className={
                    preferences.theme === "light"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.theme === "light"
                  }
                  onClick={() =>
                    updatePreference("theme", "light")
                  }
                >
                  <span aria-hidden="true">☀</span>
                  Claro
                </button>

                <button
                  type="button"
                  className={
                    preferences.theme === "dark"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.theme === "dark"
                  }
                  onClick={() =>
                    updatePreference("theme", "dark")
                  }
                >
                  <span aria-hidden="true">☾</span>
                  Oscuro
                </button>
              </div>
            </fieldset>

            {/* Contraste */}
            <fieldset>
              <legend>Contraste</legend>

              <div className="accessibility-option-grid">
                <button
                  type="button"
                  className={
                    preferences.contrast === "normal"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.contrast === "normal"
                  }
                  onClick={() =>
                    updatePreference("contrast", "normal")
                  }
                >
                  Normal
                </button>

                <button
                  type="button"
                  className={
                    preferences.contrast === "high"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.contrast === "high"
                  }
                  onClick={() =>
                    updatePreference("contrast", "high")
                  }
                >
                  Alto
                </button>
              </div>
            </fieldset>

            {/* Tamaño */}
            <fieldset>
              <legend>Tamaño del texto</legend>

              <div className="accessibility-option-grid accessibility-font-options">
                <button
                  type="button"
                  className={
                    preferences.fontSize === "normal"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.fontSize === "normal"
                  }
                  onClick={() =>
                    updatePreference(
                      "fontSize",
                      "normal"
                    )
                  }
                >
                  A
                </button>

                <button
                  type="button"
                  className={
                    preferences.fontSize === "large"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.fontSize === "large"
                  }
                  onClick={() =>
                    updatePreference(
                      "fontSize",
                      "large"
                    )
                  }
                >
                  A+
                </button>

                <button
                  type="button"
                  className={
                    preferences.fontSize === "x-large"
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  aria-pressed={
                    preferences.fontSize === "x-large"
                  }
                  onClick={() =>
                    updatePreference(
                      "fontSize",
                      "x-large"
                    )
                  }
                >
                  A++
                </button>
              </div>

              <p className="accessibility-help">
                Ajusta el tamaño general del contenido.
              </p>
            </fieldset>

            {/* Daltonismo */}
            <fieldset>
              <legend>Modo de daltonismo</legend>

              <select
                value={preferences.colorBlindMode}
                onChange={(event) =>
                  updatePreference(
                    "colorBlindMode",
                    event.target.value
                  )
                }
                aria-label="Seleccionar modo de daltonismo"
              >
                <option value="none">
                  Ninguno
                </option>

                <option value="protanopia">
                  Protanopia
                </option>

                <option value="deuteranopia">
                  Deuteranopia
                </option>

                <option value="tritanopia">
                  Tritanopia
                </option>
              </select>

              <p className="accessibility-help">
                Ajusta la percepción de colores de la interfaz.
              </p>
            </fieldset>

            {/* Texto a voz */}
            <fieldset>
              <legend>Texto a voz</legend>

              <button
                type="button"
                className={
                  preferences.speechEnabled
                    ? "accessibility-option active"
                    : "accessibility-option"
                }
                aria-pressed={preferences.speechEnabled}
                onClick={toggleSpeech}
              >
                <span aria-hidden="true">
                  🔊
                </span>

                {preferences.speechEnabled
                  ? "Texto a voz activado"
                  : "Activar texto a voz"}
              </button>

              <div className="accessibility-speech-actions">
                <button
                  type="button"
                  className="accessibility-speech-button"
                  disabled={
                    !preferences.speechEnabled
                  }
                  onClick={speakPageContent}
                >
                  Leer página
                </button>

                <button
                  type="button"
                  className="accessibility-speech-button"
                  disabled={!isSpeaking}
                  onClick={stopSpeech}
                >
                  Detener
                </button>
              </div>

              <p
                className="accessibility-help"
                aria-live="polite"
              >
                {isSpeaking
                  ? "La página se está leyendo."
                  : "Puedes escuchar el contenido principal de la página."}
              </p>
            </fieldset>
          </div>

          <button
            type="button"
            className="accessibility-reset"
            onClick={resetPreferences}
          >
            Restablecer preferencias
          </button>
        </section>
      )}
    </div>
  );
}

export default AccessibilityPanel;