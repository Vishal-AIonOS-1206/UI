import { AppData } from "@/types";

/* -------------------------------------------------------------------------- */
/*                         Base Dataset Template (kept as reference)          */
/* -------------------------------------------------------------------------- */
export const baseDatasetDetail = {
  domain: "Travel",
  schema: "Pricing",
  dataset: "daily_fares",
  description:
    "Aggregated daily economy class fares by route/date/channel for top metro pairs.",
  tags: ["pricing", "economy", "metro-routes"],
  owners: ["revops@datacorp.com", "governance@datacorp.com"],
  trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
    Number((80 + (i % 6))).toFixed(2)
  ),

  domainTags: ["Travel", "Aviation", "Airline Operations"],
  functionalTags: ["Revenue Management", "Pricing", "Demand Forecasting"],

  columnTags: {
    flight_date: ["Date", "Partition Key"],
    origin: ["IATA Code", "Dimension"],
    destination: ["IATA Code", "Dimension"],
    rbd: ["Booking Class"],
    channel: ["Sales Channel"],
    fare_amount: ["Metric", "Currency"],
    pnr_id: ["PII", "Masked Identifier"],
  },
  columnIssues: {
    fare_amount: ["Outliers above 99th percentile"],
  },

  columns: [
    { name: "flight_date", datatype: "DATE", description: "Flight departure date", pii: false },
    { name: "origin", datatype: "STRING", description: "IATA origin code", pii: false },
    { name: "destination", datatype: "STRING", description: "IATA destination code", pii: false },
    { name: "rbd", datatype: "STRING", description: "Booking class", pii: false },
    { name: "channel", datatype: "STRING", description: "Direct/OTA", pii: false },
    { name: "fare_amount", datatype: "FLOAT", description: "Eco fare in local currency", pii: false },
    { name: "pnr_id", datatype: "STRING", description: "Masked booking reference", pii: true },
  ],
  qualityReport: [
    { column: "flight_date", nullPct: 0.1, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Fill missing dates" },
    { column: "origin", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0.3, suggestedFix: "Validate IATA code" },
    { column: "destination", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0.2, suggestedFix: "Validate IATA code" },
    { column: "fare_amount", nullPct: 0, dupPct: 0, outlierPct: 1.5, formatViolationsPct: 0, suggestedFix: "Winsorize outliers" },
    { column: "pnr_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Mask using SHA256" },
  ],
  pipelineRuns: [
    { runId: "R-240901-01", started: "2025-09-01 01:00", durationMin: 18, status: "success" as const },
    { runId: "R-240902-02", started: "2025-09-02 01:00", durationMin: 22, status: "fixed_by_agent" as const, issue: "Schema Drift", fix: "Added column promo_flag STRING" },
    { runId: "R-240903-03", started: "2025-09-03 01:00", durationMin: 17, status: "success" as const },
  ],
};

/* -------------------------------------------------------------------------- */
/*                             TELCO: Detailed Datasets                        */
/* -------------------------------------------------------------------------- */
/* Each Telco dataset below contains rich columns, descriptions and quality   */
/* reports so the Dataset Catalog and Column Catalog show realistic content.  */
/* -------------------------------------------------------------------------- */

