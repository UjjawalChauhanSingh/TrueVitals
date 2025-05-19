
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  isLoading?: boolean;
  className?: string;
}

export const VitalCard = ({
  title,
  value,
  unit,
  description,
  icon,
  color = "bg-health-200",
  isLoading = false,
  className
}: VitalCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("p-4", color)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {icon && <div className="h-6 w-6">{icon}</div>}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6 flex items-baseline justify-center">
        {isLoading ? (
          <div className="animate-pulse flex space-x-2">
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
            <div className="h-6 w-8 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-sm ml-1 text-gray-500">{unit}</span>
          </>
        )}
      </CardContent>
    </Card>
  );
};
