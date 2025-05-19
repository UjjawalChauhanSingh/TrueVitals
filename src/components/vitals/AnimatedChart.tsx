
import React, { useEffect, useState, useRef } from "react";
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
  Legend,
  Area,
  AreaChart,
  ComposedChart,
  ReferenceLine,
  ReferenceArea,
  Tooltip,
  TooltipProps
} from "recharts";
import { cn } from "@/lib/utils";

// Define chart config for styling
const chartConfig = {
  heartRate: {
    label: "Heart Rate",
    color: "#F72585",  // vital-heartRate
    unit: "bpm",
    normalRange: [60, 100]
  },
  spo2: {
    label: "SpO₂",
    color: "#4CC9F0",  // vital-spo2
    unit: "%",
    normalRange: [95, 100]
  },
  respiratoryRate: {
    label: "Respiratory Rate",
    color: "#90BE6D",  // vital-respiratory
    unit: "br/min",
    normalRange: [12, 20]
  },
  systolicBP: {
    label: "Systolic BP",
    color: "#9D4EDD",  // vital-bloodPressure
    unit: "mmHg",
    normalRange: [90, 120]
  },
  diastolicBP: {
    label: "Diastolic BP",
    color: "#B8B5FF",  // lighter purple
    unit: "mmHg",
    normalRange: [60, 80]
  }
};

interface AnimatedChartProps {
  data: any[];
  type: "heartRate-spo2" | "respiratory" | "bloodPressure";
  className?: string;
}

