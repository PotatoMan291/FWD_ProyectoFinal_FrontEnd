import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "./LanguageContext";

const AccessibilityContext = createContext(null);
const STORAGE_KEY = "puravida_accessibility";
const defaults = { theme: "light", contrast: "normal", fontSize: "normal", colorBlindMode: "none", speechEnabled: false, voiceName: "" };

function chooseVoice(voices, language, preferredName) {
  const prefix = language === "en" ? "en" : "es";
  const matches = voices.filter((voice) => voice.lang?.toLowerCase().startsWith(prefix));
  return matches.find((voice) => voice.name === preferredName) || matches.find((voice) => voice.name.toLowerCase().includes("google")) || matches.find((voice) => voice.lang?.toLowerCase().includes(language === "en" ? "en-us" : "es-mx")) || matches[0] || voices[0] || null;
}

function splitText(text, max = 220) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return [normalized];
  const sentences = normalized.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length <= max) current = `${current} ${sentence}`.trim();
    else { if (current) chunks.push(current); current = sentence.slice(0, max); }
  }
  if (current) chunks.push(current);
  return chunks;
}

export function AccessibilityProvider({ children }) {
  const { language } = useLanguage();
  const [preferences, setPreferences] = useState(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
    catch { return defaults; }
  });
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const queueId = useRef(0);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)), [preferences]);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = preferences.theme;
    root.dataset.contrast = preferences.contrast;
    root.dataset.fontSize = preferences.fontSize;
    root.dataset.colorBlind = preferences.colorBlindMode;
  }, [preferences]);

  const loadVoices = useCallback(() => {
    if ("speechSynthesis" in window) setVoices(window.speechSynthesis.getVoices());
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return undefined;
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    const timer = window.setTimeout(loadVoices, 500);
    return () => { window.clearTimeout(timer); window.speechSynthesis.removeEventListener("voiceschanged", loadVoices); };
  }, [loadVoices]);

  useEffect(() => {
    if (!preferences.voiceName) return;
    if (!voices.some((voice) => voice.name === preferences.voiceName)) setPreferences((current) => ({ ...current, voiceName: "" }));
  }, [voices, preferences.voiceName]);

  const updatePreference = useCallback((key, value) => setPreferences((current) => ({ ...current, [key]: value })), []);

  const stopSpeech = useCallback(() => {
    queueId.current += 1;
    if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.resume(); }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text) => {
    if (!preferences.speechEnabled || !("speechSynthesis" in window) || !text?.trim()) return;
    const chunks = splitText(text.slice(0, 900));
    const currentQueue = ++queueId.current;
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    const voice = chooseVoice(voices, language, preferences.voiceName);
    let index = 0;
    const speakNext = () => {
      if (currentQueue !== queueId.current || index >= chunks.length) { setIsSpeaking(false); return; }
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = voice?.lang || (language === "en" ? "en-US" : "es-ES");
      if (voice) utterance.voice = voice;
      utterance.rate = 0.92; utterance.pitch = 1; utterance.volume = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { index += 1; window.setTimeout(speakNext, 20); };
      utterance.onerror = (event) => { if (!["canceled", "interrupted"].includes(event.error)) console.warn("Text-to-speech:", event.error); setIsSpeaking(false); };
      window.speechSynthesis.speak(utterance);
      window.setTimeout(() => window.speechSynthesis.resume(), 50);
    };
    speakNext();
  }, [language, preferences.speechEnabled, preferences.voiceName, voices]);

  useEffect(() => {
    if (!preferences.speechEnabled) return undefined;
    let timer;
    let lastElement = null;
    const selector = '[data-speak], h1, h2, h3, h4, p, a, button, label, legend, li';
    const getElement = (target) => target instanceof Element ? target.closest(selector) : null;
    const getText = (element) => element?.getAttribute("aria-label") || element?.innerText || element?.textContent || "";
    const shouldIgnore = (element) => !element || element.closest(".accessibility-widget, [data-no-speech], input, textarea, select") || element.getAttribute("aria-hidden") === "true";
    const handleOver = (event) => {
      const element = getElement(event.target);
      if (shouldIgnore(element) || element === lastElement) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { lastElement = element; speak(getText(element)); }, 450);
    };
    const handleFocus = (event) => { const element = getElement(event.target); if (!shouldIgnore(element) && element !== lastElement) { lastElement = element; speak(getText(element)); } };
    const handleOut = () => window.clearTimeout(timer);
    document.addEventListener("pointerover", handleOver);
    document.addEventListener("pointerout", handleOut);
    document.addEventListener("focusin", handleFocus);
    return () => { window.clearTimeout(timer); document.removeEventListener("pointerover", handleOver); document.removeEventListener("pointerout", handleOut); document.removeEventListener("focusin", handleFocus); };
  }, [preferences.speechEnabled, speak]);

  const resetPreferences = useCallback(() => { stopSpeech(); setPreferences(defaults); }, [stopSpeech]);
  const toggleSpeech = useCallback(() => setPreferences((current) => ({ ...current, speechEnabled: !current.speechEnabled })), []);
  const value = useMemo(() => ({ preferences, voices, isSpeaking, updatePreference, resetPreferences, stopSpeech, speak, toggleSpeech }), [preferences, voices, isSpeaking, updatePreference, resetPreferences, stopSpeech, speak, toggleSpeech]);
  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility debe utilizarse dentro de AccessibilityProvider");
  return context;
}

export default AccessibilityProvider;
