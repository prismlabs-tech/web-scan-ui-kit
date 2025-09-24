import i18n from "i18next";

/**
 * Host-provided i18n configuration passed through Prism.render
 */
export interface PrismLocalizationConfig {
  /**
   * Set active language after bundles are added
   */
  language?: string;
  /**
   * Optional fallback language for missing keys
   */
  fallbackLanguage?: string;
  /**
   *  Inline resources to merge at runtime: { en: { translation: {...}, otherNs?: {...} } }
   */
  resources?: Record<string, Record<string, any>>;
  /**
   *  Remote JSON files per language. Value can be a URL or array of URLs
   */
  resourceUrls?: Record<string, string | string[]>;
  /**
   * Base path used to resolve relative entries in `resourceUrls`.
   * If provided, any resource URL without a scheme (e.g. http://) will be resolved via new URL(url, resourceBasePath).
   * If omitted, relative paths will be resolved against the current document base URL by fetch (i.e., same-origin app assets).
   */
  resourceBasePath?: string;
  /**
   *  Default namespace to use when the payload isn't namespaced
   */
  namespace?: string;
  /**
   *  Deep-merge into existing bundles (true = merge, false = replace)
   */
  merge?: boolean;
}

// Applies inline and/or remote i18n bundles, then optionally sets language
export async function applyCustomI18n(config?: PrismLocalizationConfig) {
  if (!config) return;
  const ns = config.namespace ?? "translation";
  const merge = config.merge ?? true;

  // Merge inline resources. If the object looks namespaced, add each ns; otherwise add to default ns
  if (config.resources) {
    for (const [lng, bundle] of Object.entries(config.resources)) {
      const hasNamespaces =
        typeof bundle === "object" &&
        Object.values(bundle).every((element) => typeof element === "object") &&
        (Object.prototype.hasOwnProperty.call(bundle, ns) ||
          Object.keys(bundle).length > 1);

      if (hasNamespaces) {
        for (const [n, res] of Object.entries(bundle)) {
          i18n.addResourceBundle(lng, n, res, merge, merge);
        }
      } else {
        i18n.addResourceBundle(lng, ns, bundle, merge, merge);
      }
    }
  }

  // Fetch and merge remote JSON bundles for each language
  if (config.resourceUrls) {
    const getAutoBase = (): string => {
      // Prefer explicit base path when provided
      if (config.resourceBasePath) return config.resourceBasePath;
      // Try <base href> first if present in the document
      try {
        const baseEl =
          typeof document !== "undefined"
            ? (document.querySelector("base[href]") as HTMLBaseElement | null)
            : null;
        if (baseEl?.href) return baseEl.href;
      } catch {
        // ignore
      }
      // Fallback to origin root
      try {
        if (typeof window !== "undefined" && window.location?.origin) {
          return window.location.origin + "/";
        }
      } catch {
        // ignore
      }
      return "/";
    };

    const toAbsolute = (u: string): string => {
      // Absolute if it has a scheme or starts with //
      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u) || u.startsWith("//")) return u;
      // Root-relative: resolve against origin
      if (u.startsWith("/")) {
        try {
          const origin =
            typeof window !== "undefined" ? window.location.origin : "";
          return origin ? new URL(u, origin).toString() : u;
        } catch {
          return u;
        }
      }
      // Otherwise resolve relative to computed base (base href or origin root)
      try {
        return new URL(u, getAutoBase()).toString();
      } catch {
        return u;
      }
    };
    await Promise.all(
      Object.entries(config.resourceUrls).map(async ([lng, urls]) => {
        const list = Array.isArray(urls) ? urls : [urls];
        for (const rawUrl of list) {
          const url = toAbsolute(rawUrl);
          try {
            const data = await fetch(url, { cache: "no-cache" }).then((r) =>
              r.json()
            );
            if (data && typeof data === "object") {
              // Treat as namespaced only when the default namespace key exists
              // Otherwise, consider payload as a flat bundle for the default namespace
              const isNamespaced = Object.prototype.hasOwnProperty.call(
                data,
                ns
              );
              const entries = isNamespaced
                ? (Object.entries(data) as [string, any][])
                : ([[ns, data]] as [string, any][]);
              for (const [n, res] of entries as [string, any][]) {
                i18n.addResourceBundle(lng, n, res, merge, merge);
              }
            }
          } catch {
            // Ignore fetch/parse errors so i18n injection doesn't block rendering
          }
        }
      })
    );
  }

  // Apply fallback and switch active language last
  if (config.fallbackLanguage)
    i18n.options.fallbackLng = config.fallbackLanguage;
  if (config.language) await i18n.changeLanguage(config.language);
}
