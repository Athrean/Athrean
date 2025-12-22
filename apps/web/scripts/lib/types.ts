// Registry types based on the shadcn registry schema
export interface RegistryItem {
  $schema?: string;
  name: string;
  type: RegistryItemType;
  description?: string;
  title?: string;
  author?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  categories?: string[];
}

export interface RegistryFile {
  path: string;
  content?: string;
  type: RegistryItemType;
  target?: string;
}

export type RegistryItemType =
  | "registry:lib"
  | "registry:block"
  | "registry:component"
  | "registry:ui"
  | "registry:hook"
  | "registry:theme"
  | "registry:page"
  | "registry:file"
  | "registry:style"
  | "registry:item";

export interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

export interface LegoMetadata {
  id: string;
  category: string;
  name: string;
  description?: string;
  iframeHeight?: string;
  type: "file" | "directory";
}

export interface GeneratorConfig {
  componentsDir: string;
  metadataFile: string;
  outputFile: string;
  individualOutputDir: string;
  author: string;
  schema: string;
  itemSchema: string;
  homepage: string;
  name: string;
}
