// replace-env.cjs
// Replace process.env variables with actual values in dist/*.js files
const fs = require("fs");
const path = require("path");

const packageJson = require("./package.json");
const version = packageJson.version;

const replacements = {
  "process.env.CDN_ENV": JSON.stringify(process.env.CDN_ENV || ""),
  "process.env.CDN_URL": JSON.stringify(process.env.CDN_URL || ""),
  "process.env.DEPLOYMENT_TYPE": JSON.stringify(
    process.env.DEPLOYMENT_TYPE || "local"
  ),
  "process.env.PRISM_VERSION": JSON.stringify(version),
  "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
  "process.env.SIMULATE_BLOCKING_SCRIPT": JSON.stringify(
    process.env.SIMULATE_BLOCKING_SCRIPT || false
  ),
};

const distDir = path.resolve(__dirname, "dist");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  for (const [key, value] of Object.entries(replacements)) {
    console.log(`Replacing ${key} with ${value}`);
    content = content.replace(
      new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      value
    );
  }
  fs.writeFileSync(filePath, content);
}

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      replaceInFile(fullPath);
    }
  }
}

processDir(distDir);
console.log("Env replacement complete.");
