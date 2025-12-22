import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Shield,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useNewDataStore } from "@/store/useNewDataStore";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { DomainName } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Mock chart data
const incidentTrendData = [
  { time: "00:00", incidents: 2, resolved: 8 },
  { time: "04:00", incidents: 1, resolved: 3 },
  { time: "08:00", incidents: 4, resolved: 2 },
  { time: "12:00", incidents: 3, resolved: 5 },
  { time: "16:00", incidents: 6, resolved: 4 },
  { time: "20:00", incidents: 2, resolved: 6 },
  { time: "24:00", incidents: 1, resolved: 3 },
];

interface KPICardProps {
  title: string;
  value: string | number;
  delta: number;
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
  sparkline?: number[];
  subtitle?: string;
}

function KPICard({
  title,
  value,
  delta,
  trend,
  icon: Icon,
  sparkline,
  subtitle,
}: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === "up")
      return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
    if (trend === "down")
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-amber-500" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-emerald-500";
    if (trend === "down") return "text-red-500";
    return "text-amber-500";
  };

  return (
    <Card className="gradient-card border-border/50 hover:border-primary/50 transition-all animate-smooth">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-3">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`flex items-center text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">{Math.abs(delta)}%</span>
          </div>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {sparkline && (
          <div className="mt-3 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sparkline.map((value, index) => ({ index, value }))}
              >
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ExecutiveCockpit() {
  const { currentData, loadData } = useNewDataStore();
  const { domain, setDomain } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof loadData === "function") {
      loadData(); // ensure SEED_DATA is loaded
    }
  }, [loadData]);

  const currentDomainData = currentData?.domains.find(
    (d) => d.name === domain
  );

  if (!currentData || !currentDomainData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleDomainChange = (newDomain: DomainName) => {
    setDomain(newDomain);
  };

  const trustScoreBySchema = currentDomainData.schemas.map((schema) => ({
    name: schema.name,
    trustScore: schema.trustScore,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">
                Executive Cockpit
              </h1>
              <p className="text-muted-foreground">
                Real-time operational intelligence across reliability, trust,
                and explainability
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <KPICard
            title="Reliability"
            value={`${currentDomainData.kpis.reliability}%`}
            delta={2}
            trend="up"
            icon={Activity}
            subtitle="System uptime"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <KPICard
            title="Governance"
            value={`${currentDomainData.kpis.governance}%`}
            delta={-1}
            trend="down"
            icon={Shield}
            subtitle="Policy compliance"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <KPICard
            title="Data Coverage"
            value={`${currentDomainData.kpis.dataCoverage}%`}
            delta={3}
            trend="up"
            icon={Brain}
            subtitle="Schema coverage"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <KPICard
            title="Model Uptime"
            value={`${currentDomainData.kpis.modelUptime}%`}
            delta={0}
            trend="stable"
            icon={Clock}
            subtitle="ML availability"
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Incident Trends */}
        <motion.div variants={itemVariants}>
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Incident Trends (24h)</CardTitle>
              <CardDescription>
                New incidents vs resolved over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incidentTrendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stackId="1"
                      stroke="hsl(var(--intellistream-secondary))"
                      fill="hsl(var(--intellistream-secondary) / 0.2)"
                    />
                    <Area
                      type="monotone"
                      dataKey="incidents"
                      stackId="2"
                      stroke="hsl(var(--destructive))"
                      fill="hsl(var(--destructive) / 0.2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Score by Schema */}
        <motion.div variants={itemVariants}>
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Trust Score by Schema</CardTitle>
              <CardDescription>
                Current trust levels across schemas in {domain}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trustScoreBySchema}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="trustScore"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Incidents */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest incidents and alerts in {domain}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 border border-border/50">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium">
                        Schema validation passed
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        low
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      All datasets in {domain} passed validation checks
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/datasets")}
                        className="text-xs h-6"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                {currentDomainData.kpis.incidentsLast7d > 0 && (
                  <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 border border-border/50">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium">
                          {currentDomainData.kpis.incidentsLast7d} incidents in
                          last 7 days
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          medium
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recent data quality issues detected across schemas
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          Last 7 days
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate("/datasets")}
                          className="text-xs h-6"
                        >
                          Investigate
                        </Button>
                      </div>
                    </div>
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
