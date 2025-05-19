
import React, { useState, useMemo } from "react";
import { Heart, Mic, Activity, Search, CalendarRange, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVitalSignsStore } from "@/stores/vitalSignsStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VitalTrendsChart } from "@/components/vitals/VitalTrendsChart";
import { BackgroundGradient } from "@/components/ui/background";
import { AnimatedIcon } from "@/components/vitals/AnimatedIcon";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, subDays } from "date-fns";

const History = () => {
  const { history } = useVitalSignsStore();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const navigate = useNavigate();
  
  // Apply time filter to measurements
  const timeFilteredHistory = useMemo(() => {
    if (timeFilter === "all") return history;
    
    const now = new Date();
    const cutoffDate = subDays(now, 
      timeFilter === "today" ? 1 : 
      timeFilter === "week" ? 7 : 
      timeFilter === "month" ? 30 : 365
    );
    
    return history.filter(item => new Date(item.timestamp) > cutoffDate);
  }, [history, timeFilter]);
  
  // Filter measurements based on active tab and search query
  const filteredHistory = useMemo(() => {
    let result = timeFilteredHistory;
    
    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter(measurement => {
        if (activeTab === "spo2-hr") return measurement.spo2 !== undefined || measurement.heartRate !== undefined;
        if (activeTab === "respiratory") return measurement.respiratoryRate !== undefined;
        if (activeTab === "blood-pressure") return measurement.systolicBP !== undefined;
        return true;
      });
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(measurement => {
        const date = format(new Date(measurement.timestamp), 'MMM dd yyyy HH:mm').toLowerCase();
        return date.includes(query);
      });
    }
    
    return result;
  }, [timeFilteredHistory, activeTab, searchQuery]);
  
  // Group measurements by date for better organization
  const groupedHistory = useMemo(() => {
    const groups: Record<string, typeof history> = {};
    
    filteredHistory.forEach(measurement => {
      const date = format(new Date(measurement.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(measurement);
    });
    
    return groups;
  }, [filteredHistory]);
  
  return (
    <BackgroundGradient className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent flex items-center gap-2">
          Measurement History
        </h1>
        <p className="text-gray-500">
          Track your vital signs over time
        </p>
      </div>
      
      {/* Add the chart at the top of the history page */}
      {history.length >= 2 && (
        <VitalTrendsChart />
      )}
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-2 items-end">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by date..." 
            className="pl-9 bg-white/80 backdrop-blur-sm border border-white/20"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center bg-white/80 backdrop-blur-sm border border-white/20">
              <CalendarRange className="h-4 w-4" />
              <span className="capitalize">{timeFilter === "all" ? "All Time" : timeFilter}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem onClick={() => setTimeFilter("all")}>All Time</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilter("today")}>Today</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilter("week")}>Past Week</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilter("month")}>Past Month</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilter("year")}>Past Year</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card className="shadow-glass bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            History Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-gray-50/50 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white">All</TabsTrigger>
              <TabsTrigger value="spo2-hr" className="rounded-lg data-[state=active]:bg-white">
                <div className="flex items-center gap-2">
                  <AnimatedIcon type="heartRate" size="sm" animate={false} />
                  <span>Heart & SpO₂</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="respiratory" className="rounded-lg data-[state=active]:bg-white">
                <div className="flex items-center gap-2">
                  <AnimatedIcon type="respiratory" size="sm" animate={false} />
                  <span>Respiratory</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="blood-pressure" className="rounded-lg data-[state=active]:bg-white">
                <div className="flex items-center gap-2">
                  <AnimatedIcon type="bloodPressure" size="sm" animate={false} />
                  <span>Blood Pressure</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {Object.keys(groupedHistory).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedHistory).map(([date, measurements], groupIndex) => (
                    <div key={date} className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <CalendarRange className="h-4 w-4" />
                        {format(new Date(date), 'MMMM d, yyyy')}
                      </h3>
                      
                      {measurements.map((measurement, index) => (
                        <div 
                          key={`${date}-${index}`} 
                          className={cn(
                            "p-4 bg-white/60 rounded-xl transition-all duration-500",
                            "hover:bg-white hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                          )}
                          style={{
                            animationDelay: `${(groupIndex * measurements.length + index) * 100}ms`
                          }}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-500">
                              {format(new Date(measurement.timestamp), 'h:mm a')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {measurement.spo2 !== undefined && (
                              <div className="flex items-center gap-3 bg-blue-50/80 p-3 rounded-xl hover:bg-blue-100/80 transition-all duration-300">
                                <AnimatedIcon type="spo2" size="md" />
                                <div>
                                  <div className="text-sm text-gray-500">SpO₂</div>
                                  <div className="text-xl font-semibold text-vital-spo2">{measurement.spo2}%</div>
                                  <div className="text-xs text-gray-500">
                                    {measurement.spo2 >= 95 ? 'Normal' : 'Below normal'}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {measurement.heartRate !== undefined && (
                              <div className="flex items-center gap-3 bg-pink-50/80 p-3 rounded-xl hover:bg-pink-100/80 transition-all duration-300">
                                <AnimatedIcon type="heartRate" size="md" />
                                <div>
                                  <div className="text-sm text-gray-500">Heart Rate</div>
                                  <div className="text-xl font-semibold text-vital-heartRate">{measurement.heartRate} bpm</div>
                                  <div className="text-xs text-gray-500">
                                    {measurement.heartRate >= 60 && measurement.heartRate <= 100 ? 'Normal range' : 
                                      measurement.heartRate < 60 ? 'Below normal' : 'Above normal'}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {measurement.respiratoryRate !== undefined && (
                              <div className="flex items-center gap-3 bg-green-50/80 p-3 rounded-xl hover:bg-green-100/80 transition-all duration-300">
                                <AnimatedIcon type="respiratory" size="md" />
                                <div>
                                  <div className="text-sm text-gray-500">Respiratory Rate</div>
                                  <div className="text-xl font-semibold text-vital-respiratory">{measurement.respiratoryRate} br/min</div>
                                  <div className="text-xs text-gray-500">
                                    {measurement.respiratoryRate >= 12 && measurement.respiratoryRate <= 20 ? 'Normal range' : 
                                      measurement.respiratoryRate < 12 ? 'Below normal' : 'Above normal'}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {measurement.systolicBP !== undefined && (
                              <div className="flex items-center gap-3 bg-purple-50/80 p-3 rounded-xl hover:bg-purple-100/80 transition-all duration-300">
                                <AnimatedIcon type="bloodPressure" size="md" />
                                <div>
                                  <div className="text-sm text-gray-500">Blood Pressure</div>
                                  <div className="text-xl font-semibold text-vital-bloodPressure">{measurement.systolicBP}/{measurement.diastolicBP} mmHg</div>
                                  <div className="text-xs text-gray-500">
                                    {measurement.systolicBP < 120 && measurement.diastolicBP < 80 ? 'Normal' : 
                                      measurement.systolicBP >= 120 && measurement.systolicBP <= 129 && measurement.diastolicBP < 80 ? 'Elevated' : 
                                      'Hypertension'}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No measurements found for this category.</p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-vital-spo2 to-vital-heartRate text-white rounded-xl"
                  >
                    Take a Measurement
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </BackgroundGradient>
  );
};

export default History;
