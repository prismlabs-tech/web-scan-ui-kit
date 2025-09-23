// fix-esm-extensions.cjs
// Standalone script to rewrite import/export paths in dist/ to include .js extension for ESM compatibility
const fs = require("fs");
const path = require("path");

const DIST_DIR = path.resolve(__dirname, "dist");

// Known TS path aliases to rewrite to relative paths in dist output
const aliasMap = {
  "@components/": "ui/components/",
};

function isBareImport(importPath) {
  return !importPath.startsWith(".") && !importPath.startsWith("/");
}

function isDirectoryImport(importPath, fileDir) {
  if (!importPath.startsWith(".")) return false;
  const absPath = path.resolve(fileDir, importPath);
  try {
    const stat = fs.statSync(absPath);
    if (stat.isDirectory()) {
      const indexJs = path.join(absPath, "index.js");
      return fs.existsSync(indexJs);
    }
  } catch (e) {
    // Not a directory or doesn't exist
  }
  return false;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const dir = path.dirname(filePath);
  // Regex to match import/export ... from '...'; and dynamic import('...')
  const importExportRegex =
    /(import\s+(?:[^'";]+\s+from\s+)?|export\s+[^'";]+\s+from\s+|import\s*\(\s*)['"]([^'"]+)['"]/g;
  content = content.replace(importExportRegex, (match, prefix, importPath) => {
    // Rewrite known aliases to relative paths within dist
    for (const alias in aliasMap) {
      if (importPath.startsWith(alias)) {
        const rest = importPath.slice(alias.length);
        // target within dist
        const targetAbs = path.resolve(DIST_DIR, aliasMap[alias], rest);
        // Try file.js, then directory/index.js
        let candidate = `${targetAbs}.js`;
        if (!fs.existsSync(candidate)) {
          const asDirIndex = path.join(targetAbs, "index.js");
          if (fs.existsSync(asDirIndex)) candidate = asDirIndex;
        }
        let rel = path.relative(dir, candidate);
        if (!rel.startsWith(".")) rel = "./" + rel;
        // Normalize path separators to posix-style
        rel = rel.split(path.sep).join("/");
        return prefix + `'${rel}'`;
      }
    }

    if (isBareImport(importPath)) return match;
    if (/\.(js|json|css|svg|png|jpg|jpeg|gif|ico|webp|wasm)$/.test(importPath))
      return match;
    if (isDirectoryImport(importPath, dir)) {
      // ESM fully specified requires explicit file extension for directory imports
      return prefix + `'${importPath}/index.js'`;
    }
    return prefix + `'${importPath}.js'`;
  });
  fs.writeFileSync(filePath, content);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (stat.isFile() && fullPath.endsWith(".js")) {
      fixFile(fullPath);
    }
  }
}

walk(DIST_DIR);
console.log("ESM import/export paths fixed.");
