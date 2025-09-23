// generate-i18n.cjs
// Reads JSON translations and generates a TypeScript module exporting them to avoid `require` in ESM output.
const fs = require("fs");
const path = require("path");

const INPUT = path.resolve(__dirname, "public/translations/en.json");
const OUTPUT_DIR = path.resolve(__dirname, "src/i18n");
const OUTPUT = path.join(OUTPUT_DIR, "generated-en.ts");

function main() {
  const json = fs.readFileSync(INPUT, "utf8");
  const content =
    `// AUTO-GENERATED FILE. Do not edit manually.\n` +
    `// Source: public/translations/en.json\n` +
    `const en = ${json};\n` +
    `export default en;\n`;
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, content, "utf8");
  console.log("Generated", path.relative(process.cwd(), OUTPUT));
}

main();
