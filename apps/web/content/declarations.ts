export type LegosCategoryMetadata = {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  thumbnailCustomClasses?: string;
  count: string;
  hasCharts?: boolean;
};

export type LegosMetadata = {
  id: string;
  category: string;
  name: string;
  description?: string;
  iframeHeight?: string;
  type: "file" | "directory";
};

export const categoryIds = {
  AI: "ai",
  Flow: "flow",
  Grids: "grids",
  Versatile: "versatile",
  // Future categories (uncomment as needed):
  // FileUpload: "file-upload",
  // FormLayout: "form-layout",
  // Login: "login",
  // Stats: "stats",
  // GridList: "grid-list",
  // Dialogs: "dialogs",
  // Sidebar: "sidebar",
  // CommandMenu: "command-menu",
  // Tables: "tables",
  // Onboarding: "onboarding",
};

export const categoryMetadata: LegosCategoryMetadata[] = [
  {
    id: categoryIds.AI,
    name: "AI",
    description: "AI chat interfaces, prompts, and assistants",
    count: "5",
  },
  {
    id: categoryIds.Flow,
    name: "Flow",
    description: "Beautiful card components for travel, booking, and more",
    count: "2",
  },
  {
    id: categoryIds.Grids,
    name: "Grids",
    description: "Bento grids and dashboard layouts with stunning designs",
    count: "5",
  },
  {
    id: categoryIds.Versatile,
    name: "Versatile",
    description: "Animated testimonials, card stacks, and multipurpose sections",
    count: "2",
  },
  // Future categories (uncomment as needed):
  // {
  //   id: categoryIds.FileUpload,
  //   name: "File Upload",
  //   description: "File upload components with drag & drop",
  //   count: "0",
  // },
];

