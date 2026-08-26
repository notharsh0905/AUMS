"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ProtectedRoute } from '@/utils/route-guards';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Moon, Sun, Laptop, Key, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully');
    }, 600);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Settings & Preferences"
            description="Manage your account profile, credentials, visual interface appearance, and notifications."
          />
          <ContentArea>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-zinc-500" />
                    <CardTitle className="text-base">User Profile</CardTitle>
                  </div>
                  <CardDescription>Your registered account identity attributes in AUMS.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <div className="h-12 w-12 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-bold text-lg flex items-center justify-center">
                      {user?.firstName?.charAt(0) || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-xs text-zinc-500">@{user?.username}</span>
                      <span className="text-xs text-zinc-400">{user?.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex flex-col gap-1 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-850">
                      <span className="text-[11px] font-medium text-zinc-400">Assigned Role</span>
                      <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                        {user?.roles?.[0] || 'SUPER_ADMIN'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-850">
                      <span className="text-[11px] font-medium text-zinc-400">Account Status</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Active</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Theme & Appearance */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-zinc-500" />
                    <CardTitle className="text-base">Visual Appearance</CardTitle>
                  </div>
                  <CardDescription>Select your preferred theme palette for the AUMS portal.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                        theme === 'light'
                          ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800 font-bold'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <Sun className="h-5 w-5 text-amber-500" />
                      <span>Light</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                        theme === 'dark'
                          ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800 font-bold'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <Moon className="h-5 w-5 text-indigo-400" />
                      <span>Dark</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                        theme === 'system'
                          ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800 font-bold'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <Laptop className="h-5 w-5 text-zinc-500" />
                      <span>System</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Password Management */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-zinc-500" />
                    <CardTitle className="text-base">Security & Password</CardTitle>
                  </div>
                  <CardDescription>Update your credentials to safeguard your institutional account access.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4 max-w-lg">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="current_pwd">Current Password</Label>
                      <Input
                        id="current_pwd"
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="new_pwd">New Password</Label>
                        <Input
                          id="new_pwd"
                          type="password"
                          placeholder="Min. 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="confirm_pwd">Confirm New Password</Label>
                        <Input
                          id="confirm_pwd"
                          type="password"
                          placeholder="Repeat new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <Button type="submit" disabled={isSavingPassword}>
                        {isSavingPassword ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
