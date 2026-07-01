"use client";

import React from 'react';
import { Examination } from '../../types';

import { Calendar, Clock, BookOpen, User, FileText } from 'lucide-react';

interface ExaminationScheduleProps {
  exam: Examination;
}

export function ExaminationSchedule({ exam }: ExaminationScheduleProps) {
  const scheduleItems = [
    {
      icon: BookOpen,
      label: 'Course Details',
      value: `${exam.courseCode} - ${exam.courseName}`,
    },
    {
      icon: User,
      label: 'Invigilator / Faculty Coordinator',
      value: exam.facultyName,
    },
    {
      icon: Calendar,
      label: 'Academic Year & Semester',
      value: `${exam.academicYear} | ${exam.semester}`,
    },
    {
      icon: Calendar,
      label: 'Examination Date',
      value: exam.examDate || new Date().toISOString().slice(0, 10),
    },
    {
      icon: Clock,
      label: 'Exam Timings',
      value: `${exam.startTime || '09:00'} to ${exam.endTime || '12:00'}`,
    },
    {
      icon: Clock,
      label: 'Exam Duration',
      value: exam.duration || '3 Hours',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Schedule Header */}
      <div className="p-4 rounded-xl bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Examination Schedule
        </span>
        <h4 className="text-base font-extrabold truncate">
          {exam.examName} ({exam.examCode})
        </h4>
      </div>

      {/* Grid List */}
      <div className="flex flex-col gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        {scheduleItems.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900"
          >
            <item.icon className="h-5 w-5 text-zinc-450 dark:text-zinc-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="flex flex-col gap-2 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-zinc-400" />
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Important Instructions
          </span>
        </div>
        <p className="text-sm font-medium text-zinc-850 dark:text-zinc-200 leading-relaxed bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/20 p-3 rounded-lg text-amber-900 dark:text-amber-300">
          {exam.instructions || 'Report to the exam hall 30 minutes before start time. Bring admit card and student ID. Calculators and smart devices are prohibited.'}
        </p>
      </div>
    </div>
  );
}
