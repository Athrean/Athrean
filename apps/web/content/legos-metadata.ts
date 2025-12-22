import { LegosMetadata, categoryIds } from "./declarations";

export const legosMetadata: LegosMetadata[] = [
  {
    id: "ai-01",
    category: categoryIds.AI,
    name: "AI Chat with Voice Input",
    description: "Modern AI chat interface with voice input, file attachments, and expandable textarea",
    iframeHeight: "450px",
    type: "file",
  },
  {
    id: "ai-02",
    category: categoryIds.AI,
    name: "AI Chat with Model Selection",
    description: "AI chat interface with model selector, prompt suggestions, and image attachments",
    iframeHeight: "400px",
    type: "file",
  },
  {
    id: "ai-03",
    category: categoryIds.AI,
    name: "AI Chat Compact Interface",
    description: "Compact AI chat with model, agent, and performance mode selectors",
    iframeHeight: "350px",
    type: "file",
  },
  {
    id: "ai-04",
    category: categoryIds.AI,
    name: "AI Chat with File Attachments",
    description: "Full-featured AI chat with drag & drop file attachments, settings, and action buttons",
    iframeHeight: "650px",
    type: "file",
  },
];
