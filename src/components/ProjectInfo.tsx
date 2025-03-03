"use client";

import Image from "next/image";
import { Project } from "@/types/project";
import Link from "next/link";
import { ArrowUpRight } from "iconoir-react";

interface ProjectInfoProps {
  project: Project;
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 mt-10 p-8 bg-gray-50 dark:bg-zinc-900 rounded-3xl">
      {/* Company logo - takes remaining space on larger screens, full width on small */}
      <div className="align-top w-full md:w-[40%] flex-grow relative flex md:justify-start">
        {project.companyLogo && (
          <div className="relative h-12 w-28">
            <Image
              src={project.companyLogo}
              alt={project.companyName || project.title}
              fill
              className="object-contain object-top"
            />
          </div>
        )}
      </div>
      
      {/* Project information - fixed 60% width on larger screens, full width on small */}
      <div className="w-full md:w-[60%] flex-shrink-0">
        <h2 className="text-xl md:text-3xl font-bold mb-4">
        {project.companyDescription}
          {project.titleRoleDescription && (
            <span className="text-zinc-400">
              {" "} {project.titleRoleDescription}
            </span>
          )}
        </h2>
        
        <p className="text-zinc-700 dark:text-zinc-300 mb-6">
          {project.roleDescription || project.description}
        </p>
        
        {/* Responsibilities/Contributions */}
        {project.contributions && project.contributions.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {project.contributions.map((contribution, index) => (
              <span 
                key={index}
                className="px-5 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm"
              >
                {contribution}
              </span>
            ))}
          </div>
        )}
        
        {/* View Site Link */}
        {project.productLink && project.productLink.length > 0 && (
          <div className="mt-8">
            <Link 
              href={project.productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              View Site
              <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 