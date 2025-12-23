import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  Database,
  Activity,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Settings,
  Info,
  TrendingUp,
  Table as TableIcon,
  Code,
  History,
  FileText,
  Columns,
  Clock
} from "lucide-react";
import { useNewDataStore } from "@/store/useNewDataStore";
import { DatasetDetail } from "@/types";

// --- Mock Data Definitions ---

const MOCK_DATASETS: Record<string, any> = {
  "patient_records": {
    name: "patient_records",
    description: "Comprehensive electronic health records (EHR) containing patient demographics, medical history, vital signs, and admission details. This dataset is the master source for patient identity and clinical history tracking across the hospital network.",
    s3Path: "s3://clinical-data-lake/secure/ehr/patient_records_v2",
    trustScore: 98,
    columnCount: 45,
    dataVolume: "12.5 GB",
    anomalies: 0,
    domain: "Clinical",
    platform: "Snowflake",
    pipelineHealth: "healthy",
    freshnessStatus: "healthy",
    pipelineRuns: [
      { id: "run_9001", status: "success", duration: "15m 20s", triggeredBy: "Schedule (Hourly)", time: "30 mins ago" },
      { id: "run_9000", status: "success", duration: "14m 50s", triggeredBy: "Schedule (Hourly)", time: "1 hour ago" },
    ],
    lineage: {
      upstream: [
        { name: "MediTech_EHR_Source", type: "SQL Server", icon: Database, color: "text-blue-500" },
        { name: "HL7_Admission_Feed", type: "Kafka Stream", icon: Activity, color: "text-orange-500" }
      ],
      downstream: [
        { name: "Clinical_Risk_Model", type: "Databricks ML", icon: Code, color: "text-green-500" },
        { name: "Patient_360_Dashboard", type: "Tableau", icon: TrendingUp, color: "text-purple-500" }
      ]
    },
    catalog: {
      owner: "Dr. Sarah Chen (CMIO)",
      steward: "Clinical Informatics Team",
      retention: "Indefinite (HIPAA)",
      classification: "Restricted (PHI)",
      domainTags: ["Clinical", "EHR", "Patient_Identity"],
      techTags: ["Snowflake", "Structured", "P1_Critical"],
      compliance: ["HIPAA", "GDPR", "HITECH"]
    },
    columns: [
      { name: "patient_id", type: "VARCHAR(20)", desc: "Unique MRN (Medical Record Number)", check: "Unique (100%)" },
      { name: "full_name", type: "VARCHAR(100)", desc: "Patient legal name", check: "No Nulls" },
      { name: "dob", type: "DATE", desc: "Date of birth", check: "Format Valid" },
      { name: "gender", type: "CHAR(1)", desc: "Biological sex (M/F/O)", check: "Enum Valid" },
      { name: "primary_diagnosis_code", type: "VARCHAR(10)", desc: "ICD-10 code", check: "Ref Valid" }
    ],
    codeGen: {
      python: `# Load patient records from Snowflake
df = session.table("clinical.patient_records")

# Analyze patient age distribution
from snowflake.snowpark.functions import datediff, current_date, col

df = df.withColumn("age", datediff("year", col("dob"), current_date()))
age_dist = df.group_by("age").count().sort("age")
age_dist.show()`,
      sql: `-- Count patients by primary diagnosis
SELECT 
  primary_diagnosis_code, 
  COUNT(patient_id) as patient_count
FROM 
  clinical.patient_records
GROUP BY 
  primary_diagnosis_code
ORDER BY 
  patient_count DESC;`
    },
    anomaliesList: [], // No anomalies
    activityLog: [
      { action: "Schema Locked", user: "System", time: "2 days ago", details: "Schema frozen for Q4 audit" },
      { action: "PII Scan Completed", user: "Security Bot", time: "1 week ago", details: "Confirmed encryption on 'full_name' and 'dob'" }
    ]
  },
  "insurance_claims": {
    name: "insurance_claims",
    description: "Aggregated insurance claims data including submission dates, status, payout amounts, and denial codes. Used for revenue cycle management and fraud detection analysis.",
    s3Path: "s3://finance-lake/claims/processed/fy2024",
    trustScore: 85,
    columnCount: 28,
    dataVolume: "4.2 GB",
    anomalies: 2,
    domain: "Claims",
    platform: "Databricks",
    pipelineHealth: "at_risk",
    freshnessStatus: "healthy",
    pipelineRuns: [
      { id: "run_7102", status: "failed", duration: "8m 10s", triggeredBy: "Schedule (Daily)", time: "4 hours ago", error: "Duplicate keys detected" },
      { id: "run_7101", status: "success", duration: "12m 30s", triggeredBy: "Manual Retry", time: "1 day ago" },
    ],
    lineage: {
      upstream: [
        { name: "Clearinghouse_File_Drop", type: "SFTP / CSV", icon: FileText, color: "text-blue-500" }
      ],
      downstream: [
        { name: "Revenue_Cycle_Report", type: "PowerBI", icon: TrendingUp, color: "text-purple-500" },
        { name: "Fraud_Detection_Job", type: "Python Script", icon: Activity, color: "text-red-500" }
      ]
    },
    catalog: {
      owner: "Finance Ops",
      steward: "Data Governance",
      retention: "7 Years",
      classification: "Confidential",
      domainTags: ["Finance", "Claims", "Revenue"],
      techTags: ["Delta Lake", "Batch", "Bronze"],
      compliance: ["SOX", "Internal"]
    },
    columns: [
      { name: "claim_id", type: "BIGINT", desc: "Unique claim identifier", check: "Unique (98%) - Duplicates Found" },
      { name: "submission_date", type: "TIMESTAMP", desc: "Date claim was submitted", check: "Format Valid" },
      { name: "payout_amount", type: "DECIMAL(10,2)", desc: "Approved amount", check: "Range Valid" },
      { name: "denial_code", type: "VARCHAR(5)", desc: "Reason for denial if applicable", check: "Nulls Allowed" }
    ],
    codeGen: {
      python: `# Identify high-value denied claims
df = spark.read.table("finance.insurance_claims")

denied_high_value = df.filter(
    (df.status == 'DENIED') & (df.payout_amount > 10000)
)
display(denied_high_value)`,
      sql: `-- Calculate denial rate by payer
SELECT 
  payer_name,
  CAST(SUM(CASE WHEN status = 'DENIED' THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) as denial_rate
FROM 
  finance.insurance_claims
GROUP BY 
  payer_name;`
    },
    anomaliesList: [
      { title: "Duplicate Claim IDs", desc: "Found 45 duplicate claim_id values in the latest batch load.", severity: "High", time: "4 hours ago" },
      { title: "Null Payer Fields", desc: "Unexpected nulls in 'payer_name' for 5% of records.", severity: "Medium", time: "1 day ago" }
    ],
    activityLog: [
      { action: "Pipeline Failed", user: "System", time: "4 hours ago", details: "Job 'Claims_Daily_Load' failed due to quality check" },
      { action: "Metadata Update", user: "J. Doe", time: "2 days ago", details: "Updated description for 'denial_code'" }
    ]
  },
  "bed_occupancy": {
    name: "bed_occupancy",
    description: "Real-time snapshot of hospital bed availability, occupancy rates, and turnover times. Critical for optimizing patient flow and emergency room admissions.",
    s3Path: "s3://ops-lake/realtime/beds",
    trustScore: 92,
    columnCount: 15,
    dataVolume: "850 MB",
    anomalies: 0,
    domain: "Operations",
    platform: "PostgreSQL",
    pipelineHealth: "healthy",
    freshnessStatus: "healthy",
    pipelineRuns: [
      { id: "run_rt_550", status: "success", duration: "45s", triggeredBy: "Stream (CDC)", time: "1 min ago" },
      { id: "run_rt_549", status: "success", duration: "42s", triggeredBy: "Stream (CDC)", time: "6 mins ago" },
    ],
    lineage: {
      upstream: [
        { name: "ADT_System_Log", type: "Oracle DB", icon: Database, color: "text-red-600" }
      ],
      downstream: [
        { name: "Charge_Nurse_Dashboard", type: "Custom App", icon: Activity, color: "text-blue-500" },
        { name: "Capacity_Alert_Bot", type: "Webhook", icon: Settings, color: "text-slate-500" }
      ]
    },
    catalog: {
      owner: "Hospital Operations",
      steward: "Nursing Admin",
      retention: "1 Year",
      classification: "Internal",
      domainTags: ["Operations", "Capacity", "Real-time"],
      techTags: ["CDC", "Postgres", "High_Frequency"],
      compliance: ["Internal-SLA"]
    },
    columns: [
      { name: "bed_id", type: "VARCHAR(10)", desc: "Physical bed location identifier", check: "Unique (100%)" },
      { name: "ward_unit", type: "VARCHAR(50)", desc: "Department/Ward name", check: "Enum Valid" },
      { name: "status", type: "VARCHAR(20)", desc: "Occupied/Available/Cleaning", check: "No Nulls" },
      { name: "last_updated", type: "TIMESTAMP", desc: "Time of last status change", check: "Freshness < 5m" }
    ],
    codeGen: {
      python: `# Check current capacity by ward
import pandas as pd
df = pd.read_sql("SELECT * FROM beds", con=db_connection)

capacity = df.groupby(['ward_unit', 'status']).size().unstack(fill_value=0)
capacity['utilization'] = capacity['Occupied'] / (capacity['Occupied'] + capacity['Available'])
print(capacity)`,
      sql: `-- Find wards with < 10% availability
SELECT 
  ward_unit,
  COUNT(CASE WHEN status = 'Available' THEN 1 END) as available_beds
FROM 
  bed_occupancy
GROUP BY 
  ward_unit
HAVING 
  available_beds < 3;`
    },
    anomaliesList: [],
    activityLog: [
      { action: "SLA Warning", user: "Monitor", time: "yesterday", details: "Data latency exceeded 2 minutes" }
    ]
  },
  "satisfaction_survey": {
    name: "satisfaction_survey",
    description: "Post-discharge patient satisfaction survey results, including NPS scores, qualitative feedback comments, and category ratings. Used for improving patient experience and quality of care.",
    s3Path: "s3://qual-data/surveys/patient_experience",
    trustScore: 78,
    columnCount: 32,
    dataVolume: "1.8 GB",
    anomalies: 1,
    domain: "PatientExperience",
    platform: "Qualtrics",
    pipelineHealth: "healthy",
    freshnessStatus: "at_risk",
    pipelineRuns: [
      { id: "run_sx_22", status: "success", duration: "5m 00s", triggeredBy: "Schedule (Weekly)", time: "6 days ago" },
    ],
    lineage: {
      upstream: [
        { name: "Email_Survey_Tool", type: "API", icon: Settings, color: "text-purple-500" }
      ],
      downstream: [
        { name: "CX_Leadership_Deck", type: "PPT Gen", icon: FileText, color: "text-orange-500" },
        { name: "NLP_Sentiment_Engine", type: "Python", icon: Code, color: "text-blue-500" }
      ]
    },
    catalog: {
      owner: "Chief Experience Officer",
      steward: "Marketing Analyst",
      retention: "3 Years",
      classification: "Confidential",
      domainTags: ["CX", "Survey", "Qualitative"],
      techTags: ["JSON", "Unstructured", "Weekly"],
      compliance: ["GDPR"]
    },
    columns: [
      { name: "response_id", type: "UUID", desc: "Survey instance ID", check: "Unique (100%)" },
      { name: "nps_score", type: "INTEGER", desc: "Net Promoter Score (0-10)", check: "Range 0-10" },
      { name: "comments", type: "TEXT", desc: "Free text feedback", check: "Nulls Allowed" },
      { name: "sentiment_label", type: "VARCHAR(20)", desc: "Derived sentiment (Positive/Negative)", check: "Computed" }
    ],
    codeGen: {
      python: `# Analyze sentiment distribution
df = spark.read.json("s3://surveys/satisfaction")

from pyspark.sql.functions import avg
avg_nps = df.select(avg("nps_score")).collect()[0][0]
print(f"Average NPS: {avg_nps}")`,
      sql: `-- Get negative feedback for immediate review
SELECT 
  response_id, 
  nps_score, 
  comments 
FROM 
  patient_experience.satisfaction_survey
WHERE 
  nps_score <= 6 
  AND comments IS NOT NULL;`
    },
    anomaliesList: [
      { title: "Missing Data Load", desc: "Weekly load for this week has not arrived yet.", severity: "Low", time: "1 day ago" }
    ],
    activityLog: [
      { action: "Comment Added", user: "Analyst", time: "2 days ago", details: "Annotated response #9921 for review" }
    ]
  },
  // Fallback default
  "default": {
    name: "operations",
    description: "The provided data represents a table with 9 rows, each containing information about a specific operation. The columns include: - id: A unique identifier for each operation. - created_by: The user who created the operation. - updated_by: The user who last updated the operation. - updated_date: The date and time when the operation was last updated. - creation_date: The date and time when the operation was created. - operation_name: The name of the operation. - operation_display_name: A display name for the operation. - status: The status of the operation, which is currently 'Y' for all operations. The data includes operations such as CREATE, EDIT, DELETE, VIEW, goToStore, UploadFile, FileShare, STORAGE, and FILES, all of which were performed by the 'admin' user.",
    s3Path: "s3://dbstorage-prod-uh2be/uc/699f02bc-1c54-474f-ab8a...",
    trustScore: 94,
    columnCount: 9,
    dataVolume: "0.0038 MB",
    anomalies: 1,
    domain: "Finance",
    platform: "Databricks",
    pipelineHealth: "healthy",
    freshnessStatus: "healthy",
    pipelineRuns: [
      { id: "run_832910", status: "success", duration: "4m 12s", triggeredBy: "Schedule (Daily)", time: "2 hours ago" },
      { id: "run_832909", status: "success", duration: "3m 45s", triggeredBy: "Manual Trigger (Admin)", time: "1 day ago" },
    ],
    lineage: {
      upstream: [
        { name: "raw_payments_data", type: "S3 Bucket", icon: Database, color: "text-blue-500" },
        { name: "Standardization_Job", type: "Databricks Job", icon: Settings, color: "text-orange-500" }
      ],
      downstream: [
        { name: "Executive_Dashboard_View", type: "Tableau", icon: TrendingUp, color: "text-purple-500" },
        { name: "ML_Forecasting_Model", type: "Python", icon: Code, color: "text-green-500" }
      ]
    },
    catalog: {
      owner: "Admin User",
      steward: "Data Engineering Team",
      retention: "7 Years (Financial)",
      classification: "Confidential",
      domainTags: ["Finance", "Operations", "Q4_Reporting"],
      techTags: ["Parquet", "Partitioned", "Delta"],
      compliance: ["GDPR", "SOX"]
    },
    columns: [
      { name: "id", type: "STRING", desc: "Unique identifier for operation", check: "Unique (100%)" },
      { name: "amount", type: "DECIMAL", desc: "Transaction amount", check: "Range Valid" },
      { name: "operation_name", type: "STRING", desc: "System name of operation type", check: "Enum Valid" },
      { name: "status", type: "CHAR(1)", desc: "Current status flag (Y/N)", check: "No Nulls" },
    ],
    codeGen: {
      python: `# Load the dataset using Spark
df = spark.read.format("delta").load("s3://dbstorage-prod-uh2be/uc/operations")
display(df)`,
      sql: `SELECT * FROM finance.operations WHERE status = 'Y';`
    },
    anomaliesList: [
      { title: "Unusual Volume Spike", desc: "Row count increased by 450% compared to the 30-day moving average.", severity: "Medium", time: "2 hours ago" }
    ],
    activityLog: [
      { action: "Description Approved", user: "Vishal Khode", time: "Just now", details: "Approved AI-generated description" },
      { action: "Schema Update", user: "System", time: "Yesterday", details: "Added column 'region_code'" }
    ]
  }
};

