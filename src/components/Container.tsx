"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Container({ children, className, id }: ContainerProps) {
  return (
    <section id={id} className="w-full flex justify-center">
      <div className={cn("justify-center md:max-w-[1200px]", className)}>
        {children}
      </div>
    </section>
  );
} 