"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAcademicOversight } from '../hooks/use-academic-oversight';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AcademicOversightDashboard() {
  const { data, isLoading, error } = useAcademicOversight();
  const [activeTab, setActiveTab] = useState<'departments' | 'faculty' | 'programs'>('departments');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        <div className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
          ))}
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
          <h3 className="font-semibold text-lg text-zinc-950 dark:text-zinc-50">Academic Unit Access Error</h3>
          <p className="text-sm text-zinc-500 max-w-md">{error || 'Unable to load academic governance records.'}</p>
        </div>
      </div>
    );
  }

  const { unit, metrics, departments, facultyMembers, programs, recentResults } = data;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Unit Identity & Governance Header Banner */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white backdrop-blur-md">
            <Building2 className="h-7 w-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {unit.type === 'SCHOOL' ? 'Academic School Oversight' : 'Department Governance'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">Code: {unit.code}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1">{unit.name}</h1>
            <p className="text-xs text-zinc-300 mt-0.5">
              {unit.headTitle}: <span className="font-bold text-white">{unit.headName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/departments">
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-8 gap-1">
              <Layers className="h-3.5 w-3.5" />
              <span>Departments</span>
            </Button>
          </Link>
          <Link href="/faculty">
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-8 gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>Faculty Directory</span>
            </Button>
          </Link>
          <Link href="/timetable">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 gap-1 border-none shadow-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>Timetable</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Operational Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Enrolled Students</span>
            <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{metrics.totalStudents}</div>
            <p className="text-xs text-zinc-500 mt-1">Across all unit programs</p>
          </CardContent>
        </Card>

        {/* Total Faculty */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Academic Faculty</span>
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{metrics.totalFaculty}</div>
            <p className="text-xs text-zinc-500 mt-1">Professors & Instructors</p>
          </CardContent>
        </Card>

        {/* Active Courses */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Course Catalog</span>
            <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{metrics.totalCourses}</div>
            <p className="text-xs text-zinc-500 mt-1">{metrics.totalPrograms} Degree Programs</p>
          </CardContent>
        </Card>

        {/* Unit Attendance Average */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Unit Attendance</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{metrics.averageAttendance}%</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              {metrics.activeTimetableSlots} Weekly Lecture Slots
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Operational Oversight Split */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Side: Unit Breakdowns & Directory (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    Academic Sub-Units & Governance
                  </CardTitle>
                  <CardDescription>
                    Live hierarchy breakdown for {unit.name}
                  </CardDescription>
                </div>
                
                {/* Tab selector */}
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab('departments')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                      activeTab === 'departments'
                        ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                    )}
                  >
                    Departments
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('faculty')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                      activeTab === 'faculty'
                        ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                    )}
                  >
                    Faculty Roster
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('programs')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                      activeTab === 'programs'
                        ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                    )}
                  >
                    Programs
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {activeTab === 'departments' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-100 dark:border-zinc-850">
                      <tr>
                        <th className="px-5 py-3">Code</th>
                        <th className="px-5 py-3">Department Name</th>
                        <th className="px-5 py-3 text-right">Faculty</th>
                        <th className="px-5 py-3 text-right">Courses</th>
                        <th className="px-5 py-3 text-right">Programs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                      {departments.map((dept) => (
                        <tr key={dept.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                          <td className="px-5 py-3.5 font-mono font-bold text-zinc-900 dark:text-zinc-50">{dept.code}</td>
                          <td className="px-5 py-3.5 font-semibold text-zinc-800 dark:text-zinc-200">{dept.name}</td>
                          <td className="px-5 py-3.5 text-right font-medium text-zinc-600 dark:text-zinc-400">{dept.facultyCount}</td>
                          <td className="px-5 py-3.5 text-right font-medium text-zinc-600 dark:text-zinc-400">{dept.courseCount}</td>
                          <td className="px-5 py-3.5 text-right font-medium text-zinc-600 dark:text-zinc-400">{dept.programCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'faculty' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-100 dark:border-zinc-850">
                      <tr>
                        <th className="px-5 py-3">Employee Code</th>
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Designation</th>
                        <th className="px-5 py-3">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                      {facultyMembers.map((fac) => (
                        <tr key={fac.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                          <td className="px-5 py-3.5 font-mono font-bold text-zinc-900 dark:text-zinc-50">{fac.employeeCode}</td>
                          <td className="px-5 py-3.5 font-semibold text-zinc-800 dark:text-zinc-200">{fac.name}</td>
                          <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400">{fac.designation}</td>
                          <td className="px-5 py-3.5 text-zinc-500">{fac.departmentName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'programs' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-100 dark:border-zinc-850">
                      <tr>
                        <th className="px-5 py-3">Code</th>
                        <th className="px-5 py-3">Program Name</th>
                        <th className="px-5 py-3">Degree Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                      {programs.map((prog) => (
                        <tr key={prog.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                          <td className="px-5 py-3.5 font-mono font-bold text-zinc-900 dark:text-zinc-50">{prog.code}</td>
                          <td className="px-5 py-3.5 font-semibold text-zinc-800 dark:text-zinc-200">{prog.name}</td>
                          <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400">{prog.degreeType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Performance Summary & Quick Governance Actions */}
        <div className="flex flex-col gap-6">
          {/* Academic Performance / Results Overview */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Unit Evaluation Health</span>
              </CardTitle>
              <CardDescription>Published results & examination standing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-500 font-medium block">Overall Pass Rate</span>
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{recentResults.passRate}%</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-500 font-medium block">Evaluated Records</span>
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">{recentResults.totalEvaluated} Courses</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <span>Pass Count</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{recentResults.passCount} Courses</span>
              </div>
              <div className="flex justify-between items-center text-xs text-zinc-500">
                <span>Fail / Re-evaluation</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{recentResults.failCount} Courses</span>
              </div>

              <Link href="/course-results">
                <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1 mt-1">
                  <span>View All Course Results</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Academic Actions */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-zinc-500" />
                <span>Governance Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <Link href="/faculty-course-allocations">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8.5 gap-2">
                  <Users className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Faculty Course Allocations</span>
                </Button>
              </Link>
              <Link href="/timetable">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8.5 gap-2">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Lecture Scheduling & Timetable</span>
                </Button>
              </Link>
              <Link href="/exam-schedules">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8.5 gap-2">
                  <Award className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Examination Schedules</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