export default function DatasetReport() {
  const params = useParams();
  const navigate = useNavigate();
  const { getDatasetDetail } = useNewDataStore();

  const domain = decodeURIComponent(params.domain ?? "");
  const schema = decodeURIComponent(params.schema ?? "");
  const datasetName = decodeURIComponent(params.dataset ?? "");

  // Resolve data based on dataset name
  const demoData = MOCK_DATASETS[datasetName] || MOCK_DATASETS["default"];
  // Override name if falling back to default structure but keep the intent generic if needed
  // If exact match found, it uses that. If not, uses default "operations".

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          className="pl-0 gap-2 hover:bg-transparent hover:text-primary"
          onClick={() => navigate("/datasets")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Datasets
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-1">{demoData.name}</h1>
            <p className="text-muted-foreground font-mono text-sm truncate max-w-2xl">
              {demoData.s3Path}
            </p>
          </div>
          <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30 gap-2">
            <Info className="h-4 w-4" /> Approve Description
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Trust Score</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{demoData.trustScore}</div>
            <p className="text-xs text-muted-foreground mt-1">out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Column Count</span>
              <Columns className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{demoData.columnCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Data Volume</span>
              <Database className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{demoData.dataVolume}</div>
          </CardContent>
        </Card>

        <Card className={demoData.anomalies > 0 ? "border-l-4 border-l-amber-400" : ""}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Anomalies</span>
              <AlertTriangle className={`h-4 w-4 ${demoData.anomalies > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
            </div>
            <div className="text-3xl font-bold">{demoData.anomalies}</div>
            <p className={`text-xs mt-1 ${demoData.anomalies > 0 ? "text-amber-600/80" : "text-muted-foreground"}`}>
              {demoData.anomalies > 0 ? "requires attention" : "no issues detected"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="border-b">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-6">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Overview
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="pipeline_runs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" /> Pipeline Runs
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="lineage"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" /> Lineage
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="dataset_catalog"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              <div className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" /> Dataset Catalog
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="column_catalog"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              <div className="flex items-center gap-2">
                <Columns className="h-4 w-4" /> Column Catalog
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="codegen"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" /> CodeGen
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="anomalies"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Anomalies & Drift
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" /> Activity Log
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 pt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Dataset Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {demoData.description}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Dataset Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="font-medium">{demoData.domain}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="font-medium">{demoData.platform}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Health Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Pipeline Health:</span>
                  <Badge variant="secondary" className={demoData.pipelineHealth === "healthy" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"}>
                    {demoData.pipelineHealth}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Freshness Status:</span>
                  <Badge variant="secondary" className={demoData.freshnessStatus === "healthy" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"}>
                    {demoData.freshnessStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline_runs" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Pipeline Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoData.pipelineRuns.map((run: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                    <div className="flex items-center gap-4">
                      {run.status === "success" ? (
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{run.id}</span>
                          <Badge variant={run.status === "success" ? "outline" : "destructive"} className="text-xs">
                            {run.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {run.triggeredBy} • {run.duration}
                        </div>
                        {run.error && <div className="text-xs text-red-500 mt-1">{run.error}</div>}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{run.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineage" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Lineage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-muted/10">
                  <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Upstream (Sources)</h3>
                  <div className="flex flex-col gap-3">
                    {demoData.lineage.upstream.map((node: any, i: number) => {
                      const Icon = node.icon;
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 bg-card border rounded-md">
                          <Icon className={`h-4 w-4 ${node.color}`} />
                          <div>
                            <div className="font-medium">{node.name}</div>
                            <div className="text-xs text-muted-foreground">{node.type}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="h-8 border-l-2 border-primary"></div>
                </div>

                <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
                  <div className="flex items-center justify-center gap-3">
                    <Database className="h-6 w-6 text-primary" />
                    <div className="text-lg font-bold">{demoData.name} (Current)</div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground mt-1">{demoData.domain} Domain</div>
                </div>

                <div className="flex justify-center">
                  <div className="h-8 border-l-2 border-dashed border-muted-foreground/30"></div>
                </div>

                <div className="p-6 border rounded-lg bg-muted/10">
                  <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Downstream (Consumers)</h3>
                  <div className="flex flex-col gap-3">
                    {demoData.lineage.downstream.map((node: any, i: number) => {
                      const Icon = node.icon;
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 bg-card border rounded-md">
                          <Icon className={`h-4 w-4 ${node.color}`} />
                          <div>
                            <div className="font-medium">{node.name}</div>
                            <div className="text-xs text-muted-foreground">{node.type}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dataset_catalog" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Catalog Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Owner</span>
                    <div className="font-medium flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                        {demoData.catalog.owner.charAt(0)}
                      </div>
                      {demoData.catalog.owner}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Steward</span>
                    <div className="font-medium flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white">
                        {demoData.catalog.steward.charAt(0)}
                      </div>
                      {demoData.catalog.steward}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Retention Policy</span>
                    <div className="font-medium">{demoData.catalog.retention}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Classification</span>
                    <Badge variant="outline" className="border-amber-500 text-amber-500">{demoData.catalog.classification}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags & Glossary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Domain Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {demoData.catalog.domainTags.map((tag: string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Technical Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {demoData.catalog.techTags.map((tag: string) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Compliance</h4>
                    <div className="flex flex-wrap gap-2">
                      {demoData.catalog.compliance.map((tag: string) => <Badge key={tag} variant="outline" className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">{tag}</Badge>)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="column_catalog" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Schema Definition</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns className="h-4 w-4" /> Download Schema
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left font-medium">Name</th>
                      <th className="p-3 text-left font-medium">Type</th>
                      <th className="p-3 text-left font-medium">Description</th>
                      <th className="p-3 text-left font-medium">Quality Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoData.columns.map((col: any, i: number) => (
                      <tr key={i} className="border-t hover:bg-muted/20">
                        <td className="p-3 font-medium font-mono text-sm">{col.name}</td>
                        <td className="p-3 text-muted-foreground">{col.type}</td>
                        <td className="p-3">{col.desc}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                            <span className="text-xs">{col.check}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="codegen" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">Py</div>
                  Python / PySpark
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto h-full">
                  {demoData.codeGen.python}
                </pre>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-slate-700 flex items-center justify-center text-white text-xs font-bold">SQL</div>
                  Standard SQL
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto h-full">
                  {demoData.codeGen.sql}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="pt-6">
          <Card className={demoData.anomalies > 0 ? "border-l-4 border-l-amber-500" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {demoData.anomalies > 0 ? <AlertTriangle className="h-5 w-5 text-amber-500" /> : <CheckCircle className="h-5 w-5 text-emerald-500" />}
                  {demoData.anomalies > 0 ? `${demoData.anomalies} Active Anomaly Detected` : "No Anomalies Detected"}
                </CardTitle>
                {demoData.anomalies > 0 && <Badge variant="outline" className="border-amber-500 text-amber-500 cursor-pointer hover:bg-amber-50">Ignore</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoData.anomaliesList.length > 0 ? (
                  demoData.anomaliesList.map((anomaly: any, i: number) => (
                    <div key={i} className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900/50">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">{anomaly.title}</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">{anomaly.desc}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Detected: {anomaly.time}</span>
                        <span>Severity: {anomaly.severity}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mb-2 text-emerald-500/20" />
                    <p>All quality checks passed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Schema Drift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32 flex-col gap-2 text-muted-foreground">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="text-sm">No schema drift detected in last 30 days</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Data Freshness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32 flex-col gap-2 text-muted-foreground">
                  <div className={demoData.freshnessStatus === "healthy" ? "h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center" : "h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"}>
                    {demoData.freshnessStatus === "healthy" ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Clock className="h-5 w-5 text-amber-500" />}
                  </div>
                  <span className="text-sm">
                    {demoData.freshnessStatus === "healthy" ? "Data is arriving on time" : "Data arrival delayed by 2h"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit & Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-muted ml-4 space-y-6 pb-2">
                {demoData.activityLog.map((log: any, i: number) => (
                  <div key={i} className="ml-6 relative">
                    <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border bg-background flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary/50"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-sm font-semibold">{log.action}</h4>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                    <p className="text-sm text-foreground/80 mt-1">
                      {log.details}
                    </p>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="font-medium">{log.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
