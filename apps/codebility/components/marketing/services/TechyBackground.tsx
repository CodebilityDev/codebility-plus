"use client";

import { useEffect, useRef } from "react";

export const TechyBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation loop
    const animate = () => {
      timeRef.current += 0.005; // Slower animation

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle gradient waves
      drawGradientWaves(ctx, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(animate);
    };

    const drawGradientWaves = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Create multiple subtle wave layers
      for (let i = 0; i < 3; i++) {
        ctx.save();

        // Create gradient for each wave
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        const opacity = 0.02 + i * 0.01; // Very subtle

        gradient.addColorStop(0, `rgba(88, 61, 255, 0)`); // customBlue-500 transparent
        gradient.addColorStop(0.3, `rgba(88, 61, 255, ${opacity})`);
        gradient.addColorStop(0.7, `rgba(64, 73, 147, ${opacity})`); // customBlue-200
        gradient.addColorStop(1, `rgba(64, 73, 147, 0)`);

        ctx.fillStyle = gradient;

        // Draw flowing wave shape
        ctx.beginPath();
        const waveHeight = height * (0.3 + i * 0.1);
        const frequency = 0.002 + i * 0.001;
        const amplitude = 50 + i * 20;
        const phase = timeRef.current * (0.5 + i * 0.3);

        // Start the wave
        ctx.moveTo(0, height);

        // Create smooth wave path
        for (let x = 0; x <= width; x += 5) {
          const y =
            waveHeight +
            Math.sin(x * frequency + phase) * amplitude +
            Math.sin(x * frequency * 2 + phase * 1.5) * (amplitude * 0.3);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Complete the shape
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        ctx.fill();
        ctx.restore();
      }

      // Add a few minimal floating orbs
      for (let i = 0; i < 4; i++) {
        const x =
          width * 0.2 +
          width * 0.6 * (i / 3) +
          Math.sin(timeRef.current * 0.8 + i * 2) * 30;
        const y = height * 0.3 + Math.sin(timeRef.current * 0.6 + i * 1.5) * 50;
        const size = 2 + Math.sin(timeRef.current + i) * 1;
        const opacity = 0.1 + Math.sin(timeRef.current * 1.2 + i * 0.8) * 0.05;

        // Subtle glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 6);
        gradient.addColorStop(0, `rgba(88, 61, 255, ${opacity})`);
        gradient.addColorStop(1, "rgba(88, 61, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Small core
        ctx.fillStyle = `rgba(244, 244, 244, ${opacity * 2})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ background: "transparent" }}
    />
  );
};
