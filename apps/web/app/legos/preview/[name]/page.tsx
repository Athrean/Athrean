"use client";

import { notFound, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { legosComponents } from "@/content/legos-components";

export default function LegoPreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const name = params.name as string;
  const theme = searchParams.get('theme') || 'light';
  const LegoComponent = legosComponents[name] as React.ComponentType | undefined;

  useEffect(() => {
    // Get the root html element
    const html = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      // Apply dark mode
      html.classList.add("dark");
      html.style.background = "#18181b";
      body.style.background = "#18181b";
      body.style.color = "#f4f4f5";
    } else {
      // Apply light mode - override the dark base styles
      html.classList.remove("dark");
      html.style.background = "#f4f4f5";
      body.style.background = "#f4f4f5";
      body.style.color = "#18181b";
    }

    return () => {
      // Cleanup
      html.classList.remove("dark");
      html.style.background = "";
      body.style.background = "";
      body.style.color = "";
    };
  }, [theme]);

  if (!LegoComponent) {
    notFound();
  }

  // Apply inline styles to ensure proper light/dark mode rendering
  const containerStyles = theme === 'dark'
    ? { backgroundColor: '#18181b' }
    : { backgroundColor: '#f4f4f5' };

  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center`}
      style={containerStyles}
    >
      {LegoComponent && <LegoComponent />}
    </div>
  );
}
