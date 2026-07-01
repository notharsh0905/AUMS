"use client";

import React from 'react';
import Link from 'next/link';
import { useStudentDashboard } from '../hooks/use-student-dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  FileText,
  Clock,
  Award,
  FileDown,
  Info,
  AlertTriangle,
  AlertOctagon,
  User,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function StudentDashboard() {
  const { data, isLoading, error } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        {/* Profile and Stats skeletons */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="h-44 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
          <div className="h-44 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 md:col-span-2" />
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 h-96 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
          <div className="h-96 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-12 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl">
        <div className="text-center flex flex-col items-center gap-3">
          <AlertOctagon className="h-10 w-10 text-red-500" />
          <h3 className="font-semibold text-lg text-zinc-950 dark:text-zinc-50">Failed to load Student Dashboard</h3>
          <p className="text-sm text-zinc-500 max-w-md">{error || 'Unable to resolve student email matching.'}</p>
        </div>
      </div>
    );
  }

  const { profile, academics, attendance, schedule, assignments, exams, results, notifications } = data;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Hero Card with Profile & Academic Summary */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-900 dark:to-zinc-950/20">
          <CardContent className="pt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-white dark:text-zinc-950">
                <User className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 leading-tight">
                  {profile.fullName}
                </h3>
                <span className="text-xs text-zinc-500 font-mono mt-0.5">{profile.rollNumber}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-zinc-200/60 dark:border-zinc-800 pt-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span className="text-zinc-400">Program</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 text-right max-w-[150px] truncate">
                  {profile.programName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Batch Year</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">{profile.batch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Active Term</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">{profile.semester}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Indices Cards */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Academic Standing Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-medium">Cumulative CGPA</span>
                <span className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 leading-none mt-1">
                  {academics.cgpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">Scale 10.0</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-medium">Current SGPA</span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none mt-1">
                  {academics.sgpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">Last Term</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-medium">Earned Credits</span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none mt-1">
                  {academics.earnedCredits}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">/ {academics.totalCredits} Total</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-medium">Remaining Cr</span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none mt-1">
                  {academics.remainingCredits}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">Outstanding</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Quick Actions Banner */}
      <div className="flex flex-col gap-2.5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Quick Actions</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <Link href="/transcripts" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <Award className="h-4 w-4 text-zinc-500" />
            <span>View Transcript</span>
          </Link>
          <Link href="/exam-registrations" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <FileDown className="h-4 w-4 text-zinc-500" />
            <span>Hall Ticket</span>
          </Link>
          <Link href="/attendance" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <Clock className="h-4 w-4 text-zinc-500" />
            <span>View Attendance</span>
          </Link>
          <Link href="/timetable" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <span>View Timetable</span>
          </Link>
          <Link href="/assignments" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all col-span-2 sm:col-span-1">
            <FileText className="h-4 w-4 text-zinc-500" />
            <span>Assignments</span>
          </Link>
        </div>
      </div>

      {/* 3. Main Dashboard Layout grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Side (Today's Schedule & Assignments & Results) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Today's Schedule Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3.5">
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <span>Today&apos;s Classes</span>
                </CardTitle>
                <CardDescription>Scheduled slots for your registered courses</CardDescription>
              </div>
              <Link href="/timetable">
                <Button variant="ghost" size="sm" className="text-xs text-zinc-500 gap-1 h-8">
                  <span>Full Schedule</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {schedule.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {schedule.map((slot, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-850 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-all"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-800 dark:text-zinc-250 flex-shrink-0 text-xs font-bold font-mono">
                          {slot.courseCode}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 truncate">
                            {slot.courseName}
                          </span>
                          <span className="text-xs text-zinc-500">{slot.facultyName}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0 pl-3">
                        <span className="text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">
                          {slot.classroom} • {slot.entryType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-450 border border-dashed rounded-xl">
                  No classes scheduled for today.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Results Feed Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Award className="h-4 w-4 text-zinc-500" />
                <span>Recent Course Results</span>
              </CardTitle>
              <CardDescription>Latest published marks and grading summaries</CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-900">
                  {results.map((res, i) => (
                    <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-zinc-400 font-mono uppercase">
                          {res.courseCode}
                        </span>
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                          {res.courseName}
                        </span>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <div className="text-xs text-zinc-500 font-semibold">
                            {res.marksObtained} <span className="text-zinc-400">/ {res.totalMarks}</span>
                          </div>
                          <span className="text-[9px] uppercase font-bold text-zinc-400">
                            Percentage: {Math.round((res.marksObtained / res.totalMarks) * 100)}%
                          </span>
                        </div>

                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-1 text-xs font-bold tracking-wider ring-1 ring-inset uppercase",
                            res.isPass
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-650/10 dark:bg-emerald-950/20 dark:text-emerald-450"
                              : "bg-red-50 text-red-700 ring-red-650/10 dark:bg-red-950/20 dark:text-red-450"
                          )}
                        >
                          {res.gradeCode} ({res.isPass ? 'PASS' : 'FAIL'})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-450 border border-dashed rounded-xl">
                  No published course results recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side (Attendance, Assignments Tracker, Notifications) */}
        <div className="flex flex-col gap-6">
          {/* Attendance Summary */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Class Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {/* Circular indicator */}
                <div className="relative h-20 w-20 flex-shrink-0 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      className="text-zinc-200 dark:text-zinc-850"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                    />
                    <circle
                      className={cn(
                        attendance.percentage >= 75
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-500"
                      )}
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={2 * Math.PI * 32 * (1 - attendance.percentage / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                    />
                  </svg>
                  <span className="text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                    {attendance.percentage}%
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 flex-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Present Sessions</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{attendance.present}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-900 pt-1.5">
                    <span className="text-zinc-500">Absent Sessions</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{attendance.absent}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-900 pt-1.5">
                    <span className="text-zinc-500">Status Class</span>
                    <span className={cn(
                      "font-bold uppercase tracking-wider",
                      attendance.percentage >= 75 ? "text-emerald-700 dark:text-emerald-400" : "text-amber-600"
                    )}>
                      {attendance.percentage >= 75 ? 'GOOD' : 'SHORTAGE ALERT'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments Tracker Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Assignments Log</CardTitle>
              <Link href="/assignments">
                <Button variant="ghost" size="sm" className="text-[11px] h-6 px-2 text-zinc-500">
                  Manage
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2.5 text-center bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-150 dark:border-zinc-850 p-3 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 font-medium">Pending</span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {assignments.pendingCount}
                  </span>
                </div>
                <div className="flex flex-col border-x border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500 font-medium">Submitted</span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {assignments.submittedCount}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 font-medium">Due Today</span>
                  <span className={cn(
                    "text-lg font-bold mt-0.5",
                    assignments.dueTodayCount > 0 ? "text-red-650" : "text-zinc-500"
                  )}>
                    {assignments.dueTodayCount}
                  </span>
                </div>
              </div>

              {/* Due Today warning panel */}
              {assignments.dueTodayList.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 animate-spin" /> Action Required (Due Today)
                  </span>
                  {assignments.dueTodayList.map((as) => (
                    <div key={as.id} className="p-2.5 rounded-lg border border-red-200 dark:border-red-950 bg-red-50/30 dark:bg-red-950/10 text-xs flex justify-between items-center">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[130px]">
                        {as.title} ({as.courseCode})
                      </span>
                      <span className="text-red-700 dark:text-red-400 font-bold">Today at {as.dueAt}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Examinations Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Upcoming Examinations</CardTitle>
                <CardDescription>Official university exam schedules & registrations</CardDescription>
              </div>
              {exams.hallTicketRegistered ? (
                <span className="inline-flex items-center rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-950/20 dark:text-emerald-400">
                  Hall Ticket Issued
                </span>
              ) : (
                <span className="inline-flex items-center rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-650 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400">
                  Not Registered
                </span>
              )}
            </CardHeader>
            <CardContent>
              {exams.upcomingList.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {exams.upcomingList.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-150 dark:border-zinc-850">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-400 font-mono uppercase">{ex.courseCode}</span>
                        <span className="text-sm font-semibold text-zinc-805 dark:text-zinc-200">{ex.examName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">{ex.examDate}</span>
                        <span className="text-[10px] text-zinc-400">{ex.duration} Mins</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-zinc-400 text-xs border border-dashed rounded-lg">
                  No upcoming examinations scheduled.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Alerts / Notifications Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3.5">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Academic Alerts Feed</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {notifications.map((notif) => {
                const isHigh = notif.priority === 'high';
                const isMedium = notif.priority === 'medium';
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all",
                      isHigh && "bg-red-50/20 text-red-900 border-red-250 dark:bg-red-950/10 dark:text-red-400 dark:border-red-900/50",
                      isMedium && "bg-amber-50/20 text-amber-900 border-amber-250 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-900/50",
                      !isHigh && !isMedium && "bg-zinc-50/30 text-zinc-800 border-zinc-200 dark:bg-zinc-900/10 dark:text-zinc-400 dark:border-zinc-850"
                    )}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {isHigh ? (
                        <AlertOctagon className="h-4 w-4 text-red-650" />
                      ) : isMedium ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Info className="h-4 w-4 text-zinc-500" />
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-semibold leading-normal">{notif.title}</p>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500">{notif.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
