
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVitalSignsStore } from "@/stores/vitalSignsStore";
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedChart } from "./AnimatedChart";
import { cn } from "@/lib/utils";
import { AnimatedIcon } from "./AnimatedIcon";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface VitalTrendsChartProps {
  className?: string;
}

export const VitalTrendsChart: React.FC<VitalTrendsChartProps> = ({ className }) => {
  const { history } = useVitalSignsStore();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  
  // Sort history chronologically for the chart
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => a.timestamp - b.timestamp);
  }, [history]);
  
  // Format data for charts
  const chartData = useMemo(() => {
    // Filter data based on selected time range
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const filteredData = sortedHistory.filter(item => {
      if (timeRange === 'day') return (now - item.timestamp) < dayInMs;
      if (timeRange === 'week') return (now - item.timestamp) < 7 * dayInMs;
      if (timeRange === 'month') return (now - item.timestamp) < 30 * dayInMs;
      return true;
    });
    
    return filteredData.map(measurement => ({
      date: format(new Date(measurement.timestamp), 'MM/dd HH:mm'),
      timestamp: measurement.timestamp,
      heartRate: measurement.heartRate,
      spo2: measurement.spo2,
      respiratoryRate: measurement.respiratoryRate,
      systolicBP: measurement.systolicBP,
      diastolicBP: measurement.diastolicBP
    }));
  }, [sortedHistory, timeRange]);
  
  // Check if we have data for each vital sign type
  const hasHeartRateData = history.some(m => m.heartRate !== undefined);
  const hasSpO2Data = history.some(m => m.spo2 !== undefined);
  const hasRespiratoryData = history.some(m => m.respiratoryRate !== undefined);
  const hasBloodPressureData = history.some(m => m.systolicBP !== undefined);
  
  if (history.length < 2) {
    return null; // Don't show chart until we have at least 2 measurements
  }
  
  return (
    <Card className={cn(
      "bg-white/80 backdrop-blur-md shadow-glass overflow-hidden border border-white/20 rounded-2xl transition-all duration-500",
      "hover:shadow-lg hover:bg-white/90",
      className
    )}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent flex items-center gap-2">
              Vital Trends
              <span className="opacity-70 animate-pulse">
                <AnimatedIcon type="heartRate" size="sm" />
              </span>
            </CardTitle>
            <CardDescription className="text-gray-500">
              Your health metrics over time
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => {
                const ranges: ('day' | 'week' | 'month')[] = ['day', 'week', 'month'];
                const currentIndex = ranges.indexOf(timeRange);
                const prevIndex = (currentIndex - 1 + ranges.length) % ranges.length;
                setTimeRange(ranges[prevIndex]);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="capitalize">{timeRange}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => {
                const ranges: ('day' | 'week' | 'month')[] = ['day', 'week', 'month'];
                const currentIndex = ranges.indexOf(timeRange);
                const nextIndex = (currentIndex + 1) % ranges.length;
                setTimeRange(ranges[nextIndex]);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="heart-spo2" className="mt-4">
          <TabsList className="mb-4 bg-gray-50/50 p-1 rounded-xl">
            {(hasHeartRateData || hasSpO2Data) && (
              <TabsTrigger value="heart-spo2" className="rounded-lg data-[state=active]:bg-white">
                <div className="flex items-center gap-2">
                  <AnimatedIcon type="heartRate" size="sm" animate={false} />
                  <span>Heart & SpO₂</span>
                </div>
              </TabsTrigger>
            )}
            {hasRespiratoryData && (
              <TabsTrigger value="respiratory" className="rounded-lg data-[state=active]:bg-white">
                <div className="flex items-center gap-2">
                  <AnimatedIcon type="respiratory" size="sm" animate={false} />
                  <span>Respiratory</span>
                </div>
              </TabsTrigger>
            )}
            {hasBloodPressureData && (
              <TabsTrigger value="blood-pressure" className="rounded-lg data-[state=active]:bg-white">
                <div className="flex items-center gap-2">
                  <AnimatedIcon type="bloodPressure" size="sm" animate={false} />
                  <span>Blood Pressure</span>
                </div>
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Heart Rate and SpO2 Tab */}
          <TabsContent value="heart-spo2" className="h-[300px] transition-transform duration-500 transform">
            {(hasHeartRateData || hasSpO2Data) ? (
              <div className="h-full rounded-xl overflow-hidden">
                <AnimatedChart 
                  data={chartData} 
                  type="heartRate-spo2"
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <AnimatedIcon type="heartRate" size="lg" />
                <p className="mt-4">No heart rate or SpO₂ measurements available yet</p>
              </div>
            )}
          </TabsContent>
          
          {/* Respiratory Rate Tab */}
          <TabsContent value="respiratory" className="h-[300px] transition-transform duration-500 transform">
            {hasRespiratoryData ? (
              <div className="h-full rounded-xl overflow-hidden">
                <AnimatedChart 
                  data={chartData} 
                  type="respiratory" 
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <AnimatedIcon type="respiratory" size="lg" />
                <p className="mt-4">No respiratory rate measurements available yet</p>
              </div>
            )}
          </TabsContent>
          
          {/* Blood Pressure Tab */}
          <TabsContent value="blood-pressure" className="h-[300px] transition-transform duration-500 transform">
            {hasBloodPressureData ? (
              <div className="h-full rounded-xl overflow-hidden">
                <AnimatedChart 
                  data={chartData} 
                  type="bloodPressure" 
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <AnimatedIcon type="bloodPressure" size="lg" />
                <p className="mt-4">No blood pressure measurements available yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
