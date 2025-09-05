import { DeploymentType } from '../constants'

/** Runtime registry to override default SVG assets with custom URLs. */
export interface PrismAssetConfig {
  /** Map of SVG logical names (e.g., 'phone_position' or 'phone_position.svg') to absolute URLs. */
  svg?: Record<string, string>
}

const svgOverrides = new Map<string, string>()

/**
 * Apply asset overrides at runtime; safe to call multiple times.
 */
export function applyCustomAssets(config?: PrismAssetConfig) {
  if (!config?.svg) return
  for (const [key, url] of Object.entries(config.svg)) {
    svgOverrides.set(normalizeKey(key), url)
  }
}

/**
 * Resolve an SVG asset by logical name or filename; falls back to public folder path.
 * */
export function resolveSvg(name: string): string {
  const key = normalizeKey(name)
  const override = svgOverrides.get(key)
  if (override) return override
  const deployment = (process.env.DEPLOYMENT_TYPE as string) || 'local'
  // CDN: prefix with CDN_URL
  if (deployment === DeploymentType.CDN) {
    const cdn = (process.env.CDN_URL as string) || ''
    if (cdn) return joinUrl(cdn, `images/svg/${key}.svg`)
  }
  // Package: This is TBD but would be something like this where the SVGs are located in the package
  // if (deployment === DeploymentType.PACKAGE) {
  // const base = getPackageBase()
  // if (base) return joinUrl(base, `images/svg/${key}.svg`)
  // }
  // Local default: use public folder path
  return `/images/svg/${key}.svg`
}

function normalizeKey(key: string): string {
  let k = key.trim()
  // Strip known folder prefix if provided
  if (k.startsWith('/')) k = k.slice(1)
  if (k.startsWith('images/svg/')) k = k.slice('images/svg/'.length)
  // Remove extension
  if (k.toLowerCase().endsWith('.svg')) k = k.slice(0, -4)
  return k
}

/** Clear overrides */
function _clearAssetOverrides() {
  svgOverrides.clear()
}

// Join base URL and path ensuring single slash
function joinUrl(base: string, path: string): string {
  const b = base.endsWith('/') ? base : base + '/'
  const p = path.startsWith('/') ? path.slice(1) : path
  return b + p
}
