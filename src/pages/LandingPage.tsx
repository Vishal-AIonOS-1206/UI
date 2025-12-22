
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Shield, Brain, Zap, CheckCircle2, BarChart3, Database } from 'lucide-react';
import ParticlesBackground from "@/components/ui/ParticlesBackground";

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Activity,
            title: "Reliability",
            description: "Automated incident detection, smart retry logic, and proactive monitoring.",
            gradient: "from-blue-500/20 to-cyan-500/20",
            textGradient: "text-blue-400"
        },
        {
            icon: Shield,
            title: "Governance & Trust",
            description: "Trust scoring, policy enforcement, and governance workflows.",
            gradient: "from-emerald-500/20 to-teal-500/20",
            textGradient: "text-emerald-400"
        },
        {
            icon: Brain,
            title: "Explainability",
            description: "Model interpretability, feature attribution, and scenario testing.",
            gradient: "from-purple-500/20 to-pink-500/20",
            textGradient: "text-purple-400"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 dark">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Particles */}
            <ParticlesBackground />

            {/* Navbar */}
            <nav className="relative z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">IntelliStream</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="hidden md:flex" onClick={() => navigate('/login')}>
                            Log in
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-6"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10">
                <section className="pt-24 pb-32 px-6">
                    <div className="container mx-auto text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-bounce-in">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-medium text-muted-foreground">The Future of Data Operations</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
                            Agentic Data & AI <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Operations Platform</span>
                        </h1>

                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                            Unified platform for reliable data pipelines, trustworthy AI governance, and explainable machine learning outcomes at enterprise scale.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto h-12 px-8 text-base rounded-full bg-white text-black hover:bg-white/90 shadow-xl shadow-white/10 transition-transform hover:scale-105"
                                onClick={() => navigate('/signup')}
                            >
                                Get Started Now
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto h-12 px-8 text-base rounded-full border-white/10 hover:bg-white/5 backdrop-blur-sm"
                            >
                                View Documentation
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 bg-black/20 text-center relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <h2 className="text-3xl font-bold mb-16">Why IntelliStream?</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-primary/20 transition-all duration-300 hover:translate-y-[-4px]"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.textGradient}`}>
                                            <feature.icon className="w-6 h-6" />
                                        </div>

                                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Analytics Section */}
                <section className="py-32 px-6 relative">
                    <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="relative z-10 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-2xl">
                                {/* Mock Chart UI */}
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h4 className="text-lg font-semibold">Pipeline Performance</h4>
                                        <p className="text-sm text-muted-foreground">Real-time throughput metrics</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="w-24 h-8 rounded bg-white/5" />
                                        <span className="w-8 h-8 rounded bg-primary/20" />
                                    </div>
                                </div>
                                <div className="h-[200px] w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/10 flex items-end justify-between p-4 gap-2">
                                    {[40, 60, 45, 78, 55, 90, 65, 80].map((h, i) => (
                                        <div key={i} className="w-full bg-primary/40 rounded-t" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    {[
                                        { label: "Success Rate", val: "99.9%", color: "text-emerald-400" },
                                        { label: "Latency", val: "45ms", color: "text-blue-400" },
                                        { label: "Throughput", val: "12TB", color: "text-purple-400" }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/5">
                                            <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                                            <div className={`text-xl font-bold ${stat.color}`}>{stat.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-[60px]" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-[60px]" />
                        </div>

                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Complete Visibility into Your Data Stack
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Gain actionable insights with our advanced cockpit. Monitor pipelines, track lineage, and ensure compliance with automated governance checks.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    "Real-time pipeline monitoring and alerting",
                                    "Automated data quality and schema validation",
                                    "End-to-end lineage visualization",
                                    "Role-based access control and audit logs"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 text-center">
                    <div className="container mx-auto max-w-3xl">
                        <div className="p-1 rounded-2xl bg-gradient-to-r from-primary via-emerald-500 to-primary">
                            <div className="rounded-xl bg-background p-12 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

                                <div className="relative z-10">
                                    <h2 className="text-3xl font-bold mb-4">Ready to Modernize Your Operations?</h2>
                                    <p className="text-muted-foreground mb-8 text-lg">
                                        Join leading enterprises using IntelliStream to drive value from their data.
                                    </p>
                                    <Button
                                        size="lg"
                                        className="h-12 px-8 rounded-full bg-white text-black hover:bg-white/90 shadow-xl shadow-white/10"
                                        onClick={() => navigate('/signup')}
                                    >
                                        Start Your Free Trial
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 bg-black/20">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                            <Zap className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-semibold tracking-tight">IntelliStream</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © 2024 IntelliStream Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
