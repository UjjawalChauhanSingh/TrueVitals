
import React from "react";
import { Heart, Mic, Activity, ArrowRight, History, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VitalCard } from "@/components/vitals/VitalCard";
import { MeasurementButton } from "@/components/vitals/MeasurementButton";
import { useVitalSignsStore } from "@/stores/vitalSignsStore";
import { useNavigate } from "react-router-dom";
import { VitalTrendsChart } from "@/components/vitals/VitalTrendsChart";
import { BackgroundGradient } from "@/components/ui/background";
import { AnimatedIcon } from "@/components/vitals/AnimatedIcon";

const Dashboard = () => {
  const { history } = useVitalSignsStore();
  const navigate = useNavigate();
  
  // Get latest measurement from history if available
  const latestMeasurement = history.length > 0 ? history[0] : null;
  
  return (
    <BackgroundGradient className="space-y-8" intensity="medium">
      <div className="px-2">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent flex items-center gap-2">
          TrueVitals
          <span className="text-sm px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full font-normal flex items-center">
            <Heart className="h-3.5 w-3.5 mr-1 animate-pulse" />
            Live
          </span>
        </h1>
        <p className="text-gray-500">
          Track your health using smartphone sensors
        </p>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <VitalCard 
          title="SpO₂" 
          value={latestMeasurement?.spo2 || "--"} 
          unit="%" 
          type="spo2"
          onClick={() => navigate('/spo2-hr')}
        />
        <VitalCard 
          title="Heart Rate" 
          value={latestMeasurement?.heartRate || "--"} 
          unit="bpm" 
          type="heartRate"
          onClick={() => navigate('/spo2-hr')}
        />
        <VitalCard 
          title="Respiratory" 
          value={latestMeasurement?.respiratoryRate || "--"} 
          unit="br/min" 
          type="respiratory"
          onClick={() => navigate('/respiratory')}
        />
        <VitalCard 
          title="Blood Pressure" 
          value={latestMeasurement?.systolicBP ? `${latestMeasurement.systolicBP}/${latestMeasurement.diastolicBP}` : "--"} 
          unit="mmHg" 
          type="bloodPressure"
          onClick={() => navigate('/blood-pressure')}
        />
      </div>
      
      {/* Measurement History Chart */}
      {history.length >= 2 && (
        <div className="px-2">
          <VitalTrendsChart />
        </div>
      )}
      
      {/* Measurement options */}
      <Card className="shadow-glass bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl mx-2 transform transition-all duration-500 hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Take a Measurement
              </CardTitle>
              <CardDescription className="text-gray-500">
                Select a vital sign to measure
              </CardDescription>
            </div>
            <Button 
              size="icon" 
              className="rounded-full h-8 w-8 bg-white text-gray-700 shadow hover:shadow-md hover:bg-gray-50"
              onClick={() => navigate('/spo2-hr')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MeasurementButton
              title="SpO₂ & Heart Rate"
              description="Uses camera with flash (30-60 seconds)"
              type="spo2"
              onClick={() => navigate('/spo2-hr')}
            />
            <MeasurementButton
              title="Respiratory Rate"
              description="Uses microphone (30 seconds)"
              type="respiratory"
              onClick={() => navigate('/respiratory')}
            />
            <MeasurementButton
              title="Blood Pressure"
              description="Uses motion sensors (15 seconds)"
              type="bloodPressure"
              onClick={() => navigate('/blood-pressure')}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Recent history */}
      <Card className="shadow-glass bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl mx-2 transform transition-all duration-500 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-500">
              Your last {Math.min(history.length, 3)} measurements
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white/80 hover:bg-white rounded-xl transform hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/history')}
          >
            <History className="h-4 w-4" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.slice(0, 3).map((measurement, index) => (
                <div 
                  key={index} 
                  className="p-3 flex flex-col gap-2 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-sm cursor-pointer"
                  onClick={() => navigate('/history')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      {new Date(measurement.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {measurement.spo2 && (
                      <div className="flex items-center gap-2 bg-blue-50/80 p-2 rounded-lg">
                        <AnimatedIcon type="spo2" size="sm" />
                        <div>
                          <div className="text-xs text-gray-500">SpO₂</div>
                          <div className="font-semibold text-vital-spo2">{measurement.spo2}%</div>
                        </div>
                      </div>
                    )}
                    {measurement.heartRate && (
                      <div className="flex items-center gap-2 bg-pink-50/80 p-2 rounded-lg">
                        <AnimatedIcon type="heartRate" size="sm" />
                        <div>
                          <div className="text-xs text-gray-500">Heart Rate</div>
                          <div className="font-semibold text-vital-heartRate">{measurement.heartRate} bpm</div>
                        </div>
                      </div>
                    )}
                    {measurement.respiratoryRate && (
                      <div className="flex items-center gap-2 bg-green-50/80 p-2 rounded-lg">
                        <AnimatedIcon type="respiratory" size="sm" />
                        <div>
                          <div className="text-xs text-gray-500">Respiratory</div>
                          <div className="font-semibold text-vital-respiratory">{measurement.respiratoryRate} br/min</div>
                        </div>
                      </div>
                    )}
                    {measurement.systolicBP && (
                      <div className="flex items-center gap-2 bg-purple-50/80 p-2 rounded-lg">
                        <AnimatedIcon type="bloodPressure" size="sm" />
                        <div>
                          <div className="text-xs text-gray-500">Blood Pressure</div>
                          <div className="font-semibold text-vital-bloodPressure">{measurement.systolicBP}/{measurement.diastolicBP} mmHg</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto mt-1 p-0 h-auto text-xs text-gray-500 hover:text-gray-900 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/history');
                    }}
                  >
                    Details <ArrowRight className="h-3 w-3 ml-1 transition-all duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">
                No measurements recorded yet. Take your first measurement to see results here.
              </p>
              <Button 
                onClick={() => navigate('/spo2-hr')}
                className="bg-gradient-to-r from-vital-spo2 to-vital-heartRate text-white rounded-xl"
              >
                Start First Measurement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </BackgroundGradient>
  );
};

export default Dashboard;
