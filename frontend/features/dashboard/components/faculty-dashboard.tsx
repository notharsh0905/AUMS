"use client";

import React from 'react';
import Link from 'next/link';
import { useFacultyDashboard } from '../hooks/use-faculty-dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  FileText,
  BookOpen,
  Award,
  Info,
  AlertTriangle,
  AlertOctagon,
  User,
  ExternalLink,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function FacultyDashboard() {
  const { data, isLoading, error } = useFacultyDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
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
          <h3 className="font-semibold text-lg text-zinc-950 dark:text-zinc-50">Failed to load Faculty Dashboard</h3>
          <p className="text-sm text-zinc-500 max-w-md">{error || 'Unable to resolve faculty email matching.'}</p>
        </div>
      </div>
    );
  }

  const { profile, teaching, schedule, attendance, assignments, exams, results, notifications } = data;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Profile & Teaching Summary Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Faculty Profile Card */}
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
                <span className="text-xs text-zinc-500 font-mono mt-0.5">{profile.employeeCode}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-zinc-200/60 dark:border-zinc-800 pt-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span className="text-zinc-400">Department</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 text-right">
                  {profile.departmentName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Designation</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wide">
                  {profile.designation.replace('_', ' ')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Metrics Card */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Teaching Workspace Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-medium">Courses Allocated</span>
                <span className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 leading-none mt-1">
                  {teaching.coursesAssigned}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">Academic Offerings</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-medium">Active Weekly Classes</span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none mt-1">
                  {teaching.activeClasses}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">Timetable Slots</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-medium">Students Enrolled</span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none mt-1">
                  {teaching.studentsAssigned}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">Direct Assignments</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Quick Actions Banner */}
      <div className="flex flex-col gap-2.5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Quick Actions</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <Link href="/attendance" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <CheckSquare className="h-4 w-4 text-zinc-500" />
            <span>Mark Attendance</span>
          </Link>
          <Link href="/assignment-submissions" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <FileText className="h-4 w-4 text-zinc-500" />
            <span>Review Assignments</span>
          </Link>
          <Link href="/exam-attempts" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <Award className="h-4 w-4 text-zinc-500" />
            <span>Enter Marks</span>
          </Link>
          <Link href="/timetable" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <span>View Timetable</span>
          </Link>
          <Link href="/courses" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all col-span-2 sm:col-span-1">
            <BookOpen className="h-4 w-4 text-zinc-500" />
            <span>View Courses</span>
          </Link>
        </div>
      </div>

      {/* 3. Main Dashboard Layout Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Side (Today's Timetable Schedule & Assignments List & Results Tasks) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Today's Schedule Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3.5">
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <span>Today&apos;s Lecture Schedule</span>
                </CardTitle>
                <CardDescription>Your assigned classes and slot details for today</CardDescription>
              </div>
              <Link href="/timetable">
                <Button variant="ghost" size="sm" className="text-xs text-zinc-500 gap-1 h-8">
                  <span>Timetable view</span>
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
                          <span className="text-xs text-zinc-500">{slot.classroom}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0 pl-3">
                        <span className="text-xs font-semibold text-zinc-955 dark:text-zinc-50">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">
                          {slot.entryType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-455 border border-dashed rounded-xl">
                  No classes scheduled for today.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Examinations & Marks Entries Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Award className="h-4 w-4 text-zinc-500" />
                  <span>Upcoming Examinations & Evaluations</span>
                </CardTitle>
                <CardDescription>Marks entries status for assigned course exams</CardDescription>
              </div>
              <Link href="/exam-attempts">
                <Button variant="ghost" size="sm" className="text-xs text-zinc-500 gap-1 h-8">
                  <span>Enter Marks</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
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
                      <div className="text-right flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">{ex.examDate}</span>
                        {exams.marksEntryPending > 0 ? (
                          <span className="text-[10px] text-amber-600 font-semibold uppercase">Pending Marks Entry</span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold uppercase">Completed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-zinc-400 text-xs border border-dashed rounded-lg">
                  No upcoming exams scheduled.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side (Attendance Status, Assignments Review, Notifications Feed) */}
        <div className="flex flex-col gap-6">
          {/* Attendance Tracking Summary */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Class Attendance tracking</CardTitle>
              <Link href="/attendance">
                <Button variant="ghost" size="sm" className="text-[11px] h-6 px-2 text-zinc-500">
                  Mark
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-450">Pending Sessions</span>
                  <span className="text-2xl font-extrabold text-amber-500 mt-1">
                    {attendance.pendingCount}
                  </span>
                </div>
                <div className="flex flex-col pl-4">
                  <span className="text-xs text-zinc-455">Completed logs</span>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                    {attendance.completedCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments evaluation Log */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Assignments Review Log</CardTitle>
              <Link href="/assignment-submissions">
                <Button variant="ghost" size="sm" className="text-[11px] h-6 px-2 text-zinc-500">
                  Review
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2.5 text-center bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-150 dark:border-zinc-850 p-3 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Pending</span>
                  <span className="text-lg font-bold text-amber-500 mt-0.5">
                    {assignments.pendingReviews}
                  </span>
                </div>
                <div className="flex flex-col border-x border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Submitted</span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {assignments.submittedCount}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Due Today</span>
                  <span className="text-lg font-bold text-zinc-500 mt-0.5">
                    {assignments.dueTodayCount}
                  </span>
                </div>
              </div>

              {/* Course results tasks */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-150 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-900/5 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-400" />
                  <span className="font-semibold text-zinc-800 dark:text-zinc-250">Draft Course Results</span>
                </div>
                <span className={cn(
                  "font-bold text-xs uppercase px-1.5 py-0.5 rounded",
                  results.pendingPublish > 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                )}>
                  {results.pendingPublish > 0 ? `${results.pendingPublish} Pending` : 'All Published'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Academic Alerts / Notifications Feed Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3.5">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Academic Instructor Alerts</CardTitle>
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
