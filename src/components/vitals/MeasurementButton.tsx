
import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedIcon } from "./AnimatedIcon";
import { Card } from "@/components/ui/card";

interface MeasurementButtonProps {
  title: string;
  description: string;
  type: "heartRate" | "spo2" | "respiratory" | "bloodPressure";
  onClick: () => void;
  className?: string;
}

export const MeasurementButton = ({
  title,
  description,
  type,
  onClick,
  className
}: MeasurementButtonProps) => {
  const colorMap = {
    heartRate: "bg-gradient-to-r from-pink-100/80 to-rose-50/80 hover:from-pink-200/80 hover:to-rose-100/80",
    spo2: "bg-gradient-to-r from-blue-100/80 to-cyan-50/80 hover:from-blue-200/80 hover:to-cyan-100/80",
    respiratory: "bg-gradient-to-r from-green-100/80 to-emerald-50/80 hover:from-green-200/80 hover:to-emerald-100/80",
    bloodPressure: "bg-gradient-to-r from-purple-100/80 to-violet-50/80 hover:from-purple-200/80 hover:to-violet-100/80"
  };

  const textColorMap = {
    heartRate: "text-vital-heartRate",
    spo2: "text-vital-spo2",
    respiratory: "text-vital-respiratory",
    bloodPressure: "text-vital-bloodPressure"
  };

  return (
    <Card
      className={cn(
        "p-5 cursor-pointer transition-all duration-500 border-white/20",
        "backdrop-blur-sm shadow-glass hover:shadow-lg transform hover:-translate-y-2",
        "flex flex-col gap-3 rounded-2xl h-full",
        colorMap[type],
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white/80 rounded-xl shadow-sm transition-all duration-300 group-hover:shadow-md">
          <AnimatedIcon type={type} size="md" />
        </div>
        <h3 className={cn("text-lg font-medium transition-all duration-300", textColorMap[type])}>
          {title}
        </h3>
      </div>
      
      <p className="text-sm text-gray-600">
        {description}
      </p>

      <div className={cn(
        "h-1 w-12 rounded-full mt-auto ml-auto transition-all duration-300",
        type === "heartRate" && "bg-vital-heartRate/30",
        type === "spo2" && "bg-vital-spo2/30",
        type === "respiratory" && "bg-vital-respiratory/30",
        type === "bloodPressure" && "bg-vital-bloodPressure/30"
      )}/>
    </Card>
  );
};
