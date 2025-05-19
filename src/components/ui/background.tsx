
import * as React from "react"
import { cn } from "@/lib/utils"

interface BackgroundGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "high";
}

export function BackgroundGradient({
  className,
  children,
  intensity = "medium",
  ...props
}: BackgroundGradientProps) {
  const opacityMap = {
    light: "opacity-10",
    medium: "opacity-20",
    high: "opacity-30"
  };
  
  const sizeMap = {
    light: "w-64 h-64",
    medium: "w-72 h-72",
    high: "w-96 h-96"
  };
  
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Top left blob */}
        <div 
          className={cn(
            "absolute -top-10 -left-10", 
            sizeMap[intensity],
            "bg-vital-heartRate rounded-full mix-blend-multiply filter blur-3xl",
            opacityMap[intensity],
            "animate-float"
          )}
        ></div>
        
        {/* Top right blob */}
        <div 
          className={cn(
            "absolute -top-10 -right-10", 
            sizeMap[intensity],
            "bg-vital-spo2 rounded-full mix-blend-multiply filter blur-3xl",
            opacityMap[intensity],
            "animate-float"
          )} 
          style={{ animationDelay: "2s" }}
        ></div>
        
        {/* Middle blob */}
        <div 
          className={cn(
            "absolute top-1/4 left-1/3", 
            sizeMap[intensity],
            "bg-vital-respiratory rounded-full mix-blend-multiply filter blur-3xl",
            opacityMap[intensity],
            "animate-float"
          )}
          style={{ animationDelay: "4s" }}
        ></div>
        
        {/* Bottom left blob */}
        <div 
          className={cn(
            "absolute -bottom-10 left-20", 
            sizeMap[intensity],
            "bg-vital-bloodPressure rounded-full mix-blend-multiply filter blur-3xl",
            opacityMap[intensity],
            "animate-float"
          )}
          style={{ animationDelay: "6s" }}
        ></div>
        
        {/* Bottom right blob */}
        <div 
          className={cn(
            "absolute -bottom-10 right-20", 
            sizeMap[intensity],
            "bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl",
            opacityMap[intensity],
            "animate-float"
          )}
          style={{ animationDelay: "8s" }}
        ></div>
      </div>
      
      {/* Content */}
      <div className={cn(
        "relative z-10 transition-all duration-500", 
        className
      )} {...props}>
        {children}
      </div>
    </div>
  );
}
