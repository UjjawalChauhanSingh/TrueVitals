
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MeasurementButtonProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MeasurementButton = ({
  title,
  description,
  icon,
  onClick,
  className
}: MeasurementButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn("h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-health-100 hover:text-health-800 transition-all", className)}
      onClick={onClick}
    >
      <div className="mb-1">{icon}</div>
      <div className="text-lg font-medium">{title}</div>
      {description && <div className="text-xs text-gray-500">{description}</div>}
    </Button>
  );
};
