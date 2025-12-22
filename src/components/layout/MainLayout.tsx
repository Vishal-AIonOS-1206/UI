import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { useAppStore } from "@/store/useAppStore";
import { useNewDataStore } from "@/store/useNewDataStore";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { loadData } = useNewDataStore();

  useEffect(() => {
    // Load initial data on mount
    loadData();
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-background dark [--header-height:3.5rem]">
      <SidebarProvider defaultOpen={true} className="isolate h-full w-full">
        <Header />
        <div className="flex h-full w-full pt-[--header-height]">
          <AppSidebar />
          <SidebarInset className="h-full w-full overflow-hidden bg-background">
            <main className="h-full w-full overflow-auto p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}