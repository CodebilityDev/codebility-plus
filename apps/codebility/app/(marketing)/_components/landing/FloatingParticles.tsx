"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
  direction: number;
}

const FloatingParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollY = useMotionValue(0);

  const mouseXSpring = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const mouseYSpring = useSpring(mouseY, { damping: 25, stiffness: 150 });
  const scrollYSpring = useSpring(scrollY, { damping: 30, stiffness: 100 });

  // State for particles - generated only on client
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Generate particles on client side only
  useEffect(() => {
    const colors = [
      "rgba(147, 71, 255, 0.4)",   // Purple
      "rgba(2, 255, 226, 0.3)",    // Cyan
      "rgba(106, 120, 242, 0.3)",  // Blue
      "rgba(255, 255, 255, 0.2)",  // White
    ];

    const generatedParticles: Particle[] = Array.from({ length: 15 }, (_, i) => {
      const randomColorIndex = Math.floor(Math.random() * colors.length);
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: colors[randomColorIndex]!,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
        direction: Math.random() * Math.PI * 2,
      };
    });
    
    setParticles(generatedParticles);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mouseX, mouseY, scrollY]);

  // Don't render particles until mounted on client
  if (!isMounted) {
    return (
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ zIndex: 1 }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            x: [0, Math.cos(particle.direction) * 30, 0],
            y: [0, Math.sin(particle.direction) * 30, 0],
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
          }}
          transition={{
            duration: 8 + particle.speed * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.2,
          }}
        >
          {/* Inner glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
              filter: "blur(2px)",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 4 + particle.speed * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.id * 0.1,
            }}
          />
        </motion.div>
      ))}

      {/* Additional floating orbs with mouse interaction */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            x: [0, (i * 30 - 120), (i * 30 + 120), 0],
            y: [0, (i * 20 - 80), (i * 20 + 80), 0],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            x: {
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
            y: {
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{
              background: `radial-gradient(circle, ${
                ["rgba(147, 71, 255, 0.6)", "rgba(2, 255, 226, 0.4)"][i % 2]
              } 0%, transparent 70%)`,
              filter: "blur(1px)",
            }}
          />
        </motion.div>
      ))}

      {/* Ambient light orbs */}
      <motion.div
        className="absolute left-1/4 top-1/3 h-20 w-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(147, 71, 255, 0.1) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute right-1/4 top-2/3 h-16 w-16 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(2, 255, 226, 0.15) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default FloatingParticles;