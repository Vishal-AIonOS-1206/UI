
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Zap, ArrowRight, Check, Box, Database, Server, Smartphone, HardDrive, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { useAppStore } from "@/store/useAppStore";

type Step = 'workspace' | 'platform' | 'setup' | 'discovery';

const Onboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<Step>('workspace');
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success'>('idle');
    const [discoveryProgress, setDiscoveryProgress] = useState(0);
    const [discoveryStats, setDiscoveryStats] = useState({ datasets: 0, pipelines: 0, issues: 0 });
    const { setRole } = useAppStore();

    const handleWorkspaceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentStep('platform');
    };

    const handlePlatformSelect = (platformId: string) => {
        setSelectedPlatform(platformId);
        setCurrentStep('setup');
    };

    const handleConnect = async () => {
        setIsConnecting(true);
        // Simulate connection check
        setTimeout(() => {
            setIsConnecting(false);
            setConnectionStatus('success');

            // Allow user to see success state briefly before redirecting or separate button
        }, 1500);
    };

    const handleFinish = () => {
        // Start discovery simulation
        setCurrentStep('discovery');

        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            setDiscoveryProgress(progress);

            // Simulate changing stats
            if (progress > 20) setDiscoveryStats(prev => ({ ...prev, datasets: Math.min(66, prev.datasets + 2) }));
            if (progress > 40) setDiscoveryStats(prev => ({ ...prev, pipelines: Math.min(49, prev.pipelines + 1) }));
            if (progress > 60) setDiscoveryStats(prev => ({ ...prev, issues: Math.min(8, prev.issues + 1) }));

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 80);
    };

    const handleDashboardNavigation = () => {
        setRole('admin');
        navigate('/dashboard');
    };

    const steps = [
        { id: 'workspace', label: 'Create Workspace' },
        { id: 'platform', label: 'Connect Platform' },
        { id: 'setup', label: 'Setup' },
    ];

    const getStepStatus = (stepId: string) => {
        const stepOrder = ['workspace', 'platform', 'setup'];
        const currentIndex = stepOrder.indexOf(currentStep);
        const stepIndex = stepOrder.indexOf(stepId);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    const DiscoveryItem = ({ label, isCompleted, isActive }: { label: string, isCompleted: boolean, isActive: boolean }) => (
        <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isCompleted ? 'bg-emerald-500 border-emerald-500' :
                isActive ? 'border-primary' : 'border-muted'
                }`}>
                {isCompleted ? <Check className="w-4 h-4 text-white" /> :
                    isActive ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> :
                        <div className="w-2 h-2 rounded-full bg-muted" />}
            </div>
            <span className={isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Logo */}
            <div className="mb-8 relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-3xl tracking-tight text-slate-900">IntelliStream</span>
            </div>

            {/* Stepper */}
            {currentStep !== 'discovery' && (
                <div className="mb-10 relative z-10 flex items-center gap-6 text-sm font-medium">
                    {steps.map((step, idx) => {
                        const status = getStepStatus(step.id);
                        return (
                            <div key={step.id} className="flex items-center gap-2">
                                {idx > 0 && <div className="w-8 h-[1px] bg-slate-200 mx-2" />}
                                <div className={`flex items-center gap-2 ${status === 'completed' ? 'text-emerald-600' :
                                    status === 'current' ? 'text-primary' :
                                        'text-slate-400'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-emerald-500' :
                                        status === 'current' ? 'bg-primary' :
                                            'bg-slate-300'
                                        }`} />
                                    {step.label}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Main Content */}
            <Card className="w-full max-w-2xl relative z-10 border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                <CardContent className="p-6">
                    {currentStep === 'workspace' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-slate-900">Create your workspace</h1>
                                <p className="text-slate-500 text-base">
                                    IntelliStream will automatically discover and monitor your data once connected.
                                </p>
                            </div>

                            <form onSubmit={handleWorkspaceSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="workspaceName" className="text-slate-700 text-base">Workspace Name</Label>
                                    <Input
                                        id="workspaceName"
                                        placeholder="e.g., Production Data Warehouse"
                                        className="h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 transition-all duration-300"
                                        required
                                    />
                                    <p className="text-xs text-slate-500">A descriptive name for your data environment</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-700 text-base">Environment</Label>
                                    <Select defaultValue="production">
                                        <SelectTrigger className="h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 transition-all duration-300">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200">
                                            <SelectItem value="production">Production</SelectItem>
                                            <SelectItem value="staging">Staging</SelectItem>
                                            <SelectItem value="development">Development</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button type="submit" className="w-full h-11 text-base bg-primary hover:bg-primary/90 mt-4">
                                    Connect your data platform <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    )}

                    {currentStep === 'platform' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-slate-900">Connect your data platform</h1>
                                <p className="text-slate-500 text-base">
                                    Select your primary data platform to begin automated discovery and monitoring
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'databricks', name: 'Databricks', desc: 'Lakehouse platform for data and AI', icon: Box, popular: true },
                                    { id: 'snowflake', name: 'Snowflake', desc: 'Cloud data warehouse', icon: Database, popular: true },
                                    { id: 'bigquery', name: 'BigQuery', desc: 'Google Cloud data warehouse', icon: Server },
                                    { id: 'fabric', name: 'Microsoft Fabric', desc: 'Unified analytics platform', icon: Box },
                                    { id: 's3', name: 'Object Storage', desc: 'S3, Azure Blob, GCS', icon: HardDrive },
                                ].map((platform) => (
                                    <div
                                        key={platform.id}
                                        className={`group relative p-4 rounded-xl border transition-all cursor-pointer bg-white hover:shadow-md ${selectedPlatform === platform.id ? 'border-primary ring-1 ring-primary/20 shadow-primary/5' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50/50'}`}
                                        onClick={() => handlePlatformSelect(platform.id)}
                                    >
                                        {platform.popular && (
                                            <div className="absolute top-3 right-3 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                                Popular
                                            </div>
                                        )}
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedPlatform === platform.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-primary'}`}>
                                                <platform.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold text-base ${selectedPlatform === platform.id ? 'text-primary' : 'text-slate-900'}`}>{platform.name}</h3>
                                                <p className="text-slate-500 mt-1 text-xs">{platform.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 'setup' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-slate-900">Connect to Databricks</h1>
                                <p className="text-slate-500 text-base">
                                    Provide your Databricks workspace credentials to enable automated discovery
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="url" className="text-slate-700 text-base">Workspace URL</Label>
                                    <Input
                                        id="url"
                                        placeholder="https://your-workspace.cloud.databricks.com"
                                        className="h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 transition-all duration-300"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="token" className="text-slate-700 text-base">Access Token</Label>
                                    <Input
                                        id="token"
                                        type="password"
                                        placeholder="dapi................"
                                        className="h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 transition-all duration-300"
                                    />
                                    <p className="text-xs text-slate-500">Generate a personal access token from your Databricks workspace settings</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-700 text-base">Catalogs to Include</Label>
                                    <Select defaultValue="all">
                                        <SelectTrigger className="h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 transition-all duration-300">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200">
                                            <SelectItem value="all">All Catalogs (Recommended)</SelectItem>
                                            <SelectItem value="specific">Specific Catalogs</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {connectionStatus === 'success' ? (
                                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-700">Connection successful</span>
                                        <Button size="sm" variant="ghost" className="ml-auto hover:bg-emerald-100/50 h-8 text-xs text-emerald-700 hover:text-emerald-800">Test Again</Button>
                                    </div>
                                ) : (
                                    <div className="flex justify-end">
                                        <Button variant="outline" className="text-primary hover:text-primary hover:bg-primary/5 h-8 text-xs border-primary/20" onClick={handleConnect} disabled={isConnecting}>
                                            {isConnecting ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                                            Test Connection
                                        </Button>
                                    </div>
                                )}

                                <Button
                                    className="w-full h-11 text-base bg-primary hover:bg-primary/90 mt-4"
                                    onClick={connectionStatus === 'success' ? handleFinish : handleConnect}
                                >
                                    {connectionStatus === 'success' ? 'Connect & Discover' : 'Connect & Discover'}
                                </Button>
                            </div>
                        </div>
                    )}
                    {currentStep === 'discovery' && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center py-8">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-slate-900">Discovering your data</h1>
                                <p className="text-slate-500">
                                    IntelliStream is automatically analyzing your data environment
                                </p>
                            </div>

                            <div className="space-y-4 max-w-sm mx-auto text-left pl-8">
                                <DiscoveryItem label="Discovering catalogs" isCompleted={discoveryProgress > 20} isActive={discoveryProgress <= 20} />
                                <DiscoveryItem label="Identifying datasets" isCompleted={discoveryProgress > 40} isActive={discoveryProgress > 20 && discoveryProgress <= 40} />
                                <DiscoveryItem label="Mapping pipelines" isCompleted={discoveryProgress > 60} isActive={discoveryProgress > 40 && discoveryProgress <= 60} />
                                <DiscoveryItem label="Profiling data" isCompleted={discoveryProgress > 80} isActive={discoveryProgress > 60 && discoveryProgress <= 80} />
                                <DiscoveryItem label="Building catalog" isCompleted={discoveryProgress >= 100} isActive={discoveryProgress > 80 && discoveryProgress < 100} />
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="text-3xl font-bold mb-1 text-slate-900">{discoveryStats.datasets}</div>
                                    <div className="text-xs text-slate-500">Datasets found</div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="text-3xl font-bold mb-1 text-slate-900">{discoveryStats.pipelines}</div>
                                    <div className="text-xs text-slate-500">Pipelines detected</div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="text-3xl font-bold mb-1 text-slate-900">{discoveryStats.issues}</div>
                                    <div className="text-xs text-slate-500">Issues identified</div>
                                </div>
                            </div>

                            <div className="pt-4 h-16">
                                {discoveryProgress >= 100 && (
                                    <Button
                                        className="w-full h-12 text-base bg-primary hover:bg-primary/90 animate-in fade-in slide-in-from-bottom-4"
                                        onClick={handleDashboardNavigation}
                                    >
                                        Go to dashboard
                                    </Button>
                                )}
                                {discoveryProgress < 100 && (
                                    <p className="text-sm text-slate-400 animate-pulse mt-4">Discovery will continue in the background</p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bottom Info Box */}
            <div className="mt-8 max-w-2xl w-full">
                {currentStep === 'workspace' && (
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">What's next?</span> After connecting your data platform,
                            IntelliStream will automatically discover datasets, map pipelines, and begin monitoring data quality—all without manual configuration.
                        </p>
                    </div>
                )}
                {(currentStep === 'platform' || currentStep === 'setup') && (
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-slate-400 mt-0.5" />
                        <p className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">Secure Connection:</span> IntelliStream uses read-only credentials and industry-standard
                            encryption to ensure your data remains secure.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
