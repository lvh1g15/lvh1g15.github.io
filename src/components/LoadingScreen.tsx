"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  progress: number;
  // onComplete?: () => void;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const [isComplete, setIsComplete] = useState(false);
  
  // Prevent scrolling during loading
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Call onComplete when progress reaches 100%
    if (progress >= 100 && !isComplete) {
      console.log("Loading complete, calling onComplete");
      setIsComplete(true);
      
      return;
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [progress, isComplete]);
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-64 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500 dark:bg-blue-400"
          style={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Loading... {Math.round(progress)}%
      </p>
    </motion.div>
  );
} 