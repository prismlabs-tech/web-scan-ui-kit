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

  /**
   * Create a SpeechSynthesizer with an optional preferred BCP 47 language tag.
   * If not provided, language is auto-detected from the browser locale.
   *
   * @throws Error if the Speech Synthesis API is not supported by the browser.
   */
  constructor() {
    // Prefer explicitly configured language from PrismConfig, else browser locale
    let configured: string | undefined;
    try {
      // Lazy import to avoid circular deps at module init
      const { getRuntimeLanguage } = require("./runtimeConfig") as {
        getRuntimeLanguage: () => string | undefined;
      };
      configured = getRuntimeLanguage();
    } catch {
      // ignore if module not available; default to browser locale
    }

    const autoLang =
      typeof navigator !== "undefined"
        ? navigator.languages?.[0] || navigator.language || "en-US"
        : "en-US";
    this.language = configured ?? autoLang;
    if (!("speechSynthesis" in window)) {
      throw new Error("Speech Synthesis API is not supported in this browser.");
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(this.utterance());
  }

  /**
   * Build a configured SpeechSynthesisUtterance with default parameters.
   *
   * Internal helper to ensure all utterances use the same language and voice
   * characteristics.
   *
   * @param text - The text to speak. Empty by default (used for priming).
   * @returns A configured SpeechSynthesisUtterance instance.
   */
  private utterance(text: string = ""): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.language; // Default language
    utterance.rate = 1.0; // Default rate
    utterance.pitch = 1.0; // Default pitch
    utterance.volume = 1.0; // Default volume
    return utterance;
  }

  /**
   * Speak the provided text.
   *
   * Cancels any ongoing speech before speaking to avoid overlapping prompts.
   *
   * @param text - The text to synthesize.
   */
  speak(text: string): void {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(this.utterance(text));
  }

  /**
   * Cancel any ongoing speech immediately.
   */
  cancel(): void {
    window.speechSynthesis.cancel();
  }
}
