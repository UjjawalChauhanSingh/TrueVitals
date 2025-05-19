
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedIcon } from "./AnimatedIcon";
import { Card } from "@/components/ui/card";

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  type: "heartRate" | "spo2" | "respiratory" | "bloodPressure";
  description?: string;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

export const VitalCard = ({
  title,
  value,
  unit,
  type,
  description,
  isLoading = false,
  className,
  onClick
}: VitalCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const bgColorMap = {
    heartRate: "bg-gradient-to-br from-pink-50 to-rose-100",
    spo2: "bg-gradient-to-br from-blue-50 to-cyan-100", 
    respiratory: "bg-gradient-to-br from-green-50 to-emerald-100",
    bloodPressure: "bg-gradient-to-br from-purple-50 to-violet-100"
  };
  
  const colorMap = {
    heartRate: "text-vital-heartRate",
    spo2: "text-vital-spo2",
    respiratory: "text-vital-respiratory",
    bloodPressure: "text-vital-bloodPressure"
  };

  const valueIsInRange = () => {
    if (type === "heartRate") {
      const hr = Number(value);
      return hr >= 60 && hr <= 100;
    }
    if (type === "spo2") {
      const spo2 = Number(value);
      return spo2 >= 95;
    }
    if (type === "respiratory") {
      const resp = Number(value);
      return resp >= 12 && resp <= 20;
    }
    if (type === "bloodPressure" && typeof value === "string") {
      const [systolic, diastolic] = value.split('/').map(Number);
      return systolic < 120 && diastolic < 80;
    }
    return true;
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden backdrop-blur-md border border-white/20",
        "shadow-glass transition-all duration-500",
        "cursor-pointer rounded-2xl",
        bgColorMap[type],
        isHovered && "scale-105 shadow-lg",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 flex items-center justify-between">
        <h3 className={cn("text-lg font-medium transition-all duration-300", colorMap[type])}>
          {title}
        </h3>
        <div className={cn("transition-all duration-500", isHovered && "rotate-12 scale-110")}>
          <AnimatedIcon type={type} size="md" />
        </div>
      </div>
      
      <div className="p-5 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center space-y-2 w-full">
            <div className="h-10 w-24 bg-gray-200/50 rounded"></div>
            <div className="h-4 w-8 bg-gray-200/50 rounded"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center transition-all duration-300">
            <div className="flex items-baseline">
              <span className={cn(
                "text-4xl font-bold transition-all duration-500", 
                colorMap[type], 
                isHovered && "scale-110"
              )}>{value}</span>
              <span className={cn("text-sm ml-1 opacity-60", colorMap[type])}>{unit}</span>
            </div>
            {description && (
              <span className="text-xs mt-1 text-gray-500">{description}</span>
            )}
            {isHovered && (
              <div className={cn(
                "mt-2 text-xs px-2 py-0.5 rounded-full transition-all duration-300", 
                valueIsInRange() ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              )}>
                {valueIsInRange() ? "Normal" : "Abnormal"}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom indicator bar */}
      <div className={cn(
        "h-1 w-full transition-all duration-500",
        type === "heartRate" && "bg-vital-heartRate/50",
        type === "spo2" && "bg-vital-spo2/50",
        type === "respiratory" && "bg-vital-respiratory/50",
        type === "bloodPressure" && "bg-vital-bloodPressure/50"
      )}/>
    </Card>
  );
};
