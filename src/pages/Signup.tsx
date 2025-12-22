
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Lock, Mail, ArrowRight, Loader2, User, Building2 } from 'lucide-react';
import { useAppStore } from "@/store/useAppStore";

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { setRole } = useAppStore();

    // Mock signup handler
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Role will be set during onboarding or default to something basic here if needed
            // setRole('admin'); 
            navigate('/onboarding');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <Card className="w-full max-w-lg relative z-10 border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                <CardHeader className="space-y-1 text-center pb-2">
                    <div className="flex justify-center mb-2">
                        <Link to="/">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                        </Link>
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900">
                        Create an Account
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-base">
                        Join other enterprises optimizing their data operations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="firstName" className="text-slate-700 text-base">First name</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="firstName"
                                        placeholder="Jane"
                                        className="pl-10 h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="lastName" className="text-slate-700 text-base">Last name</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        className="pl-10 h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="company" className="text-slate-700 text-base">Company</Label>
                            <div className="relative group">
                                <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="company"
                                    placeholder="Acme Inc."
                                    className="pl-10 h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="role" className="text-slate-700 text-base">Primary Role</Label>
                            <Select>
                                <SelectTrigger id="role" className="pl-3 h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 transition-all duration-300">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="data-engineering">Data Engineering</SelectItem>
                                    <SelectItem value="data-science">Data Science</SelectItem>
                                    <SelectItem value="analytics">Analytics</SelectItem>
                                    <SelectItem value="governance">Governance & Compliance</SelectItem>
                                    <SelectItem value="platform-management">Platform Management</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-slate-700 text-base">Work Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="pl-10 h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-slate-700 text-base">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    className="pl-10 h-11 text-base bg-white border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                                    required
                                    minLength={8}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500">Must be at least 8 characters long</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-medium px-8 mt-1 rounded-lg bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                    <p className="text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
