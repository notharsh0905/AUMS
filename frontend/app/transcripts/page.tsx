"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer } from '@/components/layouts/page-container';
import { TranscriptView } from '@/features/transcripts';
import { ProtectedRoute } from '@/utils/route-guards';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, ArrowRight, GraduationCap } from 'lucide-react';

interface StudentOption {
  studentProfileId: string;
  fullName: string;
  rollNumber: string;
  email: string;
  program: string;
}

interface RawStudent {
  student_profile_id: string;
  first_name: string;
  last_name: string;
  roll_number: string;
  email: string;
  program: string;
}

function TranscriptPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected student profile ID to view transcript
  const [studentId, setStudentId] = useState<string | null>(null);
  
  // List of students for selection (Admins only)
  const [studentsList, setStudentsList] = useState<StudentOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [resolvingStudent, setResolvingStudent] = useState(true);

  // Read studentId from query parameters if present
  const paramStudentId = searchParams.get('studentId');

  // Determine user role and resolve appropriate student ID
  useEffect(() => {
    if (!user) return;

    const isAdmin = user.roles.includes('SUPER_ADMIN') || user.roles.includes('ADMIN');

    if (!isAdmin) {
      // User is a student, look up their profile matching their user email
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResolvingStudent(true);
      api.get<RawStudent[]>('/students')
        .then((res) => {
          const list = res.data || [];
          const self = list.find((s) => s.email.toLowerCase() === user.email.toLowerCase());
          if (self) {
            setStudentId(self.student_profile_id);
          } else {
            console.error('No matching student profile found for user:', user.email);
          }
        })
        .catch((e) => console.error('Error resolving student profile:', e))
        .finally(() => setResolvingStudent(false));
    } else {
      // User is an admin, see if they passed a studentId in URL
      if (paramStudentId) {
        setStudentId(paramStudentId);
        setResolvingStudent(false);
      } else {
        setStudentId(null);
        setResolvingStudent(false);
        // Pre-fetch students list for selection
        setIsLoadingStudents(true);
        api.get<RawStudent[]>('/students')
          .then((res) => {
            const list = res.data || [];
            setStudentsList(
              list.map((s) => ({
                studentProfileId: s.student_profile_id,
                fullName: `${s.first_name} ${s.last_name}`,
                rollNumber: s.roll_number,
                email: s.email,
                program: s.program || 'N/A',
              }))
            );
          })
          .catch((e) => console.error('Error loading students list:', e))
          .finally(() => setIsLoadingStudents(false));
      }
    }
  }, [user, paramStudentId]);

  const handleSelectStudent = (id: string) => {
    setStudentId(id);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('studentId', id);
    router.push(`?${newParams.toString()}`);
  };

  const handleClearSelection = () => {
    setStudentId(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('studentId');
    router.push(`?${newParams.toString()}`);
  };

  // Filter students based on search string
  const filteredStudents = studentsList.filter((s) =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdmin = user?.roles.includes('SUPER_ADMIN') || user?.roles.includes('ADMIN');

  if (resolvingStudent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-650" />
        <p className="text-sm text-zinc-500 font-medium">Resolving student credentials...</p>
      </div>
    );
  }

  // If a student profile is resolved or selected, render the transcript
  if (studentId) {
    return (
      <div className="w-full flex flex-col gap-4">
        {isAdmin && (
          <div className="px-4 md:px-6 max-w-7xl mx-auto w-full print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="text-zinc-600 hover:text-zinc-950 dark:hover:text-zinc-50 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs flex items-center gap-1.5"
            >
              ← Back to Student Search
            </Button>
          </div>
        )}
        <TranscriptView studentId={studentId} />
      </div>
    );
  }

  // Otherwise, if admin, show student selection search page
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4">
      <Card className="border-zinc-200 dark:border-zinc-850 shadow-md bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="text-center pb-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="mx-auto h-12 w-12 rounded-xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center mb-3">
            <GraduationCap className="h-6 w-6 text-white dark:text-zinc-950" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">Academic Records Search</CardTitle>
          <CardDescription>
            Search student roll number, name, or program to pull their official transcript.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Search Inputs */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-zinc-950 text-sm text-zinc-900 dark:text-zinc-550"
            />
          </div>

          {/* Search Results List */}
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
            {isLoadingStudents ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-450" />
                <span className="text-xs text-zinc-400">Loading student directory...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-10 text-zinc-450 text-xs font-semibold">
                No matching student records found.
              </div>
            ) : (
              filteredStudents.map((s) => (
                <button
                  key={s.studentProfileId}
                  onClick={() => handleSelectStudent(s.studentProfileId)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                      {s.fullName.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {s.fullName}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                        {s.rollNumber} • {s.program}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">View Transcript</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TranscriptsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-650" />
            </div>
          }>
            <TranscriptPageContent />
          </Suspense>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
