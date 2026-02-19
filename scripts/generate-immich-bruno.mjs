#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
const METHOD_LABEL = {
  get: "Get",
  post: "Create",
  put: "Replace",
  patch: "Update",
  delete: "Delete",
};

const repoRoot = process.cwd();
const outDir = path.join(repoRoot, "doc", "immich-api");
const inputArg = process.argv[2] || "/tmp/immich-openapi-specs.json";
const specPath = path.isAbsolute(inputArg) ? inputArg : path.join(repoRoot, inputArg);

if (!fs.existsSync(specPath)) {
  console.error(`OpenAPI spec not found: ${specPath}`);
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
const components = spec.components || {};
const schemas = components.schemas || {};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanOldBru(root) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "environments") continue;
      fs.rmSync(full, { recursive: true, force: true });
      continue;
    }
    if (entry.name.endsWith(".bru") && entry.name !== "collection.bru") {
      fs.rmSync(full, { force: true });
    }
    if (entry.name === "COVERAGE.md") {
      fs.rmSync(full, { force: true });
    }
  }
}

function sanitizeName(s) {
  return s
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toFolderName(tag) {
  return sanitizeName(tag || "Misc");
}

function toUrlPath(p) {
  return p.replace(/\{([^}]+)\}/g, ":$1");
}

function pathLabel(p) {
  const parts = p
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      if (segment.startsWith("{") && segment.endsWith("}")) {
        return segment;
      }
      return segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    });

  return parts.join(" ");
}

function dedupeParams(pathParams = [], opParams = []) {
  const merged = [...pathParams, ...opParams].filter(Boolean);
  const byKey = new Map();
  for (const p of merged) {
    const key = `${p.in}:${p.name}`;
    if (!byKey.has(key)) {
      byKey.set(key, p);
    }
  }
  return [...byKey.values()];
}

function resolveRef(ref) {
  const name = ref.split("/").pop();
  return schemas[name] || null;
}

function schemaExample(schema, depth = 0) {
  if (!schema || depth > 4) return null;

  if (schema.example !== undefined) return schema.example;

  if (schema.$ref) {
    return schemaExample(resolveRef(schema.$ref), depth + 1);
  }

  if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    return schemaExample(schema.oneOf[0], depth + 1);
  }

  if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    return schemaExample(schema.anyOf[0], depth + 1);
  }

  if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
    const out = {};
    for (const s of schema.allOf) {
      const e = schemaExample(s, depth + 1);
      if (e && typeof e === "object" && !Array.isArray(e)) {
        Object.assign(out, e);
      }
    }
    return Object.keys(out).length ? out : null;
  }

  if (schema.type === "object" || schema.properties) {
    const out = {};
    for (const [key, value] of Object.entries(schema.properties || {})) {
      const e = schemaExample(value, depth + 1);
      out[key] = e !== null ? e : "";
    }
    return out;
  }

  if (schema.type === "array") {
    const itemExample = schemaExample(schema.items, depth + 1);
    return itemExample === null ? [] : [itemExample];
  }

  if (schema.enum && schema.enum.length) return schema.enum[0];

  switch (schema.type) {
    case "string":
      return "";
    case "integer":
    case "number":
      return 0;
    case "boolean":
      return false;
    default:
      return null;
  }
}

function bodyInfo(op) {
  const reqBody = op.requestBody;
  if (!reqBody) return { type: "none", payload: null };

  const content = reqBody.content || {};
  const json = content["application/json"];
  if (!json) {
    return { type: "none", payload: null };
  }

  if (json.example !== undefined) {
    return { type: "json", payload: json.example };
  }

  const examples = json.examples || {};
  const firstExample = Object.values(examples)[0];
  if (firstExample && typeof firstExample === "object" && firstExample.value !== undefined) {
    return { type: "json", payload: firstExample.value };
  }

  const payload = schemaExample(json.schema) ?? {};
  return { type: "json", payload };
}

