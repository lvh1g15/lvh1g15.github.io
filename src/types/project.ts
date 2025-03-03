export interface Project {
  id: number;
  title: string;
  description: string;
  bgGradient: string;
  technologies: string[];
  titleRoleDescription: string;
  year: number;
  role: string;
  client: string;
  duration: string;
  
  // New fields for the updated design
  companyLogo?: string;
  companyName?: string;
  companyDescription?: string;
  roleDescription?: string;
  contributions?: string[];
  
  // Photo collections for each tab with aspect ratio type
  strategyPhotos?: PhotoCollection | string[];
  solutionPhotos?: PhotoCollection | string[];
  developmentPhotos?: PhotoCollection | string[];
  
  // Custom tabs
  tabs?: string[];
  
  // Product link for "View Site" button
  productLink?: string;
}

// New interface for photo collections with aspect ratio type
export interface PhotoCollection {
  type: AspectRatio;
  photos: string[];
}

// Enum for aspect ratio types
export enum AspectRatio {
  LANDSCAPE = "landscape",
  PORTRAIT = "portrait",
  SQUARE = "square"
} 