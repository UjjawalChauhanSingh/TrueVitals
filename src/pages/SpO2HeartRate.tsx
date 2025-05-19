
import React, { useState, useEffect } from "react";
import { Heart, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeasurementProgress } from "@/components/measurements/MeasurementProgress";
import { MeasurementResults } from "@/components/measurements/MeasurementResults";
import { useVitalSignsStore } from "@/stores/vitalSignsStore";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/background";
import { AnimatedIcon } from "@/components/vitals/AnimatedIcon";

const SpO2HeartRate = () => {
  const { startMeasurement, isCollectingData, resetCurrent, currentResult } = useVitalSignsStore();
  const { toast } = useToast();
  const [showInstructions, setShowInstructions] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let timer: number;
    if (isCollectingData) {
      setProgress(0);
      timer = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 1;
        });
      }, 300);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCollectingData]);
  
  const handleStartMeasurement = async () => {
    setShowInstructions(false);
    try {
      await startMeasurement('spo2-hr');
      toast({
        title: "Measurement Complete",
        description: "SpO₂ and Heart Rate measurement was successful."
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
    if (!currentResult || !currentResult.spo2 || !currentResult.heartRate) return null;
    
    // Determine if values are within normal range
    const spo2Normal = currentResult.spo2 >= 95;
    const hrNormal = currentResult.heartRate >= 60 && currentResult.heartRate <= 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-br from-vital-spo2/10 to-white rounded-lg text-center overflow-hidden relative border border-vital-spo2/20">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-vital-spo2/10 rounded-full blur-xl"></div>
            <div className="text-vital-spo2 font-medium mb-1 flex items-center justify-center gap-2">
              <AnimatedIcon type="spo2" size="sm" />
              <span>SpO₂</span>
            </div>
            <div className="text-4xl font-bold text-vital-spo2">{currentResult.spo2}%</div>
            <div className={cn(
              "text-xs mt-2 px-2 py-0.5 rounded-full inline-block",
              spo2Normal ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
            )}>
              {spo2Normal ? 'Normal' : 'Below normal'}
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-vital-heartRate/10 to-white rounded-lg text-center overflow-hidden relative border border-vital-heartRate/20">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-vital-heartRate/10 rounded-full blur-xl"></div>
            <div className="text-vital-heartRate font-medium mb-1 flex items-center justify-center gap-2">
              <AnimatedIcon type="heartRate" size="sm" />
              <span>Heart Rate</span>
            </div>
            <div className="text-4xl font-bold text-vital-heartRate">{currentResult.heartRate}</div>
            <div className="text-xs text-gray-500 mt-1">beats per minute</div>
            <div className={cn(
              "text-xs mt-2 px-2 py-0.5 rounded-full inline-block",
              hrNormal ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
            )}>
              {hrNormal ? 'Normal' : (currentResult.heartRate < 60 ? 'Below normal' : 'Above normal')}
            </div>
          </Card>
        </div>
        
        <Card className="p-4 bg-amber-50 rounded text-sm border border-amber-100">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1 text-amber-700">Important Note:</p>
              <p className="text-amber-600">
                These measurements are estimates and should not be used for medical diagnosis.
                Consult a healthcare professional for accurate readings.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  return (
    <BackgroundGradient className="space-y-6" intensity="light">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-vital-spo2 to-vital-heartRate bg-clip-text text-transparent flex items-center gap-2">
          SpO₂ & Heart Rate
          <AnimatedIcon type="heartRate" size="sm" />
        </h1>
        <p className="text-muted-foreground">
          Measure blood oxygen saturation and heart rate using your device's camera
        </p>
      </div>
      
      {showInstructions && !isCollectingData && !currentResult && (
        <div className="max-w-md mx-auto space-y-6">
          <Card className="p-5 border-white/20 shadow-glass bg-gradient-to-br from-blue-50 to-pink-50 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Camera className="text-vital-spo2" />
              <span>How to take a measurement</span>
            </h2>
            
            <ol className="space-y-4 ml-6">
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-spo2 flex items-center justify-center text-white text-xs">
                  1
                </div>
                <p>Place your fingertip over your device's camera and flash</p>
              </li>
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-spo2 flex items-center justify-center text-white text-xs">
                  2
                </div>
                <p>Hold your finger still for 30-60 seconds</p>
              </li>
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-spo2 flex items-center justify-center text-white text-xs">
                  3
                </div>
                <p>Ensure the flash is on during measurement</p>
              </li>
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-spo2 flex items-center justify-center text-white text-xs">
                  4
                </div>
                <p>Breathe normally during the measurement</p>
              </li>
            </ol>
            
            <div className="text-sm text-gray-600 p-3 bg-white/50 rounded-lg">
              <p className="font-medium text-vital-spo2">How it works:</p>
              <p>This method detects small changes in blood volume through your fingertip using photoplethysmography (PPG).</p>
            </div>
          </Card>
          
          <Button 
            onClick={handleStartMeasurement} 
            size="lg" 
            className="w-full bg-gradient-to-r from-vital-spo2 to-vital-heartRate text-white hover:opacity-90 transition-all duration-300"
          >
            Start Measurement
          </Button>
        </div>
      )}
      
      {isCollectingData && (
        <div className="max-w-md mx-auto">
          <MeasurementProgress
            title="Measuring SpO₂ & Heart Rate"
            description="Please keep your finger still on the camera"
            icon={<Heart className="h-6 w-6 text-vital-heartRate animate-pulse" />}
            onCancel={handleCancel}
            progress={progress}
          >
            <div className="mt-8">
              <div className="relative h-48 w-48 mx-auto">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                
                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-vital-heartRate transition-all duration-300 ease-in-out progress-ring"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${2 * Math.PI * 46}`}
                    strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                  />
                </svg>
                
                {/* Camera icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">Scanning...</p>
                    <p className="text-2xl font-bold mt-1">{progress}%</p>
                  </div>
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
            title="SpO₂ & Heart Rate Results"
            icon={<Heart className="h-5 w-5 text-vital-heartRate" />}
            onNewMeasurement={handleNewMeasurement}
            renderResults={renderResults}
          />
        </div>
      )}
    </BackgroundGradient>
  );
};

const cn = (...args: any[]) => args.filter(Boolean).join(' ');

export default SpO2HeartRate;