function renderRequest({ name, seq, method, url, pathParams, queryParams, body }) {
  const lines = [];
  lines.push("meta {");
  lines.push(`  name: ${name}`);
  lines.push("  type: http");
  lines.push(`  seq: ${seq}`);
  lines.push("}");
  lines.push("");
  lines.push(`${method} {`);
  lines.push(`  url: {{baseUrl}}${url}`);
  lines.push(`  body: ${body.type === "json" ? "json" : "none"}`);
  lines.push("  auth: inherit");
  lines.push("}");
  lines.push("");

  if (pathParams.length) {
    lines.push("params:path {");
    for (const p of pathParams) {
      lines.push(`  ${p.name}: `);
    }
    lines.push("}");
    lines.push("");
  }

  if (queryParams.length) {
    lines.push("params:query {");
    for (const p of queryParams) {
      lines.push(`  ${p.name}: `);
    }
    lines.push("}");
    lines.push("");
  }

  if (body.type === "json") {
    lines.push("body:json {");
    lines.push(JSON.stringify(body.payload, null, 2).split("\n").map((l) => `  ${l}`).join("\n"));
    lines.push("}");
    lines.push("");
  }

  lines.push("settings {");
  lines.push("  encodeUrl: true");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

function writeCollectionFiles() {
  const collection = `meta {\n  name: Immich-Api\n}\n\nheaders {\n  x-api-key: {{APIKEY}}\n}\n`;
  fs.writeFileSync(path.join(outDir, "collection.bru"), collection);

  const brunoJson = {
    version: "1",
    name: "Immich-Api",
    type: "collection",
    ignore: ["node_modules", ".git"],
    presets: {
      requestType: "http",
      requestUrl: "{{baseUrl}}",
    },
  };
  fs.writeFileSync(path.join(outDir, "bruno.json"), `${JSON.stringify(brunoJson, null, 2)}\n`);
}

function ensureEnvironmentFile() {
  const envDir = path.join(outDir, "environments");
  ensureDir(envDir);
  const envFile = path.join(envDir, "localhost.bru");
  if (fs.existsSync(envFile)) return;

  const content = `vars {\n  baseUrl: http://immich.sir/api\n}\nvars:secret [\n  APIKEY\n]\n`;
  fs.writeFileSync(envFile, content);
}

function buildRequests() {
  const grouped = new Map();
  let totalOps = 0;

  const sortedPaths = Object.keys(spec.paths || {}).sort((a, b) => a.localeCompare(b));

  for (const rawPath of sortedPaths) {
    const pathItem = spec.paths[rawPath] || {};

    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op) continue;
      totalOps += 1;

      const tag = (op.tags && op.tags[0]) || "Misc";
      const folder = toFolderName(tag);

      const name = `${METHOD_LABEL[method]} ${pathLabel(rawPath)}`.trim();

      const params = dedupeParams(pathItem.parameters || [], op.parameters || []);
      const pathParams = params.filter((p) => p.in === "path");
      const queryParams = params.filter((p) => p.in === "query");
      const body = bodyInfo(op);

      const request = {
        name,
        method,
        url: toUrlPath(rawPath),
        pathParams,
        queryParams,
        body,
      };

      if (!grouped.has(folder)) grouped.set(folder, []);
      grouped.get(folder).push(request);
    }
  }

  for (const [folder, requests] of grouped) {
    requests.sort((a, b) => a.name.localeCompare(b.name));
    ensureDir(path.join(outDir, folder));
  }

  const folders = [...grouped.keys()].sort((a, b) => a.localeCompare(b));

  folders.forEach((folder, folderSeq) => {
    const folderDir = path.join(outDir, folder);
    const folderContent = `meta {\n  name: ${folder}\n  seq: ${folderSeq + 1}\n}\n\nauth {\n  mode: inherit\n}\n`;
    fs.writeFileSync(path.join(folderDir, "folder.bru"), folderContent);

    const usedFileNames = new Set();
    grouped.get(folder).forEach((req, i) => {
      const base = sanitizeName(req.name) || `${METHOD_LABEL[req.method]} Request`;
      let fileName = `${base}.bru`;
      let counter = 2;
      while (usedFileNames.has(fileName.toLowerCase())) {
        fileName = `${base} ${counter}.bru`;
        counter += 1;
      }
      usedFileNames.add(fileName.toLowerCase());

      const content = renderRequest({
        name: req.name,
        seq: i + 1,
        method: req.method,
        url: req.url,
        pathParams: req.pathParams,
        queryParams: req.queryParams,
        body: req.body,
      });
      fs.writeFileSync(path.join(folderDir, fileName), content);
    });
  });

  return { grouped, totalOps };
}

function writeCoverage({ grouped, totalOps, source }) {
  const folders = [...grouped.keys()].sort((a, b) => a.localeCompare(b));
  const lines = [];
  lines.push("# Immich API Coverage");
  lines.push("");
  lines.push(`- Source OpenAPI: \`${source}\``);
  lines.push(`- Generated at: \`${new Date().toISOString()}\``);
  lines.push(`- Total HTTP endpoints in spec: **${totalOps}**`);

  let generatedRequests = 0;
  for (const folder of folders) {
    generatedRequests += grouped.get(folder).length;
  }

  lines.push(`- Requests generated in Bruno: **${generatedRequests}**`);
  lines.push(`- Missing endpoints: **${Math.max(0, totalOps - generatedRequests)}**`);
  lines.push("");
  lines.push("## Endpoints by Module");
  lines.push("");

  for (const folder of folders) {
    lines.push(`- ${folder}: ${grouped.get(folder).length}`);
  }

  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- Collection auth uses `x-api-key: {{APIKEY}}`.");
  lines.push("- `environments/localhost.bru` keeps `APIKEY` as secret variable.");
  lines.push("- Request files are generated from OpenAPI and can be regenerated safely.");
  lines.push("");

  fs.writeFileSync(path.join(outDir, "COVERAGE.md"), `${lines.join("\n")}\n`);
}

ensureDir(outDir);
cleanOldBru(outDir);
writeCollectionFiles();
ensureEnvironmentFile();
const result = buildRequests();
writeCoverage({ grouped: result.grouped, totalOps: result.totalOps, source: specPath });

console.log(`Generated ${result.totalOps} requests across ${result.grouped.size} modules.`);
