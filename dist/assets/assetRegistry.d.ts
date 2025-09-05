/** Runtime registry to override default SVG assets with custom URLs. */
export interface PrismAssetConfig {
    /** Map of SVG logical names (e.g., 'phone_position' or 'phone_position.svg') to absolute URLs. */
    svg?: Record<string, string>;
}
/**
 * Apply asset overrides at runtime; safe to call multiple times.
 */
export declare function applyCustomAssets(config?: PrismAssetConfig): void;
/**
 * Resolve an SVG asset by logical name or filename; falls back to public folder path.
 * */
export declare function resolveSvg(name: string): string;
