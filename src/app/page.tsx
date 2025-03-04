"use client";

import { Container } from "@/components/Container";
import projectsData from "@/data/projects.json";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Project, AspectRatio, PhotoCollection } from "@/types/project";
import { CardGradient } from "@/components/CardGradient";
import { ProjectTabs, TabType } from "@/components/ProjectTabs";
import { ProjectInfo } from "@/components/ProjectInfo";
import ProjectCard from "@/components/ProjectCard";
import { ScrollVideoAnimation } from "@/components/ScrollVideoAnimation";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AnimatedDesignElement } from "@/components/AnimatedDesignElement";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Record<number, TabType>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [isWebHovered, setIsWebHovered] = useState(false);
  const [isMobileHovered, setIsMobileHovered] = useState(false);
  const [isLandingHovered, setIsLandingHovered] = useState(false);

  // Count total images to preload
  useEffect(() => {
    let count = 0; 

    // Count main images and background gradients
    projectsData.projects.forEach(project => {
      
      // Count background gradient if it exists
      if (project.bgGradient) {
        count += 1;
      }

      // Count strategy photos
      if (project.strategyPhotos) {
        const photos = Array.isArray(project.strategyPhotos) 
          ? project.strategyPhotos 
          : (project.strategyPhotos as PhotoCollection).photos;
        count += photos.length;
      }

      // Count solution photos
      if (project.solutionPhotos) {
        const photos = Array.isArray(project.solutionPhotos) 
          ? project.solutionPhotos 
          : (project.solutionPhotos as PhotoCollection).photos;
        count += photos.length;
      }

      // Count development photos
      if (project.developmentPhotos) {
        const photos = Array.isArray(project.developmentPhotos) 
          ? project.developmentPhotos 
          : (project.developmentPhotos as PhotoCollection).photos;
        count += photos.length;
      }
      
      // Count company logo if it exists
      if (project.companyLogo) {
        count += 1;
      }
    });

    console.log(`Total images to preload: ${count}`);
    setTotalImages(count);
  }, []);

  // Preload all images
  useEffect(() => {
    if (totalImages === 0) return;

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        // Skip empty or invalid URLs
        if (!src || typeof src !== 'string' || src.trim() === '') {
          console.warn(`Skipping invalid image source: ${src}`);
          setImagesLoaded(prev => prev + 1);
          resolve();
          return;
        }

        console.log(`Preloading image: ${src}`);
        const img = new window.Image();
        
        img.onload = () => {
          console.log(`Loaded image: ${src}`);
          setImagesLoaded(prev => prev + 1);
          resolve();
        };
        
        img.onerror = (error) => {
          console.error(`Failed to load image: ${src}`, error);
          // Still count as loaded even if there's an error
          setImagesLoaded(prev => prev + 1);
          resolve();
        };
        
        // Set src after adding event handlers
        img.src = src;
      });
    };

    const preloadAllImages = async () => {
      const imagePromises: Promise<void>[] = [];

      // Preload all project images
      projectsData.projects.forEach(project => {

        // Background gradient
        if (project.bgGradient) {
          imagePromises.push(preloadImage(project.bgGradient));
        }

        // Strategy photos
        if (project.strategyPhotos) {
          const photos = Array.isArray(project.strategyPhotos) 
            ? project.strategyPhotos 
            : (project.strategyPhotos as PhotoCollection).photos;
            
          photos.forEach((photo: string) => {
            imagePromises.push(preloadImage(photo));
          });
        }

        // Solutions photos
        if (project.solutionPhotos) {
          const photos = Array.isArray(project.solutionPhotos) 
            ? project.solutionPhotos 
            : (project.solutionPhotos as PhotoCollection).photos;
            
          photos.forEach((photo: string) => {
            imagePromises.push(preloadImage(photo));
          });
        }

        // Development photos
        if (project.developmentPhotos) {
          const photos = Array.isArray(project.developmentPhotos) 
            ? project.developmentPhotos 
            : (project.developmentPhotos as PhotoCollection).photos;
            
          photos.forEach((photo: string) => {
            imagePromises.push(preloadImage(photo));
          });
        }

        // Company logo
        if (project.companyLogo) {
          imagePromises.push(preloadImage(project.companyLogo));
        }
      });

      console.log(`Total images to load: ${imagePromises.length}`);

      try {
        // Wait for all images to load
        await Promise.all(imagePromises);
        console.log("All images loaded successfully");
        
        // Ensure we set loading progress to 100% to trigger the onComplete callback
        setTimeout(() => {
          console.log("Setting imagesLoaded to totalImages to ensure 100% completion");
          setImagesLoaded(totalImages);
        }, 500);
      } catch (error) {
        console.error("Error loading images:", error);
        // Even if there's an error, we should still finish loading
        setTimeout(() => {
          console.log("Setting imagesLoaded to totalImages after error");
          setImagesLoaded(totalImages);
        }, 500);
      }
    };

    preloadAllImages();
  }, [totalImages]);

  // Add scroll handler
  useEffect(() => {
    // Prevent scrolling during loading
    if (isLoading) {
      document.body.style.overflow = "hidden";
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      // Calculate progress as a value between 0 and 1
      // Use a smaller divisor to make the fade happen more quickly
      const progress = Math.min(Math.max(scrollPosition / (windowHeight * 0.5), 0), 1);
      setScrollProgress(progress);
    };

    // Initial calculation
    handleScroll();

    // Add event listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  const handleTabChange = (e: React.MouseEvent, projectId: number, tab: TabType) => {
    e.stopPropagation(); // Prevent card click when clicking on tabs
    setActiveTab(prev => ({
      ...prev,
      [projectId]: tab
    }));
  };

  // Get the appropriate images based on the active tab
  const getImagesForTab = (project: Project, tab: TabType): string[] => {
    let photoSource;
    
    switch (tab) {
      case "Strategy":
        photoSource = project.strategyPhotos;
        break;
      case "Solutions":
        photoSource = project.solutionPhotos;
        break;
      case "Final Result":
        photoSource = project.developmentPhotos;
        break;
      default:
        return [];
    }
    
    // Handle both string[] and PhotoCollection formats
    if (!photoSource) {
      return [];
    } else if (Array.isArray(photoSource)) {
      return photoSource;
    } else {
      return photoSource.photos;
    }
  };

  // Get the aspect ratio for a specific tab
  const getAspectRatioForTab = (project: Project, tab: TabType | null): AspectRatio => {
    // If tab is null or undefined, return default aspect ratio
    if (!tab) {
      return AspectRatio.LANDSCAPE;
    }
    
    let photoSource;
    
    switch (tab) {
      case "Strategy":
        photoSource = project.strategyPhotos;
        break;
      case "Solutions":
        photoSource = project.solutionPhotos;
        break;
      case "Final Result":
        photoSource = project.developmentPhotos;
        break;
      default:
        return AspectRatio.LANDSCAPE; // Default
    }
    
    // Return the aspect ratio if it's a PhotoCollection, otherwise default to landscape
    if (!photoSource) {
      return AspectRatio.LANDSCAPE;
    } else if (Array.isArray(photoSource)) {
      return AspectRatio.LANDSCAPE; // Default for legacy format
    } else {
      return photoSource.type;
    }
  };

  // Get available tabs for a project (only tabs with photos)
  const getAvailableTabs = (project: Project): TabType[] => {
    const tabs: TabType[] = [];

    // Use custom tabs from project if available
    if (project.tabs && project.tabs.length > 0) {
      return project.tabs as TabType[];
    }

    // Otherwise, determine tabs based on available photos
    if (project.strategyPhotos) {
      const hasPhotos = Array.isArray(project.strategyPhotos) 
        ? project.strategyPhotos.length > 0 
        : project.strategyPhotos.photos.length > 0;
      
      if (hasPhotos) {
        tabs.push("Strategy");
      }
    }

    if (project.solutionPhotos) {
      const hasPhotos = Array.isArray(project.solutionPhotos) 
        ? project.solutionPhotos.length > 0 
        : project.solutionPhotos.photos.length > 0;
      
      if (hasPhotos) {
        tabs.push("Solutions");
      }
    }

    if (project.developmentPhotos) {
      const hasPhotos = Array.isArray(project.developmentPhotos) 
        ? project.developmentPhotos.length > 0 
        : project.developmentPhotos.photos.length > 0;
      
      if (hasPhotos) {
        tabs.push("Final Result");
      }
    }

    return tabs;
  };

  // Calculate opacity based on scroll progress
  const headerOpacity = 1 - scrollProgress;
  const headerScale = 1 - (0.2 * scrollProgress);

  // Calculate loading progress percentage
  const loadingProgress = totalImages > 0 
    ? Math.min(Math.round((imagesLoaded / totalImages) * 100), 100) 
    : 0;
  
  // Log loading progress when it changes
  useEffect(() => {
    console.log(`Loading progress: ${loadingProgress.toFixed(2)}% (${imagesLoaded}/${totalImages} images)`);
    if(loadingProgress >= 100) {
      setIsLoading(false);
    }
  }, [loadingProgress, imagesLoaded, totalImages]);

  // Helper function to determine the correct image folder based on hover states
  const getImageFolder = () => {
    if (isWebHovered) return "web";
    if (isMobileHovered) return "mobile";
    if (isLandingHovered) return "landing";
    return "web"; // Default folder
  };

  return (
    <>
      <main>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen
              progress={loadingProgress}
                />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Container
                id="header-section"
                className="fixed top-0 h-screen px-8 dark:bg-black lg:px-64 md:px-24"
              >
                <motion.div
                  className="flex flex-col gap-2 h-full justify-center relative w-full"
                  style={{
                    opacity: headerOpacity,
                    scale: headerScale,
                  }}
                >
                  {/* Absolutely positioned images with dynamic folder path */}
                  <AnimatedDesignElement
                    src={`/gifs/${getImageFolder()}/1.png`}
                    alt="Design element 1"
                    className="w-48"
                    style={{ top: '30%', right: '0%', left: 'auto' }}
                    isActive={isWebHovered || isMobileHovered || isLandingHovered}
                    delay={0.05}
                  />
                  <AnimatedDesignElement
                    src={`/gifs/${getImageFolder()}/2.png`}
                    alt="Design element 2"
                    className="w-64"
                    style={{ top: '30%', right: '-25%', left: 'auto' }}
                    isActive={isWebHovered || isMobileHovered || isLandingHovered}
                    delay={0.1}
                  />
                  <AnimatedDesignElement
                    src={`/gifs/${getImageFolder()}/3.png`}
                    alt="Design element 3"
                    className="w-48"
                    style={{ top: '30%', left: '-15%', right: '-40%' }}
                    isActive={isWebHovered || isMobileHovered || isLandingHovered}
                    delay={0.2}
                  />
                  <AnimatedDesignElement
                    src={`/gifs/${getImageFolder()}/4.png`}
                    alt="Design element 4"
                    className="w-48"
                    style={{ top: '35%', left: '-30%' }}
                    isActive={isWebHovered || isMobileHovered || isLandingHovered}
                    delay={0.25}
                  />
                  <AnimatedDesignElement
                    src={`/gifs/${getImageFolder()}/5.png`}
                    alt="Design element 5"
                    className="w-48"
                    style={{ top: '43%', right: '-20%', left: 'auto' }}
                    isActive={isWebHovered || isMobileHovered || isLandingHovered}
                    delay={0.3}
                  />
                  <AnimatedDesignElement
                    src={`/gifs/${getImageFolder()}/6.png`}
                    alt="Design element 6"
                    className="w-48"
                    style={{ top: '43%', left: '-27%' }}
                    isActive={isWebHovered || isMobileHovered || isLandingHovered}
                    delay={0.35}
                  />

                  <h1 className="text-2xl font-bold sm:text-4xl">
                    Hey. I&apos;m Landon. Welcome to my portfolio. Here you&apos;ll find all of my product design work from over the past 6 years. Ranging from
                    <motion.span
                      className="text-zinc-400 leading-tight cursor-pointer"
                      whileHover={{ color: "#1070FF" }}
                      whileTap={{ color: "#1070FF" }}
                      transition={{ duration: 0.3 }}
                      onMouseEnter={() => {
                        setIsMobileHovered(true);
                        setIsWebHovered(false);
                        setIsLandingHovered(false);
                      }}
                      onMouseLeave={() => setIsMobileHovered(false)}
                      onTap={() => {
                        setIsMobileHovered(true);
                        setIsWebHovered(false);
                        setIsLandingHovered(false);
                      }}
                    > mobile apps </motion.span> to
                    <motion.span
                      className="text-zinc-400 leading-tight cursor-pointer"
                      whileHover={{ color: "#1070FF" }}
                      whileTap={{ color: "#1070FF" }}
                      transition={{ duration: 0.3 }}
                      onMouseEnter={() => {
                        setIsWebHovered(true);
                        setIsMobileHovered(false);
                        setIsLandingHovered(false);
                      }}
                      onMouseLeave={() => setIsWebHovered(false)}
                      onTap={() => {
                        setIsWebHovered(true);
                        setIsMobileHovered(false);
                        setIsLandingHovered(false);
                      }}
                    > web apps </motion.span> to
                    <motion.span
                      className="text-zinc-400 leading-tight cursor-pointer"
                      whileHover={{ color: "#1070FF" }}
                      whileTap={{ color: "#1070FF" }}
                      transition={{ duration: 0.3 }}
                      onMouseEnter={() => {
                        setIsLandingHovered(true);
                        setIsWebHovered(false);
                        setIsMobileHovered(false);
                      }}
                      onMouseLeave={() => setIsLandingHovered(false)}
                      onTap={() => {
                        setIsLandingHovered(true);
                        setIsWebHovered(false);
                        setIsMobileHovered(false);
                      }}
                    > landing page design. </motion.span>
                    <span>Scroll to start</span>
                    <ScrollVideoAnimation
                      videoSrc="/scroll.webm"
                      width={24}
                      height={20}
                      className="ml-2"
                    />
                  </h1>
                </motion.div>
              </Container>

              {/* Updated main content section */}
              <div
                className="relative flex flex-col p-8"
                style={{ marginTop: "100vh" }}
              >
                {projectsData.projects.map((project, index) => {
                  // Get available tabs for this project
                  const availableTabs = getAvailableTabs(project as Project);

                  // Set default active tab if not already set or if current tab is not available
                  const currentTab = activeTab[project.id] && availableTabs.includes(activeTab[project.id])
                    ? activeTab[project.id]
                    : availableTabs.length > 0 ? availableTabs[0] : null;

                  // Get the images for the current tab
                  const tabImages = currentTab ? getImagesForTab(project as Project, currentTab) : [];

                  return (
                    <Container id={`project-${project.id}`} key={project.id}>
                      {/* Separator (not for the first project) */}
                      {index > 0 && (
                        <div className="flex justify-center my-8">
                          <motion.div
                            className="w-px h-[10rem] origin-top bg-gradient-to-b from-white to-zinc-300 dark:to-zinc-700"
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true, }}
                            transition={{
                              duration: 1,
                              ease: [0.25, 0.1, 0.25, 1.0],
                              delay: 0.6,
                            }}
                          />
                        </div>
                      )}
                      <motion.div
                        className="flex flex-col"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.8,
                            ease: [0.25, 0.1, 0.25, 1.0],
                            delay: 0.6
                          }
                        }}
                        viewport={{ once: true }}
                      >
                        {/* Card with image slider */}
                        <motion.div
                          className="w-full aspect-[1.7/1] rounded-3xl overflow-hidden relative"
                        >
                          {/* Background gradient image */}
                          {project.bgGradient ? (
                            <Image
                              src={project.bgGradient}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority
                            />
                          ) : (
                            <CardGradient />
                          )}

                          {/* Tabs component - only show if there are available tabs */}
                          {availableTabs.length > 0 && (
                            <ProjectTabs
                              activeTab={currentTab as TabType}
                              projectId={project.id}
                              onTabChange={handleTabChange}
                              availableTabs={availableTabs}
                            />
                          )}

                          {/* Replace ProjectSlider with ProjectCard - only show if there are images */}
                          {tabImages.length > 0 && (
                            <ProjectCard
                              project={project as Project}
                              images={tabImages}
                              previewImage={tabImages.length > 0 ? tabImages[0] : undefined}
                              aspectRatio={currentTab ? getAspectRatioForTab(project as Project, currentTab as TabType) : AspectRatio.LANDSCAPE}
                            />
                          )}
                        </motion.div>

                         <motion.div
                           initial={{ opacity: 0 }}
                           whileInView={{ opacity: 1 }}
                           viewport={{ once: true, margin: "-30%" }}
                           transition={{ duration: 0.6, delay: 0.3 }}
                         >
                           <ProjectInfo project={project as Project} />
                         </motion.div>
                      </motion.div>
                    </Container>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}