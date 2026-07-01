"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { GuestRoute } from '@/utils/route-guards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertCircle, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoUserSelect = (demoEmail: string) => {
    clearError();
    setEmail(demoEmail);
    setPassword('password123'); // Demo fallback password
  };

  return (
    <GuestRoute>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Logo / Title banner */}
          <div className="flex flex-col items-center gap-2 text-center select-none">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              AUMS Portal
            </h1>
            <p className="text-xs text-zinc-450 dark:text-zinc-500">
              Autonomous Management System Console
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-md border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Sign In</CardTitle>
              <CardDescription>Enter credentials to access academic dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 text-xs">
                    <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@aums.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-4 border-none mt-2 w-full"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Demo Login selector */}
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 shadow-xs">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-center">
              Quick Select Demo Profile
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoUserSelect('admin@aums.edu')}
                className="h-8 text-xs font-semibold"
              >
                Super Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoUserSelect('smith@aums.edu')}
                className="h-8 text-xs font-semibold"
              >
                Faculty
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoUserSelect('doe@aums.edu')}
                className="h-8 text-xs font-semibold"
              >
                Student
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoUserSelect('parent.doe@aums.edu')}
                className="h-8 text-xs font-semibold"
              >
                Parent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GuestRoute>
  );
}
