// copy-assets.cjs
// Recursively copy all .css files from src/ to dist/ preserving directory structure
// Also copy public/images/svg into dist/images/svg for module consumers
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

function copyDirectory(srcDir, distDir) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(distDir, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      // Log only SVG copies to avoid noise
      if (entry.name.toLowerCase().endsWith(".svg")) {
        console.log(
          `Copied SVG: ${path.relative(path.resolve(__dirname, "public/images/svg"), srcPath)}`
        );
      }
    }
  }
}

copyCssFiles(SRC_DIR, DIST_DIR);
// Copy public SVGs -> dist/images/svg
copyDirectory(
  path.resolve(__dirname, "public/images/svg"),
  path.resolve(__dirname, "dist/images/svg")
);
console.log("All CSS assets copied.");
