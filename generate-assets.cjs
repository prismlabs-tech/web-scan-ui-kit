// generate-assets.cjs
// Reads SVG files and generates a TypeScript module exporting them as data URLs to inline in ESM builds.
const fs = require("fs");
const path = require("path");

const INPUT_DIR = path.resolve(__dirname, "public/images/svg");
const OUTPUT_DIR = path.resolve(__dirname, "src/assets");
const OUTPUT = path.join(OUTPUT_DIR, "generated-svg.ts");

function svgToDataUrl(svgContent) {
  const base64 = Buffer.from(svgContent).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

function main() {
  const entries = fs.readdirSync(INPUT_DIR, { withFileTypes: true });
  const svgAssets = {};

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".svg")) {
      const filePath = path.join(INPUT_DIR, entry.name);
      const svgContent = fs.readFileSync(filePath, "utf8");
      const key = entry.name.slice(0, -4); // remove .svg
      svgAssets[key] = svgToDataUrl(svgContent);
    }
  }

  const content =
    `// AUTO-GENERATED FILE. Do not edit manually.\n` +
    `// Source: public/images/svg/*.svg\n` +
    `export const svgAssets: Record<string, string> = ${JSON.stringify(svgAssets, null, 2)};\n`;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, content, "utf8");
  console.log("Generated", path.relative(process.cwd(), OUTPUT));
}

main();
