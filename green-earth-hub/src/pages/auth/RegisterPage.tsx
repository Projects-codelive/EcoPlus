
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNo: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            login(data.user);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
            {/* Back Link */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft size={20} strokeWidth={2.5} />
                <span className="font-medium">Back</span>
            </Link>

            {/* Logo */}
            <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                    <Leaf size={32} strokeWidth={2.5} className="text-lime" />
                </div>
            </div>

            {/* Register Card */}
            <div className="lisboa-card w-full max-w-sm">
                <h1 className="text-2xl font-bold text-foreground text-center mb-2">
                    Join Green Earth Hub
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                    Start your sustainable lifestyle today
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-foreground font-semibold">
                            Full Name
                        </Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Ex: John Doe"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            className="h-14 rounded-2xl border-2 border-primary/20 bg-cream text-foreground text-lg font-medium placeholder:text-muted-foreground focus:border-primary"
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-2">
                        <Label htmlFor="mobileNo" className="text-foreground font-semibold">
                            Mobile Number
                        </Label>
                        <Input
                            id="mobileNo"
                            name="mobileNo"
                            type="tel"
                            placeholder="Ex: 9876543210"
                            required
                            value={formData.mobileNo}
                            onChange={handleChange}
                            className="h-14 rounded-2xl border-2 border-primary/20 bg-cream text-foreground text-lg font-medium placeholder:text-muted-foreground focus:border-primary"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground font-semibold">
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="h-14 rounded-2xl border-2 border-primary/20 bg-cream text-foreground text-lg font-medium placeholder:text-muted-foreground focus:border-primary"
                        />
                    </div>

                    {/* Register Button */}
                    <Button
                        type="submit"
                        className="btn-jungle w-full text-lg h-14 rounded-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </Button>
                </form>

                {/* Help Text */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-coral font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
