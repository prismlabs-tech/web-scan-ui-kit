export function getCssVarValue(variableName, fallback) {
  if (fallback === void 0) {
    fallback = "";
  }
  var prismRoot = document.querySelector(".prism-css");
  var value = prismRoot
    ? getComputedStyle(prismRoot).getPropertyValue(variableName).trim()
    : getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
  return value || fallback;
}
