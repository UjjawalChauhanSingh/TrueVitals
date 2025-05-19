
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useVitalSignsStore } from "@/stores/vitalSignsStore";
import { X } from "lucide-react";

interface MeasurementProgressProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onCancel: () => void;
  children?: React.ReactNode; // Children prop for custom content
  progress?: number; // Add progress prop to allow external progress control
}

export const MeasurementProgress = ({
  title,
  description,
  icon,
  onCancel,
  children,
  progress: externalProgress // Rename to avoid conflict with store progress
}: MeasurementProgressProps) => {
  const { progress: storeProgress, isCollectingData } = useVitalSignsStore();
  
  // Use external progress if provided, otherwise use progress from store
  const progressValue = externalProgress !== undefined ? externalProgress : storeProgress;
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} disabled={!isCollectingData}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
        
        <div className="text-center font-medium text-lg animate-pulse">
          {progressValue < 100 ? (
            "Please hold still during measurement..."
          ) : (
            "Processing results..."
          )}
        </div>
        
        {children} {/* Render children if provided */}
      </CardContent>
    </Card>
  );
};
