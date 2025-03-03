"use client";

import { useEffect, useRef } from "react";

interface CardGradientProps {
  className?: string;
}

export function CardGradient({ className = "" }: CardGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match parent
    const updateCanvasSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Create gradient
    const createGradient = () => {
      // Create a different gradient for each card based on its dimensions
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      // Blue to green gradient
      gradient.addColorStop(0, 'rgba(64, 186, 213, 0.9)');  // Light blue
      gradient.addColorStop(0.6, 'rgba(32, 156, 183, 0.7)'); // Medium blue
      gradient.addColorStop(1, 'rgba(46, 204, 113, 0.5)');  // Green
      
      return gradient;
    };
    
    // Add noise/grain
    const addNoise = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Add subtle noise to each pixel
        const noise = Math.random() * 15 - 7.5;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));     // R
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
    
    // Draw the gradient mesh
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fill with gradient
      ctx.fillStyle = createGradient();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add noise
      addNoise();
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
} 