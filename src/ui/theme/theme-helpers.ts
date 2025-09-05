export function getCssVarValue(variableName: string, fallback = ''): string {
  const prismRoot = document.querySelector('.prism-css') as HTMLElement | null
  const value = prismRoot
    ? getComputedStyle(prismRoot).getPropertyValue(variableName).trim()
    : getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
  console.log(`Resolved ${variableName}:`, value)
  return value || fallback
}
