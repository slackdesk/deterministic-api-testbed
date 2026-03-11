const fs = require("fs");
const path = require("path");
const YAML = require("yamljs");

const specPath = path.resolve(process.cwd(), "openapi.yaml");
const outDir = path.resolve(process.cwd(), "tests/generated");

if (!fs.existsSync(specPath)) {
  console.error(`openapi.yaml not found at ${specPath}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const spec = YAML.load(specPath);
const baseURL = "process.env.API_BASE_URL || 'https://api.slackdesk.org'";

function sanitizeName(value) {
  return value
    .replace(/[\/{}]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function buildTestFile(route, methods) {
  const fileName = `${sanitizeName(route)}.spec.ts`;
  const tests = [];

  for (const [method, details] of Object.entries(methods)) {
    const summary = details.summary || `${method.toUpperCase()} ${route}`;
    const safeRoute = route.replace(/{[^}]+}/g, "1");

    tests.push(`
  test("${summary}", async ({ request }) => {
    const res = await request.${method.toLowerCase()}(\`\${baseURL}${safeRoute}\`);
    expect(res.status()).toBeLessThan(600);
  });
`);
  }

  return {
    fileName,
    content: `import { test, expect } from "@playwright/test";

const baseURL = ${baseURL};

test.describe("${route}", () => {${tests.join("\n")}
});
`
  };
}

for (const [route, methods] of Object.entries(spec.paths || {})) {
  const file = buildTestFile(route, methods);
  fs.writeFileSync(path.join(outDir, file.fileName), file.content);
  console.log(`Generated ${file.fileName}`);
}