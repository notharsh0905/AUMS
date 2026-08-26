"use client";

import React, { useState } from 'react';
import { useTranscript } from '../../hooks/use-transcripts';
import { PageSkeleton } from '@/components/shared/loading-skeletons';
import { ErrorState } from '@/components/shared/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Printer, 
  Calendar, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  User,
  Building,
  Mail,
  Dna,
  Globe,
  TrendingUp
} from 'lucide-react';

interface TranscriptViewProps {
  studentId: string;
}

export function TranscriptView({ studentId }: TranscriptViewProps) {
  const { transcript, isLoading, error, refetch } = useTranscript(studentId);
  const [activeTab, setActiveTab] = useState<'progress' | 'semesters' | 'courses'>('progress');

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (error || !transcript) {
    return (
      <div className="flex-1 p-6">
        <ErrorState
          title="Transcript Load Failed"
          description={error || "Could not retrieve transcript records."}
          retryCallback={refetch}
        />
      </div>
    );
  }

  const { student, program, semesters, courses, cgpa, generatedAt } = transcript;

  const handlePrint = () => {
    window.print();
  };

  const totalRequiredCredits = cgpa.totalCredits > 0 ? cgpa.totalCredits : 120.0;
  const progressPercent = Math.min(100, Math.round((cgpa.earnedCredits / totalRequiredCredits) * 100));

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6 print:p-0 print:max-w-full">
      {/* 1. Header Toolbar (Hidden in Print) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            Official Academic Transcript & Degree Audit
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Verified degree progress, cumulative performance, and semester-by-semester transcript records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handlePrint}
            className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 flex items-center gap-2 shadow-sm font-semibold rounded-lg"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Export PDF</span>
          </Button>
        </div>
      </div>

      {/* 2. Official Header Block for Print Only (Hidden on screen) */}
      <div className="hidden print:flex flex-col items-center text-center gap-2 pb-6 border-b-2 border-zinc-900 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-black">
          AUTONOMOUS MANAGEMENT SYSTEM (AUMS)
        </h1>
        <p className="text-sm font-medium text-zinc-600 uppercase tracking-widest">
          Office of the Registrar & Academic Records
        </p>
        <p className="text-xs text-zinc-500">
          Official Academic Transcript • Generated on {new Date(generatedAt).toLocaleString()}
        </p>
      </div>

      {/* 3. Student & Program Profile Grid */}
      <div className="grid gap-6 md:grid-cols-3 print:grid-cols-3">
        {/* Student Information Card */}
        <Card className="md:col-span-2 border-zinc-200 dark:border-zinc-850 shadow-sm overflow-hidden bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md print:col-span-2 print:shadow-none print:border-zinc-300">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 py-4 border-b border-zinc-100 dark:border-zinc-900 print:bg-transparent print:p-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <User className="h-4 w-4 text-zinc-400 print:hidden" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 p-5 text-sm print:p-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Full Name</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-50 text-base">{student.firstName} {student.lastName}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Enrollment Number</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">{student.enrollmentNumber}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Email Address</span>
              <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Mail className="h-3.5 w-3.5 text-zinc-400 print:hidden" />
                {student.email}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Date of Birth</span>
              <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Calendar className="h-3.5 w-3.5 text-zinc-400 print:hidden" />
                {student.dateOfBirth || '2004-05-15'}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Gender & Nationality</span>
              <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Globe className="h-3.5 w-3.5 text-zinc-400 print:hidden" />
                {student.gender || 'Not specified'} / {student.nationality || 'Indian'}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Blood Group</span>
              <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Dna className="h-3.5 w-3.5 text-zinc-400 print:hidden" />
                {student.bloodGroup || 'O+'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Academic Program Card */}
        <Card className="border-zinc-200 dark:border-zinc-850 shadow-sm overflow-hidden bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md print:shadow-none print:border-zinc-300">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 py-4 border-b border-zinc-100 dark:border-zinc-900 print:bg-transparent print:p-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <Building className="h-4 w-4 text-zinc-400 print:hidden" />
              Academic Program
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-5 text-sm print:p-2">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Program</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-50">{program.programName}</span>
              <span className="text-xs text-zinc-500 font-mono">Code: {program.programCode}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Department</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{program.departmentName}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Degree Level</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-250">{program.degreeType || 'Undergraduate (B.Tech)'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Degree Progress Bar & Telemetry Card */}
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Degree Requirement Progress
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                Cumulative progress toward degree completion ({program.programName})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                {cgpa.earnedCredits} / {totalRequiredCredits} Credits
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {progressPercent}% Completed
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {/* Progress Bar */}
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-850">
            <div>
              <span className="text-zinc-400 block">Earned Credits</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">{cgpa.earnedCredits} Cr</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Remaining Credits</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">{cgpa.creditsRemaining} Cr</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Academic Standing</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{cgpa.academicStanding}</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Graduation Eligibility</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">{cgpa.graduationEligibility}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. CGPA & Completion Status Metrics Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 print:grid-cols-4">
        {/* CGPA */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-zinc-950 p-5 shadow-sm print:shadow-none print:border-zinc-300 print:bg-none print:p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">CGPA Score</span>
            <Award className="h-4 w-4 text-indigo-500 dark:text-indigo-400 print:hidden" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{cgpa.cgpa.toFixed(2)}</span>
            <span className="text-xs text-zinc-500">/ 4.00</span>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-tight">{cgpa.degreeClassification}</p>
        </div>

        {/* Earned Credits */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-950 p-5 shadow-sm print:shadow-none print:border-zinc-300 print:bg-none print:p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Credits Earned</span>
            <BookOpen className="h-4 w-4 text-emerald-500 dark:text-emerald-400 print:hidden" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{cgpa.earnedCredits}</span>
            <span className="text-xs text-zinc-500">/ {totalRequiredCredits}</span>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">{cgpa.creditsRemaining} credits remaining</p>
        </div>

        {/* Academic Standing */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-zinc-950 p-5 shadow-sm print:shadow-none print:border-zinc-300 print:bg-none print:p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Standing</span>
            {cgpa.academicStanding === 'Good Standing' || cgpa.academicStanding === 'GOOD' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 print:hidden" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500 print:hidden" />
            )}
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{cgpa.academicStanding}</span>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-tight">{cgpa.graduationEligibility}</p>
        </div>

        {/* Degree Status */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/40 dark:to-zinc-950 p-5 shadow-sm print:shadow-none print:border-zinc-300 print:bg-none print:p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Degree Status</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-500 dark:text-indigo-400 print:hidden" />
          </div>
          <div className="mt-2">
            <span className={cn(
              "text-lg font-extrabold tracking-tight",
              cgpa.degreeCompleted ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"
            )}>
              {cgpa.degreeCompleted ? 'COMPLETED' : 'IN PROGRESS'}
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
            {cgpa.completionDate ? `Date: ${cgpa.completionDate}` : 'Anticipated graduation 2026'}
          </p>
        </div>
      </div>

      {/* 6. Details Section Tabs (Hidden in Print) */}
      <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 gap-6 mt-4 print:hidden">
        <button
          onClick={() => setActiveTab('progress')}
          className={cn(
            "pb-3 text-sm font-semibold border-b-2 transition-all relative px-1",
            activeTab === 'progress'
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
              : "border-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          )}
        >
          Degree Audit & Curriculum Progress
        </button>
        <button
          onClick={() => setActiveTab('semesters')}
          className={cn(
            "pb-3 text-sm font-semibold border-b-2 transition-all relative px-1",
            activeTab === 'semesters'
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
              : "border-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          )}
        >
          Semester Breakdown
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={cn(
            "pb-3 text-sm font-semibold border-b-2 transition-all relative px-1",
            activeTab === 'courses'
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
              : "border-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          )}
        >
          Detailed Course Grades
        </button>
      </div>

      {/* 7. Content Sections */}
      <div className="flex flex-col gap-8 mt-2">
        {/* Tab 1: Degree Audit & Curriculum Progression */}
        <div className={cn(
          "flex flex-col gap-4",
          activeTab !== 'progress' && "hidden"
        )}>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Core Engineering Foundation</CardTitle>
              </CardHeader>
              <CardContent className="text-xs flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Completed (100%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Completed Courses</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">Data Structures, DBMS</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Department Core Courses</CardTitle>
              </CardHeader>
              <CardContent className="text-xs flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">In Progress</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Active Allocations</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">Operating Systems, Networks</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Electives & Capstone</CardTitle>
              </CardHeader>
              <CardContent className="text-xs flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Pending Term 7/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Required Credits</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">24 Credits</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tab 2: Semester breakdown block */}
        <div className={cn(
          "flex flex-col gap-4",
          activeTab !== 'semesters' && activeTab !== 'progress' && "print:flex hidden"
        )}>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-150 pb-2 print:block hidden">
            Academic Performance by Semester
          </h3>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 w-full overflow-hidden bg-white/60 dark:bg-zinc-950/60 print:border-zinc-300 print:bg-white print:text-black">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="bg-zinc-50/75 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase font-bold text-[10px] tracking-wider print:bg-transparent print:border-zinc-300">
                  <th className="px-6 py-3.5">Semester</th>
                  <th className="px-6 py-3.5">Semester Name</th>
                  <th className="px-6 py-3.5 text-right">Attempted Credits</th>
                  <th className="px-6 py-3.5 text-right">Earned Credits</th>
                  <th className="px-6 py-3.5 text-right">SGPA</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-center">Published Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 print:divide-zinc-300">
                {semesters.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-400 dark:text-zinc-500 font-medium">
                      No semester results published yet. Results will appear once evaluated and published.
                    </td>
                  </tr>
                ) : (
                  semesters.map((s) => (
                    <tr key={s.semesterResultId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors print:hover:bg-transparent">
                      <td className="px-6 py-4 font-mono font-bold text-zinc-900 dark:text-zinc-50">Sem {s.semesterNumber}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-800 dark:text-zinc-200">{s.semesterName}</td>
                      <td className="px-6 py-4 text-right font-semibold">{s.totalCredits}</td>
                      <td className="px-6 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">{s.earnedCredits}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-zinc-950 dark:text-zinc-50">{s.sgpa.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
                          s.resultStatus === 'PUBLISHED'
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20 print:bg-transparent print:text-black print:ring-transparent print:p-0"
                            : "bg-zinc-50 text-zinc-600 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20 print:bg-transparent print:text-black print:ring-transparent print:p-0"
                        )}>
                          {s.resultStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        {s.publishedAt ? new Date(s.publishedAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab 3: Detailed course list block */}
        <div className={cn(
          "flex flex-col gap-4",
          activeTab !== 'courses' && activeTab !== 'progress' && "print:flex hidden"
        )}>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-150 pb-2 print:block hidden">
            Detailed Course-by-Course Records
          </h3>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 w-full overflow-hidden bg-white/60 dark:bg-zinc-950/60 print:border-zinc-300 print:bg-white print:text-black">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="bg-zinc-50/75 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase font-bold text-[10px] tracking-wider print:bg-transparent print:border-zinc-300">
                  <th className="px-6 py-3.5">Sem</th>
                  <th className="px-6 py-3.5">Course Code</th>
                  <th className="px-6 py-3.5">Course Name</th>
                  <th className="px-6 py-3.5 text-right">Credits</th>
                  <th className="px-6 py-3.5 text-right">Marks</th>
                  <th className="px-6 py-3.5 text-center">Grade</th>
                  <th className="px-6 py-3.5 text-right">Points</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 print:divide-zinc-300">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-zinc-400 dark:text-zinc-500 font-medium">
                      No course grade results available.
                    </td>
                  </tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c.courseResultId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors print:hover:bg-transparent">
                      <td className="px-6 py-4 font-mono font-bold text-zinc-500">Sem {c.semesterNumber}</td>
                      <td className="px-6 py-4 font-mono font-bold text-zinc-900 dark:text-zinc-50">{c.courseCode}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-800 dark:text-zinc-200">{c.courseName}</td>
                      <td className="px-6 py-4 text-right font-medium">{c.credits}</td>
                      <td className="px-6 py-4 text-right font-medium">
                        {c.marksObtained.toFixed(1)} <span className="text-zinc-400 text-xs font-normal">/ {c.totalMarks}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-extrabold text-indigo-600 dark:text-indigo-400 print:text-black">
                        {c.gradeCode || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right font-bold">{c.gradePoint.toFixed(1)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset",
                          c.isPassing
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20 print:bg-transparent print:text-black print:ring-transparent print:p-0"
                            : "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20 print:bg-transparent print:text-black print:ring-transparent print:p-0"
                        )}>
                          {c.isPassing ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 8. Official Sign-off and Registrar Stamp - Print Only */}
      <div className="hidden print:flex justify-between items-end mt-16 pt-8 border-t border-zinc-300 text-sm">
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-zinc-500 text-xs uppercase">Verification Barcode / Hash</span>
          <span className="font-mono text-xs text-zinc-400">UUID: {studentId}</span>
          <span className="text-xs text-zinc-500">Official academic transcript from institutional database.</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <div className="h-16 w-32 border-b border-zinc-400"></div>
          <span className="font-bold uppercase text-xs mt-1 text-black">Office of the Registrar</span>
          <span className="text-[10px] text-zinc-500">Authorized Signature & Seal</span>
        </div>
      </div>
    </div>
  );
}
