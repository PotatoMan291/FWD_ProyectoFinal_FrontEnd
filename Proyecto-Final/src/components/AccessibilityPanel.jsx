import { useEffect, useMemo, useRef, useState } from "react";
import { useAccessibility } from "../context/AccessibilityContext";
import { useLanguage } from "../context/LanguageContext";
import Icon from "./Icon";

function AccessibilityPanel() {
  const { language, setLanguage, t } = useLanguage();
  const { preferences, voices, isSpeaking, updatePreference, resetPreferences, stopSpeech, toggleSpeech } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const availableVoices = useMemo(() => voices.filter((voice) => voice.lang?.toLowerCase().startsWith(language === "en" ? "en" : "es")), [voices, language]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape" && isOpen) { setIsOpen(false); toggleRef.current?.focus(); } };
    document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);
  useEffect(() => {
    const onOutside = (event) => { if (isOpen && panelRef.current && !panelRef.current.contains(event.target)) setIsOpen(false); };
    document.addEventListener("mousedown", onOutside); return () => document.removeEventListener("mousedown", onOutside);
  }, [isOpen]);

  return (
    <div className="accessibility-widget" ref={panelRef} data-no-speech>
      <button ref={toggleRef} type="button" className="accessibility-toggle" aria-label={t("accessibility.title")} aria-expanded={isOpen} aria-controls="accessibility-panel" title={t("accessibility.title")} onClick={() => setIsOpen((value) => !value)}>
        <Icon name="accessibility" size={21} />
      </button>
      {isOpen && (
        <section id="accessibility-panel" className="accessibility-panel" aria-label={t("accessibility.title")}>
          <div className="accessibility-panel-header"><div><p className="accessibility-eyebrow">{t("accessibility.personalization")}</p><h2>{t("accessibility.title")}</h2></div><button type="button" className="accessibility-close" onClick={() => { setIsOpen(false); toggleRef.current?.focus(); }} aria-label="Close"><Icon name="close" size={18} /></button></div>
          <div className="accessibility-options">
            <fieldset><legend>{t("language")}</legend><select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="es">{t("spanish")}</option><option value="en">{t("english")}</option></select><p className="accessibility-help">{t("accessibility.languageHelp")}</p></fieldset>
            <fieldset><legend>{t("accessibility.theme")}</legend><div className="accessibility-option-grid"><button type="button" className={`accessibility-option ${preferences.theme === "light" ? "active" : ""}`} aria-pressed={preferences.theme === "light"} onClick={() => updatePreference("theme", "light")}><Icon name="sun" size={17} />{t("accessibility.light")}</button><button type="button" className={`accessibility-option ${preferences.theme === "dark" ? "active" : ""}`} aria-pressed={preferences.theme === "dark"} onClick={() => updatePreference("theme", "dark")}><Icon name="moon" size={17} />{t("accessibility.dark")}</button></div></fieldset>
            <fieldset><legend>{t("accessibility.contrast")}</legend><div className="accessibility-option-grid"><button type="button" className={`accessibility-option ${preferences.contrast === "normal" ? "active" : ""}`} onClick={() => updatePreference("contrast", "normal")}>{t("accessibility.normal")}</button><button type="button" className={`accessibility-option ${preferences.contrast === "high" ? "active" : ""}`} onClick={() => updatePreference("contrast", "high")}>{t("accessibility.high")}</button></div></fieldset>
            <fieldset><legend>{t("accessibility.fontSize")}</legend><select value={preferences.fontSize} onChange={(event) => updatePreference("fontSize", event.target.value)}><option value="normal">{t("accessibility.fontNormal")}</option><option value="large">{t("accessibility.fontLarge")}</option><option value="x-large">{t("accessibility.fontXLarge")}</option></select></fieldset>
            <fieldset><legend>{t("accessibility.colorBlind")}</legend><select value={preferences.colorBlindMode} onChange={(event) => updatePreference("colorBlindMode", event.target.value)}><option value="none">{t("accessibility.none")}</option><option value="protanopia">{t("accessibility.protanopia")}</option><option value="deuteranopia">{t("accessibility.deuteranopia")}</option><option value="tritanopia">{t("accessibility.tritanopia")}</option></select></fieldset>
            <fieldset><legend>{t("accessibility.speech")}</legend><button type="button" className={`accessibility-option ${preferences.speechEnabled ? "active" : ""}`} aria-pressed={preferences.speechEnabled} onClick={toggleSpeech}>{preferences.speechEnabled ? t("accessibility.speechOn") : t("accessibility.speechOff")}</button>{availableVoices.length > 0 && <select value={preferences.voiceName} onChange={(event) => updatePreference("voiceName", event.target.value)} aria-label="Voice"><option value="">Default voice</option>{availableVoices.map((voice) => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.name} ({voice.lang})</option>)}</select>}<button type="button" className="accessibility-option" onClick={stopSpeech} disabled={!isSpeaking}>{t("accessibility.stop")}</button><p className="accessibility-help">{t("accessibility.speechHelp")}</p></fieldset>
            <button type="button" className="accessibility-reset" onClick={resetPreferences}>{t("accessibility.reset")}</button>
          </div>
        </section>
      )}
    </div>
  );
}
export default AccessibilityPanel;
