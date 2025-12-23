
import { motion } from "framer-motion";
import {
    CheckSquare,
    Clock,
    FileText,
    Shield,
    ThumbsUp,
    ThumbsDown,
    Edit,
    Check,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function Approvals() {
    return (
        <div className="space-y-8">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Approvals Inbox</h1>
                    <p className="text-muted-foreground">
                        Review and approve recommendations from IntelliStream
                    </p>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold mb-2">8</div>
                                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold mb-2 text-emerald-500">42</div>
                                <p className="text-sm text-muted-foreground">Approved This Week</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold mb-2 text-amber-500">3</div>
                                <p className="text-sm text-muted-foreground">High Priority</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold mb-2">98%</div>
                                <p className="text-sm text-muted-foreground">Approval Rate</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Approval Items */}
                <div className="space-y-6">
                    {/* Item 1 */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-border/50 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">Dataset Description</Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                1 day ago
                                            </span>
                                            <Badge variant="outline" className="bg-black text-white hover:bg-black border-transparent dark:bg-white dark:text-black">Low Impact</Badge>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                AI-generated description for analytics.revenue_dashboard
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Dataset: <span className="font-medium text-foreground">analytics.revenue_dashboard</span>
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What Changed</h4>
                                                <p className="text-sm">Add comprehensive documentation</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Why IntelliStream Recommends It</h4>
                                                <p className="text-sm">IntelliStream analyzed usage patterns and data lineage to generate accurate documentation</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 pt-2">
                                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                                                <Check className="h-4 w-4" /> Approve
                                            </Button>
                                            <Button variant="outline" className="gap-2">
                                                <Edit className="h-4 w-4" /> Edit & Approve
                                            </Button>
                                            <Button variant="outline" className="gap-2 text-muted-foreground hover:text-destructive">
                                                <ThumbsDown className="h-4 w-4" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Item 2 */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-border/50 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">PII Classification</Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                2 days ago
                                            </span>
                                            <Badge variant="destructive" className="hover:bg-destructive">High Impact</Badge>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                Mark ssn column as PII in customers.personal_info
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Dataset: <span className="font-medium text-foreground">customers.personal_info</span>
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What Changed</h4>
                                                <p className="text-sm">Apply PII classification tag</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Why IntelliStream Recommends It</h4>
                                                <p className="text-sm">IntelliStream detected Social Security Numbers based on data patterns and column naming</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 pt-2">
                                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                                                <Check className="h-4 w-4" /> Approve
                                            </Button>
                                            <Button variant="outline" className="gap-2">
                                                <Edit className="h-4 w-4" /> Edit & Approve
                                            </Button>
                                            <Button variant="outline" className="gap-2 text-muted-foreground hover:text-destructive">
                                                <ThumbsDown className="h-4 w-4" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
