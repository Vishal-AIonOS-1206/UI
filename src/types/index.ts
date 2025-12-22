// IntelliStream Type Definitions

export type DomainName = 'Travel' | 'Telco' | 'Hospitality' | 'Healthcare' | 'BFSI';

export type Role =
  | 'viewer'
  | 'analyst'
  | 'engineer'
  | 'governance_lead'
  | 'compliance_officer'
  | 'platform_manager'
  | 'security_admin'
  | 'admin';

export type DatasetStatus = 'healthy' | 'at_risk' | 'degraded';

export interface RolePermissions {
  canMarkFalsePositive: boolean;
  canSaveScenarios: boolean;
  canSimulateRetry: boolean;
  canEditThresholds: boolean;
  canCreateTrustOverride: boolean;
  canViewFairness: boolean;
  canManageConnectors: boolean;
  canManageRBAC: boolean;
}

// ---------- Core Data Structures ----------

export interface Dataset {
  name: string;
  status: DatasetStatus;
  rows: number;
  owner: string;
}

export interface Schema {
  name: string;
  trustScore: number;
  datasets: Dataset[];
}

export interface DomainKPIs {
  reliability: number;
  governance: number;
  dataCoverage: number;
  modelUptime: number;
  incidentsLast7d: number;
}

export interface Domain {
  name: DomainName;
  schemas: Schema[];
  kpis: DomainKPIs;
}

// ---------- Dataset-Level ----------

export interface DatasetColumn {
  name: string;
  datatype: string;
  description: string;
  pii: boolean;
}

export interface QualityReport {
  column: string;
  nullPct: number;
  dupPct: number;
  outlierPct: number;
  formatViolationsPct: number;
  suggestedFix: string;
}

export interface DatasetAnomaly {
  date: string;
  type: string;
  detail: string;
}

export interface PIIDetection {
  field: string;
  pattern: string;
  risk: string;
  action: string;
}

export interface DatasetRule {
  name: string;
  rule: string;
  threshold: string;
  status: 'passing' | 'failing';
}

export interface PipelineRun {
  runId: string;
  started: string;
  durationMin: number;
  status: 'success' | 'fixed_by_agent' | 'failed';
  issue?: string;
  fix?: string;
}

// ---------- Enriched Dataset Detail ----------

export interface DatasetDetail {
  domain: string;
  schema: string;
  dataset: string;
  description: string;
  tags: string[];
  owners: string[];
  trustScoreTrend30d: number[];
  columns: DatasetColumn[];
  qualityReport: QualityReport[];
  anomalies: DatasetAnomaly[];
  piiDetections: PIIDetection[];
  rules: DatasetRule[];
  pipelineRuns: PipelineRun[];

  // 🟢 Added fields
  domainTags?: string[];
  functionalTags?: string[];
  columnTags?: Record<string, string[]>;   // e.g. { "email": ["PII", "Contact Info"] }
  columnIssues?: Record<string, string[]>; // e.g. { "phone": ["Non-standard format", "Duplicates"] }
}

// ---------- Explainability ----------

export interface KeyDriver {
  name: string;
  impactPct: number;
}

export interface WaterfallData {
  feature: string;
  shap: number;
}

export interface RCADriver {
  driver: string;
  bullets: string[];
}

export interface DataLineage {
  sources: string[];
  transforms: string[];
  model: {
    name: string;
    type: string;
    version: string;
  };
  decision: string;
}

export interface WhatIfScenario {
  name: string;
  expectedImpact: {
    conversionLiftPct: number;
    revenueLiftPct: number;
  };
  explanation: string;
  recommendation: string;
}

export interface ExplainabilityData {
  pageContext: {
    domain: string;
    schema: string;
    dataset: string;
    model: string;
    version: string;
    trainedOn: string;
  };
  insight: {
    text: string;
    confidence: string;
  };
  keyDrivers: KeyDriver[];
  waterfall: WaterfallData[];
  rca: RCADriver[];
  lineage: DataLineage;
  whatIf: {
    scenarios: WhatIfScenario[];
    finalRecommendation: string;
  };
}

export interface AppData {
  domains: Domain[];
  baseDatasetDetail: DatasetDetail;
  datasetDetails: Record<string, DatasetDetail>;
  explainability: ExplainabilityData;
}

// ---------- Misc ----------

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  role: Role;
  details: Record<string, any>;
  entityType: 'dataset' | 'pipeline' | 'prediction' | 'policy' | 'scenario';
  entityId: string;
}

export interface KPIMetric {
  value: number;
  delta: number;
  trend: 'up' | 'down' | 'stable';
  sparkline?: number[];
}

export interface ExecutiveMetrics {
  reliabilityIndex: KPIMetric;
  trustIndex: KPIMetric;
  explainabilityIndex: KPIMetric;
  mttr: KPIMetric;
}
