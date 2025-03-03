"use client";


import Image from "next/image";

export type TabType = "Strategy" | "Solutions" | "Final Result";

interface ProjectTabsProps {
  activeTab: TabType;
  projectId: number;
  onTabChange: (e: React.MouseEvent, projectId: number, tab: TabType) => void;
  availableTabs?: TabType[];
}

export function ProjectTabs({ activeTab, projectId, onTabChange, availableTabs = ["Strategy", "Solutions", "Final Result"] }: ProjectTabsProps) {
  // If no tabs are available, don't render anything
  if (availableTabs.length === 0) {
    return null;
  }
  
  return (
    <div className="absolute z-20 left-1/2 top-4 -translate-x-1/2 rounded-2xl border-2 border-white/20 backdrop-blur-md bg-white/20">
      <div className="flex items-center p-2">
      {availableTabs.includes("Strategy") && (
        <TabButton 
          isActive={activeTab === "Strategy"}
          onClick={(e) => onTabChange(e, projectId, "Strategy")}
          label="Strategy"
          icon={
            <Image 
              src="/icons/planning.png" 
              width={16} 
              height={16} 
              alt="" 
              className="mr-2" 
            />
          }
        />
      )}
      
      {availableTabs.includes("Strategy") && (availableTabs.includes("Solutions") || availableTabs.includes("Final Result")) && (
        <div className="mx-1 text-black opacity-50">
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 4H1M15 4L12 1M15 4L12 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      
      {availableTabs.includes("Solutions") && (
        <TabButton 
          isActive={activeTab === "Solutions"}
          onClick={(e) => onTabChange(e, projectId, "Solutions")}
          label="Solutions"
          icon={
            <Image 
              src="/icons/designing.png" 
              width={16} 
              height={16} 
              alt="" 
              className="mr-2" 
            />
          }
        />
      )}
      
      {availableTabs.includes("Solutions") && availableTabs.includes("Final Result") && (
        <div className="mx-1 text-black opacity-50">
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 4H1M15 4L12 1M15 4L12 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      
      {availableTabs.includes("Final Result") && (
        <TabButton 
          isActive={activeTab === "Final Result"}
          onClick={(e) => onTabChange(e, projectId, "Final Result")}
          label="Final Result"
          icon={
            <Image 
              src="/icons/development.png" 
              width={16} 
              height={16} 
              alt="" 
              className="mr-2" 
            />
          }
        />
      )}
      </div>
    </div>
  );
}

interface TabButtonProps {
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  icon: React.ReactNode;
}

function TabButton({ isActive, onClick, label, icon }: TabButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
        isActive 
          ? "text-black dark:text-white opacity-100" 
          : "text-black dark:text-white opacity-50 hover:opacity-80"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
} 