// Custom tooltip component with enhanced styling
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry, index) => {
          const dataKey = entry.dataKey as keyof typeof chartConfig;
          const color = chartConfig[dataKey]?.color || entry.color;
          const value = entry.value;
          const unit = chartConfig[dataKey]?.unit || '';
          const normalRange = chartConfig[dataKey]?.normalRange || null;
          const isInRange = normalRange ? (value >= normalRange[0] && value <= normalRange[1]) : true;
          
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-xs text-gray-600">{chartConfig[dataKey]?.label || entry.name}:</span>
              </div>
              <div className="flex gap-1 items-baseline">
                <span className="text-sm font-semibold">{value}</span>
                <span className="text-xs text-gray-500">{unit}</span>
                {normalRange && (
                  <span className={cn(
                    "text-xs ml-1 px-1.5 py-0.5 rounded-full",
                    isInRange ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {isInRange ? "Normal" : "Abnormal"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const AnimatedChart: React.FC<AnimatedChartProps> = ({ 
  data, 
  type,
  className 
}) => {
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Handle window resize to make chart responsive
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setChartDimensions({
          width: chartRef.current.clientWidth,
          height: chartRef.current.clientHeight
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Animate the chart by gradually revealing data points
  useEffect(() => {
    if (!data.length) return;
    
    setDisplayData([]);
    
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < data.length) {
        setDisplayData((prev) => [...prev, data[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [data]);
  
  const renderChart = () => {
    switch (type) {
      case "heartRate-spo2":
        return (
          <ComposedChart data={displayData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
            <defs>
              <linearGradient id="heartRateFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F72585" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F72585" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spo2Fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CC9F0" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4CC9F0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={50}
              tick={{ fontSize: 10, fill: '#888' }}
              tickLine={{ stroke: '#ccc' }}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              domain={['dataMin - 5', 'dataMax + 5']} 
              tick={{ fontSize: 10, fill: '#888' }}
              tickLine={{ stroke: '#ccc' }}
              label={{ value: 'bpm', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10, fill: '#888' } }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[85, 100]} 
              tick={{ fontSize: 10, fill: '#888' }}
              tickLine={{ stroke: '#ccc' }}
              label={{ value: '%', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: 10, fill: '#888' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', padding: '10px 0' }} />
            
            {/* Heart Rate normal range reference area */}
            <ReferenceArea 
              y1={chartConfig.heartRate.normalRange[0]} 
              y2={chartConfig.heartRate.normalRange[1]} 
              yAxisId="left" 
              fill="#F72585" 
              fillOpacity={0.05} 
              stroke="none"
            />
            
            {/* SpO2 normal range reference area */}
            <ReferenceArea 
              y1={chartConfig.spo2.normalRange[0]} 
              y2={chartConfig.spo2.normalRange[1]} 
              yAxisId="right" 
              fill="#4CC9F0" 
              fillOpacity={0.05} 
              stroke="none"
            />
            
            <Area
              type="monotone"
              dataKey="heartRate"
              name="Heart Rate"
              stroke={chartConfig.heartRate.color}
              fillOpacity={1}
              fill="url(#heartRateFill)"
              strokeWidth={2}
              yAxisId="left"
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            
            <Line
              type="monotone"
              dataKey="spo2"
              name="SpO₂"
              stroke={chartConfig.spo2.color}
              strokeWidth={2}
              yAxisId="right"
              dot={{ r: 4, strokeWidth: 0, fill: chartConfig.spo2.color }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </ComposedChart>
        );
        
      case "respiratory":
        return (
          <AreaChart data={displayData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
            <defs>
              <linearGradient id="respFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#90BE6D" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#90BE6D" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={50} 
              tick={{ fontSize: 10, fill: '#888' }}
              tickLine={{ stroke: '#ccc' }}
            />
            <YAxis 
              domain={['dataMin - 2', 'dataMax + 2']} 
              tick={{ fontSize: 10, fill: '#888' }}
              tickLine={{ stroke: '#ccc' }}
              label={{ value: 'br/min', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10, fill: '#888' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', padding: '10px 0' }} />
            
            {/* Respiratory rate normal range reference area */}
            <ReferenceArea 
              y1={chartConfig.respiratoryRate.normalRange[0]} 
              y2={chartConfig.respiratoryRate.normalRange[1]} 
              fill="#90BE6D" 
              fillOpacity={0.05} 
              stroke="none"
            />
            
            <Area
              type="monotone"
              dataKey="respiratoryRate"
              name="Respiratory Rate"
              stroke={chartConfig.respiratoryRate.color}
              fill="url(#respFill)"
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        );
        
      case "bloodPressure":
        return (
          <ComposedChart data={displayData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
            <defs>
              <linearGradient id="systolicFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9D4EDD" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9D4EDD" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="diastolicFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B8B5FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#B8B5FF" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={50}
              tick={{ fontSize: 10, fill: '#888' }}
              tickLine={{ stroke: '#ccc' }}
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']} 
              tick={{ fontSize: 10, fill: '#888' }}
              tickLine={{ stroke: '#ccc' }}
              label={{ value: 'mmHg', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10, fill: '#888' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', padding: '10px 0' }} />
            
            {/* Systolic BP normal range reference area */}
            <ReferenceArea 
              y1={chartConfig.systolicBP.normalRange[0]} 
              y2={chartConfig.systolicBP.normalRange[1]} 
              fill="#9D4EDD" 
              fillOpacity={0.05} 
              stroke="none"
            />
            
            {/* Diastolic BP normal range reference area */}
            <ReferenceArea 
              y1={chartConfig.diastolicBP.normalRange[0]} 
              y2={chartConfig.diastolicBP.normalRange[1]} 
              fill="#B8B5FF" 
              fillOpacity={0.05} 
              stroke="none"
            />
            
            <Area
              type="monotone"
              dataKey="systolicBP"
              name="Systolic BP"
              stroke={chartConfig.systolicBP.color}
              fill="url(#systolicFill)"
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Line
              type="monotone"
              dataKey="diastolicBP"
              name="Diastolic BP"
              stroke={chartConfig.diastolicBP.color}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 0, fill: chartConfig.diastolicBP.color }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </ComposedChart>
        );
        
      default:
        return null;
    }
  };

  return (
    <div ref={chartRef} className={cn("h-full w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
