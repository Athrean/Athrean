export interface PreviewPanelProps {
  code: string | null;
  isLoading: boolean;
}

export type Tab = "preview" | "code";
export type Device = "desktop" | "tablet" | "mobile";

export const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};
