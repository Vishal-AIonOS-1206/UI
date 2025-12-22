import { useState, useMemo } from "react";
import {
  Brain,
  BarChart3,
  Activity,
  Target,
  GitBranch,
  Shield,
  Layers,
  Settings,
  Lightbulb,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
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
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useAppStore } from "@/store/useAppStore";

const COLORS = {
  positive: "#4ade80",
  negative: "#f87171",
  baseline: "#a5b4fc",
  simulated: "#6366f1",
};

// -----------------------------------------------------------------------------
// DUMMY SCENARIO DATA PER INDUSTRY (CLEAN + RELEVANT)
// -----------------------------------------------------------------------------
const explainabilityData = {
  telco: {
    model: "TrueChurnNetV3",
    decisionLabel: "Predicted Churn (%)",
    baselineValue: 21.5,
    scenarios: [
      {
        name: "Reduce Dropped Calls by 10%",
        insight:
          "Improving 4G/5G stability across metro and tier-2 regions can reduce churn probability by up to 6%.",
        keyDrivers: [
          { name: "Dropped Calls", shap: -0.42 },
          { name: "Network Latency", shap: -0.24 },
          { name: "Support Tickets", shap: -0.21 },
          { name: "Discount Offers", shap: +0.10 },
          { name: "Customer Tenure", shap: -0.05 },
        ],
        rca: [
          {
            driver: "Dropped Calls",
            bullets: [
              "Top 5 cities account for 68% of drop-call complaints.",
              "Prepaid customers show 1.8x higher churn correlation with drop spikes.",
            ],
          },
          {
            driver: "Network Latency",
            bullets: [
              "South region latency = 120ms vs 85ms national average.",
              "Evening congestion due to limited fiber backhaul capacity.",
            ],
          },
        ],
        lineage: {
          sources: ["CDR Logs", "CRM", "Network KPIs"],
          transforms: ["Cleanse", "Aggregate", "Join (user, plan, region)"],
          version: "v3.0",
          trainedOn: "2025-10-10",
        },
        governance: [
          { label: "Lineage", status: "Complete" },
          { label: "Bias Check", status: "Passed" },
          { label: "PII", status: "Safe" },
          { label: "Audit", status: "Compliant" },
        ],
        whatIfControls: [
          { name: "dropped_calls_delta", label: "Dropped Calls (%)", min: -30, max: 30, default: 0, weight: -0.25 },
          { name: "network_latency_delta", label: "Latency (%)", min: -50, max: 50, default: 0, weight: -0.18 },
          { name: "support_tickets_delta", label: "Support Tickets (%)", min: -40, max: 40, default: 0, weight: -0.15 },
          { name: "discount_rate", label: "Discount Rate (%)", min: 0, max: 20, default: 5, weight: +0.1 },
        ],
      },
      {
        name: "Improve NPS by +5 Points",
        insight:
          "Enhancing complaint resolution speed and transparency improves NPS, reducing churn by nearly 4%.",
        keyDrivers: [
          { name: "NPS", shap: +0.28 },
          { name: "Support Resolution Time", shap: -0.25 },
          { name: "Network Latency", shap: -0.15 },
          { name: "Billing Transparency", shap: +0.09 },
          { name: "Usage Volume", shap: +0.04 },
        ],
        rca: [
          {
            driver: "Support Resolution Time",
            bullets: [
              "Average resolution = 48h vs target 24h.",
              "80% of low-NPS users interacted ≥3 times before issue closure.",
            ],
          },
        ],
        lineage: {
          sources: ["Survey DB", "CRM", "Billing Logs"],
          transforms: ["Join", "Aggregate"],
          version: "v3.0",
          trainedOn: "2025-10-08",
        },
        governance: [
          { label: "Bias", status: "Passed" },
          { label: "Lineage", status: "Complete" },
          { label: "Explainability", status: "Complete" },
          { label: "PII", status: "Safe" },
        ],
        whatIfControls: [
          { name: "nps_delta", label: "NPS Change (points)", min: -10, max: 10, default: 0, weight: -0.20 },
          { name: "support_resolution_delta", label: "Resolution Time (%)", min: -50, max: 50, default: 0, weight: -0.15 },
        ],
      },
      {
        name: "Offer Credit Score-Based Discounts",
        insight:
          "Dynamic billing discounts for low-risk postpaid users improve retention by ~3% while maintaining ARPU.",
        keyDrivers: [
          { name: "Credit Risk Score", shap: -0.18 },
          { name: "Discount Offered", shap: +0.12 },
          { name: "ARPU", shap: +0.09 },
          { name: "Outstanding Balance", shap: -0.07 },
        ],
        rca: [
          {
            driver: "Credit Risk Score",
            bullets: ["65% of defaults originate from risk decile 8–10 users."],
          },
        ],
        lineage: {
          sources: ["Billing Summary", "Credit Risk Profiles", "CRM"],
          transforms: ["Join", "Aggregate"],
          version: "v2.2",
          trainedOn: "2025-09-12",
        },
        governance: [
          { label: "Bias", status: "Passed" },
          { label: "Fair Lending", status: "Passed" },
          { label: "PII", status: "Safe" },
          { label: "Regulation", status: "Ready" },
        ],
        whatIfControls: [
          { name: "discount_delta", label: "Discount (%)", min: 0, max: 20, default: 0, weight: +0.12 },
          { name: "arpu_delta", label: "ARPU (%)", min: -10, max: 10, default: 0, weight: +0.09 },
        ],
      },
    ],
  },

    travel: {
    model: "FareOptNetV2",
    decisionLabel: "Predicted Fare Accuracy (%)",
    baselineValue: 87.2,
    scenarios: [
      {
        name: "Optimize Fare Elasticity by 5%",
        insight:
          "Fine-tuning fare elasticity on high-demand metro routes can improve pricing accuracy by 3.8%.",
        keyDrivers: [
          { name: "Historical Demand", shap: +0.25 },
          { name: "Competitor Fare Index", shap: -0.18 },
          { name: "Advance Booking Window", shap: +0.14 },
          { name: "Promo Code Usage", shap: -0.09 },
        ],
        rca: [
          {
            driver: "Competitor Fare Index",
            bullets: [
              "OTA fares fluctuate ±12% daily vs. carrier’s static pricing.",
              "Dynamic match missed for 28% of Bangkok–Singapore segments.",
            ],
          },
        ],
        lineage: {
          sources: ["Daily Fares", "Competitor API", "Revenue Reports"],
          transforms: ["Aggregate", "Join", "Model-train"],
          version: "v2.0",
          trainedOn: "2025-10-12",
        },
        governance: [
          { label: "Bias", status: "Passed" },
          { label: "Explainability", status: "Complete" },
          { label: "Audit", status: "Compliant" },
          { label: "PII", status: "Safe" },
        ],
        whatIfControls: [
          { name: "demand_delta", label: "Demand Change (%)", min: -20, max: 20, default: 0, weight: +0.20 },
          { name: "competitor_fare_delta", label: "Competitor Fare (%)", min: -20, max: 20, default: 0, weight: -0.18 },
        ],
      },
      {
        name: "Reduce Flight Cancellations by 2%",
        insight:
          "Lowering operational cancellations boosts route reliability and passenger trust metrics by ~4 points.",
        keyDrivers: [
          { name: "Cancellations", shap: -0.22 },
          { name: "Crew Availability", shap: -0.18 },
          { name: "Weather Delays", shap: -0.12 },
          { name: "Aircraft Utilization", shap: +0.08 },
        ],
        rca: [
          {
            driver: "Crew Availability",
            bullets: [
              "Crew shortage observed on 12 weekend rotations.",
              "Delayed roster sync between HR and Ops system.",
            ],
          },
        ],
        lineage: {
          sources: ["Flight Load Summary", "Crew Roster", "Weather Feed"],
          transforms: ["Cleanse", "Join"],
          version: "v1.8",
          trainedOn: "2025-09-18",
        },
        governance: [
          { label: "Ops Compliance", status: "Passed" },
          { label: "Lineage", status: "Complete" },
          { label: "Safety Check", status: "Passed" },
          { label: "Audit", status: "Compliant" },
        ],
        whatIfControls: [
          { name: "cancel_delta", label: "Cancellations (%)", min: -10, max: 10, default: 0, weight: -0.22 },
          { name: "crew_delta", label: "Crew Availability (%)", min: -20, max: 20, default: 0, weight: +0.15 },
        ],
      },
      {
        name: "Boost NPS via Check-in Automation",
        insight:
          "Introducing self-serve kiosks and app check-in reduces queue time, improving NPS by 6 points and repeat bookings by 2%.",
        keyDrivers: [
          { name: "Check-in Time", shap: -0.30 },
          { name: "Queue Length", shap: -0.22 },
          { name: "Digital Adoption", shap: +0.15 },
          { name: "Staff Friendliness", shap: +0.08 },
        ],
        rca: [
          {
            driver: "Check-in Time",
            bullets: [
              "Peak-hour queue exceeds 25 min in 4 airports.",
              "Low kiosk usage (<30%) due to UX friction.",
            ],
          },
        ],
        lineage: {
          sources: ["NPS Survey", "App Analytics", "Ops Logs"],
          transforms: ["Aggregate", "Join"],
          version: "v2.5",
          trainedOn: "2025-10-03",
        },
        governance: [
          { label: "CX Compliance", status: "Passed" },
          { label: "Bias", status: "Passed" },
          { label: "Explainability", status: "Complete" },
          { label: "PII", status: "Safe" },
        ],
        whatIfControls: [
          { name: "checkin_time_delta", label: "Check-in Time (%)", min: -40, max: 40, default: 0, weight: -0.25 },
          { name: "digital_adoption_delta", label: "Digital Adoption (%)", min: -20, max: 40, default: 0, weight: +0.15 },
        ],
      },
    ],
  },

    hospitality: {
    model: "StayValueAI",
    decisionLabel: "Predicted Guest Satisfaction (%)",
    baselineValue: 82.4,
    scenarios: [
      {
        name: "Enhance Room Cleanliness Score",
        insight:
          "Improving cleanliness ratings by 10% raises guest satisfaction by 4.5% and review volume by 2x.",
        keyDrivers: [
          { name: "Cleanliness Score", shap: +0.35 },
          { name: "Service Time", shap: -0.18 },
          { name: "Check-in Delay", shap: -0.12 },
          { name: "Room Amenities", shap: +0.09 },
        ],
        rca: [
          {
            driver: "Service Time",
            bullets: [
              "Housekeeping backlog during high-occupancy weekends.",
              "Average turnaround 65 min vs 45 min SLA.",
            ],
          },
        ],
        lineage: {
          sources: ["Guest Feedback", "Housekeeping Logs", "Booking Data"],
          transforms: ["Cleanse", "Aggregate"],
          version: "v1.6",
          trainedOn: "2025-09-20",
        },
        governance: [
          { label: "PII", status: "Safe" },
          { label: "Bias", status: "Passed" },
          { label: "Audit", status: "Compliant" },
          { label: "Lineage", status: "Complete" },
        ],
        whatIfControls: [
          { name: "cleanliness_delta", label: "Cleanliness (%)", min: -20, max: 20, default: 0, weight: +0.35 },
          { name: "checkin_delay_delta", label: "Check-in Delay (%)", min: -30, max: 30, default: 0, weight: -0.12 },
        ],
      },
      {
        name: "Reduce Energy Cost by Smart HVAC",
        insight:
          "IoT-based HVAC control lowers energy cost by 8% while keeping comfort index constant.",
        keyDrivers: [
          { name: "HVAC Runtime", shap: -0.28 },
          { name: "Occupancy Rate", shap: +0.12 },
          { name: "Outdoor Temp", shap: -0.10 },
          { name: "Energy Cost", shap: -0.06 },
        ],
        rca: [
          {
            driver: "HVAC Runtime",
            bullets: [
              "Average runtime 9.2 h/day vs optimal 7 h.",
              "Automation missing for 18% of rooms.",
            ],
          },
        ],
        lineage: {
          sources: ["IoT Sensors", "Energy Billing", "Occupancy Logs"],
          transforms: ["Aggregate", "Feature Engineering"],
          version: "v2.1",
          trainedOn: "2025-10-15",
        },
        governance: [
          { label: "Energy Compliance", status: "Passed" },
          { label: "Bias", status: "Passed" },
          { label: "Audit", status: "Compliant" },
          { label: "PII", status: "Safe" },
        ],
        whatIfControls: [
          { name: "hvac_runtime_delta", label: "HVAC Runtime (%)", min: -30, max: 30, default: 0, weight: -0.25 },
          { name: "occupancy_delta", label: "Occupancy Rate (%)", min: -20, max: 20, default: 0, weight: +0.12 },
        ],
      },
      {
        name: "Upsell Premium Rooms via Personalization",
        insight:
          "Targeted upsell campaigns for repeat guests improve revenue per booking by 6% with minimal attrition.",
        keyDrivers: [
          { name: "Loyalty Tier", shap: +0.18 },
          { name: "Email Open Rate", shap: +0.14 },
          { name: "Discount Offered", shap: +0.09 },
          { name: "Cancellation Rate", shap: -0.08 },
        ],
        rca: [
          {
            driver: "Loyalty Tier",
            bullets: ["Gold members convert 2.4x higher than non-members."],
          },
        ],
        lineage: {
          sources: ["CRM", "Loyalty DB", "Campaign Logs"],
          transforms: ["Join", "Aggregate"],
          version: "v1.9",
          trainedOn: "2025-10-02",
        },
        governance: [
          { label: "Marketing Compliance", status: "Passed" },
          { label: "Fairness", status: "Passed" },
          { label: "PII", status: "Safe" },
          { label: "Audit", status: "Compliant" },
        ],
        whatIfControls: [
          { name: "discount_delta", label: "Discount (%)", min: 0, max: 20, default: 0, weight: +0.10 },
          { name: "email_open_delta", label: "Email Open Rate (%)", min: -10, max: 40, default: 0, weight: +0.14 },
        ],
      },
    ],
  },

    healthcare: {
    model: "ReadmitPredictX",
    decisionLabel: "Predicted Readmission Risk (%)",
    baselineValue: 17.8,
    scenarios: [
      {
        name: "Reduce Readmission via Follow-up Calls",
        insight:
          "Scheduling nurse follow-up calls within 48 h lowers 30-day readmission by 5%.",
        keyDrivers: [
          { name: "Follow-up Gap", shap: -0.35 },
          { name: "Medication Adherence", shap: +0.20 },
          { name: "Discharge Instructions", shap: +0.12 },
          { name: "Age", shap: +0.05 },
        ],
        rca: [
          {
            driver: "Follow-up Gap",
            bullets: [
              "35% patients not contacted post discharge.",
              "Correlation 0.62 with readmission rate.",
            ],
          },
        ],
        lineage: {
          sources: ["EHR", "Care Plans", "Call Logs"],
          transforms: ["Join", "Aggregate"],
          version: "v3.1",
          trainedOn: "2025-09-25",
        },
        governance: [
          { label: "PHI", status: "Safe" },
          { label: "Bias", status: "Passed" },
          { label: "Audit", status: "Compliant" },
          { label: "Explainability", status: "Complete" },
        ],
        whatIfControls: [
          { name: "followup_gap_delta", label: "Follow-up Gap (%)", min: -50, max: 50, default: 0, weight: -0.30 },
          { name: "adherence_delta", label: "Adherence (%)", min: -20, max: 20, default: 0, weight: +0.20 },
        ],
      },
      {
        name: "Improve Appointment No-Show Rate",
        insight:
          "Reducing no-shows by 15% raises utilization by 4.2% and revenue by 3%.",
        keyDrivers: [
          { name: "Reminder SMS Sent", shap: +0.22 },
          { name: "Lead Time", shap: -0.15 },
          { name: "Patient Distance", shap: -0.10 },
          { name: "Wait Time", shap: -0.08 },
        ],
        rca: [
          {
            driver: "Lead Time",
            bullets: [
              "No-shows spike for appointments booked >10 days in advance.",
            ],
          },
        ],
        lineage: {
          sources: ["Scheduling DB", "Patient CRM", "SMS Gateway"],
          transforms: ["Aggregate", "Model-train"],
          version: "v2.4",
          trainedOn: "2025-10-14",
        },
        governance: [
          { label: "Bias", status: "Passed" },
          { label: "PHI", status: "Safe" },
          { label: "Audit", status: "Compliant" },
          { label: "Explainability", status: "Complete" },
        ],
        whatIfControls: [
          { name: "reminder_delta", label: "Reminders Sent (%)", min: 0, max: 30, default: 0, weight: +0.20 },
          { name: "leadtime_delta", label: "Lead Time (%)", min: -30, max: 30, default: 0, weight: -0.15 },
        ],
      },
      {
        name: "Optimize ER Wait Times",
        insight:
          "Implementing triage prediction model reduces median wait time by 18 min improving patient satisfaction by 7 pts.",
        keyDrivers: [
          { name: "ER Volume", shap: -0.25 },
          { name: "Triage Accuracy", shap: +0.18 },
          { name: "Staff Availability", shap: +0.12 },
          { name: "Bed Occupancy", shap: -0.10 },
        ],
        rca: [
          {
            driver: "ER Volume",
            bullets: [
              "Monday influx +23% vs weekday average.",
              "Low staffing coverage 11 p.m.–6 a.m.",
            ],
          },
        ],
        lineage: {
          sources: ["ER Logs", "Staff Rosters", "EHR"],
          transforms: ["Join", "Aggregate"],
          version: "v2.7",
          trainedOn: "2025-10-05",
        },
        governance: [
          { label: "Operational", status: "Passed" },
          { label: "PHI", status: "Safe" },
          { label: "Audit", status: "Compliant" },
          { label: "Explainability", status: "Complete" },
        ],
        whatIfControls: [
          { name: "er_volume_delta", label: "ER Volume (%)", min: -40, max: 40, default: 0, weight: -0.25 },
          { name: "triage_accuracy_delta", label: "Triage Accuracy (%)", min: -10, max: 20, default: 0, weight: +0.18 },
        ],
      },
    ],
  },
  bfsi: {
    model: "CreditRiskNetV4",
    decisionLabel: "Predicted Default Risk (%)",
    baselineValue: 9.6,
    scenarios: [
      {
        name: "Tighten Underwriting Rules",
        insight:
          "Stricter underwriting on self-employed applicants reduces default risk by 1.8 pts with marginal approval drop.",
        keyDrivers: [
          { name: "Income Stability", shap: -0.28 },
          { name: "Debt-to-Income", shap: +0.22 },
          { name: "Employment Type", shap: -0.12 },
          { name: "Credit Score", shap: -0.10 },
        ],
        rca: [
          {
            driver: "Debt-to-Income",
            bullets: ["DTI > 45% has 3× default odds."],
          },
        ],
        lineage: {
          sources: ["Loan Portfolio", "Credit Bureau", "Customer Accounts"],
          transforms: ["Cleanse", "Join"],
          version: "v4.0",
          trainedOn: "2025-10-11",
        },
        governance: [
          { label: "Fair Lending", status: "Passed" },
          { label: "Bias", status: "Passed" },
          { label: "Audit", status: "Compliant" },
          { label: "PII", status: "Safe" },
        ],
        whatIfControls: [
          { name: "dti_delta", label: "DTI (%)", min: -20, max: 20, default: 0, weight: +0.22 },
          { name: "income_stability_delta", label: "Income Stability (%)", min: -20, max: 20, default: 0, weight: -0.25 },
        ],
      },
      {
        name: "Offer Lower Interest to Prime Borrowers",
        insight:
          "Reducing APR by 1% for prime customers lifts retention by 4 pts without affecting portfolio yield.",
        keyDrivers: [
          { name: "Interest Rate", shap: +0.18 },
          { name: "Credit Score", shap: -0.20 },
          { name: "Delinquency History", shap: +0.15 },
          { name: "Tenure", shap: -0.05 },
        ],
        rca: [
          {
            driver: "Interest Rate",
            bullets: ["APR spread > 2% vs. competitor products drives churn."],
          },
        ],
        lineage: {
          sources: ["Loan Portfolio", "CRM", "Credit Risk Models"],
          transforms: ["Aggregate", "Feature Scaling"],
          version: "v3.9",
          trainedOn: "2025-09-27",
        },
        governance: [
          { label: "Fair Pricing", status: "Passed" },
          { label: "Bias", status: "Passed" },
          { label: "Explainability", status: "Complete" },
          { label: "Audit", status: "Compliant" },
        ],
        whatIfControls: [
          { name: "apr_delta", label: "Interest Rate (%)", min: -10, max: 10, default: 0, weight: +0.18 },
          { name: "credit_score_delta", label: "Credit Score (%)", min: -10, max: 10, default: 0, weight: -0.20 },
        ],
      },
      {
        name: "Enhance Fraud Detection Thresholds",
        insight:
          "Increasing model sensitivity by 8% improves fraud detection by 5% while adding 1.2% false positives.",
        keyDrivers: [
          { name: "Transaction Velocity", shap: +0.26 },
          { name: "Merchant Risk Score", shap: +0.22 },
          { name: "Model Threshold", shap: -0.15 },
          { name: "Geolocation Variance", shap: +0.09 },
        ],
        rca: [
          {
            driver: "Merchant Risk Score",
            bullets: [
              "50% of flagged merchants are in MCC 6011 and 7995 categories.",
            ],
          },
        ],
        lineage: {
          sources: ["Payment Transactions", "AML Alerts", "Fraud Logs"],
          transforms: ["Join", "Aggregate"],
          version: "v2.8",
          trainedOn: "2025-10-10",
        },
        governance: [
          { label: "AML", status: "Passed" },
          { label: "Bias", status: "Passed" },
          { label: "Audit", status: "Compliant" },
          { label: "Explainability", status: "Complete" },
        ],
        whatIfControls: [
          { name: "threshold_delta", label: "Model Sensitivity (%)", min: -20, max: 20, default: 0, weight: +0.25 },
          { name: "velocity_delta", label: "Txn Velocity (%)", min: -30, max: 30, default: 0, weight: +0.20 },
        ],
      },
    ],
  },



  
};

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
export default function Explainability() {
  const { domain } = useAppStore();
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [whatIfValues, setWhatIfValues] = useState<Record<string, number>>({});

  const industry =
    explainabilityData[domain.toLowerCase() as keyof typeof explainabilityData] ||
    explainabilityData.telco;

  const baseline = industry.baselineValue;

  // Simulated churn dynamically updated
  const simulatedValue = useMemo(() => {
    if (!selectedScenario) return baseline;
    let delta = 0;
    selectedScenario.whatIfControls.forEach((c: any) => {
      const change = whatIfValues[c.name] ?? c.default;
      delta += (change / 100) * (c.weight * baseline);
    });
    return Math.max(0, baseline + delta);
  }, [whatIfValues, selectedScenario, baseline]);

  const shapData =
    selectedScenario?.keyDrivers.map((d: any) => ({
      name: d.name,
      shap: d.shap,
      color: d.shap >= 0 ? COLORS.positive : COLORS.negative,
    })) || [];

  // Dynamic metrics reacting to sliders
  const dynamicMetrics = useMemo(() => {
    if (!selectedScenario) return [];
    const sliderImpact = Object.values(whatIfValues).reduce(
      (acc, v) => acc + v,
      0
    );
    const churnImpact = baseline - (sliderImpact * 0.05);
    const retention = Math.min(100, 100 - churnImpact * 0.5);
    const nps = 45 + sliderImpact * 0.2;
    const arpu = 950 + sliderImpact * 1.5;

    return [
      {
        name: "Predicted Churn",
        baseline: baseline.toFixed(1),
        simulated: simulatedValue.toFixed(1),
        unit: "%",
        delta: `${(baseline - simulatedValue).toFixed(1)} pts ↓`,
        good: simulatedValue < baseline,
      },
      {
        name: "Customer Retention",
        baseline: 78.5,
        simulated: retention,
        unit: "%",
        delta: `${(retention - 78.5).toFixed(1)} pts`,
        good: retention > 78.5,
      },
      {
        name: "Average NPS",
        baseline: 45.0,
        simulated: nps,
        unit: "",
        delta: `${(nps - 45).toFixed(1)} pts`,
        good: nps > 45,
      },
      {
        name: "Avg ARPU",
        baseline: 950,
        simulated: arpu,
        unit: "",
        delta: `${(arpu - 950).toFixed(0)}`,
        good: arpu > 950,
      },
    ];
  }, [whatIfValues, baseline, selectedScenario, simulatedValue]);

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Explainability Sandbox
          </h1>
        </div>
        <Badge variant="outline" className="capitalize">
          {domain}
        </Badge>
      </div>

      {/* SCENARIO SELECTION */}
      {!selectedScenario && (
        <Card>
          <CardHeader>
            <CardTitle>Select a Scenario to Explore</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industry.scenarios.map((s, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition"
                onClick={() => setSelectedScenario(s)}
              >
                <div className="font-semibold mb-1">{s.name}</div>
                <p className="text-sm text-muted-foreground mb-2">
                  {s.insight.slice(0, 90)}…
                </p>
                <Badge variant="secondary">Click to Deep Dive</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SCENARIO DETAILS */}
      {selectedScenario && (
        <>
          <div className="flex items-center gap-3 text-foreground">
            <Button variant="ghost" onClick={() => setSelectedScenario(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h3 className="text-2xl font-semibold">{selectedScenario.name}</h3>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                <Activity className="h-4 w-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="whatif">
                <Target className="h-4 w-4 mr-2" /> What-If Simulator
              </TabsTrigger>
              <TabsTrigger value="model">
                <Settings className="h-4 w-4 mr-2" /> Model Details
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Lightbulb className="inline w-5 h-5 mr-2" />
                    AI Insight
                  </CardTitle>
                </CardHeader>
                <CardContent>{selectedScenario.insight}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    <BarChart3 className="inline w-5 h-5 mr-2" />
                    SHAP Feature Attribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={shapData}
                      layout="vertical"
                      margin={{ top: 10, right: 20, bottom: 10, left: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[-0.5, 0.5]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="shap" isAnimationActive={false}>
                        {shapData.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Layers className="inline w-5 h-5 mr-2" />
                      Root Cause Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedScenario.rca.map((r: any, i: number) => (
                      <div key={i} className="mb-4">
                        <div className="font-semibold">{r.driver}</div>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {r.bullets.map((b: any, j: number) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      <GitBranch className="inline w-5 h-5 mr-2" />
                      Data Lineage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <b>Sources:</b>{" "}
                      {selectedScenario.lineage.sources.join(", ")}
                    </div>
                    <div>
                      <b>Transforms:</b>{" "}
                      {selectedScenario.lineage.transforms.join(", ")}
                    </div>
                    <div>
                      <b>Version:</b> {selectedScenario.lineage.version}
                    </div>
                    <div>
                      <b>Trained On:</b>{" "}
                      {selectedScenario.lineage.trainedOn}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>
                    <Shield className="inline w-5 h-5 mr-2" />
                    Governance & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedScenario.governance.map((g: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 border rounded-lg flex flex-col items-center"
                    >
                      <CheckCircle className="h-5 w-5 text-primary mb-2" />
                      <div className="font-medium">{g.label}</div>
                      <Badge variant="secondary">{g.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* WHAT-IF SIMULATOR */}
            <TabsContent value="whatif" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Controls */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Scenario Controls</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Adjust parameters to see projected impact
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedScenario.whatIfControls.map((c: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <Label>{c.label}</Label>
                          <span className="text-muted-foreground">
                            {whatIfValues[c.name] ?? c.default}
                            {c.unit || "%"}
                          </span>
                        </div>
                        <Slider
                          min={c.min}
                          max={c.max}
                          step={1}
                          value={[whatIfValues[c.name] ?? c.default]}
                          onValueChange={([val]) =>
                            setWhatIfValues((prev) => ({
                              ...prev,
                              [c.name]: val,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Right: KPI Metrics */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dynamicMetrics.map((m, i) => (
                      <Card key={i} className="text-center">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">
                            {m.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-semibold">
                            {m.simulated} {m.unit}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              m.good ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {m.delta}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* MODEL DETAILS */}
            <TabsContent value="model" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Settings className="inline w-5 h-5 mr-2" />
                    Model Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div>
                    <b>Model Name:</b> {industry.model}
                  </div>
                  <div>
                    <b>Version:</b> {selectedScenario.lineage.version}
                  </div>
                  <div>
                    <b>Trained On:</b> {selectedScenario.lineage.trainedOn}
                  </div>
                  <div>
                    <b>Decision Variable:</b> {industry.decisionLabel}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
