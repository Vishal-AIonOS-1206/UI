import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Database,
  FileText,
  Brain,
  Shield,
  Settings,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Executive Cockpit", url: "/executive", icon: TrendingUp },
  { title: "Datasets", url: "/datasets", icon: Database },
  { title: "Sandbox", url: "/explainability", icon: Brain },
];

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  const getNavClasses = (path: string) => {
    const active = isActive(path);
    return active
      ? "bg-primary/20 text-primary border-r-2 border-primary font-medium"
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";
  };

  return (
    <Sidebar
      collapsible="icon"
      className={className}
      style={{
        marginTop: 'var(--header-height)',
        height: 'calc(100svh - var(--header-height))'
      }}
      {...props}
    >
      <SidebarContent className="border-r border-border/40">
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all animate-smooth ${getNavClasses(item.url)}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {state === "expanded" && (
                        <>
                          <span className="flex-1 text-sm">{item.title}</span>
                          {isActive(item.url) && (
                            <ChevronRight className="h-4 w-4 text-primary" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Demo Status */}
        {state === "expanded" && (
          <div className="mt-auto p-4 border-t border-border/40">
            <div className="text-xs text-muted-foreground mb-2">Demo Mode</div>

          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
