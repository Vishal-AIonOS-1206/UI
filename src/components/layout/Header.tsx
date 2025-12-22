import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Zap, HelpCircle, User, LogOut, ChevronDown } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useNewDataStore } from "@/store/useNewDataStore";
import { DomainName } from "@/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const DOMAINS: DomainName[] = ['Travel', 'Telco', 'Hospitality', 'Healthcare', 'BFSI'];

export function Header() {
  const { domain, setDomain } = useAppStore();
  const { loadData } = useNewDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadData(); // load once on mount
  }, [loadData]);

  const handleDomainChange = (newDomain: DomainName) => {
    setDomain(newDomain);
    loadData(); // optional: refresh data for new domain
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[--header-height] w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center px-4">
        {/* Sidebar Trigger */}
        <div className="mr-4">
          <SidebarTrigger />
        </div>

        {/* Logo and Workspace Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              IntelliStream
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-transparent px-2">
                Production Workspace <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Production Workspace</span>
                  <span className="text-xs text-muted-foreground">production-environment</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Staging Environment</span>
                  <span className="text-xs text-muted-foreground">staging-environment</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Dev Sandbox</span>
                  <span className="text-xs text-muted-foreground">dev-sandbox-01</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-end items-center gap-2">
          {/* Domain Selector (Subtle) */}
          <Select value={domain} onValueChange={handleDomainChange}>
            <SelectTrigger className="w-[140px] h-8 bg-transparent border-none text-muted-foreground hover:text-foreground focus:ring-0 hidden md:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOMAINS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
