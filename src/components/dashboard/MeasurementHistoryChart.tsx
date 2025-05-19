
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVitalSignsStore } from "@/stores/vitalSignsStore";
import { format } from 'date-fns';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define chart config for styling
const chartConfig = {
  heartRate: {
    label: "Heart Rate",
    color: "#f43f5e"
  },
  spo2: {
    label: "SpO₂",
    color: "#0ea5e9"
  },
  respiratoryRate: {
    label: "Respiratory Rate",
    color: "#22c55e"
  },
  systolicBP: {
    label: "Systolic BP",
    color: "#8b5cf6"
  },
  diastolicBP: {
    label: "Diastolic BP",
    color: "#d946ef"
  }
};

const MeasurementHistoryChart = () => {
  const { history } = useVitalSignsStore();
  
  // Sort history chronologically for the chart
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => a.timestamp - b.timestamp);
  }, [history]);
  
  // Format data for charts
  const chartData = useMemo(() => {
    return sortedHistory.map(measurement => ({
      date: format(new Date(measurement.timestamp), 'MM/dd HH:mm'),
      timestamp: measurement.timestamp,
      heartRate: measurement.heartRate,
      spo2: measurement.spo2,
      respiratoryRate: measurement.respiratoryRate,
      systolicBP: measurement.systolicBP,
      diastolicBP: measurement.diastolicBP
    }));
  }, [sortedHistory]);
  
  // Check if we have data for each vital sign type
  const hasHeartRateData = history.some(m => m.heartRate !== undefined);
  const hasSpO2Data = history.some(m => m.spo2 !== undefined);
  const hasRespiratoryData = history.some(m => m.respiratoryRate !== undefined);
  const hasBloodPressureData = history.some(m => m.systolicBP !== undefined);
  
  if (history.length < 2) {
    return null; // Don't show chart until we have at least 2 measurements
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Measurement Trends</CardTitle>
        <CardDescription>Tracking your vital signs over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="heart-spo2">
          <TabsList className="mb-4">
            {(hasHeartRateData || hasSpO2Data) && (
              <TabsTrigger value="heart-spo2">Heart Rate & SpO₂</TabsTrigger>
            )}
            {hasRespiratoryData && (
              <TabsTrigger value="respiratory">Respiratory Rate</TabsTrigger>
            )}
            {hasBloodPressureData && (
              <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
            )}
          </TabsList>
          
          {/* Heart Rate and SpO2 Tab */}
          <TabsContent value="heart-spo2" className="h-[300px]">
            {(hasHeartRateData || hasSpO2Data) ? (
              <ChartContainer config={chartConfig}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                  />
                  <YAxis yAxisId="left" orientation="left" domain={['dataMin - 5', 'dataMax + 5']} />
                  <YAxis yAxisId="right" orientation="right" domain={[85, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  {hasHeartRateData && (
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      name="Heart Rate"
                      stroke={chartConfig.heartRate.color}
                      strokeWidth={2}
                      yAxisId="left"
                      dot={{ r: 4 }}
                      connectNulls
                    />
                  )}
                  {hasSpO2Data && (
                    <Line
                      type="monotone"
                      dataKey="spo2"
                      name="SpO₂"
                      stroke={chartConfig.spo2.color}
                      strokeWidth={2}
                      yAxisId="right"
                      dot={{ r: 4 }}
                      connectNulls
                    />
                  )}
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No heart rate or SpO₂ measurements available yet
              </div>
            )}
          </TabsContent>
          
          {/* Respiratory Rate Tab */}
          <TabsContent value="respiratory" className="h-[300px]">
            {hasRespiratoryData ? (
              <ChartContainer config={chartConfig}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                  />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="respiratoryRate"
                    name="Respiratory Rate"
                    stroke={chartConfig.respiratoryRate.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No respiratory rate measurements available yet
              </div>
            )}
          </TabsContent>
          
          {/* Blood Pressure Tab */}
          <TabsContent value="blood-pressure" className="h-[300px]">
            {hasBloodPressureData ? (
              <ChartContainer config={chartConfig}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                  />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="systolicBP"
                    name="Systolic BP"
                    stroke={chartConfig.systolicBP.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolicBP"
                    name="Diastolic BP"
                    stroke={chartConfig.diastolicBP.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No blood pressure measurements available yet
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MeasurementHistoryChart;
