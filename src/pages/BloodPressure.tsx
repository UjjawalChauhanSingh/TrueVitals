
import React, { useState, useEffect } from "react";
import { Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeasurementProgress } from "@/components/measurements/MeasurementProgress";
import { MeasurementResults } from "@/components/measurements/MeasurementResults";
import { useVitalSignsStore } from "@/stores/vitalSignsStore";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/background";
import { AnimatedIcon } from "@/components/vitals/AnimatedIcon";
import { cn } from "@/lib/utils";

const BloodPressure = () => {
  const { startMeasurement, isCollectingData, resetCurrent, currentResult } = useVitalSignsStore();
  const { toast } = useToast();
  const [showInstructions, setShowInstructions] = useState(true);
  const [progress, setProgress] = useState(0);
  const [animStep, setAnimStep] = useState(0);
  
  useEffect(() => {
    let timer: number;
    if (isCollectingData) {
      setProgress(0);
      timer = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return newProgress;
        });
        
        setAnimStep(prev => (prev + 1) % 4);
      }, 250);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCollectingData]);
  
  const handleStartMeasurement = async () => {
    setShowInstructions(false);
    try {
      await startMeasurement('blood-pressure');
      toast({
        title: "Measurement Complete",
        description: "Blood pressure measurement was successful."
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
    if (!currentResult || !currentResult.systolicBP || !currentResult.diastolicBP) return null;
    
    // Determine BP category
    const systolic = currentResult.systolicBP;
    const diastolic = currentResult.diastolicBP;
    
    let category = '';
    let categoryColor = '';
    let statusClass = '';
    
    if (systolic < 120 && diastolic < 80) {
      category = 'Normal';
      categoryColor = 'text-green-600';
      statusClass = 'bg-green-100 border-green-200';
    } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
      category = 'Elevated';
      categoryColor = 'text-yellow-600';
      statusClass = 'bg-yellow-100 border-yellow-200';
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      category = 'Hypertension Stage 1';
      categoryColor = 'text-orange-600';
      statusClass = 'bg-orange-100 border-orange-200';
    } else if (systolic >= 140 || diastolic >= 90) {
      category = 'Hypertension Stage 2';
      categoryColor = 'text-red-600';
      statusClass = 'bg-red-100 border-red-200';
    }
    
    // Calculate percentage for gauge visualization
    const maxSystolic = 180;
    const systolicPercent = (systolic / maxSystolic) * 100;
    
    return (
      <div className="space-y-6">
        <Card className={cn(
          "p-6 rounded-lg text-center overflow-hidden relative border transition-all duration-300",
          statusClass
        )}>
          <div className="text-vital-bloodPressure font-medium mb-2 flex items-center justify-center gap-2">
            <AnimatedIcon type="bloodPressure" size="sm" />
            <span>Blood Pressure</span>
          </div>
          
          {/* Blood pressure gauge */}
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-3 w-4/5 mx-auto">
            {/* Normal range */}
            <div 
              className="absolute h-full bg-green-200 left-0" 
              style={{ width: '66%' }} // 120/180
            >
              <div className="absolute top-full text-xs text-green-600 mt-1 left-1/2 transform -translate-x-1/2">
                Normal
              </div>
            </div>
            
            {/* Elevated range */}
            <div 
              className="absolute h-full bg-yellow-200 left-0" 
              style={{ width: '72%', left: '66%' }} // 130/180
            >
              <div className="absolute top-full text-xs text-yellow-600 mt-1 left-1/2 transform -translate-x-1/2">
                Elevated
              </div>
            </div>
            
            {/* Stage 1 range */}
            <div 
              className="absolute h-full bg-orange-200 left-0" 
              style={{ width: '77%', left: '72%' }} // 140/180
            >
              <div className="absolute top-full text-xs text-orange-600 mt-1 left-1/2 transform -translate-x-1/2">
                Stage 1
              </div>
            </div>
            
            {/* Stage 2 range */}
            <div 
              className="absolute h-full bg-red-200 right-0" 
              style={{ width: '23%' }}
            >
              <div className="absolute top-full text-xs text-red-600 mt-1 left-1/2 transform -translate-x-1/2">
                Stage 2
              </div>
            </div>
            
            {/* Patient marker */}
            <div 
              className="absolute h-full w-4 bg-vital-bloodPressure top-0 transform -translate-x-1/2 transition-all duration-500 shadow-md"
              style={{ left: `${systolicPercent}%` }}
            ></div>
          </div>
          
          <div className="text-4xl font-bold text-vital-bloodPressure mt-6">
            {systolic}/{diastolic}
          </div>
          <div className="text-sm text-gray-500 mt-1">mmHg</div>
          
          <div className="mt-3">
            <span className={cn(
              "px-3 py-1 rounded-full inline-block text-sm font-medium",
              categoryColor
            )}>
              {category}
            </span>
          </div>
        </Card>
        
        <Card className="p-3 bg-gray-50 rounded text-sm space-y-2 border border-gray-200">
          <p className="font-medium mb-1">Understanding Blood Pressure:</p>
          <ul className="space-y-1 text-sm">
            <li className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
              <span><span className="font-medium">Normal:</span> Less than 120/80 mmHg</span>
            </li>
            <li className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1 flex-shrink-0"></div>
              <span><span className="font-medium">Elevated:</span> 120-129/&lt;80 mmHg</span>
            </li>
            <li className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 mt-1 flex-shrink-0"></div>
              <span><span className="font-medium">Stage 1:</span> 130-139/80-89 mmHg</span>
            </li>
            <li className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
              <span><span className="font-medium">Stage 2:</span> 140+/90+ mmHg</span>
            </li>
          </ul>
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
  
  return (
    <BackgroundGradient className="space-y-6" intensity="light">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-vital-bloodPressure to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
          Blood Pressure
          <AnimatedIcon type="bloodPressure" size="sm" />
        </h1>
        <p className="text-muted-foreground">
          Estimate blood pressure using your device's motion sensors
        </p>
      </div>
      
      {showInstructions && !isCollectingData && !currentResult && (
        <div className="max-w-md mx-auto space-y-6">
          <Card className="p-5 border-white/20 shadow-glass bg-gradient-to-br from-purple-50 to-violet-50 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="text-vital-bloodPressure" />
              <span>How to take a measurement</span>
            </h2>
            
            <ol className="space-y-4 ml-6">
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-bloodPressure flex items-center justify-center text-white text-xs">
                  1
                </div>
                <p>Sit comfortably with your back straight and feet flat on the floor</p>
              </li>
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-bloodPressure flex items-center justify-center text-white text-xs">
                  2
                </div>
                <p>Hold your device firmly and place your index finger on the camera</p>
              </li>
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-bloodPressure flex items-center justify-center text-white text-xs">
                  3
                </div>
                <p>When prompted, raise your arm straight out and then back down</p>
              </li>
              <li className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-vital-bloodPressure flex items-center justify-center text-white text-xs">
                  4
                </div>
                <p>The test will analyze your movement patterns and pulse wave velocity</p>
              </li>
            </ol>
            
            <div className="text-sm text-gray-600 p-3 bg-white/50 rounded-lg">
              <p className="font-medium text-vital-bloodPressure">How it works:</p>
              <p>This method uses motion pattern analysis and pulse transit time to estimate blood pressure.</p>
            </div>
          </Card>
          
          <Button 
            onClick={handleStartMeasurement} 
            size="lg" 
            className="w-full bg-gradient-to-r from-vital-bloodPressure to-purple-500 text-white hover:opacity-90 transition-all duration-300"
          >
            Start Measurement
          </Button>
        </div>
      )}
      
      {isCollectingData && (
        <div className="max-w-md mx-auto">
          <MeasurementProgress
            title="Measuring Blood Pressure"
            description="Please follow the on-screen instructions"
            icon={<Activity className="h-5 w-5 text-vital-bloodPressure" />}
            onCancel={handleCancel}
            progress={progress}
          >
            <div className="mt-8">
              <div className="h-64 w-64 mx-auto relative">
                {/* Blood pressure visualization */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                  
                  {/* Blood pressure wave */}
                  <path
                    d={`M 5,${50 + (animStep === 0 ? -15 : animStep === 1 ? -5 : animStep === 2 ? 5 : -5)} 
                       Q 25,${50 + (animStep === 0 ? 20 : animStep === 1 ? -20 : animStep === 2 ? -10 : 10)},
                         50,${50 + (animStep === 0 ? -10 : animStep === 1 ? 15 : animStep === 2 ? -5 : 5)} 
                       T 95,${50 + (animStep === 0 ? 5 : animStep === 1 ? -5 : animStep === 2 ? 15 : -15)}`}
                    fill="none"
                    stroke="#9D4EDD"
                    strokeWidth="3"
                    className="transition-all duration-300 ease-in-out"
                  />
                  
                  {/* Progress circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#9D4EDD" 
                    strokeWidth="8" 
                    strokeDasharray={`${Math.PI * 90 * progress / 100} ${Math.PI * 90 * (100 - progress) / 100}`}
                    strokeDashoffset={Math.PI * 22.5} 
                    transform="rotate(-90 50 50)"
                  />
                  
                  {/* Center text */}
                  <text x="50" y="45" textAnchor="middle" fill="#9D4EDD" fontSize="6" fontWeight="bold">MEASURING</text>
                  <text x="50" y="55" textAnchor="middle" fill="#9D4EDD" fontSize="10" fontWeight="bold">{`${progress}%`}</text>
                </svg>
                
                <div className={cn(
                  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                  "text-vital-bloodPressure text-center px-2 py-1 rounded-lg text-sm"
                )}>
                  {progress < 30 && "Place finger on camera"}
                  {progress >= 30 && progress < 60 && "Measuring pulse wave"}
                  {progress >= 60 && progress < 90 && "Analyzing blood pressure"}
                  {progress >= 90 && "Almost done!"}
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
            title="Blood Pressure Results"
            icon={<Activity className="h-5 w-5 text-vital-bloodPressure" />}
            onNewMeasurement={handleNewMeasurement}
            renderResults={renderResults}
          />
        </div>
      )}
    </BackgroundGradient>
  );
};

export default BloodPressure;
