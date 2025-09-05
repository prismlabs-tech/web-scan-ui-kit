import { DeploymentType } from '../constants.js';
var svgOverrides = new Map();
/**
 * Apply asset overrides at runtime; safe to call multiple times.
 */
export function applyCustomAssets(config) {
    if (!(config === null || config === void 0 ? void 0 : config.svg))
        return;
    for (var _i = 0, _a = Object.entries(config.svg); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], url = _b[1];
        svgOverrides.set(normalizeKey(key), url);
    }
}
/**
 * Resolve an SVG asset by logical name or filename; falls back to public folder path.
 * */
export function resolveSvg(name) {
    var key = normalizeKey(name);
    var override = svgOverrides.get(key);
    if (override)
        return override;
    var deployment = process.env.DEPLOYMENT_TYPE || 'local';
    // CDN: prefix with CDN_URL
    if (deployment === DeploymentType.CDN) {
        var cdn = process.env.CDN_URL || '';
        if (cdn)
            return joinUrl(cdn, "images/svg/".concat(key, ".svg"));
    }
    // Package: This is TBD but would be something like this where the SVGs are located in the package
    // if (deployment === DeploymentType.PACKAGE) {
    // const base = getPackageBase()
    // if (base) return joinUrl(base, `images/svg/${key}.svg`)
    // }
    // Local default: use public folder path
    return "/images/svg/".concat(key, ".svg");
}
function normalizeKey(key) {
    var k = key.trim();
    // Strip known folder prefix if provided
    if (k.startsWith('/'))
        k = k.slice(1);
    if (k.startsWith('images/svg/'))
        k = k.slice('images/svg/'.length);
    // Remove extension
    if (k.toLowerCase().endsWith('.svg'))
        k = k.slice(0, -4);
    return k;
}
/** Clear overrides */
function _clearAssetOverrides() {
    svgOverrides.clear();
}
// Join base URL and path ensuring single slash
function joinUrl(base, path) {
    var b = base.endsWith('/') ? base : base + '/';
    var p = path.startsWith('/') ? path.slice(1) : path;
    return b + p;
}
