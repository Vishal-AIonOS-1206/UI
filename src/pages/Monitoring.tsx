import { motion } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Zap,
    TrendingUp,
    FileText,
    AlertCircle,
    Server,
    Play,
    PauseCircle,
    ShieldAlert
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

export default function Monitoring() {
    return (
        <div className="space-y-6">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>

                {/* Header */}
                <motion.div variants={itemVariants} className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Monitoring</h1>
                    <p className="text-muted-foreground mt-2">
                        Real-time operational monitoring and incident management
                    </p>
                </motion.div>

                {/* KPI Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                                    +12%
                                </span>
                            </div>
                            <div className="text-3xl font-bold">247</div>
                            <p className="text-xs text-muted-foreground mt-1">Active Pipelines</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-3xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground mt-1">Open Incidents</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                                <Zap className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                                    +24%
                                </span>
                            </div>
                            <div className="text-3xl font-bold">156</div>
                            <p className="text-xs text-muted-foreground mt-1">Auto-Fixes This Week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">99.2%</div>
                            <p className="text-xs text-muted-foreground mt-1">SLA Compliance</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Tabs Section */}
                <motion.div variants={itemVariants}>
                    <Tabs defaultValue="pipelines" className="w-full">
                        <div className="border-b mb-6">
                            <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-6">
                                <TabsTrigger
                                    value="pipelines"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
                                >
                                    Pipelines
                                </TabsTrigger>
                                <TabsTrigger
                                    value="incidents"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
                                >
                                    Incidents
                                </TabsTrigger>
                                <TabsTrigger
                                    value="autofixes"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
                                >
                                    Auto-Fixes
                                </TabsTrigger>
                                <TabsTrigger
                                    value="sla"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
                                >
                                    SLA & Latency
                                </TabsTrigger>
                                <TabsTrigger
                                    value="coverage"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
                                >
                                    Catalog Coverage
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* TAB: Pipelines */}
                        <TabsContent value="pipelines" className="space-y-4">
                            <Card>
                                <CardContent className="p-0">
                                    <div className="relative w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm">
                                            <thead className="[&_tr]:border-b">
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pipeline Name</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Run</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Health</th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0">
                                                <tr className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium flex items-center gap-2">
                                                        <div className="p-1.5 rounded bg-muted">
                                                            <Server className="w-4 h-4 text-zinc-500" />
                                                        </div>
                                                        etl_daily_revenue
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <Badge variant="default" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900">running</Badge>
                                                    </td>
                                                    <td className="p-4 align-middle text-muted-foreground">5 min ago</td>
                                                    <td className="p-4 align-middle text-muted-foreground">2m 34s</td>
                                                    <td className="p-4 align-middle">
                                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            Healthy
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium flex items-center gap-2">
                                                        <div className="p-1.5 rounded bg-muted">
                                                            <Activity className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        ml_feature_pipeline
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400">completed</Badge>
                                                    </td>
                                                    <td className="p-4 align-middle text-muted-foreground">1 hour ago</td>
                                                    <td className="p-4 align-middle text-muted-foreground">15m 12s</td>
                                                    <td className="p-4 align-middle">
                                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            Healthy
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium flex items-center gap-2">
                                                        <div className="p-1.5 rounded bg-muted">
                                                            <Server className="w-4 h-4 text-zinc-500" />
                                                        </div>
                                                        data_sync_customers
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <Badge variant="default" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900">running</Badge>
                                                    </td>
                                                    <td className="p-4 align-middle text-muted-foreground">2 min ago</td>
                                                    <td className="p-4 align-middle text-muted-foreground">45s</td>
                                                    <td className="p-4 align-middle">
                                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            Healthy
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium flex items-center gap-2">
                                                        <div className="p-1.5 rounded bg-muted">
                                                            <Activity className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        analytics_aggregation
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">warning</Badge>
                                                    </td>
                                                    <td className="p-4 align-middle text-muted-foreground">3 hours ago</td>
                                                    <td className="p-4 align-middle text-muted-foreground">8m 45s</td>
                                                    <td className="p-4 align-middle">
                                                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                                                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                                                            Warning
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium flex items-center gap-2">
                                                        <div className="p-1.5 rounded bg-muted">
                                                            <Server className="w-4 h-4 text-zinc-500" />
                                                        </div>
                                                        backup_archive
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400">completed</Badge>
                                                    </td>
                                                    <td className="p-4 align-middle text-muted-foreground">12 hours ago</td>
                                                    <td className="p-4 align-middle text-muted-foreground">1h 23m</td>
                                                    <td className="p-4 align-middle">
                                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            Healthy
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB: Incidents */}
                        <TabsContent value="incidents" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: "INC-2024-001", title: "High Latency in Payment Gateway", severity: "Critical", time: "10 mins ago", status: "Investigating" },
                                    { id: "INC-2024-002", title: "Schema Drift in User Table", severity: "Medium", time: "2 hours ago", status: "Open" },
                                    { id: "INC-2024-003", title: "API Rate Limit Exceeded", severity: "Low", time: "5 hours ago", status: "Resolved" },
                                ].map((inc, i) => (
                                    <Card key={i} className="border-l-4 border-l-red-500">
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-lg">{inc.title}</h3>
                                                        <Badge variant={inc.severity === "Critical" ? "destructive" : "outline"} className={inc.severity === "Medium" ? "border-amber-500 text-amber-500" : ""}>{inc.severity}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{inc.id} • {inc.time}</p>
                                                </div>
                                                <Button variant="outline" size="sm">View</Button>
                                            </div>
                                            <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                                                <div className={`h-2 w-2 rounded-full ${inc.status === "Investigating" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}></div>
                                                Status: {inc.status}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* TAB: Auto-Fixes */}
                        <TabsContent value="autofixes" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Automated Remediation Logs</CardTitle>
                                    <CardDescription>Recent actions taken by IntelliStream Auto-Heal</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {[
                                            { action: "Restarted Stuck Spark Job", target: "etl_finance_rollup", result: "Success", time: "15 mins ago" },
                                            { action: "Scaled Up Cluster", target: "ml_training_cluster", result: "Success", time: "1 hour ago" },
                                            { action: "Rolled Back Schema Change", target: "dim_customers", result: "Failed", time: "4 hours ago", error: "Dependencies detected" },
                                            { action: "Cleared Temp Cache", target: "system_maintenance", result: "Success", time: "6 hours ago" },
                                        ].map((fix, i) => (
                                            <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${fix.result === "Success" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                                                        <Zap className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{fix.action}</p>
                                                        <p className="text-sm text-muted-foreground">Target: {fix.target}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant={fix.result === "Success" ? "outline" : "destructive"} className={fix.result === "Success" ? "border-emerald-500 text-emerald-500" : ""}>{fix.result}</Badge>
                                                    <p className="text-xs text-muted-foreground mt-1">{fix.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB: SLA & Latency */}
                        <TabsContent value="sla" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>API Response Latency (P95)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[200px] flex items-end justify-between gap-2 px-4 py-2 border-b">
                                            {[45, 60, 55, 120, 80, 50, 48, 52, 45, 60, 40, 38].map((h, i) => (
                                                <div key={i} className="w-full bg-blue-500/20 hover:bg-blue-500/40 rounded-t-sm relative group" style={{ height: `${(h / 120) * 100}%` }}>
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow hidden group-hover:block">
                                                        {h}ms
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                            <span>00:00</span>
                                            <span>06:00</span>
                                            <span>12:00</span>
                                            <span>18:00</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Pipeline SLA Adherence</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { name: "Gold Tier Pipelines", value: 99.9, target: 99.9 },
                                                { name: "Silver Tier Pipelines", value: 98.5, target: 99.0 },
                                                { name: "Bronze Tier Pipelines", value: 99.5, target: 95.0 },
                                            ].map((tier, i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium">{tier.name}</span>
                                                        <span className={tier.value >= tier.target ? "text-emerald-500" : "text-amber-500"}>{tier.value}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                        <div className={`h-full ${tier.value >= tier.target ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${tier.value}%` }}></div>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Target: {tier.target}%</div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* TAB: Catalog Coverage */}
                        <TabsContent value="coverage" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Governance Coverage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                        <div className="space-y-2">
                                            <div className="mx-auto h-24 w-24 rounded-full border-4 border-emerald-500 flex items-center justify-center text-2xl font-bold">
                                                85%
                                            </div>
                                            <p className="font-medium">Documented Datasets</p>
                                            <p className="text-xs text-muted-foreground">308 / 362 Datasets</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="mx-auto h-24 w-24 rounded-full border-4 border-blue-500 flex items-center justify-center text-2xl font-bold">
                                                92%
                                            </div>
                                            <p className="font-medium">Owner Assigned</p>
                                            <p className="text-xs text-muted-foreground">333 / 362 Datasets</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="mx-auto h-24 w-24 rounded-full border-4 border-amber-500 flex items-center justify-center text-2xl font-bold">
                                                64%
                                            </div>
                                            <p className="font-medium">PII Tagged</p>
                                            <p className="text-xs text-muted-foreground">Requires Audit</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </motion.div>

            </motion.div>
        </div>
    );
}
