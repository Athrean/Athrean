"use client";

import { useEffect, useRef, useMemo } from "react";

interface GradientBlindsProps {
  gradientColors?: string[];
  angle?: number;
  noise?: number;
  blindCount?: number;
  blindMinWidth?: number;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  mouseDampening?: number;
  distortAmount?: number;
  shineDirection?: "left" | "right" | "center";
  mixBlendMode?: string;
}

export default function GradientBlinds({
  gradientColors = ["#1F1C2C", "#4a4568", "#928DAB"],
  angle = 15,
  noise = 0.115,
  blindCount = 13,
  blindMinWidth = 50,
  spotlightRadius = 0.38,
  spotlightSoftness = 1,
  spotlightOpacity = 0.42,
  mouseDampening = 0.15,
  distortAmount = 0,
  shineDirection = "right",
  mixBlendMode = "overlay",
}: GradientBlindsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  const gradientStops = useMemo(() => {
    return gradientColors.map((color, i) => ({
      color,
      position: i / (gradientColors.length - 1),
    }));
  }, [gradientColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result && result[1] && result[2] && result[3]
        ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
        : { r: 0, g: 0, b: 0 };
    };

    const interpolateColor = (position: number): { r: number; g: number; b: number } => {
      const defaultStop = { color: "#000000", position: 0 };
      let startStop = gradientStops[0] ?? defaultStop;
      let endStop = gradientStops[gradientStops.length - 1] ?? defaultStop;

      for (let i = 0; i < gradientStops.length - 1; i++) {
        const current = gradientStops[i];
        const next = gradientStops[i + 1];
        if (current && next && position >= current.position && position <= next.position) {
          startStop = current;
          endStop = next;
          break;
        }
      }

      const range = endStop.position - startStop.position;
      const localPosition = range === 0 ? 0 : (position - startStop.position) / range;

      const startRgb = hexToRgb(startStop.color);
      const endRgb = hexToRgb(endStop.color);

      return {
        r: Math.round(lerp(startRgb.r, endRgb.r, localPosition)),
        g: Math.round(lerp(startRgb.g, endRgb.g, localPosition)),
        b: Math.round(lerp(startRgb.b, endRgb.b, localPosition)),
      };
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Smooth mouse movement
      mouseRef.current.x = lerp(mouseRef.current.x, targetMouseRef.current.x, mouseDampening);
      mouseRef.current.y = lerp(mouseRef.current.y, targetMouseRef.current.y, mouseDampening);

      ctx.clearRect(0, 0, width, height);

      // Calculate blind dimensions
      const angleRad = (angle * Math.PI) / 180;
      const blindWidth = Math.max(blindMinWidth, width / blindCount);
      const totalBlinds = Math.ceil(width / blindWidth) + 2;

      // Draw blinds
      for (let i = 0; i < totalBlinds; i++) {
        const x = i * blindWidth - blindWidth;
        const colorPosition = i / totalBlinds;

        // Apply shine direction
        let adjustedPosition = colorPosition;
        if (shineDirection === "left") {
          adjustedPosition = 1 - colorPosition;
        } else if (shineDirection === "center") {
          adjustedPosition = Math.abs(colorPosition - 0.5) * 2;
        }

        const color = interpolateColor(adjustedPosition);

        // Calculate distortion based on mouse position
        const distX = (mouseRef.current.x - 0.5) * distortAmount * 100;
        const distY = (mouseRef.current.y - 0.5) * distortAmount * 50;

        ctx.save();
        ctx.translate(x + blindWidth / 2, height / 2);
        ctx.rotate(angleRad);
        ctx.translate(distX, distY);

        // Draw blind
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(-blindWidth / 2 - 1, -height, blindWidth + 2, height * 2);

        ctx.restore();
      }

      // Add spotlight effect
      const spotlightX = mouseRef.current.x * width;
      const spotlightY = mouseRef.current.y * height;
      const maxRadius = Math.max(width, height) * spotlightRadius;

      const spotlight = ctx.createRadialGradient(
        spotlightX,
        spotlightY,
        0,
        spotlightX,
        spotlightY,
        maxRadius * (1 + spotlightSoftness)
      );
      spotlight.addColorStop(0, `rgba(255, 255, 255, ${spotlightOpacity})`);
      spotlight.addColorStop(0.5, `rgba(255, 255, 255, ${spotlightOpacity * 0.3})`);
      spotlight.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.globalCompositeOperation = mixBlendMode as GlobalCompositeOperation;
      ctx.fillStyle = spotlight;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      // Add noise
      if (noise > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const noiseIntensity = noise * 50;

        for (let i = 0; i < data.length; i += 4) {
          const random = (Math.random() - 0.5) * noiseIntensity;
          data[i] = Math.max(0, Math.min(255, (data[i] ?? 0) + random));
          data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] ?? 0) + random));
          data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] ?? 0) + random));
        }

        ctx.putImageData(imageData, 0, 0);
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    gradientStops,
    angle,
    noise,
    blindCount,
    blindMinWidth,
    spotlightRadius,
    spotlightSoftness,
    spotlightOpacity,
    mouseDampening,
    distortAmount,
    shineDirection,
    mixBlendMode,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
