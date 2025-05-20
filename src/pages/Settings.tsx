
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BackgroundGradient } from "@/components/ui/background";
import { Check, Save, Settings as SettingsIcon, Bell, UserCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

const Settings = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>("measurement");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sensitivity, setSensitivity] = useState<number>(75);
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate a save operation
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Saved",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };
  
  return (
    <BackgroundGradient className="space-y-6" intensity="light">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent flex items-center gap-2">
          Settings
          <SettingsIcon className="h-6 w-6 animate-spin-slow" style={{ '--spin-duration': '8s' } as React.CSSProperties} />
        </h1>
        <p className="text-muted-foreground">
          Configure your vital sign monitoring preferences
        </p>
      </div>
      
      {/* Settings navbar */}
      <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
        <Button 
          variant={activeSection === "measurement" ? "default" : "outline"}
          className={cn(
            "rounded-full transition-all duration-300",
            activeSection === "measurement" ? "bg-gray-800 text-white" : "bg-white"
          )}
          onClick={() => setActiveSection("measurement")}
        >
          Measurement
        </Button>
        <Button 
          variant={activeSection === "notifications" ? "default" : "outline"}
          className={cn(
            "rounded-full transition-all duration-300",
            activeSection === "notifications" ? "bg-gray-800 text-white" : "bg-white"
          )}
          onClick={() => setActiveSection("notifications")}
        >
          Notifications
        </Button>
        <Button 
          variant={activeSection === "profile" ? "default" : "outline"}
          className={cn(
            "rounded-full transition-all duration-300",
            activeSection === "profile" ? "bg-gray-800 text-white" : "bg-white"
          )}
          onClick={() => setActiveSection("profile")}
        >
          Profile
        </Button>
      </div>
      
      <div className="grid gap-6">
        {/* Measurement Settings */}
        {activeSection === "measurement" && (
          <Card className="backdrop-blur-md bg-white/80 border border-white/20 shadow-glass rounded-2xl transition-all duration-500 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Measurement Settings
              </CardTitle>
              <CardDescription>Configure how measurements are taken</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-all duration-300">
                  <div>
                    <Label htmlFor="use-flash" className="font-medium">Use Flash for SpO₂</Label>
                    <p className="text-sm text-muted-foreground">
                      Use your device's flash when taking SpO₂ measurements
                    </p>
                  </div>
                  <Switch id="use-flash" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-all duration-300">
                  <div>
                    <Label htmlFor="high-accuracy" className="font-medium">High Accuracy Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase measurement duration for more accurate results
                    </p>
                  </div>
                  <Switch id="high-accuracy" />
                </div>
                
                <div className="p-3 bg-green-50/50 rounded-lg hover:bg-green-50 transition-all duration-300">
                  <Label htmlFor="measurement-duration" className="font-medium">Default Measurement Duration</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="measurement-duration" className="w-full mt-2">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds (Recommended)</SelectItem>
                      <SelectItem value="60">60 seconds (Higher Accuracy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-3 bg-yellow-50/50 rounded-lg hover:bg-yellow-50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="sensitivity" className="font-medium">Measurement Sensitivity</Label>
                    <span className="text-xs text-gray-500 font-medium">{sensitivity}%</span>
                  </div>
                  <div className="mt-4 px-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Low</span>
                      <span className="text-xs text-gray-500">High</span>
                    </div>
                    <Slider 
                      id="sensitivity"
                      defaultValue={[sensitivity]} 
                      min={0} 
                      max={100} 
                      step={1}
                      showTooltip={true}
                      onValueChange={(value) => setSensitivity(value[0])}
                      className="cursor-pointer" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Notification Settings */}
        {activeSection === "notifications" && (
          <Card className="backdrop-blur-md bg-white/80 border border-white/20 shadow-glass rounded-2xl transition-all duration-500 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure alerts and reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-all duration-300">
                  <div>
                    <Label htmlFor="daily-reminder" className="font-medium">Daily Measurement Reminder</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily reminder to take your measurements
                    </p>
                  </div>
                  <Switch id="daily-reminder" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-pink-50/50 rounded-lg hover:bg-pink-50 transition-all duration-300">
                  <div>
                    <Label htmlFor="abnormal-alerts" className="font-medium">Abnormal Reading Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when readings are outside normal ranges
                    </p>
                  </div>
                  <Switch id="abnormal-alerts" defaultChecked />
                </div>
                
                <div className="p-3 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-all duration-300">
                  <Label htmlFor="reminder-time" className="font-medium">Reminder Time</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <Label htmlFor="reminder-hour" className="text-xs text-gray-500">Hour</Label>
                      <Select defaultValue="9">
                        <SelectTrigger id="reminder-hour" className="mt-1">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i} value={String(i+1)}>{i+1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reminder-ampm" className="text-xs text-gray-500">AM/PM</Label>
                      <Select defaultValue="am">
                        <SelectTrigger id="reminder-ampm" className="mt-1">
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="am">AM</SelectItem>
                          <SelectItem value="pm">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* User Profile */}
        {activeSection === "profile" && (
          <Card className="backdrop-blur-md bg-white/80 border border-white/20 shadow-glass rounded-2xl transition-all duration-500 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                User Profile
              </CardTitle>
              <CardDescription>Your personal information for more accurate readings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                    <UserCircle className="h-16 w-16" />
                  </div>
                  <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-all duration-300">
                    <Label htmlFor="age" className="font-medium">Age</Label>
                    <Input id="age" type="number" placeholder="Enter your age" className="mt-1 bg-white" />
                  </div>
                  
                  <div className="p-3 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-all duration-300">
                    <Label htmlFor="gender" className="font-medium">Gender</Label>
                    <Select>
                      <SelectTrigger id="gender" className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50/50 rounded-lg hover:bg-green-50 transition-all duration-300">
                    <Label htmlFor="height" className="font-medium">Height (cm)</Label>
                    <Input id="height" type="number" placeholder="Enter your height" className="mt-1 bg-white" />
                  </div>
                  
                  <div className="p-3 bg-yellow-50/50 rounded-lg hover:bg-yellow-50 transition-all duration-300">
                    <Label htmlFor="weight" className="font-medium">Weight (kg)</Label>
                    <Input id="weight" type="number" placeholder="Enter your weight" className="mt-1 bg-white" />
                  </div>
                </div>
                
                <div className="p-3 bg-pink-50/50 rounded-lg hover:bg-pink-50 transition-all duration-300">
                  <Label htmlFor="medical-conditions" className="font-medium">Pre-existing Medical Conditions</Label>
                  <Input id="medical-conditions" placeholder="e.g. Hypertension, Asthma" className="mt-1 bg-white" />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Data
                </Button>
                
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isSaving}
                  className="bg-gradient-to-r from-gray-700 to-gray-900 text-white"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BackgroundGradient>
  );
};

export default Settings;
