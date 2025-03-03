"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ScrollVideoAnimationProps {
  videoSrc: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ScrollVideoAnimation({
  videoSrc,
  className = "",
  width = 16,
  height = 16
}: ScrollVideoAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Control video playback based on scroll position
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Make sure video is loaded and played
    video.load();
    video.play().catch(err => {
      console.warn("Auto-play failed:", err);
    });
  }, []);

  return (
    <motion.span
      className={`inline-flex items-center align-middle ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <video 
        ref={videoRef}
        width={width}
        height={height}
        muted
        playsInline
        loop
        autoPlay
        className="inline-block align-middle"
      >
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </motion.span>
  );
} 