#!/usr/bin/env bun

/**
 * Registry Generator for Athrean Legos Library
 *
 * Generates shadcn-compatible component registry files from the content/components directory.
 *
 * Usage:
 *   bun run scripts/generate-registry.ts
 *   bun run scripts/generate-registry.ts --verbose
 */

import fs from "fs/promises";
import path from "path";
import type { Registry, RegistryItem, RegistryFile, LegoMetadata, GeneratorConfig } from "./lib/types";

const CONFIG: GeneratorConfig = {
  componentsDir: "content/components",
  metadataFile: "content/legos-metadata.ts",
  outputFile: "public/r/registry.json",
  individualOutputDir: "public/r",
  author: "athrean <https://athrean.com>",
  schema: "https://ui.shadcn.com/schema/registry.json",
  itemSchema: "https://ui.shadcn.com/schema/registry-item.json",
  homepage: "https://athrean.com",
  name: "athrean",
};

// Known UI component dependencies (maps import to registry name)
const UI_REGISTRY_MAP: Record<string, string> = {
  "button": "button",
  "badge": "badge",
  "input": "input",
  "textarea": "textarea",
  "select": "select",
  "dropdown-menu": "dropdown-menu",
  "dialog": "dialog",
  "switch": "switch",
  "label": "label",
  "card": "card",
  "avatar": "avatar",
};

// Known npm dependencies that should be extracted
const NPM_DEPS_MAP: Record<string, string> = {
  "lucide-react": "lucide-react",
  "framer-motion": "framer-motion",
  "next/image": "next",
  "clsx": "clsx",
  "tailwind-merge": "tailwind-merge",
};

async function loadMetadata(): Promise<Map<string, LegoMetadata>> {
  const metadataPath = path.resolve(CONFIG.metadataFile);
  const metadataMap = new Map<string, LegoMetadata>();

  try {
    // Dynamic import the metadata file
    const module = await import(metadataPath);
    const legosMetadata = module.legosMetadata as LegoMetadata[];

    for (const lego of legosMetadata) {
      metadataMap.set(lego.id, lego);
    }

    console.log(`✓ Loaded ${metadataMap.size} lego metadata entries`);
  } catch (error) {
    console.error("Failed to load metadata:", error);
  }

  return metadataMap;
}

async function listCategories(): Promise<string[]> {
  const componentsPath = path.resolve(CONFIG.componentsDir);
  const entries = await fs.readdir(componentsPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

async function listLegosInCategory(categoryPath: string): Promise<string[]> {
  const entries = await fs.readdir(categoryPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx") && entry.name !== "index.ts")
    .map((entry) => entry.name.replace(".tsx", ""));
}

function extractDependencies(content: string): { registryDeps: string[]; npmDeps: string[] } {
  const registryDeps: Set<string> = new Set();
  const npmDeps: Set<string> = new Set();

  // Extract imports
  const importRegex = /import\s+(?:{[^}]*}|[^;]+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPath) continue;

    // Check for UI component imports
    if (importPath.startsWith("@/components/ui/")) {
      const componentName = importPath.replace("@/components/ui/", "");
      if (UI_REGISTRY_MAP[componentName]) {
        registryDeps.add(UI_REGISTRY_MAP[componentName]);
      }
    }

    // Check for npm dependencies
    for (const [pattern, dep] of Object.entries(NPM_DEPS_MAP)) {
      if (importPath === pattern || importPath.startsWith(pattern + "/")) {
        npmDeps.add(dep);
      }
    }
  }

  return {
    registryDeps: Array.from(registryDeps),
    npmDeps: Array.from(npmDeps),
  };
}

function transformImports(content: string): string {
  // Transform @/components/ui/* to @/components/ui/*
  // Transform @/lib/utils to @/lib/utils
  // These should remain the same as shadcn convention
  return content;
}

async function buildRegistryItem(
  legoId: string,
  categoryPath: string,
  metadata: LegoMetadata | undefined
): Promise<RegistryItem> {
  const filePath = path.join(categoryPath, `${legoId}.tsx`);
  const content = await fs.readFile(filePath, "utf-8");
  const transformedContent = transformImports(content);
  const { registryDeps, npmDeps } = extractDependencies(content);

  const title = metadata?.name || legoId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const description = metadata?.description || `A ${title.toLowerCase()} component.`;

  const registryFile: RegistryFile = {
    path: `content/components/${metadata?.category || "unknown"}/${legoId}.tsx`,
    content: transformedContent,
    type: "registry:block",
    target: `components/legos/${legoId}.tsx`,
  };

  const item: RegistryItem = {
    name: legoId,
    type: "registry:block",
    title,
    description,
    author: CONFIG.author,
    registryDependencies: registryDeps,
    dependencies: npmDeps,
    files: [registryFile],
  };

  if (metadata?.category) {
    item.categories = [metadata.category];
  }

  return item;
}

async function buildRegistry(): Promise<Registry> {
  console.log("🧱 Starting legos registry generation...");
  console.log(`📁 Components directory: ${CONFIG.componentsDir}`);
  console.log(`📤 Output file: ${CONFIG.outputFile}`);

  const metadataMap = await loadMetadata();
  const categories = await listCategories();
  const items: RegistryItem[] = [];

  console.log(`\nFound ${categories.length} categories: ${categories.join(", ")}`);

  for (const category of categories) {
    const categoryPath = path.join(path.resolve(CONFIG.componentsDir), category);
    const legos = await listLegosInCategory(categoryPath);

    console.log(`\n📂 ${category}: ${legos.length} legos`);

    for (const legoId of legos) {
      try {
        const metadata = metadataMap.get(legoId);
        const item = await buildRegistryItem(legoId, categoryPath, metadata);
        items.push(item);
        console.log(`   ✓ ${legoId}`);
      } catch (error) {
        console.error(`   ✗ ${legoId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  return {
    $schema: CONFIG.schema,
    name: CONFIG.name,
    homepage: CONFIG.homepage,
    items: items.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

async function writeRegistry(registry: Registry): Promise<void> {
  // Ensure output directory exists
  await fs.mkdir(CONFIG.individualOutputDir, { recursive: true });

  // Write main registry file
  await fs.writeFile(CONFIG.outputFile, JSON.stringify(registry, null, 2));
  console.log(`\n✓ Wrote main registry to ${CONFIG.outputFile}`);

  // Write individual registry files
  let writtenCount = 0;
  for (const item of registry.items) {
    const individualItem = {
      $schema: CONFIG.itemSchema,
      ...item,
    };

    const filename = `${item.name}.json`;
    const filepath = path.join(CONFIG.individualOutputDir, filename);

    await fs.writeFile(filepath, JSON.stringify(individualItem, null, 2));
    writtenCount++;
  }

  console.log(`✓ Wrote ${writtenCount} individual registry files to ${CONFIG.individualOutputDir}/`);
}

async function main() {
  const startTime = Date.now();

  try {
    const registry = await buildRegistry();
    await writeRegistry(registry);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n📊 Generation Summary:");
    console.log(`   • Total legos: ${registry.items.length}`);
    console.log(`   • Duration: ${duration}s`);
    console.log("\n🧱 Legos registry generation completed successfully!");
  } catch (error) {
    console.error("\n❌ Registry generation failed:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
