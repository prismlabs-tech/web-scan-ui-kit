import type { PrismAssetConfig } from './assets/assetRegistry';
import type { PrismLocalizationConfig } from './i18n/applyCustomI18n';
/**
 * Configuration object accepted by `Prism.render`.
 *
 * This allows the host page to inject runtime customizations without rebuilding the SDK:
 *  - `localization`: add or override i18n strings before the widget mounts
 *  - `assets`: override built-in SVG assets by providing absolute URLs
 */
export type PrismConfig = {
    /** Custom localization bundles and options (language, fallback, merge). */
    localization?: PrismLocalizationConfig;
    /** Asset overrides: map logical SVG names to remote URLs. */
    assets?: PrismAssetConfig;
};
/**
 * Public SDK handle dispatched via the `onPrismLoaded` event.
 *
 * Example (host page):
 *
 * window.addEventListener('onPrismLoaded', (e) => {
 *   e.detail.prism.render({
 *     localization: {
 *       language: 'en',
 *       resources: { en: { translation: { leveling: { title: 'Override' } } } },
 *       merge: true
 *     },
 *     assets: {
 *       svg: { phone_position: 'https://cdn.example.com/phone_position.svg' }
 *     }
 *   })
 * })
 */
export type PrismInstance = {
    /** Initialize and render the Prism widget with optional runtime config. */
    render: (config: PrismConfig) => void | Promise<void>;
    /** Unmount hook (legacy support). */
    unmount: () => void;
    /** SDK version string embedded at build time. */
    version: string;
};
