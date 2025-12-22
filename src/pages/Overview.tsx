
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Activity,
    Database,
    Layers,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { useNewDataStore } from "@/store/useNewDataStore";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function Overview() {
    const { currentData, loadData } = useNewDataStore();
    const { domain } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof loadData === "function") {
            loadData();
        }
    }, [loadData]);

    if (!currentData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const currentDomainData = currentData.domains.find((d) => d.name === domain);

    if (!currentDomainData) return null;

    // Calculate some stats
    const totalSchemas = currentDomainData.schemas.length;
    const totalDatasets = currentDomainData.schemas.reduce(
        (acc, schema) => acc + schema.datasets.length,
        0
    );
    const atRiskDatasets = currentDomainData.schemas.flatMap((s) =>
        s.datasets.filter((d) => d.status === "at_risk" || d.status === "degraded")
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-50">
                                Operational Overview
                            </h1>
                            <p className="text-muted-foreground">
                                Snapshot of your data ecosystem in <span className="text-primary font-medium">{domain}</span>
                            </p>
                        </div>
                        <Button onClick={() => navigate("/executive")} variant="outline" className="gap-2">
                            Executive View <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div variants={itemVariants}>
                        <Card className="gradient-card border-border/50 hover:border-primary/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Schemas
                                </CardTitle>
                                <Layers className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalSchemas}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Active in {domain}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="gradient-card border-border/50 hover:border-primary/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Datasets
                                </CardTitle>
                                <Database className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalDatasets}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Across all schemas
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="gradient-card border-border/50 hover:border-primary/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Health Status
                                </CardTitle>
                                <Activity className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(currentDomainData.kpis.reliability)}%
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    System uptime score
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Action Needed Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                        <Card className="gradient-card border-border/50 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    Requires Attention
                                </CardTitle>
                                <CardDescription>
                                    Datasets with quality or freshness issues
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {atRiskDatasets.length > 0 ? (
                                    <div className="space-y-4">
                                        {atRiskDatasets.slice(0, 3).map((d, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm">{d.name}</p>
                                                    <p className="text-xs text-muted-foreground lowercase">
                                                        {d.status.replace("_", " ")}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/dataset/${domain}/${d.name /* assuming schema name isn't easily available here without traversal, but keeping simple */}`
                                                        )
                                                    }
                                                    className="text-xs"
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        ))}
                                        {atRiskDatasets.length > 3 && (
                                            <Button
                                                variant="link"
                                                className="w-full text-xs text-muted-foreground"
                                                onClick={() => navigate("/datasets")}
                                            >
                                                View all {atRiskDatasets.length} issues
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                        <CheckCircle2 className="h-8 w-8 mb-2 text-emerald-500/50" />
                                        <p>All systems healthy</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="gradient-card border-border/50 h-full">
                            <CardHeader>
                                <CardTitle>System Activity</CardTitle>
                                <CardDescription>Recent automated actions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50"
                                        >
                                            <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
                                            <div>
                                                <p className="text-sm">
                                                    Automated schema validation completed for{" "}
                                                    <span className="text-foreground font-medium">
                                                        Customer_360
                                                    </span>
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {i * 15 + 2} minutes ago
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
