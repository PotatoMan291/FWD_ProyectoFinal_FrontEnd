import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useAccessibility } from "../context/AccessibilityContext";

import Icon from "./Icon";

function AccessibilityPanel() {
  const {
    preferences,
    isSpeaking,
    updatePreference,
    resetPreferences,
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

    const firstFocusableElement =
      panelRef.current?.querySelector(
        "button, select"
      );

    firstFocusableElement?.focus();
  }, [isOpen]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

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
        title="Accesibilidad"
        onClick={() =>
          setIsOpen((current) => !current)
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
              <Icon
                name="close"
                size={18}
              />
            </button>
          </div>

          <div className="accessibility-options">
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

                  Oscuro
                </button>
              </div>
            </fieldset>

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
                    updatePreference(
                      "contrast",
                      "normal"
                    )
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
                    updatePreference(
                      "contrast",
                      "high"
                    )
                  }
                >
                  Alto
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>Tamaño del texto</legend>

              <div className="accessibility-option-grid accessibility-font-options">
                {[
                  ["normal", "A"],
                  ["large", "A+"],
                  ["x-large", "A++"],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={
                      preferences.fontSize === value
                        ? "accessibility-option active"
                        : "accessibility-option"
                    }
                    aria-pressed={
                      preferences.fontSize === value
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
                ))}
              </div>

              <p className="accessibility-help">
                Ajusta el tamaño general del contenido.
              </p>
            </fieldset>

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
                Simula diferentes formas de percepción
                del color sin modificar el resto de las
                preferencias.
              </p>
            </fieldset>

            <fieldset>
              <legend>Texto a voz</legend>

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
                onClick={toggleSpeech}
              >
                <Icon
                  name="volume"
                  size={17}
                />

                {preferences.speechEnabled
                  ? "Texto a voz activado"
                  : "Activar texto a voz"}
              </button>

              <p
                className="accessibility-help"
                aria-live="polite"
              >
                {isSpeaking
                  ? "Leyendo el elemento seleccionado..."
                  : "Al activarlo, lee el texto bajo el cursor o el elemento enfocado con el teclado."}
              </p>

              {isSpeaking && (
                <button
                  type="button"
                  className="accessibility-speech-button"
                  onClick={stopSpeech}
                >
                  Detener lectura
                </button>
              )}
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