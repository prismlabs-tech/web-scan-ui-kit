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
     *  Default namespace to use when the payload isn't namespaced
     */
    namespace?: string;
    /**
     *  Deep-merge into existing bundles (true = merge, false = replace)
     */
    merge?: boolean;
}
export declare function applyCustomI18n(config?: PrismLocalizationConfig): Promise<void>;
