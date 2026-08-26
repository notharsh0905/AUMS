"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useFacultyDashboard } from '../hooks/use-faculty-dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  FileText,
  BookOpen,
  Award,
  AlertOctagon,
  User,
  ExternalLink,
  CheckSquare,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function FacultyDashboard() {
  const { data, isLoading, error } = useFacultyDashboard();
  const [scheduleTab, setScheduleTab] = useState<'today' | 'upcoming'>('today');

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

  const { profile, teaching, schedule, upcomingSchedule, attendance, assignments, exams } = data;
  const displaySchedule = scheduleTab === 'today' ? schedule : upcomingSchedule;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Profile & Teaching Summary Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Faculty Profile Card */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-850 relative overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-900 dark:to-zinc-950/20">
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

        {/* Teaching Workspace Metrics */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-850 md:col-span-2">
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
                <span className="text-[10px] text-zinc-400 mt-1">Active Offerings</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-medium">Weekly Lecture Slots</span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none mt-1">
                  {teaching.activeClasses}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">Assigned Slots</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-medium">Students Enrolled</span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none mt-1">
                  {teaching.studentsAssigned}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">Direct Enrollments</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Quick Actions Banner */}
      <div className="flex flex-col gap-2.5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Quick Academic Actions</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <Link href="/attendance" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Mark Attendance</span>
          </Link>
          <Link href="/assignment-submissions" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Grade Submissions</span>
          </Link>
          <Link href="/internal-assessments" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Assessment Marks</span>
          </Link>
          <Link href="/timetable" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <span>Full Timetable</span>
          </Link>
          <Link href="/courses" className="flex items-center gap-2 px-3 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-all col-span-2 sm:col-span-1">
            <BookOpen className="h-4 w-4 text-zinc-500" />
            <span>Course Catalog</span>
          </Link>
        </div>
      </div>

      {/* 3. Main Dashboard Layout Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Side: Teaching Schedule Hub */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Teaching Schedule Hub Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5">
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                  <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Teaching Schedule & Attendance Hub</span>
                </CardTitle>
                <CardDescription>
                  Your assigned lectures with rapid attendance-marking shortcuts
                </CardDescription>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                <button
                  type="button"
                  onClick={() => setScheduleTab('today')}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                    scheduleTab === 'today'
                      ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  Today&apos;s Classes
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleTab('upcoming')}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                    scheduleTab === 'upcoming'
                      ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  All Scheduled Slots
                </button>
              </div>
            </CardHeader>

            <CardContent>
              {displaySchedule.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {displaySchedule.map((slot) => {
                    const isMarked = slot.attendanceStatus === 'MARKED';
                    const markUrl = slot.classSessionId
                      ? `/attendance?session_id=${slot.classSessionId}&course_offering_id=${slot.courseOfferingId}`
                      : `/attendance?course_offering_id=${slot.courseOfferingId}`;

                    return (
                      <div
                        key={slot.timetableEntryId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 transition-all gap-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 flex-shrink-0 text-xs font-bold font-mono">
                            {slot.courseCode.slice(0, 6)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                                {slot.courseName}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                                {slot.section}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                                {slot.classroom}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-zinc-400" />
                                {slot.totalStudents} Students
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status & Rapid Action */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-850">
                          <div className="flex items-center gap-1.5">
                            {isMarked ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="h-3 w-3" />
                                Marked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                <AlertCircle className="h-3 w-3" />
                                Pending Roll-call
                              </span>
                            )}
                          </div>

                          <Link href={markUrl}>
                            <Button
                              size="sm"
                              variant={isMarked ? 'outline' : 'default'}
                              className={cn(
                                "h-8 text-xs font-semibold gap-1.5",
                                isMarked
                                  ? "text-zinc-700 hover:text-zinc-950 dark:text-zinc-300"
                                  : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950"
                              )}
                            >
                              <CheckSquare className="h-3.5 w-3.5" />
                              <span>{isMarked ? 'Review' : 'Mark Attendance'}</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400 text-xs border border-dashed rounded-xl flex flex-col items-center gap-2">
                  <Calendar className="h-6 w-6 text-zinc-300" />
                  <span>No lecture slots assigned for this time. Check the full institutional timetable.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Examinations & Evaluations */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Award className="h-4 w-4 text-zinc-500" />
                  <span>Upcoming Examinations & Evaluations</span>
                </CardTitle>
                <CardDescription>Marks entry status for assigned course exams</CardDescription>
              </div>
              <Link href="/internal-assessments">
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
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{ex.examName}</span>
                      </div>
                      <div className="text-right flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">{ex.examDate}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold uppercase">Active Evaluation</span>
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

        {/* Right Side: Assignment Review Tasks & Actionable Alerts */}
        <div className="flex flex-col gap-6">
          {/* Assignment Submissions Workspace */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-zinc-500" />
                <span>Assignment Grading Queue</span>
              </CardTitle>
              <CardDescription>Pending student coursework to evaluate</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-500 font-medium block">Pending Reviews</span>
                  <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">{assignments.pendingReviews} Submissions</span>
                </div>
                <Link href="/assignment-submissions">
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    Grade Now
                  </Button>
                </Link>
              </div>

              <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <span>Total Received</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">{assignments.submittedCount}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-zinc-500">
                <span>Due Today</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">{assignments.dueTodayCount} Assignments</span>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Roll Call Overview */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
                <span>Roll Call Completion</span>
              </CardTitle>
              <CardDescription>Class sessions attendance log summary</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Completed Sessions</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{attendance.completedCount} Sessions</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Pending Marking</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{attendance.pendingCount} Slots</span>
              </div>

              <Link href="/attendance" className="mt-2">
                <Button variant="outline" className="w-full text-xs h-8">
                  Open Attendance Register
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
