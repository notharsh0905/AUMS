"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, Calendar, CheckCircle2, FileText, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface StudentWard {
  id: string;
  name: string;
  rollNumber: string;
  program: string;
  semester: string;
  cgpa: string;
  attendancePercent: number;
  recentGrade: string;
  pendingAssignments: number;
  examRegistrationStatus: 'REGISTERED' | 'PENDING';
}

const WARDS: StudentWard[] = [
  {
    id: 'student-1',
    name: 'Jane Doe',
    rollNumber: '2026CS101',
    program: 'B.Tech Computer Science and Engineering',
    semester: 'Semester 2',
    cgpa: '3.85 / 4.00',
    attendancePercent: 94,
    recentGrade: 'A+ (Database Systems)',
    pendingAssignments: 1,
    examRegistrationStatus: 'REGISTERED',
  },
  {
    id: 'student-2',
    name: 'Alex Doe',
    rollNumber: '2026ME102',
    program: 'B.Tech Mechanical Engineering',
    semester: 'Semester 1',
    cgpa: '3.70 / 4.00',
    attendancePercent: 88,
    recentGrade: 'A (Engineering Mechanics)',
    pendingAssignments: 2,
    examRegistrationStatus: 'REGISTERED',
  },
];

export function ParentDashboard() {
  const [selectedWardIndex, setSelectedWardIndex] = useState(0);
  const ward = WARDS[selectedWardIndex];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Ward Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 flex items-center justify-center font-bold">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Student Ward Overview</h2>
            <p className="text-xs text-zinc-500">Select child profile to monitor academic standing and attendance.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {WARDS.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => setSelectedWardIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedWardIndex === idx
                  ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {w.name} ({w.rollNumber})
            </button>
          ))}
        </div>
      </div>

      {/* Ward Telemetry KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Attendance</span>
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {ward.attendancePercent}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Consistent attendance (Good standing)
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current CGPA</span>
              <GraduationCap className="h-4 w-4 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {ward.cgpa}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-zinc-500 font-medium">Top 5% in department cohort</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Term</span>
              <Calendar className="h-4 w-4 text-zinc-400" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {ward.semester}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-zinc-500 font-medium">{ward.program}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Exam Hall Ticket</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {ward.examRegistrationStatus}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-zinc-500 font-medium">Eligible for end-semester exams</span>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Details Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Academic Milestones</CardTitle>
            <CardDescription>Latest marks publications and performance summaries.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-zinc-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Latest Evaluation</span>
                  <span className="text-xs text-zinc-500">{ward.recentGrade}</span>
                </div>
              </div>
              <Link href="/course-results">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <span>View Grades</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-zinc-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Official Transcript</span>
                  <span className="text-xs text-zinc-500">Download verified cumulative record</span>
                </div>
              </div>
              <Link href="/transcripts">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <span>Open</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Institutional Notices & Attendance</CardTitle>
            <CardDescription>Live notifications regarding timetable and lecture updates.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-850 flex flex-col gap-1 text-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-50">Mid-Term Examination Schedule</span>
              <p className="text-zinc-500">Hall tickets have been issued and verified for upcoming term examinations.</p>
            </div>
            <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-850 flex flex-col gap-1 text-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-50">Attendance Threshold Met</span>
              <p className="text-zinc-500">Ward maintains required &gt;75% minimum semester attendance quota.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
