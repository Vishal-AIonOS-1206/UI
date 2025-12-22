import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { useNewDataStore } from "@/store/useNewDataStore";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";
import { DatasetAnomaly } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "at_risk":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "degraded":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-3 w-3" />;
      case "at_risk":
      case "degraded":
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div
      className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)}
      <span className="capitalize">{status.replace("_", " ")}</span>
    </div>
  );
}

export default function Datasets() {
  const { currentData } = useNewDataStore();
  const { domain: selectedDomain } = useAppStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [schemaFilter, setSchemaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!currentData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Build dataset list
  const allDatasets = currentData.domains.flatMap((domain) =>
    domain.schemas.flatMap((schema) =>
      schema.datasets.map((dataset) => ({
        ...dataset,
        domain: domain.name,
        schema: schema.name,
        id: `${domain.name}-${schema.name}-${dataset.name}`,
      }))
    )
  );

  // Filter for selected domain
  const currentDomainData = currentData.domains.find(
    (d) => d.name === selectedDomain
  );
  const schemas = currentDomainData?.schemas.map((s) => s.name) || [];

  // Apply search + filters
  const filteredDatasets = allDatasets.filter((dataset) => {
    const matchesSearch =
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchema =
      schemaFilter === "all" || dataset.schema === schemaFilter;
    const matchesStatus =
      statusFilter === "all" || dataset.status === statusFilter;
    const matchesDomain = dataset.domain === selectedDomain;
    return (
      matchesSearch && matchesSchema && matchesStatus && matchesDomain
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-slate-50">Datasets</h1>
              <p className="text-muted-foreground">
                Monitor data quality, freshness, and trust across all datasets
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {filteredDatasets.length} datasets
              </Badge>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search datasets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                </div>

                {/* Schema Filter */}
                <Select value={schemaFilter} onValueChange={setSchemaFilter}>
                  <SelectTrigger className="w-40 bg-background/50">
                    <SelectValue placeholder="Schema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Schemas</SelectItem>
                    {schemas.map((schema) => (
                      <SelectItem key={schema} value={schema}>
                        {schema}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-background/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="at_risk">At Risk</SelectItem>
                    <SelectItem value="degraded">Degraded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Dataset Table */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Dataset Overview</span>
              </CardTitle>
              <CardDescription>
                Click on any dataset to view detailed quality and governance reports
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredDatasets.map((dataset) => (
                  <motion.div
                    key={dataset.id}
                    variants={itemVariants}
                    className="p-4 rounded-lg bg-card/30 border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/dataset/${encodeURIComponent(
                          dataset.domain
                        )}/${encodeURIComponent(
                          dataset.schema
                        )}/${encodeURIComponent(dataset.name)}`
                      )
                    }
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                      {/* Dataset Name & Schema */}
                      <div className="lg:col-span-2">
                        <div className="font-medium text-foreground mb-1">
                          {dataset.name}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {dataset.schema}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {dataset.rows.toLocaleString()} rows
                          </Badge>
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Status
                        </div>
                        <StatusBadge status={dataset.status} />
                      </div>

                      {/* Trust Score */}
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Trust Score
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={85} className="h-2 flex-1" />
                          <span className="text-sm font-medium">85</span>
                        </div>
                      </div>

                      {/* Owner */}
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">
                          Owner
                        </div>
                        <div className="flex items-center justify-end space-x-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {dataset.owner?.split("@")[0] || "Unassigned"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredDatasets.length === 0 && (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No datasets found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
