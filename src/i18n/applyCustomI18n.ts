import i18n from 'i18next'

/**
 * Host-provided i18n configuration passed through Prism.render
 */
export interface PrismLocalizationConfig {
  /**
   * Set active language after bundles are added
   */
  language?: string
  /**
   * Optional fallback language for missing keys
   */
  fallbackLanguage?: string
  /**
   *  Inline resources to merge at runtime: { en: { translation: {...}, otherNs?: {...} } }
   */
  resources?: Record<string, Record<string, any>>
  /**
   *  Remote JSON files per language. Value can be a URL or array of URLs
   */
  resourceUrls?: Record<string, string | string[]>
  /**
   *  Default namespace to use when the payload isn't namespaced
   */
  namespace?: string
  /**
   *  Deep-merge into existing bundles (true = merge, false = replace)
   */
  merge?: boolean
}

// Applies inline and/or remote i18n bundles, then optionally sets language
export async function applyCustomI18n(config?: PrismLocalizationConfig) {
  if (!config) return
  const ns = config.namespace ?? 'translation'
  const merge = config.merge ?? true

  // Merge inline resources. If the object looks namespaced, add each ns; otherwise add to default ns
  if (config.resources) {
    for (const [lng, bundle] of Object.entries(config.resources)) {
      const hasNamespaces =
        typeof bundle === 'object' &&
        Object.values(bundle).every((v) => typeof v === 'object') &&
        (Object.prototype.hasOwnProperty.call(bundle, ns) || Object.keys(bundle).length > 1)

      if (hasNamespaces) {
        for (const [n, res] of Object.entries(bundle)) {
          i18n.addResourceBundle(lng, n, res, merge, merge)
        }
      } else {
        i18n.addResourceBundle(lng, ns, bundle, merge, merge)
      }
    }
  }

  // Fetch and merge remote JSON bundles for each language
  if (config.resourceUrls) {
    await Promise.all(
      Object.entries(config.resourceUrls).map(async ([lng, urls]) => {
        const list = Array.isArray(urls) ? urls : [urls]
        for (const url of list) {
          try {
            const data = await fetch(url, { cache: 'no-cache' }).then((r) => r.json())
            if (data && typeof data === 'object') {
              const entries = Object.keys(data).some((k) => typeof (data as any)[k] === 'object')
                ? Object.entries(data)
                : [[ns, data]]
              for (const [n, res] of entries as [string, any][]) {
                i18n.addResourceBundle(lng, n, res, merge, merge)
              }
            }
          } catch {
            // Ignore fetch/parse errors so i18n injection doesn't block rendering
          }
        }
      }),
    )
  }

  // Apply fallback and switch active language last
  if (config.fallbackLanguage) i18n.options.fallbackLng = config.fallbackLanguage
  if (config.language) await i18n.changeLanguage(config.language)
}
