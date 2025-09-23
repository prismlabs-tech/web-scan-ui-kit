// copy-assets.cjs
// Recursively copy all .css files from src/ to dist/ preserving directory structure
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.resolve(__dirname, "src");
const DIST_DIR = path.resolve(__dirname, "dist");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyCssFiles(srcDir, distDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(distDir, entry.name);
    if (entry.isDirectory()) {
      copyCssFiles(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith(".css")) {
      ensureDir(path.dirname(destPath));
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied CSS: ${path.relative(SRC_DIR, srcPath)}`);
    }
  }
}

copyCssFiles(SRC_DIR, DIST_DIR);
console.log("All CSS assets copied.");
