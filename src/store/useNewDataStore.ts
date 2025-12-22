import { create } from "zustand";
import { AppData, AuditLog } from "@/types";
import { SEED_DATA } from "@/lib/seedData";
import { useAppStore } from "@/store/useAppStore";

interface NewDataState {
  currentData: AppData | null;
  selectedSchema: string;
  loading: boolean;
  auditLogs: AuditLog[];

  // Actions
  loadData: () => Promise<void>;
  setSelectedSchema: (schema: string) => void;
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;

  // Getters
  getCurrentDomain: () => any;
  getSchemasByDomain: (domain?: string) => any[];
  getDatasetsBySchema: (domain: string, schema: string) => any[];
  getDatasetDetail: (datasetId: string) => any;
}

export const useNewDataStore = create<NewDataState>((set, get) => ({
  currentData: null,
  selectedSchema: "Customers",
  loading: false,
  auditLogs: [],

  // ---- Load all seed data ----
  loadData: async () => {
    set({ loading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      set({
        currentData: SEED_DATA,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load data:", error);
      set({ loading: false });
    }
  },

  // ---- UI actions ----
  setSelectedSchema: (schema) => set({ selectedSchema: schema }),

  addAuditLog: (logData) => {
    const newLog: AuditLog = {
      ...logData,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  // ---- Data Getters ----
  getCurrentDomain: () => {
    const state = get();
    const { domain } = useAppStore.getState();
    return state.currentData?.domains.find((d) => d.name === domain);
  },

  getSchemasByDomain: (domain) => {
    const state = get();
    const activeDomain = domain || useAppStore.getState().domain;
    return (
      state.currentData?.domains.find((d) => d.name === activeDomain)
        ?.schemas || []
    );
  },

  getDatasetsBySchema: (domain, schema) => {
    const state = get();
    const domainData =
      state.currentData?.domains.find((d) => d.name === domain) ||
      state.currentData?.domains.find(
        (d) => d.name === useAppStore.getState().domain
      );
    const schemaData = domainData?.schemas.find((s) => s.name === schema);
    return schemaData?.datasets || [];
  },

  getDatasetDetail: (datasetId: string) =>
    SEED_DATA.datasetDetails[datasetId] || null,
}));
