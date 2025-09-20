"use client";

import type { ReactNode, RefObject } from "react";
import React, { forwardRef } from "react";
import Image from "next/image";
// Removed imports for PDF functionality

// Removed PDF download functionality - keeping only PNG export

export interface CertificateProps {
  title: string;
  name: string;
  mainSentence: ReactNode;
  description1: ReactNode;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  (props, ref) => {
    const { title, name, mainSentence, description1 } = props;

    // Use relative paths - Next.js serves from public folder
    const logo = '/assets/images/codebility.png';
    const signature = '/assets/images/signature1.png';

    return (
      <div
        ref={ref}
        className="relative h-[700px] w-[1000px] overflow-hidden"
        style={{
          backgroundColor: "#0a0a1a",
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(120, 198, 255, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)
          `,
          fontFamily: "'Arial', sans-serif",
          position: "relative",
        }}
      >
        {/* Background pattern - simple dots for better PDF rendering */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }}>
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
              <circle cx="22" cy="22" r="1" fill="white" />
              <circle cx="2" cy="22" r="1" fill="white" />
              <circle cx="22" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        
        {/* Decorative border with glow effect */}
        <div 
          className="absolute rounded-lg"
          style={{ 
            top: "40px",
            left: "40px",
            right: "40px",
            bottom: "40px",
            border: "2px solid rgba(255,255,255,0.3)",
            boxShadow: "inset 0 0 20px rgba(255,255,255,0.1), 0 0 20px rgba(120, 119, 198, 0.3)"
          }}
        />
        <div 
          className="absolute rounded-lg"
          style={{ 
            top: "50px",
            left: "50px",
            right: "50px",
            bottom: "50px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        />
        
        {/* Corner decorations */}
        <div className="absolute w-16 h-16 border-t-2 border-l-2 border-white/30 rounded-tl-lg" style={{ top: "60px", left: "60px" }} />
        <div className="absolute w-16 h-16 border-t-2 border-r-2 border-white/30 rounded-tr-lg" style={{ top: "60px", right: "60px" }} />
        <div className="absolute w-16 h-16 border-b-2 border-l-2 border-white/30 rounded-bl-lg" style={{ bottom: "60px", left: "60px" }} />
        <div className="absolute w-16 h-16 border-b-2 border-r-2 border-white/30 rounded-br-lg" style={{ bottom: "60px", right: "60px" }} />
        
        <div className="relative h-full w-full px-40 pt-20 pb-24 text-center" style={{ color: "white", zIndex: 1 }}>
          {/* Top section with logo and title */}
          <div className="mb-6">
            <div className="mx-auto w-48 h-[60px] relative mb-3">
              <img 
                className="mx-auto w-48 h-auto" 
                src={logo} 
                alt="logo" 
                onError={(e) => console.error('Failed to load logo:', e)}
                style={{ maxHeight: "60px", objectFit: "contain" }}
              />
            </div>
            <h1 className="leading-tight" style={{ color: "white" }}>
              <span className="text-5xl font-bold" style={{ color: "white" }}>CERTIFICATE</span>
            </h1>
            <h1 className="mt-2" style={{ color: "white" }}>
              <span className="text-3xl" style={{ color: "white", letterSpacing: "0.05em" }}>OF {title}</span>
            </h1>
          </div>
          
          {/* Middle section with content - better spacing */}
          <div className="mb-8 px-12">
            <p className="text-base mb-2" style={{ color: "white", letterSpacing: "0.02em" }}>This certifies that</p>
            <h2 className="text-3xl font-semibold mb-3" style={{ color: "white", letterSpacing: "0.08em", wordSpacing: "0.2em" }}>
              {name.toUpperCase()}
            </h2>
            <hr className="mx-20 my-4 border-t border-white" style={{ borderColor: "white" }} />
            <div className="mb-4 leading-relaxed" style={{ color: "white", letterSpacing: "0.02em", lineHeight: "1.6" }}>{mainSentence}</div>
            <div className="leading-relaxed" style={{ color: "white", letterSpacing: "0.02em", lineHeight: "1.6" }}>{description1}</div>
          </div>
          
          {/* Bottom section with signature - moved up significantly */}
          <div className="mt-8">
            <p className="mb-2" style={{ color: "white", letterSpacing: "0.05em" }}>Authorized by:</p>
            <img
              src={signature}
              alt="signature"
              className="pointer-events-none mx-auto opacity-90"
              onError={(e) => console.error('Failed to load signature:', e)}
              style={{ maxHeight: "50px", width: "200px", objectFit: "contain" }}
            />
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: "0.03em" }}>
              CEO & Founder, Codebility
            </p>
          </div>
        </div>
      </div>
    );
  },
);

Certificate.displayName = "Certificate";

export default Certificate;