export const datasetDetails: Record<string, typeof baseDatasetDetail> = {
  /* --------------------------- Telco - Customer: customer_master --------------------------- */
  "Telco-Customers-customer_master": {
    ...baseDatasetDetail,
    domain: "Telco",
    schema: "Customers",
    dataset: "customer_master",
    description:
      "Master customer profile for subscribers: demographics, subscription plan, status, consent flags and contact details. Used by CRM, billing and personalization.",
    tags: ["customers", "profile", "account", "pii"],
    owners: ["crm@telco.com", "governance@telco.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((90 + Math.sin(i / 4) * 2).toFixed(2))
    ),
    domainTags: ["Telecom", "Customer Data"],
    functionalTags: ["CRM", "Personalization", "Customer Analytics"],

    columnTags: {
      customer_id: ["Primary Key", "Identifier"],
      first_name: ["PII", "Name"],
      last_name: ["PII", "Name"],
      email: ["PII", "Contact"],
      phone: ["PII", "Contact", "E.164"],
      plan_type: ["Subscription", "Categorical"],
      billing_type: ["Subscription Type", "Postpaid/Prepaid"],
      activation_date: ["Date", "Lifecycle"],
      last_active_date: ["Date", "Activity"],
      monthly_arpu: ["KPI", "Monetary"],
      consent_pdpa: ["Flag", "Privacy Consent"],
      address_region: ["Geography"],
      segment: ["Derived", "Customer Segment"],
    },

    columnIssues: {
      email: ["Invalid domain formats found", "MX check failing for 2.3%"],
      phone: ["Non-standard country codes in 1.1%"],
      monthly_arpu: ["Occasional negative values due to refunds"],
    },

    columns: [
      { name: "customer_id", datatype: "STRING", description: "Unique internal customer ID (UUID)", pii: false },
      { name: "first_name", datatype: "STRING", description: "Given name of customer", pii: true },
      { name: "last_name", datatype: "STRING", description: "Family name of customer", pii: true },
      { name: "email", datatype: "STRING", description: "Primary email address (normalized to lowercase)", pii: true },
      { name: "phone", datatype: "STRING", description: "Primary mobile in E.164 format", pii: true },
      { name: "plan_type", datatype: "STRING", description: "Plan category (Prepaid/Postpaid)", pii: false },
      { name: "billing_type", datatype: "STRING", description: "Billing arrangement: prepaid/postpaid", pii: false },
      { name: "activation_date", datatype: "DATE", description: "Activation date for current subscription", pii: false },
      { name: "last_active_date", datatype: "DATE", description: "Last activity/touchpoint date", pii: false },
      { name: "monthly_arpu", datatype: "FLOAT", description: "Average revenue per user — monthly (local currency)", pii: false },
      { name: "consent_pdpa", datatype: "BOOLEAN", description: "Customer PDPA / consent flag for marketing", pii: false },
      { name: "address_region", datatype: "STRING", description: "Regional grouping for network operations", pii: false },
      { name: "segment", datatype: "STRING", description: "Customer segment label generated by analytics", pii: false },
    ],

    qualityReport: [
      { column: "customer_id", nullPct: 0, dupPct: 0.05, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Ensure UUID uniqueness and backfill missing keys" },
      { column: "email", nullPct: 0.8, dupPct: 0.4, outlierPct: 0, formatViolationsPct: 1.2, suggestedFix: "Normalize domain and validate MX record" },
      { column: "phone", nullPct: 0.2, dupPct: 0.3, outlierPct: 0, formatViolationsPct: 1.1, suggestedFix: "Standardize to E.164 and remove country code anomalies" },
      { column: "plan_type", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0.1, suggestedFix: "Validate allowed values (Prepaid/Postpaid)" },
      { column: "monthly_arpu", nullPct: 0, dupPct: 0, outlierPct: 0.4, formatViolationsPct: 0, suggestedFix: "Cap negative ARPU from refund adjustments" },
      { column: "consent_pdpa", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Backfill consent flags from CRM where available" },
    ],

    pipelineRuns: [
      { runId: "CUST-20251101-01", started: "2025-11-01 02:00", durationMin: 12, status: "success" as const },
      { runId: "CUST-20251102-02", started: "2025-11-02 02:00", durationMin: 15, status: "success" as const },
      { runId: "CUST-20251103-03", started: "2025-11-03 02:00", durationMin: 30, status: "fixed_by_agent" as const, issue: "Format Violations in phone", fix: "Standardized to E.164 using regex and country mapping" },
    ],
  },

  /* --------------------------- Telco - Customer: churn_history --------------------------- */
  "Telco-Customers-churn_history": {
    ...baseDatasetDetail,
    domain: "Telco",
    schema: "Customers",
    dataset: "churn_history",
    description:
      "Records of churn events: date, reason, customer profile snapshot and retention attempts. Used by retention teams and churn models.",
    tags: ["churn", "retention", "events"],
    owners: ["analytics@telco.com", "retention@telco.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((82 + Math.cos(i / 5) * 3).toFixed(2))
    ),
    domainTags: ["Telecom", "Customer Experience"],
    functionalTags: ["Retention", "Churn Prediction", "CX Analytics"],

    columnTags: {
      churn_id: ["Primary Key", "Event ID"],
      customer_id: ["Foreign Key"],
      churn_date: ["Date", "Event Timestamp"],
      churn_channel: ["Categorical", "Channel"],
      churn_reason: ["Categorical", "Reason"],
      retention_contacted: ["Boolean", "Retention Action"],
      retention_outcome: ["Categorical", "Outcome"],
      prior_3m_avg_usage: ["Metric", "Behavior"],
      prior_3m_avg_calls: ["Metric", "Behavior"],
    },

    columnIssues: {
      churn_reason: ["High proportion of 'Unknown' (5%)", "Free text responses need classification"],
      retention_outcome: ["Nulls where contact not attempted"],
    },

    columns: [
      { name: "churn_id", datatype: "STRING", description: "Unique churn event id", pii: false },
      { name: "customer_id", datatype: "STRING", description: "Customer id (FK to customer_master)", pii: false },
      { name: "churn_date", datatype: "DATE", description: "Date of churn event", pii: false },
      { name: "churn_channel", datatype: "STRING", description: "Channel of churn (SIM return, voluntary, port-out)", pii: false },
      { name: "churn_reason", datatype: "STRING", description: "Primary reason recorded (e.g., cost, network, churn-for-better-offer)", pii: false },
      { name: "retention_contacted", datatype: "BOOLEAN", description: "Whether retention team attempted contact", pii: false },
      { name: "retention_outcome", datatype: "STRING", description: "Outcome of retention attempt (kept/partial-offer/failed)", pii: false },
      { name: "prior_3m_avg_usage", datatype: "FLOAT", description: "Average data usage last 3 months (GB)", pii: false },
      { name: "prior_3m_avg_calls", datatype: "FLOAT", description: "Average calls last 3 months", pii: false },
    ],

    qualityReport: [
      { column: "churn_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Ensure unique event ids" },
      { column: "customer_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Validate referential integrity with customer_master" },
      { column: "churn_reason", nullPct: 2.1, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Map free-text to standard taxonomy" },
      { column: "retention_outcome", nullPct: 12.3, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Mark 'not contacted' explicitly" },
    ],

    pipelineRuns: [
      { runId: "CHURN-20251101-01", started: "2025-11-01 03:00", durationMin: 8, status: "success" as const },
      { runId: "CHURN-20251105-02", started: "2025-11-05 03:00", durationMin: 12, status: "success" as const },
      { runId: "CHURN-20251108-03", started: "2025-11-08 03:00", durationMin: 16, status: "failed" as const, issue: "Source API timeout", fix: undefined },
    ],
  },

  /* --------------------------- Telco - Network: tower_performance --------------------------- */
  "Telco-Network-tower_performance": {
    ...baseDatasetDetail,
    domain: "Telco",
    schema: "Network",
    dataset: "tower_performance",
    description:
      "Per tower telemetry and KPI summary (uptime, latency, packet loss, signal_strength). Used for network reliability and capacity planning.",
    tags: ["network", "telemetry", "tower"],
    owners: ["infra@telco.com", "network.ops@telco.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((78 + Math.sin(i / 4) * 3).toFixed(2))
    ),
    domainTags: ["Telecom", "Infrastructure"],
    functionalTags: ["Network Reliability", "Capacity Planning", "NOC"],

    columnTags: {
      tower_id: ["Primary Key", "Infrastructure ID"],
      region: ["Geographic Attribute"],
      site_type: ["Macro/Micro/Small Cell"],
      uptime_pct: ["KPI", "Reliability Metric"],
      avg_latency_ms: ["Performance Metric"],
      packet_loss_pct: ["Performance Metric"],
      signal_strength_dbm: ["Network Metric", "Quality Indicator"],
      last_maintenance_date: ["Date", "Lifecycle"],
      active_users: ["Metric", "Load Indicator"],
    },

    columnIssues: {
      packet_loss_pct: ["Sparse telemetry during maintenance windows (5%)"],
      avg_latency_ms: ["Spikes during peak hours require aggregation smoothing"],
    },

    columns: [
      { name: "tower_id", datatype: "STRING", description: "Unique tower/site identifier", pii: false },
      { name: "region", datatype: "STRING", description: "Region or state code", pii: false },
      { name: "site_type", datatype: "STRING", description: "Macro/Micro/Small cell classification", pii: false },
      { name: "uptime_pct", datatype: "FLOAT", description: "Uptime percentage for reporting window", pii: false },
      { name: "avg_latency_ms", datatype: "FLOAT", description: "Average network latency at tower", pii: false },
      { name: "packet_loss_pct", datatype: "FLOAT", description: "Packet loss percentage", pii: false },
      { name: "signal_strength_dbm", datatype: "FLOAT", description: "Average signal strength in dBm", pii: false },
      { name: "last_maintenance_date", datatype: "DATE", description: "Date of last scheduled maintenance", pii: false },
      { name: "active_users", datatype: "INT", description: "Number of active users attached to tower", pii: false },
    ],

    qualityReport: [
      { column: "tower_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Standardize tower ID format" },
      { column: "uptime_pct", nullPct: 0, dupPct: 0, outlierPct: 0.2, formatViolationsPct: 0, suggestedFix: "Clip values to 0-100" },
      { column: "avg_latency_ms", nullPct: 0.4, dupPct: 0, outlierPct: 0.5, formatViolationsPct: 0, suggestedFix: "Aggregate/smooth telemetry spikes" },
      { column: "signal_strength_dbm", nullPct: 0, dupPct: 0, outlierPct: 0.7, formatViolationsPct: 0, suggestedFix: "Flag towers with < -100 dBm for investigation" },
    ],

    pipelineRuns: [
      { runId: "TOWER-20251101-01", started: "2025-11-01 00:15", durationMin: 45, status: "success" as const },
      { runId: "TOWER-20251103-02", started: "2025-11-03 00:20", durationMin: 60, status: "success" as const },
      { runId: "TOWER-20251106-03", started: "2025-11-06 00:10", durationMin: 120, status: "fixed_by_agent" as const, issue: "Missing telemetry partitions", fix: "Backfilled partitions from backup S3" },
    ],
  },

  /* --------------------------- Telco - Network: service_outages --------------------------- */
  "Telco-Network-service_outages": {
    ...baseDatasetDetail,
    domain: "Telco",
    schema: "Network",
    dataset: "service_outages",
    description:
      "Catalog of planned and unplanned service outages: timestamps, regions, root cause, impacted services and mitigation notes.",
    tags: ["incidents", "outages", "ops"],
    owners: ["network.ops@telco.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((76 + Math.cos(i / 5) * 4).toFixed(2))
    ),
    domainTags: ["Telecom", "Service Reliability"],
    functionalTags: ["Incident Management", "Root Cause Analysis"],

    columnTags: {
      outage_id: ["Primary Key", "Incident ID"],
      region: ["Geographic"],
      start_time: ["Timestamp"],
      end_time: ["Timestamp"],
      duration_min: ["Metric"],
      cause: ["Categorical", "Root Cause"],
      impacted_services: ["Array", "Affected Services"],
      severity: ["Enum", "low/medium/high"],
    },

    columnIssues: {
      cause: ["Free text in 4% of records — needs taxonomy mapping"],
      end_time: ["Null when ongoing"],
    },

    columns: [
      { name: "outage_id", datatype: "STRING", description: "Unique outage identifier", pii: false },
      { name: "region", datatype: "STRING", description: "Region affected by outage", pii: false },
      { name: "start_time", datatype: "TIMESTAMP", description: "Outage start timestamp", pii: false },
      { name: "end_time", datatype: "TIMESTAMP", description: "Outage end timestamp (null if ongoing)", pii: false },
      { name: "duration_min", datatype: "INT", description: "Duration in minutes", pii: false },
      { name: "cause", datatype: "STRING", description: "Root cause classification (e.g., fiber-cut, power, configuration)", pii: false },
      { name: "impacted_services", datatype: "STRING", description: "Comma-separated services impacted (voice, data, sms)", pii: false },
      { name: "severity", datatype: "STRING", description: "Severity classification", pii: false },
    ],

    qualityReport: [
      { column: "outage_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Ensure UUID and stable naming" },
      { column: "start_time", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Validate timezone standardization" },
      { column: "end_time", nullPct: 3.6, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Mark ongoing outages explicitly" },
      { column: "cause", nullPct: 1.2, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Map free-text to standard cause taxonomy" },
    ],

    pipelineRuns: [
      { runId: "OUT-20251102-01", started: "2025-11-02 06:00", durationMin: 6, status: "success" as const },
      { runId: "OUT-20251104-02", started: "2025-11-04 14:30", durationMin: 10, status: "success" as const },
      { runId: "OUT-20251109-03", started: "2025-11-09 02:00", durationMin: 120, status: "success" as const },
    ],
  },

  /* --------------------------- Telco - Billing: billing_summary --------------------------- */
  "Telco-Billing-billing_summary": {
    ...baseDatasetDetail,
    domain: "Telco",
    schema: "Billing",
    dataset: "billing_summary",
    description:
      "Monthly billing aggregates by region and plan: ARPU, revenue, payment success rates, refunds, outstanding balances. Used by finance and revenue assurance.",
    tags: ["billing", "arpu", "finance"],
    owners: ["finance@telco.com", "revops@telco.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((88 + Math.sin(i / 6) * 2).toFixed(2))
    ),
    domainTags: ["Telecom", "Finance"],
    functionalTags: ["Revenue Reporting", "Billing Insights", "Revenue Assurance"],

    columnTags: {
      billing_month: ["Time Dimension"],
      region: ["Geographic"],
      plan_type: ["Dimension"],
      arpu: ["KPI", "Monetary"],
      revenue: ["Metric", "Monetary"],
      payment_success_pct: ["KPI", "Operational"],
      refunds_amt: ["Metric", "Adjustments"],
      outstanding_balance: ["Liability", "Monetary"],
    },

    columnIssues: {
      outstanding_balance: ["Occasional negative values due to timing differences"],
      payment_success_pct: ["Missing values for small regions (2%)"],
    },

    columns: [
      { name: "billing_month", datatype: "DATE", description: "Billing month (YYYY-MM-01)", pii: false },
      { name: "region", datatype: "STRING", description: "Region code", pii: false },
      { name: "plan_type", datatype: "STRING", description: "Plan category", pii: false },
      { name: "arpu", datatype: "FLOAT", description: "Average revenue per user for month (local currency)", pii: false },
      { name: "revenue", datatype: "FLOAT", description: "Total revenue for region-month", pii: false },
      { name: "payment_success_pct", datatype: "FLOAT", description: "Successful payment percentage", pii: false },
      { name: "refunds_amt", datatype: "FLOAT", description: "Total refunds processed", pii: false },
      { name: "outstanding_balance", datatype: "FLOAT", description: "Outstanding receivables", pii: false },
    ],

    qualityReport: [
      { column: "billing_month", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Ensure consistent month partitioning" },
      { column: "arpu", nullPct: 0, dupPct: 0, outlierPct: 1.0, formatViolationsPct: 0, suggestedFix: "Investigate ARPU outliers" },
      { column: "payment_success_pct", nullPct: 2.0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Backfill missing data for small regions" },
      { column: "outstanding_balance", nullPct: 0, dupPct: 0, outlierPct: 0.2, formatViolationsPct: 0, suggestedFix: "Clamp or annotate negative balances" },
    ],

    pipelineRuns: [
      { runId: "BILL-20251101-01", started: "2025-11-01 04:00", durationMin: 10, status: "success" as const },
      { runId: "BILL-20251102-02", started: "2025-11-02 04:05", durationMin: 12, status: "success" as const },
      { runId: "BILL-20251106-03", started: "2025-11-06 04:10", durationMin: 18, status: "success" as const },
    ],
  },

  /* --------------------------- Telco - Billing: credit_risk_profiles --------------------------- */
  "Telco-Billing-credit_risk_profiles": {
    ...baseDatasetDetail,
    domain: "Telco",
    schema: "Billing",
    dataset: "credit_risk_profiles",
    description:
      "Credit scoring and risk segmentation for postpaid subscribers: historical payments, delinquencies, risk deciles and recommended collection actions.",
    tags: ["credit", "risk", "collections"],
    owners: ["risk@telco.com", "collections@telco.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((84 + Math.cos(i / 5) * 2.5).toFixed(2))
    ),
    domainTags: ["Telecom", "Finance"],
    functionalTags: ["Collections", "Credit Analytics", "Risk Monitoring"],

    columnTags: {
      customer_id: ["FK", "Identifier"],
      risk_score: ["Model Output", "0-100"],
      risk_decile: ["Derived", "1-10"],
      days_past_due: ["Metric"],
      avg_payment_delay_days: ["Metric"],
      total_outstanding: ["Monetary"],
      recommended_action: ["Categorical"],
    },

    columnIssues: {
      risk_score: ["Model versioning mismatch for 0.6% of rows"],
      total_outstanding: ["Negative values reported due to refunds (0.2%)"],
    },

    columns: [
      { name: "customer_id", datatype: "STRING", description: "Customer id (FK)", pii: false },
      { name: "risk_score", datatype: "FLOAT", description: "Credit risk score (0-100)", pii: false },
      { name: "risk_decile", datatype: "INT", description: "Risk decile (1 safest - 10 riskiest)", pii: false },
      { name: "days_past_due", datatype: "INT", description: "Max days past due in last 12 months", pii: false },
      { name: "avg_payment_delay_days", datatype: "FLOAT", description: "Average payment delay in days", pii: false },
      { name: "total_outstanding", datatype: "FLOAT", description: "Total outstanding balance", pii: false },
      { name: "recommended_action", datatype: "STRING", description: "Collections action recommended by system", pii: false },
    ],

    qualityReport: [
      { column: "customer_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Check FK integrity" },
      { column: "risk_score", nullPct: 0.1, dupPct: 0, outlierPct: 0.4, formatViolationsPct: 0, suggestedFix: "Ensure model version alignment" },
      { column: "total_outstanding", nullPct: 0, dupPct: 0, outlierPct: 0.2, formatViolationsPct: 0, suggestedFix: "Annotate negative balances with refund metadata" },
    ],

    pipelineRuns: [
      { runId: "CRISK-20251101-01", started: "2025-11-01 05:00", durationMin: 25, status: "success" as const },
      { runId: "CRISK-20251104-02", started: "2025-11-04 05:00", durationMin: 30, status: "fixed_by_agent" as const, issue: "Model version mismatch", fix: "Re-scored with v2.2 pipeline" },
    ],
  },

    /* --------------------------- Travel - Operations: flight_load_summary --------------------------- */
  "Travel-Operations-flight_load_summary": {
    ...baseDatasetDetail,
    domain: "Travel",
    schema: "Operations",
    dataset: "flight_load_summary",
    description:
      "Aggregated daily seat load factors (SLF), on-time performance, and cancellations by flight and route. Used by operations control and planning.",
    tags: ["operations", "on-time", "capacity"],
    owners: ["ops@datacorp.com", "network@datacorp.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((85 + Math.sin(i / 3) * 3).toFixed(2))
    ),
    domainTags: ["Travel", "Airline Operations"],
    functionalTags: ["Operations", "Scheduling", "Reliability"],

    columnTags: {
      flight_number: ["Primary Key"],
      flight_date: ["Date", "Partition Key"],
      origin: ["IATA Code"],
      destination: ["IATA Code"],
      slf_pct: ["KPI", "Load Factor"],
      cancellations: ["Count", "Operational Metric"],
      delay_minutes: ["Metric", "Performance"],
      aircraft_type: ["Categorical"],
      crew_id: ["Identifier", "Internal"],
    },

    columnIssues: {
      delay_minutes: ["Outliers during weather disruptions"],
      cancellations: ["Nulls for charters not tracked in ops feed"],
    },

    columns: [
      { name: "flight_number", datatype: "STRING", description: "Unique flight identifier", pii: false },
      { name: "flight_date", datatype: "DATE", description: "Date of flight operation", pii: false },
      { name: "origin", datatype: "STRING", description: "Origin IATA airport code", pii: false },
      { name: "destination", datatype: "STRING", description: "Destination IATA airport code", pii: false },
      { name: "slf_pct", datatype: "FLOAT", description: "Seat load factor (0–100%)", pii: false },
      { name: "cancellations", datatype: "INT", description: "Number of flights cancelled on date/route", pii: false },
      { name: "delay_minutes", datatype: "INT", description: "Total delay minutes accumulated", pii: false },
      { name: "aircraft_type", datatype: "STRING", description: "Equipment model", pii: false },
      { name: "crew_id", datatype: "STRING", description: "Crew rotation ID (anonymized)", pii: false },
    ],

    qualityReport: [
      { column: "flight_number", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Validate unique key constraint" },
      { column: "slf_pct", nullPct: 0, dupPct: 0, outlierPct: 1.1, formatViolationsPct: 0, suggestedFix: "Clip SLF to 0–100" },
      { column: "delay_minutes", nullPct: 0, dupPct: 0, outlierPct: 2.4, formatViolationsPct: 0, suggestedFix: "Winsorize extreme delays" },
    ],

    pipelineRuns: [
      { runId: "OPS-20251101-01", started: "2025-11-01 04:00", durationMin: 18, status: "success" as const },
      { runId: "OPS-20251102-02", started: "2025-11-02 04:05", durationMin: 20, status: "fixed_by_agent" as const, issue: "Null cancellations", fix: "Defaulted 0 where missing" },
    ],
  },

  /* --------------------------- Travel - Bookings: booking_transactions --------------------------- */
  "Travel-Bookings-booking_transactions": {
    ...baseDatasetDetail,
    domain: "Travel",
    schema: "Bookings",
    dataset: "booking_transactions",
    description:
      "All PNR-level bookings with fare, passenger, and payment details. Used for revenue recognition, channel performance, and refund analytics.",
    tags: ["bookings", "transactions", "revenue"],
    owners: ["revops@datacorp.com", "finance@datacorp.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((86 + Math.cos(i / 4) * 2).toFixed(2))
    ),
    domainTags: ["Travel", "E-Commerce"],
    functionalTags: ["Sales Analytics", "Revenue", "Finance"],

    columnTags: {
      booking_id: ["Primary Key", "Transaction ID"],
      pnr_id: ["Foreign Key"],
      booking_date: ["Date"],
      payment_status: ["Enum", "Paid/Refunded/Pending"],
      channel: ["Sales Channel"],
      base_fare: ["Metric", "Currency"],
      taxes: ["Metric", "Currency"],
      total_amount: ["Metric", "Currency"],
      passengers: ["Count"],
      refund_flag: ["Boolean"],
    },

    columnIssues: {
      payment_status: ["Non-standard codes from OTA feed"],
      total_amount: ["Mismatch with base_fare + taxes (0.5%)"],
    },

    columns: [
      { name: "booking_id", datatype: "STRING", description: "Unique booking identifier", pii: false },
      { name: "pnr_id", datatype: "STRING", description: "Passenger Name Record (masked)", pii: true },
      { name: "booking_date", datatype: "DATE", description: "Booking creation date", pii: false },
      { name: "payment_status", datatype: "STRING", description: "Status of payment (Paid, Refunded, Pending)", pii: false },
      { name: "channel", datatype: "STRING", description: "Booking channel (Direct/OTA/Agent)", pii: false },
      { name: "base_fare", datatype: "FLOAT", description: "Base ticket fare", pii: false },
      { name: "taxes", datatype: "FLOAT", description: "Applicable taxes", pii: false },
      { name: "total_amount", datatype: "FLOAT", description: "Total transaction amount", pii: false },
      { name: "passengers", datatype: "INT", description: "Number of passengers per booking", pii: false },
      { name: "refund_flag", datatype: "BOOLEAN", description: "Indicates if refund issued", pii: false },
    ],

    qualityReport: [
      { column: "booking_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Enforce uniqueness" },
      { column: "payment_status", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 1.0, suggestedFix: "Normalize to fixed enum values" },
      { column: "total_amount", nullPct: 0, dupPct: 0, outlierPct: 0.5, formatViolationsPct: 0, suggestedFix: "Recalculate total = base_fare + taxes" },
    ],

    pipelineRuns: [
      { runId: "BOOK-20251101-01", started: "2025-11-01 07:00", durationMin: 16, status: "success" as const },
      { runId: "BOOK-20251103-02", started: "2025-11-03 07:00", durationMin: 22, status: "fixed_by_agent" as const, issue: "Enum mismatch", fix: "Standardized payment_status via mapping" },
    ],
  },

  /* --------------------------- Travel - CustomerExperience: nps_survey_responses --------------------------- */
  "Travel-CustomerExperience-nps_survey_responses": {
    ...baseDatasetDetail,
    domain: "Travel",
    schema: "CustomerExperience",
    dataset: "nps_survey_responses",
    description:
      "Post-journey survey responses with NPS scores, comments, and satisfaction metrics across booking, check-in, and onboard stages.",
    tags: ["survey", "nps", "feedback"],
    owners: ["cx@datacorp.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((83 + Math.sin(i / 2) * 3).toFixed(2))
    ),
    domainTags: ["Travel", "Customer Experience"],
    functionalTags: ["NPS", "Feedback Analysis", "CX Analytics"],

    columnTags: {
      survey_id: ["Primary Key"],
      pnr_id: ["Foreign Key"],
      nps_score: ["Metric", "0–10"],
      comment_text: ["Free Text"],
      sentiment_score: ["Derived", "Sentiment"],
      journey_stage: ["Enum", "Booking/Check-In/Flight"],
      created_at: ["Timestamp"],
    },

    columnIssues: {
      sentiment_score: ["Low correlation with manual tagging (1.2%)"],
    },

    columns: [
      { name: "survey_id", datatype: "STRING", description: "Unique survey response ID", pii: false },
      { name: "pnr_id", datatype: "STRING", description: "Passenger record reference (masked)", pii: true },
      { name: "nps_score", datatype: "INT", description: "Net Promoter Score (0–10)", pii: false },
      { name: "comment_text", datatype: "STRING", description: "Customer free-text feedback", pii: true },
      { name: "sentiment_score", datatype: "FLOAT", description: "AI-derived sentiment (-1 to +1)", pii: false },
      { name: "journey_stage", datatype: "STRING", description: "Stage of journey feedback", pii: false },
      { name: "created_at", datatype: "TIMESTAMP", description: "Timestamp of feedback submission", pii: false },
    ],

    qualityReport: [
      { column: "survey_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Ensure unique IDs" },
      { column: "nps_score", nullPct: 0.4, dupPct: 0, outlierPct: 0.3, formatViolationsPct: 0, suggestedFix: "Clip to valid 0–10 range" },
      { column: "sentiment_score", nullPct: 0, dupPct: 0, outlierPct: 1.0, formatViolationsPct: 0, suggestedFix: "Recompute using latest NLP model" },
    ],

    pipelineRuns: [
      { runId: "CX-20251101-01", started: "2025-11-01 12:00", durationMin: 10, status: "success" as const },
      { runId: "CX-20251103-02", started: "2025-11-03 12:00", durationMin: 15, status: "success" as const },
      { runId: "CX-20251105-03", started: "2025-11-05 12:00", durationMin: 18, status: "fixed_by_agent" as const, issue: "Sentiment model drift", fix: "Recomputed with v2.1 embeddings" },
    ],
  },

    /* --------------------------- Hospitality - Operations: hotel_performance --------------------------- */
  "Hospitality-Operations-hotel_performance": {
    ...baseDatasetDetail,
    domain: "Hospitality",
    schema: "Operations",
    dataset: "hotel_performance",
    description:
      "Daily operational KPIs per property: occupancy, ADR, RevPAR, cancellations, and stay length. Used by revenue and operations teams for daily pickup tracking.",
    tags: ["operations", "revpar", "adr"],
    owners: ["ops@hospitality.com", "revman@hospitality.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((84 + Math.sin(i / 3) * 2).toFixed(2))
    ),
    domainTags: ["Hospitality", "Hotel Operations"],
    functionalTags: ["Revenue Management", "Daily Pickup", "Operations"],

    columnTags: {
      property_id: ["Primary Key"],
      date: ["Partition Key", "Date"],
      occupancy_pct: ["KPI", "Performance"],
      adr_usd: ["KPI", "Revenue"],
      revpar_usd: ["KPI", "Yield"],
      cancellations_pct: ["Metric", "Customer Behavior"],
      avg_stay_length: ["Metric", "Behavior"],
      region: ["Geography"],
      brand: ["Categorical"],
    },

    columnIssues: {
      cancellations_pct: ["Spikes due to event cancellations (1.8%)"],
    },

    columns: [
      { name: "property_id", datatype: "STRING", description: "Unique hotel property identifier", pii: false },
      { name: "date", datatype: "DATE", description: "Operational date", pii: false },
      { name: "occupancy_pct", datatype: "FLOAT", description: "Occupancy percentage", pii: false },
      { name: "adr_usd", datatype: "FLOAT", description: "Average daily rate (USD)", pii: false },
      { name: "revpar_usd", datatype: "FLOAT", description: "Revenue per available room (USD)", pii: false },
      { name: "cancellations_pct", datatype: "FLOAT", description: "Percentage of bookings cancelled", pii: false },
      { name: "avg_stay_length", datatype: "FLOAT", description: "Average guest stay length (nights)", pii: false },
      { name: "region", datatype: "STRING", description: "Geographical region of property", pii: false },
      { name: "brand", datatype: "STRING", description: "Brand affiliation", pii: false },
    ],

    qualityReport: [
      { column: "property_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Ensure unique property key" },
      { column: "occupancy_pct", nullPct: 0, dupPct: 0, outlierPct: 0.4, formatViolationsPct: 0, suggestedFix: "Clip occupancy to 0–100" },
      { column: "adr_usd", nullPct: 0, dupPct: 0, outlierPct: 1.0, formatViolationsPct: 0, suggestedFix: "Smooth high ADR spikes during peak season" },
    ],

    pipelineRuns: [
      { runId: "HOTEL-20251101-01", started: "2025-11-01 05:00", durationMin: 15, status: "success" as const },
      { runId: "HOTEL-20251103-02", started: "2025-11-03 05:00", durationMin: 18, status: "fixed_by_agent" as const, issue: "Missing occupancy data", fix: "Interpolated from PMS backup" },
    ],
  },

  /* --------------------------- Hospitality - Bookings: reservations --------------------------- */
  "Hospitality-Bookings-reservations": {
    ...baseDatasetDetail,
    domain: "Hospitality",
    schema: "Bookings",
    dataset: "reservations",
    description:
      "Detailed reservation records from PMS: check-in/check-out dates, rate codes, source, room type, and booking channel.",
    tags: ["bookings", "reservations", "rooms"],
    owners: ["pms@hospitality.com", "revman@hospitality.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((86 + Math.cos(i / 4) * 2.5).toFixed(2))
    ),
    domainTags: ["Hospitality", "Bookings"],
    functionalTags: ["Distribution", "Channel Management", "Revenue Tracking"],

    columnTags: {
      reservation_id: ["Primary Key"],
      guest_id: ["Foreign Key"],
      check_in_date: ["Date"],
      check_out_date: ["Date"],
      nights: ["Metric"],
      rate_code: ["Categorical"],
      room_type: ["Categorical"],
      channel: ["Booking Channel"],
      total_revenue: ["Metric", "Currency"],
      cancellation_flag: ["Boolean"],
    },

    columnIssues: {
      total_revenue: ["Minor mismatch vs accounting feed (0.3%)"],
    },

    columns: [
      { name: "reservation_id", datatype: "STRING", description: "Unique reservation ID", pii: false },
      { name: "guest_id", datatype: "STRING", description: "Unique guest identifier", pii: true },
      { name: "check_in_date", datatype: "DATE", description: "Guest check-in date", pii: false },
      { name: "check_out_date", datatype: "DATE", description: "Guest check-out date", pii: false },
      { name: "nights", datatype: "INT", description: "Number of nights stayed", pii: false },
      { name: "rate_code", datatype: "STRING", description: "Rate plan code applied to booking", pii: false },
      { name: "room_type", datatype: "STRING", description: "Room category booked", pii: false },
      { name: "channel", datatype: "STRING", description: "Booking source (OTA, Direct, Corporate)", pii: false },
      { name: "total_revenue", datatype: "FLOAT", description: "Total booking revenue in USD", pii: false },
      { name: "cancellation_flag", datatype: "BOOLEAN", description: "Whether booking was cancelled", pii: false },
    ],

    qualityReport: [
      { column: "reservation_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Validate uniqueness" },
      { column: "total_revenue", nullPct: 0, dupPct: 0, outlierPct: 0.3, formatViolationsPct: 0, suggestedFix: "Cross-check with accounting ledger" },
      { column: "channel", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0.4, suggestedFix: "Normalize OTA source codes" },
    ],

    pipelineRuns: [
      { runId: "RES-20251101-01", started: "2025-11-01 09:00", durationMin: 22, status: "success" as const },
      { runId: "RES-20251103-02", started: "2025-11-03 09:00", durationMin: 30, status: "fixed_by_agent" as const, issue: "Missing OTA feed records", fix: "Backfilled from SFTP" },
    ],
  },

  /* --------------------------- Hospitality - Finance: revenue_summary --------------------------- */
  "Hospitality-Finance-revenue_summary": {
    ...baseDatasetDetail,
    domain: "Hospitality",
    schema: "Finance",
    dataset: "revenue_summary",
    description:
      "Monthly revenue summary by region and segment, including room, F&B, and ancillary revenues. Used for P&L reporting and forecasting.",
    tags: ["finance", "revenue", "pnl"],
    owners: ["finance@hospitality.com", "analytics@hospitality.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((87 + Math.sin(i / 5) * 2).toFixed(2))
    ),
    domainTags: ["Hospitality", "Finance"],
    functionalTags: ["Financial Planning", "Forecasting"],

    columnTags: {
      month: ["Date", "Time Dimension"],
      region: ["Geographic"],
      segment: ["Categorical"],
      room_revenue: ["Metric", "Currency"],
      fb_revenue: ["Metric", "Currency"],
      other_revenue: ["Metric", "Currency"],
      total_revenue: ["KPI", "Currency"],
      variance_pct: ["Metric", "Performance"],
    },

    columnIssues: {
      variance_pct: ["Formatting issues in import (1.1%)"],
    },

    columns: [
      { name: "month", datatype: "DATE", description: "Month start date", pii: false },
      { name: "region", datatype: "STRING", description: "Geographic region", pii: false },
      { name: "segment", datatype: "STRING", description: "Market segment (Leisure/Corporate/Group)", pii: false },
      { name: "room_revenue", datatype: "FLOAT", description: "Room revenue (USD)", pii: false },
      { name: "fb_revenue", datatype: "FLOAT", description: "Food & Beverage revenue (USD)", pii: false },
      { name: "other_revenue", datatype: "FLOAT", description: "Ancillary revenue (USD)", pii: false },
      { name: "total_revenue", datatype: "FLOAT", description: "Total revenue (USD)", pii: false },
      { name: "variance_pct", datatype: "FLOAT", description: "Variance vs budget (%)", pii: false },
    ],

    qualityReport: [
      { column: "total_revenue", nullPct: 0, dupPct: 0, outlierPct: 0.4, formatViolationsPct: 0, suggestedFix: "Reconcile with accounting system" },
      { column: "variance_pct", nullPct: 0, dupPct: 0, outlierPct: 1.1, formatViolationsPct: 0, suggestedFix: "Convert to float before aggregation" },
    ],

    pipelineRuns: [
      { runId: "REV-20251101-01", started: "2025-11-01 06:00", durationMin: 14, status: "success" as const },
      { runId: "REV-20251102-02", started: "2025-11-02 06:00", durationMin: 20, status: "fixed_by_agent" as const, issue: "Currency mismatch", fix: "Standardized to USD" },
    ],
  },

  /* --------------------------- Hospitality - CustomerExperience: guest_feedback --------------------------- */
  "Hospitality-CustomerExperience-guest_feedback": {
    ...baseDatasetDetail,
    domain: "Hospitality",
    schema: "CustomerExperience",
    dataset: "guest_feedback",
    description:
      "Guest feedback and review dataset aggregated from post-stay surveys and online review platforms. Includes satisfaction scores and NLP sentiment tags.",
    tags: ["guest", "feedback", "reviews"],
    owners: ["cx@hospitality.com", "analytics@hospitality.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((85 + Math.sin(i / 2) * 2).toFixed(2))
    ),
    domainTags: ["Hospitality", "CX"],
    functionalTags: ["Sentiment Analysis", "Reputation Management"],

    columnTags: {
      review_id: ["Primary Key"],
      property_id: ["Foreign Key"],
      guest_id: ["Foreign Key"],
      satisfaction_score: ["Metric", "0–10"],
      sentiment_score: ["Metric", "-1 to 1"],
      platform: ["Categorical"],
      review_text: ["Free Text"],
      created_at: ["Timestamp"],
    },

    columnIssues: {
      sentiment_score: ["Low correlation with manual tags (0.9%)"],
    },

    columns: [
      { name: "review_id", datatype: "STRING", description: "Unique review ID", pii: false },
      { name: "property_id", datatype: "STRING", description: "Linked hotel property", pii: false },
      { name: "guest_id", datatype: "STRING", description: "Guest identifier (masked)", pii: true },
      { name: "satisfaction_score", datatype: "INT", description: "Guest satisfaction score (0–10)", pii: false },
      { name: "sentiment_score", datatype: "FLOAT", description: "AI-predicted sentiment score (-1 to +1)", pii: false },
      { name: "platform", datatype: "STRING", description: "Source of review (Survey, OTA, Social)", pii: false },
      { name: "review_text", datatype: "STRING", description: "Free-text review content", pii: true },
      { name: "created_at", datatype: "TIMESTAMP", description: "Date/time of review creation", pii: false },
    ],

    qualityReport: [
      { column: "satisfaction_score", nullPct: 0.3, dupPct: 0, outlierPct: 0.2, formatViolationsPct: 0, suggestedFix: "Ensure valid 0–10 scale" },
      { column: "sentiment_score", nullPct: 0, dupPct: 0, outlierPct: 0.9, formatViolationsPct: 0, suggestedFix: "Retrain sentiment model quarterly" },
    ],

    pipelineRuns: [
      { runId: "GUEST-20251101-01", started: "2025-11-01 10:00", durationMin: 25, status: "success" as const },
      { runId: "GUEST-20251104-02", started: "2025-11-04 10:30", durationMin: 28, status: "fixed_by_agent" as const, issue: "Sentiment model drift", fix: "Re-scored reviews" },
    ],
  },

    /* --------------------------- Healthcare - Clinical: patient_records --------------------------- */
  "Healthcare-Clinical-patient_records": {
    ...baseDatasetDetail,
    domain: "Healthcare",
    schema: "Clinical",
    dataset: "patient_records",
    description:
      "Master patient clinical record including demographics, diagnosis codes, medications, allergies, and care history. Used for EMR analytics and care optimization.",
    tags: ["clinical", "patient", "emr"],
    owners: ["clinicalops@healthcare.com", "governance@healthcare.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((88 + Math.sin(i / 3) * 2).toFixed(2))
    ),
    domainTags: ["Healthcare", "Clinical Data"],
    functionalTags: ["Electronic Health Records", "Care Management"],

    columnTags: {
      patient_id: ["Primary Key", "PII"],
      first_name: ["PII", "Name"],
      last_name: ["PII", "Name"],
      dob: ["Date", "Sensitive"],
      gender: ["Categorical"],
      diagnosis_code: ["ICD-10", "Medical Code"],
      medication_list: ["Array", "Drugs"],
      allergies: ["Array", "Allergy Data"],
      encounter_date: ["Date", "Event Timestamp"],
      physician_id: ["Foreign Key"],
    },

    columnIssues: {
      diagnosis_code: ["Deprecated ICD-9 codes found (0.5%)"],
      medication_list: ["Free-text entries need standardization"],
    },

    columns: [
      { name: "patient_id", datatype: "STRING", description: "Unique patient identifier", pii: true },
      { name: "first_name", datatype: "STRING", description: "Patient's first name", pii: true },
      { name: "last_name", datatype: "STRING", description: "Patient's last name", pii: true },
      { name: "dob", datatype: "DATE", description: "Date of birth", pii: true },
      { name: "gender", datatype: "STRING", description: "Gender (M/F/Other)", pii: false },
      { name: "diagnosis_code", datatype: "STRING", description: "Primary ICD-10 diagnosis code", pii: false },
      { name: "medication_list", datatype: "STRING", description: "Comma-separated list of prescribed medications", pii: false },
      { name: "allergies", datatype: "STRING", description: "Known allergies (comma-separated)", pii: false },
      { name: "encounter_date", datatype: "DATE", description: "Date of patient’s last clinical encounter", pii: false },
      { name: "physician_id", datatype: "STRING", description: "Treating physician identifier", pii: false },
    ],

    qualityReport: [
      { column: "patient_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Ensure unique patient key" },
      { column: "diagnosis_code", nullPct: 0, dupPct: 0, outlierPct: 0.5, formatViolationsPct: 0, suggestedFix: "Update deprecated ICD codes" },
      { column: "medication_list", nullPct: 0.2, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Standardize drug names using RxNorm" },
    ],

    pipelineRuns: [
      { runId: "CLIN-20251101-01", started: "2025-11-01 08:00", durationMin: 20, status: "success" as const },
      { runId: "CLIN-20251103-02", started: "2025-11-03 08:00", durationMin: 25, status: "fixed_by_agent" as const, issue: "ICD code mismatch", fix: "Mapped ICD-9 → ICD-10" },
    ],
  },

  /* --------------------------- Healthcare - Claims: insurance_claims --------------------------- */
  "Healthcare-Claims-insurance_claims": {
    ...baseDatasetDetail,
    domain: "Healthcare",
    schema: "Claims",
    dataset: "insurance_claims",
    description:
      "Processed insurance claims with billing codes, claim amounts, status, adjudication dates, and denial reasons. Used for revenue cycle management.",
    tags: ["claims", "insurance", "billing"],
    owners: ["finance@healthcare.com", "claims@healthcare.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((87 + Math.cos(i / 4) * 2).toFixed(2))
    ),
    domainTags: ["Healthcare", "Insurance"],
    functionalTags: ["Revenue Cycle", "Claims Analytics"],

    columnTags: {
      claim_id: ["Primary Key"],
      patient_id: ["Foreign Key"],
      procedure_code: ["CPT", "Procedure Code"],
      billed_amount_usd: ["Metric", "Currency"],
      approved_amount_usd: ["Metric", "Currency"],
      claim_status: ["Enum", "Approved/Denied/Pending"],
      denial_reason: ["Categorical"],
      adjudicated_date: ["Date"],
      insurer_name: ["Categorical"],
    },

    columnIssues: {
      denial_reason: ["Missing in 8% of denied claims"],
      claim_status: ["Non-standard status codes (0.7%)"],
    },

    columns: [
      { name: "claim_id", datatype: "STRING", description: "Unique insurance claim ID", pii: false },
      { name: "patient_id", datatype: "STRING", description: "Linked patient ID", pii: true },
      { name: "procedure_code", datatype: "STRING", description: "CPT or ICD-10-PCS procedure code", pii: false },
      { name: "billed_amount_usd", datatype: "FLOAT", description: "Claimed amount billed (USD)", pii: false },
      { name: "approved_amount_usd", datatype: "FLOAT", description: "Amount approved by insurer", pii: false },
      { name: "claim_status", datatype: "STRING", description: "Current claim status", pii: false },
      { name: "denial_reason", datatype: "STRING", description: "If denied, reason provided", pii: false },
      { name: "adjudicated_date", datatype: "DATE", description: "Date claim was adjudicated", pii: false },
      { name: "insurer_name", datatype: "STRING", description: "Insurance provider name", pii: false },
    ],

    qualityReport: [
      { column: "claim_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Ensure unique claim keys" },
      { column: "claim_status", nullPct: 0, dupPct: 0, outlierPct: 0.7, formatViolationsPct: 0, suggestedFix: "Normalize status enums" },
      { column: "denial_reason", nullPct: 8.0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Backfill denial reasons via audit notes" },
    ],

    pipelineRuns: [
      { runId: "CLAIM-20251101-01", started: "2025-11-01 10:00", durationMin: 18, status: "success" as const },
      { runId: "CLAIM-20251105-02", started: "2025-11-05 10:00", durationMin: 25, status: "fixed_by_agent" as const, issue: "Enum mismatch", fix: "Mapped 'Processing' → 'Pending'" },
    ],
  },

  /* --------------------------- Healthcare - Operations: bed_occupancy --------------------------- */
  "Healthcare-Operations-bed_occupancy": {
    ...baseDatasetDetail,
    domain: "Healthcare",
    schema: "Operations",
    dataset: "bed_occupancy",
    description:
      "Daily summary of hospital bed utilization by ward, specialty, and admission type. Used for capacity planning and operations monitoring.",
    tags: ["operations", "capacity", "occupancy"],
    owners: ["ops@healthcare.com", "planning@healthcare.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((84 + Math.sin(i / 2) * 3).toFixed(2))
    ),
    domainTags: ["Healthcare", "Operations"],
    functionalTags: ["Resource Planning", "Capacity Analytics"],

    columnTags: {
      hospital_id: ["Primary Key"],
      date: ["Date"],
      total_beds: ["Metric"],
      occupied_beds: ["Metric"],
      occupancy_rate_pct: ["KPI"],
      icu_beds: ["Metric"],
      icu_occupancy_pct: ["KPI"],
      emergency_admissions: ["Metric"],
      elective_admissions: ["Metric"],
    },

    columns: [
      { name: "hospital_id", datatype: "STRING", description: "Hospital identifier", pii: false },
      { name: "date", datatype: "DATE", description: "Reporting date", pii: false },
      { name: "total_beds", datatype: "INT", description: "Total available beds", pii: false },
      { name: "occupied_beds", datatype: "INT", description: "Beds occupied at end of day", pii: false },
      { name: "occupancy_rate_pct", datatype: "FLOAT", description: "Occupancy rate (%)", pii: false },
      { name: "icu_beds", datatype: "INT", description: "Number of ICU beds", pii: false },
      { name: "icu_occupancy_pct", datatype: "FLOAT", description: "ICU occupancy rate (%)", pii: false },
      { name: "emergency_admissions", datatype: "INT", description: "Emergency admissions during day", pii: false },
      { name: "elective_admissions", datatype: "INT", description: "Elective admissions during day", pii: false },
    ],

    qualityReport: [
      { column: "occupancy_rate_pct", nullPct: 0, dupPct: 0, outlierPct: 0.5, formatViolationsPct: 0, suggestedFix: "Clamp to 0–100%" },
      { column: "icu_occupancy_pct", nullPct: 0, dupPct: 0, outlierPct: 1.0, formatViolationsPct: 0, suggestedFix: "Reconcile with ICU logs" },
    ],

    pipelineRuns: [
      { runId: "OPS-20251101-01", started: "2025-11-01 06:00", durationMin: 20, status: "success" as const },
      { runId: "OPS-20251102-02", started: "2025-11-02 06:15", durationMin: 22, status: "fixed_by_agent" as const, issue: "Missing ICU telemetry", fix: "Interpolated via bed tracker" },
    ],
  },

  /* --------------------------- Healthcare - PatientExperience: satisfaction_survey --------------------------- */
  "Healthcare-PatientExperience-satisfaction_survey": {
    ...baseDatasetDetail,
    domain: "Healthcare",
    schema: "PatientExperience",
    dataset: "satisfaction_survey",
    description:
      "Post-discharge survey capturing patient satisfaction, NPS, and free-text comments by department. Used for CX improvement initiatives.",
    tags: ["survey", "nps", "feedback"],
    owners: ["cx@healthcare.com", "quality@healthcare.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((85 + Math.cos(i / 3) * 2).toFixed(2))
    ),
    domainTags: ["Healthcare", "CX"],
    functionalTags: ["Patient Experience", "Quality of Care"],

    columnTags: {
      survey_id: ["Primary Key"],
      patient_id: ["Foreign Key"],
      department: ["Categorical"],
      nps_score: ["Metric", "0–10"],
      satisfaction_score: ["Metric", "0–100"],
      comment_text: ["Free Text"],
      sentiment_score: ["Derived", "Sentiment"],
      created_at: ["Timestamp"],
    },

    columns: [
      { name: "survey_id", datatype: "STRING", description: "Unique survey response ID", pii: false },
      { name: "patient_id", datatype: "STRING", description: "Linked patient ID", pii: true },
      { name: "department", datatype: "STRING", description: "Department for which feedback was given", pii: false },
      { name: "nps_score", datatype: "INT", description: "Net Promoter Score (0–10)", pii: false },
      { name: "satisfaction_score", datatype: "FLOAT", description: "Satisfaction percentage (0–100)", pii: false },
      { name: "comment_text", datatype: "STRING", description: "Free-text feedback", pii: true },
      { name: "sentiment_score", datatype: "FLOAT", description: "AI-predicted sentiment score (-1 to +1)", pii: false },
      { name: "created_at", datatype: "TIMESTAMP", description: "Survey completion timestamp", pii: false },
    ],

    qualityReport: [
      { column: "nps_score", nullPct: 0.2, dupPct: 0, outlierPct: 0.3, formatViolationsPct: 0, suggestedFix: "Clip to 0–10" },
      { column: "sentiment_score", nullPct: 0, dupPct: 0, outlierPct: 0.8, formatViolationsPct: 0, suggestedFix: "Re-score using updated NLP model" },
    ],

    pipelineRuns: [
      { runId: "PX-20251101-01", started: "2025-11-01 11:00", durationMin: 20, status: "success" as const },
      { runId: "PX-20251104-02", started: "2025-11-04 11:10", durationMin: 24, status: "fixed_by_agent" as const, issue: "Sentiment model drift", fix: "Reprocessed survey feedback" },
    ],
  },

    /* --------------------------- BFSI - Accounts: customer_accounts --------------------------- */
  "BFSI-Accounts-customer_accounts": {
    ...baseDatasetDetail,
    domain: "BFSI",
    schema: "Accounts",
    dataset: "customer_accounts",
    description:
      "Customer bank account master data including KYC info, account type, balances, and consent flags. Used for CRM and compliance analytics.",
    tags: ["accounts", "kyc", "customers"],
    owners: ["crm@bank.com", "compliance@bank.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((88 + Math.sin(i / 3) * 2).toFixed(2))
    ),
    domainTags: ["Banking", "Customer Data"],
    functionalTags: ["Core Banking", "Customer Analytics"],

    columnTags: {
      account_id: ["Primary Key", "Identifier"],
      customer_id: ["Foreign Key", "Identifier"],
      account_type: ["Categorical", "Savings/Current/Loan"],
      balance_usd: ["Metric", "Monetary"],
      kyc_verified: ["Boolean", "Compliance"],
      consent_marketing: ["Boolean", "Privacy"],
      region: ["Geography"],
      opened_date: ["Date"],
      last_transaction_date: ["Date"],
    },

    columnIssues: {
      balance_usd: ["Occasional negative values due to overdrafts"],
      kyc_verified: ["Missing flags in legacy accounts (0.8%)"],
    },

    columns: [
      { name: "account_id", datatype: "STRING", description: "Unique internal account ID", pii: false },
      { name: "customer_id", datatype: "STRING", description: "Linked customer identifier", pii: true },
      { name: "account_type", datatype: "STRING", description: "Account category (Savings, Current, Loan)", pii: false },
      { name: "balance_usd", datatype: "FLOAT", description: "Current account balance in USD", pii: false },
      { name: "kyc_verified", datatype: "BOOLEAN", description: "Whether account KYC is verified", pii: false },
      { name: "consent_marketing", datatype: "BOOLEAN", description: "Customer marketing consent flag", pii: false },
      { name: "region", datatype: "STRING", description: "Customer’s region or branch zone", pii: false },
      { name: "opened_date", datatype: "DATE", description: "Account creation date", pii: false },
      { name: "last_transaction_date", datatype: "DATE", description: "Date of most recent transaction", pii: false },
    ],

    qualityReport: [
      { column: "account_id", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Validate unique account IDs" },
      { column: "balance_usd", nullPct: 0, dupPct: 0, outlierPct: 0.5, formatViolationsPct: 0, suggestedFix: "Tag overdraft transactions separately" },
      { column: "kyc_verified", nullPct: 0.8, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Enforce KYC backfill in legacy accounts" },
    ],

    pipelineRuns: [
      { runId: "ACC-20251101-01", started: "2025-11-01 06:00", durationMin: 15, status: "success" as const },
      { runId: "ACC-20251103-02", started: "2025-11-03 06:15", durationMin: 20, status: "fixed_by_agent" as const, issue: "Missing KYC flags", fix: "Populated from customer_kyc feed" },
    ],
  },

  /* --------------------------- BFSI - Loans: loan_portfolio --------------------------- */
  "BFSI-Loans-loan_portfolio": {
    ...baseDatasetDetail,
    domain: "BFSI",
    schema: "Loans",
    dataset: "loan_portfolio",
    description:
      "Active and closed loan accounts with loan type, disbursed amount, interest rate, tenure, and NPA flag. Used for portfolio monitoring and credit risk modeling.",
    tags: ["loans", "portfolio", "npa"],
    owners: ["risk@bank.com", "finance@bank.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((86 + Math.cos(i / 4) * 2).toFixed(2))
    ),
    domainTags: ["Banking", "Credit"],
    functionalTags: ["Lending", "Portfolio Analytics"],

    columnTags: {
      loan_id: ["Primary Key"],
      customer_id: ["Foreign Key"],
      loan_type: ["Categorical", "Home/Auto/Personal"],
      disbursed_amount: ["Metric", "Currency"],
      interest_rate_pct: ["Metric", "Percentage"],
      tenure_months: ["Metric", "Duration"],
      emi_amount: ["Metric", "Currency"],
      npa_flag: ["Boolean", "Risk Indicator"],
      disbursed_date: ["Date"],
    },

    columns: [
      { name: "loan_id", datatype: "STRING", description: "Unique loan identifier", pii: false },
      { name: "customer_id", datatype: "STRING", description: "Linked customer identifier", pii: true },
      { name: "loan_type", datatype: "STRING", description: "Loan category (Home, Auto, Personal, etc.)", pii: false },
      { name: "disbursed_amount", datatype: "FLOAT", description: "Loan amount disbursed", pii: false },
      { name: "interest_rate_pct", datatype: "FLOAT", description: "Nominal annual interest rate", pii: false },
      { name: "tenure_months", datatype: "INT", description: "Loan tenure in months", pii: false },
      { name: "emi_amount", datatype: "FLOAT", description: "Monthly EMI amount", pii: false },
      { name: "npa_flag", datatype: "BOOLEAN", description: "Non-performing asset indicator", pii: false },
      { name: "disbursed_date", datatype: "DATE", description: "Date of disbursement", pii: false },
    ],

    qualityReport: [
      { column: "interest_rate_pct", nullPct: 0, dupPct: 0, outlierPct: 0.8, formatViolationsPct: 0, suggestedFix: "Cap interest rates at product policy limits" },
      { column: "npa_flag", nullPct: 0, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Cross-check with collection system" },
    ],

    pipelineRuns: [
      { runId: "LOAN-20251101-01", started: "2025-11-01 07:00", durationMin: 20, status: "success" as const },
      { runId: "LOAN-20251105-02", started: "2025-11-05 07:20", durationMin: 22, status: "fixed_by_agent" as const, issue: "High outliers in interest rate", fix: "Applied capping rule (<=24%)" },
    ],
  },

  /* --------------------------- BFSI - Transactions: payment_transactions --------------------------- */
  "BFSI-Transactions-payment_transactions": {
    ...baseDatasetDetail,
    domain: "BFSI",
    schema: "Transactions",
    dataset: "payment_transactions",
    description:
      "Transactional payment dataset capturing card, UPI, and online transfers with timestamps, merchant details, and failure flags.",
    tags: ["payments", "transactions", "upi"],
    owners: ["payments@bank.com", "fraud@bank.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((84 + Math.sin(i / 2) * 3).toFixed(2))
    ),
    domainTags: ["Banking", "Payments"],
    functionalTags: ["Digital Banking", "Fraud Analytics"],

    columnTags: {
      txn_id: ["Primary Key"],
      account_id: ["Foreign Key"],
      txn_type: ["Enum", "Debit/Credit"],
      channel: ["Categorical", "UPI/Card/NEFT"],
      amount_usd: ["Metric", "Currency"],
      merchant_category: ["Categorical"],
      txn_status: ["Enum", "Success/Failed/Pending"],
      failure_reason: ["Text", "Error Code"],
      timestamp: ["Timestamp"],
    },

    columns: [
      { name: "txn_id", datatype: "STRING", description: "Unique transaction identifier", pii: false },
      { name: "account_id", datatype: "STRING", description: "Linked account ID", pii: true },
      { name: "txn_type", datatype: "STRING", description: "Transaction type (Debit/Credit)", pii: false },
      { name: "channel", datatype: "STRING", description: "Payment channel (UPI, Card, NEFT, RTGS)", pii: false },
      { name: "amount_usd", datatype: "FLOAT", description: "Transaction amount in USD", pii: false },
      { name: "merchant_category", datatype: "STRING", description: "Merchant category (MCC code)", pii: false },
      { name: "txn_status", datatype: "STRING", description: "Transaction outcome", pii: false },
      { name: "failure_reason", datatype: "STRING", description: "If failed, error reason", pii: false },
      { name: "timestamp", datatype: "TIMESTAMP", description: "Transaction timestamp", pii: false },
    ],

    qualityReport: [
      { column: "txn_status", nullPct: 0, dupPct: 0, outlierPct: 0.3, formatViolationsPct: 0, suggestedFix: "Normalize statuses to Success/Failed/Pending" },
      { column: "failure_reason", nullPct: 4.2, dupPct: 0, outlierPct: 0, formatViolationsPct: 0, suggestedFix: "Map error codes to standard failure taxonomy" },
    ],

    pipelineRuns: [
      { runId: "PAY-20251101-01", started: "2025-11-01 05:30", durationMin: 15, status: "success" as const },
      { runId: "PAY-20251103-02", started: "2025-11-03 05:45", durationMin: 20, status: "fixed_by_agent" as const, issue: "Failure code mismap", fix: "Standardized codes via lookup table" },
    ],
  },

  /* --------------------------- BFSI - Risk & Compliance: aml_alerts --------------------------- */
  "BFSI-RiskCompliance-aml_alerts": {
    ...baseDatasetDetail,
    domain: "BFSI",
    schema: "RiskCompliance",
    dataset: "aml_alerts",
    description:
      "Anti-money laundering (AML) alerts dataset with transaction IDs, customer risk score, alert type, and resolution status.",
    tags: ["aml", "fraud", "compliance"],
    owners: ["compliance@bank.com", "risk@bank.com"],
    trustScoreTrend30d: Array.from({ length: 30 }, (_, i) =>
      Number((83 + Math.cos(i / 3) * 2).toFixed(2))
    ),
    domainTags: ["Banking", "Risk"],
    functionalTags: ["AML", "Compliance", "Fraud Detection"],

    columnTags: {
      alert_id: ["Primary Key"],
      customer_id: ["Foreign Key"],
      txn_id: ["Foreign Key"],
      alert_type: ["Categorical", "Structuring/High Value/Blacklist"],
      risk_score: ["Metric", "0–100"],
      alert_status: ["Enum", "Open/Closed/Under Review"],
      investigator_id: ["Internal ID"],
      resolution_date: ["Date"],
    },

    columns: [
      { name: "alert_id", datatype: "STRING", description: "Unique AML alert identifier", pii: false },
      { name: "customer_id", datatype: "STRING", description: "Linked customer identifier", pii: true },
      { name: "txn_id", datatype: "STRING", description: "Linked transaction ID", pii: false },
      { name: "alert_type", datatype: "STRING", description: "Type of AML alert triggered", pii: false },
      { name: "risk_score", datatype: "FLOAT", description: "Computed AML risk score", pii: false },
      { name: "alert_status", datatype: "STRING", description: "Current alert workflow status", pii: false },
      { name: "investigator_id", datatype: "STRING", description: "Assigned investigator ID", pii: false },
      { name: "resolution_date", datatype: "DATE", description: "Date alert was resolved", pii: false },
    ],

    qualityReport: [
      { column: "alert_status", nullPct: 0, dupPct: 0, outlierPct: 0.5, formatViolationsPct: 0, suggestedFix: "Restrict to enum (Open/Closed/Under Review)" },
      { column: "risk_score", nullPct: 0, dupPct: 0, outlierPct: 0.4, formatViolationsPct: 0, suggestedFix: "Clip scores 0–100" },
    ],

    pipelineRuns: [
      { runId: "AML-20251101-01", started: "2025-11-01 02:30", durationMin: 25, status: "success" as const },
      { runId: "AML-20251105-02", started: "2025-11-05 03:00", durationMin: 28, status: "fixed_by_agent" as const, issue: "Enum mismatch", fix: "Mapped 'In Progress' → 'Under Review'" },
    ],
  },




};

/* -------------------------------------------------------------------------- */
/*                                 SEED DATA                                   */
/* -------------------------------------------------------------------------- */
export const SEED_DATA: AppData = {
  domains: [
   {
  name: "Travel",
  schemas: [
    {
      name: "Pricing",
      trustScore: 84,
      datasets: [
        { name: "daily_fares", status: "healthy", rows: 125430, owner: "revops@datacorp.com" },
        { name: "competitor_prices", status: "at_risk", rows: 88116, owner: "revops@datacorp.com" },
      ],
    },
    {
      name: "Operations",
      trustScore: 86,
      datasets: [
        { name: "flight_load_summary", status: "healthy", rows: 24120, owner: "ops@datacorp.com" },
      ],
    },
    {
      name: "Bookings",
      trustScore: 87,
      datasets: [
        { name: "booking_transactions", status: "healthy", rows: 518420, owner: "finance@datacorp.com" },
      ],
    },
    {
      name: "CustomerExperience",
      trustScore: 83,
      datasets: [
        { name: "nps_survey_responses", status: "at_risk", rows: 18560, owner: "cx@datacorp.com" },
      ],
    },
  ],
  kpis: { reliability: 91, governance: 88, dataCoverage: 90, modelUptime: 98.2, incidentsLast7d: 2 },
},

    {
      name: "Telco",
      schemas: [
        {
          name: "Customers",
          trustScore: 88,
          datasets: [
            { name: "customer_master", status: "healthy", rows: 1_250_000, owner: "crm@telco.com" },
            { name: "churn_history", status: "at_risk", rows: 11840, owner: "analytics@telco.com" },
          ],
        },
        {
          name: "Network",
          trustScore: 82,
          datasets: [
            { name: "tower_performance", status: "healthy", rows: 756000, owner: "infra@telco.com" },
            { name: "service_outages", status: "degraded", rows: 1840, owner: "network.ops@telco.com" },
          ],
        },
        {
          name: "Billing",
          trustScore: 86,
          datasets: [
            { name: "billing_summary", status: "healthy", rows: 61200, owner: "finance@telco.com" },
            { name: "credit_risk_profiles", status: "at_risk", rows: 21200, owner: "risk@telco.com" },
          ],
        },
      ],
      kpis: {
        reliability: 92,
        governance: 89,
        dataCoverage: 90,
        modelUptime: 97.8,
        incidentsLast7d: 4,
      },
    },

    {
  name: "Hospitality",
  schemas: [
    {
      name: "Operations",
      trustScore: 85,
      datasets: [
        { name: "hotel_performance", status: "healthy", rows: 15420, owner: "ops@hospitality.com" },
      ],
    },
    {
      name: "Bookings",
      trustScore: 86,
      datasets: [
        { name: "reservations", status: "healthy", rows: 44210, owner: "pms@hospitality.com" },
      ],
    },
    {
      name: "Finance",
      trustScore: 88,
      datasets: [
        { name: "revenue_summary", status: "healthy", rows: 13800, owner: "finance@hospitality.com" },
      ],
    },
    {
      name: "CustomerExperience",
      trustScore: 84,
      datasets: [
        { name: "guest_feedback", status: "at_risk", rows: 17800, owner: "cx@hospitality.com" },
      ],
    },
  ],
  kpis: { reliability: 90, governance: 89, dataCoverage: 88, modelUptime: 97.9, incidentsLast7d: 3 },
},
    {
  name: "Healthcare",
  schemas: [
    {
      name: "Clinical",
      trustScore: 87,
      datasets: [
        { name: "patient_records", status: "healthy", rows: 225000, owner: "clinicalops@healthcare.com" },
      ],
    },
    {
      name: "Claims",
      trustScore: 85,
      datasets: [
        { name: "insurance_claims", status: "at_risk", rows: 43210, owner: "claims@healthcare.com" },
      ],
    },
    {
      name: "Operations",
      trustScore: 84,
      datasets: [
        { name: "bed_occupancy", status: "healthy", rows: 31200, owner: "ops@healthcare.com" },
      ],
    },
    {
      name: "PatientExperience",
      trustScore: 86,
      datasets: [
        { name: "satisfaction_survey", status: "at_risk", rows: 17800, owner: "cx@healthcare.com" },
      ],
    },
  ],
  kpis: { reliability: 89, governance: 88, dataCoverage: 87, modelUptime: 97.5, incidentsLast7d: 5 },
},

{
  name: "BFSI",
  schemas: [
    {
      name: "Accounts",
      trustScore: 88,
      datasets: [
        { name: "customer_accounts", status: "healthy", rows: 245000, owner: "crm@bank.com" },
      ],
    },
    {
      name: "Loans",
      trustScore: 86,
      datasets: [
        { name: "loan_portfolio", status: "healthy", rows: 78500, owner: "risk@bank.com" },
      ],
    },
    {
      name: "Transactions",
      trustScore: 85,
      datasets: [
        { name: "payment_transactions", status: "at_risk", rows: 520000, owner: "payments@bank.com" },
      ],
    },
    {
      name: "RiskCompliance",
      trustScore: 83,
      datasets: [
        { name: "aml_alerts", status: "healthy", rows: 11800, owner: "compliance@bank.com" },
      ],
    },
  ],
  kpis: { reliability: 90, governance: 89, dataCoverage: 88, modelUptime: 97.1, incidentsLast7d: 6 },
},


    
  ],

  baseDatasetDetail,
  datasetDetails,

  explainability: {
    pageContext: {
      domain: "Telco",
      schema: "Customers",
      dataset: "churn_history",
      model: "TrueChurnNetV3",
      version: "v3.0",
      trainedOn: "2025-11-18",
    },
    insight: { text: "High churn probability observed in low-ARPU prepaid users.", confidence: "High" },
    keyDrivers: [{ name: "Dropped Calls", impactPct: -22.0 }],
    waterfall: [{ feature: "Dropped Calls", shap: -0.22 }],
    rca: [{ driver: "Dropped Calls", bullets: ["Tier-2 cities show 4.8% drop rate", "High correlation with recent outage windows"] }],
    lineage: {
      sources: ["CDR Logs", "CRM", "Network KPIs"],
      transforms: ["Aggregate", "Cleanse", "Join (customer_id)"],
      model: { name: "TrueChurnNetV3", type: "XGBoost", version: "v3.0" },
      decision: "Prioritize targeted network patches and retention campaigns for Tier-2 prepaid cohorts",
    },
    whatIf: { scenarios: [], finalRecommendation: "Reduce dropped calls by 10% and run targeted retention offers" },
  },
};
