"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ScrollTypingAnimationProps {
  text: string;
  className?: string;
  delay?: number;
}

export function ScrollTypingAnimation({ 
  text, 
  className = "", 
  delay = 0 
}: ScrollTypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      // Calculate progress as a value between 0 and 1
      const progress = Math.min(Math.max(scrollPosition / (windowHeight * 0.3), 0), 1);
      setScrollProgress(progress);
    };

    // Initial calculation
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Start typing when scroll begins
    if (scrollProgress > 0.05 && !isComplete) {
      let currentIndex = 0;
      const textLength = text.length;
      
      // Clear any existing interval
      const intervalId = setInterval(() => {
        if (currentIndex <= textLength) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(intervalId);
        }
      }, 50); // Adjust typing speed here
      
      return () => clearInterval(intervalId);
    }
  }, [text, scrollProgress, isComplete]);

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: scrollProgress > 0.05 ? 1 : 0,
      }}
      transition={{ duration: 0.3, delay }}
    >
      {displayedText}
      <motion.span 
        className="inline-block w-[2px] h-[1em] bg-current ml-[2px] align-middle"
        animate={{ 
          opacity: isComplete ? [1, 0] : 1,
          scaleY: isComplete ? [1, 1] : [1, 0.8, 1]
        }}
        transition={{ 
          repeat: isComplete ? Infinity : 0,
          repeatType: "reverse",
          duration: isComplete ? 0.8 : 0.5,
          ease: "easeInOut"
        }}
      />
    </motion.span>
  );
} 