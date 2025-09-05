// fix-esm-extensions.cjs
// Standalone script to rewrite import/export paths in dist/ to include .js extension for ESM compatibility
const fs = require('fs')
const path = require('path')

const DIST_DIR = path.resolve(__dirname, 'dist')

function isBareImport(importPath) {
  return !importPath.startsWith('.') && !importPath.startsWith('/')
}

function isDirectoryImport(importPath, fileDir) {
  if (!importPath.startsWith('.')) return false
  const absPath = path.resolve(fileDir, importPath)
  try {
    const stat = fs.statSync(absPath)
    if (stat.isDirectory()) {
      const indexJs = path.join(absPath, 'index.js')
      return fs.existsSync(indexJs)
    }
  } catch (e) {
    // Not a directory or doesn't exist
  }
  return false
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const dir = path.dirname(filePath)
  // Regex to match import/export ... from '...'; and dynamic import('...')
  const importExportRegex =
    /(import\s+(?:[^'";]+\s+from\s+)?|export\s+[^'";]+\s+from\s+|import\s*\(\s*)['"]([^'"]+)['"]/g
  content = content.replace(importExportRegex, (match, prefix, importPath) => {
    if (isBareImport(importPath)) return match
    if (/\.(js|json|css|svg|png|jpg|jpeg|gif|ico|webp|wasm)$/.test(importPath)) return match
    if (isDirectoryImport(importPath, dir)) return match
    return prefix + `'${importPath}.js'`
  })
  fs.writeFileSync(filePath, content)
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walk(fullPath)
    } else if (stat.isFile() && fullPath.endsWith('.js')) {
      fixFile(fullPath)
    }
  }
}

walk(DIST_DIR)
console.log('ESM import/export paths fixed.')
