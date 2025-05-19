
import React from "react";
import { Heart, Mic, Activity, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  type: "heartRate" | "spo2" | "respiratory" | "bloodPressure";
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  type, 
  size = "md", 
  className,
  animate = true 
}) => {
  const sizeMap = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10"
  };

  const animationMap = {
    heartRate: "animate-pulse",
    spo2: "animate-breathe",
    respiratory: "animate-breathe",
    bloodPressure: "animate-wave"
  };

  const renderIcon = () => {
    switch (type) {
      case "heartRate":
        return (
          <div className={cn(
            "relative text-vital-heartRate transition-all duration-300", 
            animate && animationMap[type],
            sizeMap[size], 
            className
          )}>
            <Heart strokeWidth={1.5} className="h-full w-full" />
            {animate && (
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-vital-heartRate rounded-full animate-ping opacity-75"></span>
            )}
          </div>
        );
      
      case "spo2":
        return (
          <div className={cn(
            "relative text-vital-spo2 transition-all duration-300", 
            animate && animationMap[type],
            sizeMap[size], 
            className
          )}>
            <Droplet strokeWidth={1.5} className="h-full w-full" />
            {animate && (
              <div className="absolute inset-0 animate-pulse opacity-40">
                <Droplet strokeWidth={1.5} className="h-full w-full" />
              </div>
            )}
          </div>
        );
      
      case "respiratory":
        return (
          <div className={cn(
            "relative text-vital-respiratory transition-all duration-300", 
            animate && animationMap[type],
            sizeMap[size], 
            className
          )}>
            <Mic strokeWidth={1.5} className="h-full w-full" />
            {animate && (
              <div className="absolute inset-0 opacity-0 animate-ping">
                <Mic strokeWidth={1.5} className="h-full w-full" />
              </div>
            )}
          </div>
        );
      
      case "bloodPressure":
        return (
          <div className={cn(
            "relative text-vital-bloodPressure transition-all duration-300", 
            animate && animationMap[type],
            sizeMap[size], 
            className
          )}>
            <Activity strokeWidth={1.5} className="h-full w-full" />
            {animate && (
              <div className="absolute inset-0 animate-pulse opacity-40">
                <Activity strokeWidth={1.5} className="h-full w-full" />
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderIcon();
};
