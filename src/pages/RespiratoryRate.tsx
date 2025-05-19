
import React, { useState, useEffect } from "react";
import { Mic, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeasurementProgress } from "@/components/measurements/MeasurementProgress";
import { MeasurementResults } from "@/components/measurements/MeasurementResults";
import { useVitalSignsStore } from "@/stores/vitalSignsStore";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/background";
import { AnimatedIcon } from "@/components/vitals/AnimatedIcon";
import { cn } from "@/lib/utils";

const RespiratoryRate = () => {
  const { startMeasurement, isCollectingData, resetCurrent, currentResult } = useVitalSignsStore();
  const { toast } = useToast();
  const [showInstructions, setShowInstructions] = useState(true);
  const [progress, setProgress] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [waveAmplitude, setWaveAmplitude] = useState(0);
  
  useEffect(() => {
    let timer: number;
    let breathTimer: number;
    let waveTimer: number;
    
    if (isCollectingData) {
      setProgress(0);
      setBreathCount(0);
      
      // Progress timer
      timer = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      // Breath counter
      breathTimer = window.setInterval(() => {
        setBreathCount(prev => {
          // Don't exceed expected respiratory rate
          if (prev < 16) return prev + 1;
          return prev;
        });
      }, 1800); // Average person takes about 15-20 breaths per minute
      
      // Wave animation
      waveTimer = window.setInterval(() => {
        setWaveAmplitude(prev => {
          // Create breathing pattern effect
          return prev > 40 ? 0 : prev + 10;
        });
      }, 200);
    }
    
    return () => {
      if (timer) clearInterval(timer);
      if (breathTimer) clearInterval(breathTimer);
      if (waveTimer) clearInterval(waveTimer);
    };
  }, [isCollectingData]);
  
  const handleStartMeasurement = async () => {
    setShowInstructions(false);
    try {
      await startMeasurement('respiratory');
      toast({
        title: "Measurement Complete",
        description: "Respiratory rate measurement was successful."
      });
    } catch (error) {
      toast({
        title: "Measurement Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handleCancel = () => {
    resetCurrent();
    setShowInstructions(true);
  };
  
  const handleNewMeasurement = () => {
    resetCurrent();
    setShowInstructions(true);
  };
  
  const renderResults = () => {
    if (!currentResult || !currentResult.respiratoryRate) return null;
    
    // Determine if respiratory rate is in normal range
    const isNormal = currentResult.respiratoryRate >= 12 && currentResult.respiratoryRate <= 20;
    const statusColor = isNormal ? 'bg-green-100 border-green-200' : 'bg-amber-100 border-amber-200';
    const textColor = isNormal ? 'text-green-600' : 'text-amber-600';
    const statusText = isNormal 
      ? 'Normal range' 
      : (currentResult.respiratoryRate < 12 ? 'Below normal range' : 'Above normal range');
    
    return (
      <div className="space-y-6">
        <Card className={cn(
          "p-6 rounded-lg text-center overflow-hidden relative border transition-all duration-300",
          statusColor
        )}>
          <div className="text-vital-respiratory font-medium mb-1 flex items-center justify-center gap-2">
            <AnimatedIcon type="respiratory" size="sm" />
            <span>Respiratory Rate</span>
          </div>
          
          {/* Animated lungs illustration */}
          <div className="my-4 flex justify-center">
            <svg width="100" height="80" viewBox="0 0 100 80">
              {/* Left lung */}
              <path 
                d="M45,20 C35,25 25,35 25,50 C25,65 35,75 45,70 Q 45,45 45,20" 
                fill="#90BE6D" 
                fillOpacity="0.2" 
                stroke="#90BE6D" 
                strokeWidth="1.5"
                className={isNormal ? "animate-breathe" : ""}
              />
              
              {/* Right lung */}
              <path 
                d="M55,20 C65,25 75,35 75,50 C75,65 65,75 55,70 Q 55,45 55,20" 
                fill="#90BE6D" 
                fillOpacity="0.2" 
                stroke="#90BE6D" 
                strokeWidth="1.5"
                className={isNormal ? "animate-breathe" : ""}
              />
              
              {/* Trachea */}
              <path 
                d="M50,10 L50,25 M45,20 L55,20" 
                stroke="#90BE6D" 
                strokeWidth="1.5" 
                fill="none"
              />
            </svg>
          </div>
          
          <div className="text-4xl font-bold text-vital-respiratory">{currentResult.respiratoryRate}</div>
          <div className="text-sm text-gray-500 mt-1">breaths per minute</div>
          
          <div className="mt-3">
            <span className={cn(
              "px-3 py-1 rounded-full inline-block text-sm font-medium",
              textColor
            )}>
              {statusText}
            </span>
          </div>
        </Card>
        
        <Card className="p-3 bg-gray-50 rounded text-sm space-y-2 border border-gray-200">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 100 80">
                <path d="M45,20 C35,25 25,35 25,50 C25,65 35,75 45,70 Q 45,45 45,20" fill="#90BE6D" fillOpacity="0.2" stroke="#90BE6D" strokeWidth="1.5"/>
                <path d="M55,20 C65,25 75,35 75,50 C75,65 65,75 55,70 Q 55,45 55,20" fill="#90BE6D" fillOpacity="0.2" stroke="#90BE6D" strokeWidth="1.5"/>
                <path d="M50,10 L50,25 M45,20 L55,20" stroke="#90BE6D" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div>
              <p className="font-medium mb-1">Normal Respiratory Rate Range:</p>
              <p className="text-gray-600">
                Normal adult respiratory rate typically ranges from 12-20 breaths per minute.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 p-2 bg-amber-50 rounded border border-amber-100">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <p className="text-amber-700 text-sm">
              This measurement is an estimate and should not replace professional medical assessment.
            </p>
          </div>
        </Card>
      </div>
    );
  };
  
  // Generate points for breathing waveform visualization
  const generateWavePoints = () => {
    const points = [];
    const width = 300;
    const height = 80;
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const yOffset = Math.sin(i / segments * Math.PI * 2 + progress / 10) * waveAmplitude;
      const y = height / 2 + yOffset;
      points.push(`${x},${y}`);
    }
    
    return points.join(' ');
  };
  
  return (
    <BackgroundGradient className="space-y-6" intensity="light">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-vital-respiratory to-green-500 bg-clip-text text-transparent flex items-center gap-2">
          Respiratory Rate
          <AnimatedIcon type="respiratory" size="sm" />
        </h1>
        <p className="text-muted-foreground">
          Measure your breathing rate using your device's microphone
        </p>
      </div>
      
      {showInstructions && !isCollectingData && !currentResult && (
        <div className="max-w-md mx-auto space-y-6">
          <Card className="p-5 border-white/20 shadow-glass bg-gradient-to-br from-green-50 to-emerald-50 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Mic className="text-vital-respiratory" />
              <span>How to take a measurement</span>
            </h2>
            
            <ol className="space-y-4 ml-6">
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-respiratory flex items-center justify-center text-white text-xs">
                  1
                </div>
                <p>Find a quiet environment with minimal background noise</p>
              </li>
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-respiratory flex items-center justify-center text-white text-xs">
                  2
                </div>
                <p>Hold your device approximately 8-12 inches from your mouth</p>
              </li>
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-respiratory flex items-center justify-center text-white text-xs">
                  3
                </div>
                <p>Breathe normally through your mouth for 30 seconds</p>
              </li>
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-respiratory flex items-center justify-center text-white text-xs">
                  4
                </div>
                <p>Try to remain still and minimize other noises during measurement</p>
              </li>
            </ol>
            
            <div className="text-sm text-gray-600 p-3 bg-white/50 rounded-lg">
              <p className="font-medium text-vital-respiratory">How it works:</p>
              <p>This method works by detecting sound patterns of inhalation and exhalation using your device's microphone.</p>
            </div>
          </Card>
          
          <Button 
            onClick={handleStartMeasurement} 
            size="lg" 
            className="w-full bg-gradient-to-r from-vital-respiratory to-green-500 text-white hover:opacity-90 transition-all duration-300"
          >
            Start Measurement
          </Button>
        </div>
      )}
      
      {isCollectingData && (
        <div className="max-w-md mx-auto">
          <MeasurementProgress
            title="Measuring Respiratory Rate"
            description="Please breathe normally for 30 seconds"
            icon={<Mic className="h-5 w-5 text-vital-respiratory" />}
            onCancel={handleCancel}
            progress={progress}
          >
            <div className="mt-8">
              <div className="relative h-48 w-full mx-auto bg-gray-50 rounded-lg p-4 border border-gray-200">
                {/* Sound wave visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="80" className="overflow-visible">
                    <polyline
                      points={generateWavePoints()}
                      fill="none"
                      stroke="#90BE6D"
                      strokeWidth="2"
                      className="transition-all duration-200 ease-in-out"
                    />
                  </svg>
                </div>
                
                {/* Breaths counted and microphone animation */}
                <div className="absolute inset-x-0 bottom-4 text-center">
                  <div className="inline-block relative">
                    <Mic className={cn(
                      "h-8 w-8 text-vital-respiratory mx-auto mb-2",
                      waveAmplitude > 20 ? "opacity-100" : "opacity-50"
                    )} />
                    <span className={cn(
                      "absolute top-0 right-0 h-3 w-3 rounded-full bg-vital-respiratory",
                      waveAmplitude > 20 ? "opacity-100" : "opacity-50"
                    )}></span>
                  </div>
                  <div className="text-sm text-gray-500">Breaths detected:</div>
                  <div className="text-2xl font-bold text-vital-respiratory">{breathCount}</div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  Cancel Measurement
                </Button>
              </div>
            </div>
          </MeasurementProgress>
        </div>
      )}
      
      {currentResult && !isCollectingData && (
        <div className="max-w-md mx-auto">
          <MeasurementResults
            title="Respiratory Rate Results"
            icon={<Mic className="h-5 w-5 text-vital-respiratory" />}
            onNewMeasurement={handleNewMeasurement}
            renderResults={renderResults}
          />
        </div>
      )}
    </BackgroundGradient>
  );
};

export default RespiratoryRate;
