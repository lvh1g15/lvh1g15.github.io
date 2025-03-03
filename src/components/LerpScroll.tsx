"use client";

import { useEffect, useState, ReactNode, useRef } from "react";

interface LerpScrollProps {
  children: ReactNode;
  smoothFactor?: number; // 0-1, lower = smoother
}

export function LerpScroll({ children, smoothFactor = 0.1 }: LerpScrollProps) {
  const [scrollY, setScrollY] = useState(0);
  const [targetScrollY, setTargetScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Get the total scrollable height
    const updateHeight = () => {
      if (contentRef.current) {
        document.body.style.height = `${contentRef.current.offsetHeight}px`;
      }
    };
    
    // Initial height update
    updateHeight();
    
    // Update on resize
    window.addEventListener('resize', updateHeight);
    
    // Handle scroll events
    const handleScroll = () => {
      setTargetScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Animation loop for smooth scrolling
    let animationFrame: number;
    
    const animate = () => {
      // Lerp formula: current + (target - current) * smoothFactor
      setScrollY(prev => prev + (targetScrollY - prev) * smoothFactor);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
      document.body.style.height = '';
    };
  }, [smoothFactor]);
  
  return (
    <div 
      ref={scrollContainerRef}
      className="fixed top-0 left-0 w-full h-screen overflow-hidden"
    >
      <div 
        ref={contentRef}
        style={{ transform: `translateY(-${scrollY}px)` }}
      >
        {children}
      </div>
    </div>
  );
} 