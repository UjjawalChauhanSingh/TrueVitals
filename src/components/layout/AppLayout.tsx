
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Home, Activity, Heart, Mic, Calendar, Settings, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [openDrawer, setOpenDrawer] = useState(false);
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/"
    },
    {
      title: "SpO₂ & Heart Rate",
      icon: Heart,
      path: "/spo2-hr"
    },
    {
      title: "Respiratory Rate",
      icon: Mic,
      path: "/respiratory"
    },
    {
      title: "Blood Pressure",
      icon: Activity,
      path: "/blood-pressure"
    },
    {
      title: "History",
      icon: Calendar,
      path: "/history"
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings"
    }
  ];

  // Close drawer when location changes (mobile navigation)
  useEffect(() => {
    setOpenDrawer(false);
  }, [location]);

  const SidebarContentComponent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-6 px-4 py-4">
        <h1 className="text-xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">TrueVitals</h1>
      </div>
      <SidebarGroup>
        <SidebarGroupLabel className="px-4 text-sm font-medium text-gray-500">
          Monitoring
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <SidebarMenuItem key={item.path} className={cn(
                  "transition-all duration-300",
                  // Apply staggered animation delay based on index
                  "animate-[slideInLeft_0.4s_ease-out_forwards]",
                  {"opacity-0": !isMobile}
                )} style={{ animationDelay: `${index * 60}ms` }}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => 
                        cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300", 
                          isActive ? 
                            "bg-gray-100 text-gray-900 font-medium shadow-sm" : 
                            "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )
                      }
                    >
                      <item.icon className={cn(
                        "w-5 h-5 transition-transform", 
                        isActive && "text-primary animate-[iconPulse_1s_ease-out]"
                      )} />
                      <span className={cn(
                        "transition-colors duration-300",
                        isActive && "text-primary font-medium"
                      )}>
                        {item.title}
                      </span>
                      {isActive && (
                        <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full animate-pulse" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full">
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <div className="fixed top-4 left-4 z-30">
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full shadow-md bg-white">
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
          </div>
          <DrawerContent className="max-h-[85vh]">
            <div className="p-4">
              <SidebarContentComponent />
            </div>
          </DrawerContent>
        </Drawer>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar className="h-screen border-r border-gray-100 shadow-sm bg-white">
        <SidebarContent>
          <SidebarContentComponent />
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};
