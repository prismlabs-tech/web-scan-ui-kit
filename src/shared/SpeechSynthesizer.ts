import { getRuntimeLanguage } from "./runtimeConfig";
/**
 * Lightweight wrapper around the Web Speech Synthesis API.
 *
 * This utility centralizes speaking simple, short prompts with sane defaults and
 * consistent behavior (always cancel any ongoing speech before speaking next).
 *
 * Environment
 * - Requires a browser environment with `window.speechSynthesis` support.
 * - Will throw at construction time if the API is unavailable.
 *
 * Defaults
 * - Language: auto-detected from the browser locale (configurable via constructor)
 * - Rate: 1.0, Pitch: 1.0, Volume: 1.0
 *
 * Notes
 * - The constructor primes the synthesizer by issuing an empty utterance. This
 *   can help some engines load voices before the first real `speak()` call.
 *
 * Example
 * ```ts
 * const speaker = new SpeechSynthesizer() // auto-detects language from the browser
 * speaker.speak('Stand upright')
 * // later
 * speaker.cancel() // stop any in-progress speech
 * ```
 */
export class SpeechSynthesizer {
  private language: string = "en-US";
  private voice: SpeechSynthesisVoice | undefined;
  private readonly isMobile: boolean;
  private readonly onVoicesChanged: (() => void) | undefined;

  /**
   * Create a SpeechSynthesizer with an optional preferred BCP 47 language tag.
   * If not provided, language is auto-detected from the browser locale.
   *
   * @throws Error if the Speech Synthesis API is not supported by the browser.
   */
  constructor() {
    // Prefer explicitly configured language from PrismConfig, else browser locale
    const configured: string | undefined = getRuntimeLanguage();

    const autoLang =
      typeof navigator !== "undefined"
        ? navigator.languages?.[0] || navigator.language || "en-US"
        : "en-US";
    this.language = configured ?? autoLang;
    // Cache platform check so we don't re-evaluate per utterance
    this.isMobile =
      typeof navigator !== "undefined" &&
      /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!("speechSynthesis" in window)) {
      throw new Error("Speech Synthesis API is not supported in this browser.");
    }

    // Prepare a stable handler reference. Also re-check runtime language which may change at runtime.
    this.onVoicesChanged = () => {
      const latest = getRuntimeLanguage();
      if (latest && latest !== this.language) {
        this.language = latest;
      }
      this.selectBestVoice();
    };

    // Attempt to select the best matching voice immediately (may be empty at first)
    // Call getVoices() proactively to trigger loading on some browsers
    try {
      void window.speechSynthesis.getVoices?.();
    } catch {
      // ignore
    }
    // Initial voice selection using configured or auto language
    this.selectBestVoice();

    // Listen for the voiceschanged event and re-select when available.
    if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = this.onVoicesChanged;
    }
    try {
      (window.speechSynthesis as any).addEventListener?.(
        "voiceschanged",
        this.onVoicesChanged
      );
    } catch {
      // ignore
    }

    // Prime the engine with an empty utterance
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(this.utterance());
  }

  /**
   * Speak the provided text.
   *
   * Cancels any ongoing speech before speaking to avoid overlapping prompts.
   *
   * @param text - The text to synthesize.
   */
  speak(text: string): void {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(this.utterance(text));
  }

  /**
   * Cancel any ongoing speech immediately.
   */
  cancel(): void {
    window.speechSynthesis.cancel();
  }

  // =====================
  //     P R I V A T E
  // =====================

  /**
   * Build a configured SpeechSynthesisUtterance with default parameters.
   */
  private utterance(text: string = ""): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);
    // iOS can ignore utterance.voice and prefers utterance.lang. So a solution is to
    // ensure we pass a region-specific tag when only a base language (e.g., 'de') is configured.
    const voices = window.speechSynthesis.getVoices?.() || [];
    const lang = this.isMobile
      ? this.normalizeLanguageForMobile(this.language, voices)
      : this.language;
    utterance.lang = lang;
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    return utterance;
  }

  /**
   * Select the best matching voice for the current language.
   */
  private selectBestVoice(): void {
    const voices = window.speechSynthesis.getVoices?.() || [];
    if (!voices.length) return;
    // Exclude "Eloquence" voices (older-sounding synthesizer set) for better quality output
    let candidateVoices = voices.filter(
      (v) =>
        !/eloquence/i.test(v.name || "") && !/eloquence/i.test(v.voiceURI || "")
    );
    if (!candidateVoices.length) {
      // Fallback: if everything was filtered (unlikely) use original list
      candidateVoices = voices;
    }
    const desired = (
      getRuntimeLanguage() ||
      this.language ||
      "en-US"
    ).toLowerCase();
    const base = desired.split("-")[0];

    let match = candidateVoices.find((v) => v.lang?.toLowerCase() === desired);
    if (!match)
      match = candidateVoices.find((v) => v.lang?.toLowerCase() === base);
    if (!match)
      match = candidateVoices.find((v) =>
        v.lang?.toLowerCase().startsWith(base + "-")
      );
    if (!match)
      match = candidateVoices.find((v) => v.lang?.toLowerCase().includes(base));

    if (match) {
      this.voice = match;
      this.language = match.lang || this.language;
    }
  }

  /**
   * Map base language codes to region-specific tags for mobile voice selection.
   */
  private normalizeLanguageForMobile(
    desired: string,
    voices: SpeechSynthesisVoice[]
  ): string {
    const lang = (desired || "en-US").trim();
    if (lang.includes("-")) return lang; // already region-specific
    const base = lang.toLowerCase();
    const candidate =
      voices.find((v) => v.lang?.toLowerCase() === base) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith(base + "-"));
    if (candidate?.lang) return candidate.lang;
    if (typeof navigator !== "undefined") {
      const navLangs = [
        ...(navigator.languages || []),
        navigator.language,
      ].filter(Boolean) as string[];
      const navMatch = navLangs.find((l) =>
        l?.toLowerCase().startsWith(base + "-")
      );
      if (navMatch) return navMatch;
    }
    return base;
  }
}
