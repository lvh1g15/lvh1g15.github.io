"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project, AspectRatio } from "@/types/project";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface ProjectCardProps {
  project: Project;
  images: string[];
  previewImage?: string; // Optional preview image, defaults to first image in the array
  aspectRatio?: AspectRatio; // Added aspect ratio prop
  onCardClick?: () => void;
} 

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  images,
  previewImage,
  aspectRatio = AspectRatio.LANDSCAPE, // Default to landscape if not provided
  onCardClick,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Filter out any empty strings from the images array
  const validImages = images.filter(img => img && img.trim() !== '');

  // Use the provided preview image or default to the first image in the array
  const displayImage = previewImage || (validImages.length > 0 ? validImages[0] : null);
  
  // Get aspect ratio class based on the provided aspect ratio
  const getAspectRatioClass = (): string => {
    switch (aspectRatio) {
      case AspectRatio.PORTRAIT:
        return "aspect-[3/4]";
      case AspectRatio.SQUARE:
        return "aspect-square";
      case AspectRatio.LANDSCAPE:
      default:
        return "aspect-[1.7/1]";
    }
  };

  // Render preview based on aspect ratio
  const renderPreview = () => {
    switch (aspectRatio) {
      case AspectRatio.PORTRAIT:
        // For portrait, show up to 3 images in a grid
        return (
          <div className="grid grid-cols-3 gap-6 w-[90%] mt-[100px] h-full">
            {validImages.slice(0, 3).map((img, index) => (
              <div key={index} className="relative aspect-[1/2.16] rounded-2xl overflow-hidden">
                <Image
                  src={img}
                  alt={`${project.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
            {/* If less than 3 images, fill with empty spaces */}
            {validImages.length < 3 && Array(3 - validImages.length).fill(0).map((_, index) => (
              <div key={`empty-${index}`} className="bg-gray-100 rounded-2xl" />
            ))}
          </div>
        );
      
      case AspectRatio.SQUARE:
      case AspectRatio.LANDSCAPE:
      default:
        // For landscape and square, keep the current single image layout
        return displayImage ? (
          <div className="relative w-[90%] h-full mt-[100px] rounded-2xl overflow-hidden">
            <Image
              src={displayImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null;
    }
  };

  const handleViewMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick();
    }
    setShowModal(true);
  };

  return (
    <>
      <div 
        className={`relative w-full ${getAspectRatioClass()} rounded-3xl overflow-hidden cursor-pointer group`}
        onClick={handleCardClick}
      >
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
        >
          {renderPreview()}
        </motion.div>
        
        {/* Overlay with View More button - ensure it works for all aspect ratios */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <button
            className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            onClick={handleViewMore}
          >
            View More
          </button>
        </div>
      </div>

      {/* Shadcn Dialog Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>{project.title}</DialogTitle>
            <DialogDescription>{project.description}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {aspectRatio === AspectRatio.PORTRAIT ? (
              /* Portrait mode slider */
              <div className="w-full overflow-x-auto">
                <div className="flex gap-4 py-2">
                  {validImages.map((img, index) => (
                    <div 
                      key={index}
                      className={`relative w-1/4 flex-shrink-0 aspect-[1/2.16] rounded-lg overflow-hidden`}
                    >
                      <Image
                        src={img}
                        alt={`${project.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Default landscape/square view */
              <div className="w-full rounded-lg max-h-[50vh] overflow-y-auto">
                {validImages.length > 0 && (
                  <div className="relative w-full">
                    <Image
                      src={validImages[selectedImageIndex] || "/placeholder-image.jpg"}
                      alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                      width={1200}
                      height={800}
                      className="w-full h-auto"
                      style={{ maxWidth: '100%' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Image thumbnails - only show for non-portrait mode */}
            {validImages.length > 1 && aspectRatio !== AspectRatio.PORTRAIT && (
              <div className="flex gap-2 overflow-x-auto py-2 px-2">
                {validImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      selectedImageIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard; 