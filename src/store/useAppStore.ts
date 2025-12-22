import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DomainName, Role, RolePermissions } from "@/types";
import { useNewDataStore } from "@/store/useNewDataStore"; // cross-import for sync

interface AppState {
  // App state
  domain: DomainName;
  role: Role;

  // UI state
  sidebarCollapsed: boolean;

  // Actions
  setDomain: (domain: DomainName) => void;
  setRole: (role: Role) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Permission helpers
  getPermissions: () => RolePermissions;
}

const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  viewer: {
    canMarkFalsePositive: false,
    canSaveScenarios: false,
    canSimulateRetry: false,
    canEditThresholds: false,
    canCreateTrustOverride: false,
    canViewFairness: false,
    canManageConnectors: false,
    canManageRBAC: false,
  },
  analyst: {
    canMarkFalsePositive: true,
    canSaveScenarios: true,
    canSimulateRetry: false,
    canEditThresholds: false,
    canCreateTrustOverride: false,
    canViewFairness: false,
    canManageConnectors: false,
    canManageRBAC: false,
  },
  engineer: {
    canMarkFalsePositive: true,
    canSaveScenarios: true,
    canSimulateRetry: true,
    canEditThresholds: true,
    canCreateTrustOverride: false,
    canViewFairness: false,
    canManageConnectors: false,
    canManageRBAC: false,
  },
  governance_lead: {
    canMarkFalsePositive: true,
    canSaveScenarios: true,
    canSimulateRetry: false,
    canEditThresholds: true,
    canCreateTrustOverride: true,
    canViewFairness: false,
    canManageConnectors: false,
    canManageRBAC: false,
  },
  compliance_officer: {
    canMarkFalsePositive: false,
    canSaveScenarios: false,
    canSimulateRetry: false,
    canEditThresholds: false,
    canCreateTrustOverride: false,
    canViewFairness: true,
    canManageConnectors: false,
    canManageRBAC: false,
  },
  platform_manager: {
    canMarkFalsePositive: true,
    canSaveScenarios: true,
    canSimulateRetry: false,
    canEditThresholds: false,
    canCreateTrustOverride: false,
    canViewFairness: false,
    canManageConnectors: true,
    canManageRBAC: false,
  },
  security_admin: {
    canMarkFalsePositive: false,
    canSaveScenarios: false,
    canSimulateRetry: false,
    canEditThresholds: false,
    canCreateTrustOverride: false,
    canViewFairness: true,
    canManageConnectors: false,
    canManageRBAC: true,
  },
  admin: {
    canMarkFalsePositive: true,
    canSaveScenarios: true,
    canSimulateRetry: true,
    canEditThresholds: true,
    canCreateTrustOverride: true,
    canViewFairness: true,
    canManageConnectors: true,
    canManageRBAC: true,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      domain: "Travel",
      role: "admin",
      sidebarCollapsed: false,

      // Actions
      setDomain: (domain) => {
        set({ domain });
        // 🔄 auto-sync with data store
        useNewDataStore.getState().loadData();
      },

      setRole: (role) => set({ role }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Helpers
      getPermissions: () => ROLE_PERMISSIONS[get().role],
    }),
    {
      name: "intellistream-app",
      partialize: (state) => ({
        domain: state.domain,
        role: state.role,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
