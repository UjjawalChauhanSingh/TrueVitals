
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVitalSignsStore } from "@/stores/vitalSignsStore";
import { Check } from "lucide-react";

interface MeasurementResultsProps {
  title: string;
  icon: React.ReactNode;
  onNewMeasurement: () => void;
  renderResults: () => React.ReactNode;
}

export const MeasurementResults = ({
  title,
  icon,
  onNewMeasurement,
  renderResults
}: MeasurementResultsProps) => {
  const { currentResult } = useVitalSignsStore();
  
  if (!currentResult) return null;
  
  const timestamp = new Date(currentResult.timestamp).toLocaleString();
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
            <Check className="h-4 w-4" />
          </span>
          <CardTitle className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </div>
        <CardDescription>Measurement taken at {timestamp}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderResults()}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onNewMeasurement}>Take Another Measurement</Button>
      </CardFooter>
    </Card>
  );
};
