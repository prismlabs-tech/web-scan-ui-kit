// Simple in-memory store for runtime configuration values we need across modules
// Currently only tracks the active i18n language from PrismConfig.localization.language

let runtimeLanguage: string | undefined;

export function setRuntimeLanguage(lang?: string) {
  runtimeLanguage = lang || undefined;
}

export function getRuntimeLanguage(): string | undefined {
  return runtimeLanguage;
}
