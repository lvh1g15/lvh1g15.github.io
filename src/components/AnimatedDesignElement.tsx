import { motion } from "framer-motion";

interface AnimatedDesignElementProps {
  src: string;
  alt: string;
  className?: string;
  style: React.CSSProperties;
  isActive: boolean;
  delay: number;
}

export const AnimatedDesignElement = ({
  src,
  alt,
  className = "",
  style,
  isActive,
  delay,
}: AnimatedDesignElementProps) => {
  const transition = isActive ? { 
    duration: 0.5, 
    ease: "backOut", // Using built-in bounce easing function
    opacity: { times: [0, 0.8, 1] },
  } : { 
    duration: 0.3,
    ease: "easeOut",
    opacity: { times: [0, 0.8, 1] }
  };

  return (
    <motion.img 
      src={src}
      alt={alt} 
      className={`absolute h-auto opacity-70 -z-10 ${className}`}
      style={style}
      initial={{ opacity: 0, scale: 0}}
      animate={isActive ? { 
        opacity: [0, 1, 1],
        scale: [0, 1.1, 1],
      } : { opacity: [1, 0, 0], scale: 0 }}
      transition={{ 
        ...transition,
        delay: isActive ? delay : 0 
      }}
    />
  );
}; 