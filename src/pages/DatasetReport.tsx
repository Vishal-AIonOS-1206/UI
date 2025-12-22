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
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  Database,
  Activity,
  Shield,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Settings,
  Play,
  Loader2,
} from "lucide-react";
import { useNewDataStore } from "@/store/useNewDataStore";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { DatasetDetail } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DatasetReport() {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPermissions } = useAppStore();
  const { getDatasetDetail } = useNewDataStore();

  const domain = decodeURIComponent(params.domain ?? "");
  const schema = decodeURIComponent(params.schema ?? "");
  const datasetName = decodeURIComponent(params.dataset ?? "");
  const datasetId =
    domain && schema && datasetName
      ? `${domain}-${schema}-${datasetName}`
      : "";

  const [data, setData] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openSim, setOpenSim] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const permissions = getPermissions();

  useEffect(() => {
    setLoading(true);
    if (!datasetId) {
      setError("Invalid dataset path");
      setLoading(false);
      return;
    }

    const detail = getDatasetDetail(datasetId);
    if (detail) {
      setData(detail);
    } else {
      setError("Dataset not found");
    }
    setLoading(false);
  }, [datasetId, getDatasetDetail]);

  const startSimulation = () => {
    setSimStep(0);
    setOpenSim(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSimStep(step);
      if (step >= 4) clearInterval(interval);
    }, 1800);
  };

  const simSteps = [
    {
      title: "Triggering Ingestion Job",
      icon: <Loader2 className="h-6 w-6 text-primary animate-spin" />,
      desc: "Starting ingestion job for dataset `sales.orders_2025`...",
    },
    {
      title: "Analysing Data Flow",
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      desc: "Detected schema drift — new column `discount_code` found in source system.",
    },
    {
      title: "Auto-Fixing Detected Issue",
      icon: <Settings className="h-6 w-6 text-blue-500 animate-spin" />,
      desc: (
        <div>
          <p>Generated SQL patch to align schema:</p>
          <pre className="bg-muted p-3 rounded text-xs mt-2">
{`ALTER TABLE sales.orders_2025 
ADD COLUMN discount_code VARCHAR(20);`}
          </pre>
        </div>
      ),
    },
    {
      title: "Pipeline Restored Successfully",
      icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
      desc: "All checks passed. Pipeline resumed successfully and data freshness restored.",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <Card>
          <CardContent className="p-8 text-center">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {error || "Dataset not found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {error === "Invalid dataset path"
                ? "The dataset URL is malformed or incomplete."
                : "The dataset you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate("/datasets")} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Datasets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dataset = data;
  const trustTrendData = dataset.trustScoreTrend30d.map((score, i) => ({
    day: i + 1,
    score,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/datasets")}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
              <Database className="w-8 h-8 text-primary" />
              {dataset.dataset}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="outline">{dataset.domain}</Badge>
              <Badge variant="secondary">{dataset.schema}</Badge>
              <span className="text-muted-foreground">
                Owned by {dataset.owners.join(", ")}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right space-y-2">
          <div>
            <div className="text-sm text-muted-foreground">Trust Score</div>
            <div className="text-2xl font-bold text-primary">
              {dataset.trustScoreTrend30d.at(-1)}
            </div>
          </div>
          <Button
            size="sm"
            onClick={startSimulation}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Simulate Pipeline
          </Button>
        </div>
      </div>

      {/* Simulation Dialog */}
      <Dialog open={openSim} onOpenChange={setOpenSim}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pipeline Simulation</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {simSteps.slice(0, simStep + 1).map((s, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg bg-muted/30 space-y-2"
              >
                <div className="flex items-center gap-3">
                  {s.icon}
                  <h4 className="font-medium">{s.title}</h4>
                </div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
                <Progress value={(i + 1) * 25} className="h-2 bg-muted/60" />
              </div>
            ))}

            {simStep < 3 && (
              <p className="text-xs text-center text-muted-foreground">
                Running step {simStep + 1} of 4...
              </p>
            )}

            {simStep === 3 && (
              <div className="text-center mt-4">
                <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm text-emerald-700 font-medium">
                  Simulation completed successfully
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Description */}
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-4">{dataset.description}</p>
          <div className="flex flex-wrap gap-2">
            {dataset.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="reliability" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reliability" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Reliability
          </TabsTrigger>
          <TabsTrigger value="governance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Governance
          </TabsTrigger>
        </TabsList>

        {/* Reliability */}
        <TabsContent value="reliability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dataset.pipelineRuns.map((run) => (
                  <div
                    key={run.runId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {run.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : run.status === "fixed_by_agent" ? (
                        <Settings className="h-5 w-5 text-blue-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{run.runId}</div>
                        <div className="text-sm text-muted-foreground">
                          {run.started} • {run.durationMin}m
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          run.status === "success"
                            ? "default"
                            : run.status === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {run.status.replace("_", " ")}
                      </Badge>
                      {run.issue && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {run.issue}
                        </div>
                      )}
                      {run.fix && (
                        <div className="text-xs text-emerald-600 mt-1">
                          {run.fix}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Lineage */}
          <Card>
            <CardHeader>
              <CardTitle>Data Lineage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Domain → {dataset.domain} | Schema → {dataset.schema} | Dataset →{" "}
                  {dataset.dataset}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Governance */}
        <TabsContent value="governance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust Score Trend (30d)</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trustTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Dataset Catalog */}
          <Card>
            <CardHeader>
              <CardTitle>Dataset Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Metadata and classification tags describing dataset purpose and context.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Domain Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {dataset.domainTags?.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    )) || (
                      <p className="text-sm text-muted-foreground">No tags</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Functional Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {dataset.functionalTags?.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    )) || (
                      <p className="text-sm text-muted-foreground">No tags</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Column Catalog */}
          <Card>
            <CardHeader>
              <CardTitle>Column Catalog</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left font-semibold">Column</th>
                    <th className="p-3 text-left font-semibold">Type</th>
                    <th className="p-3 text-left font-semibold">Description</th>
                    <th className="p-3 text-left font-semibold">PII</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.columns.map((col, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{col.name}</td>
                      <td className="p-3">{col.datatype}</td>
                      <td className="p-3">{col.description}</td>
                      <td className="p-3">
                        {col.pii ? (
                          <Badge variant="destructive" className="text-xs">
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Column Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Column Quality</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left font-semibold">Column</th>
                    <th className="p-3 text-left font-semibold">Null %</th>
                    <th className="p-3 text-left font-semibold">Duplicates %</th>
                    <th className="p-3 text-left font-semibold">Outliers %</th>
                    <th className="p-3 text-left font-semibold">
                      Format Violations %
                    </th>
                    <th className="p-3 text-left font-semibold">Suggested Fix</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.qualityReport.map((col, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{col.column}</td>
                      <td className="p-3">{col.nullPct}%</td>
                      <td className="p-3">{col.dupPct}%</td>
                      <td className="p-3">{col.outlierPct}%</td>
                      <td className="p-3">{col.formatViolationsPct}%</td>
                      <td className="p-3 text-muted-foreground">
                        {col.suggestedFix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
