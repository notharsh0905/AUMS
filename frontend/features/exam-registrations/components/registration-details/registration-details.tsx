"use client";

import React from 'react';
import { ExamRegistration } from '../../types';
import { cn } from '@/lib/utils';
import { ShieldCheck, Calendar, GraduationCap, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegistrationDetailsProps {
  registration: ExamRegistration;
}

export function RegistrationDetails({ registration }: RegistrationDetailsProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hall Ticket Card */}
      <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-md overflow-hidden print:border-none print:shadow-none">
        
        {/* Card Header */}
        <div className="flex items-center justify-between p-5 bg-zinc-900 text-zinc-50 dark:bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-zinc-200" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">AUMS ERP Portal</span>
              <span className="text-sm font-bold text-white uppercase tracking-wide">Official Exam Hall Ticket</span>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ring-1 ring-inset",
              registration.registrationStatus === 'REGISTERED' &&
                "bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-500/25 dark:bg-emerald-950/20 dark:text-emerald-450",
              registration.registrationStatus === 'ABSENT' &&
                "bg-zinc-100 text-zinc-700 border-zinc-300 ring-zinc-500/25 dark:bg-zinc-900 dark:text-zinc-400",
              registration.registrationStatus === 'DISQUALIFIED' &&
                "bg-red-50 text-red-700 border-red-300 ring-red-500/25 dark:bg-red-950/20 dark:text-red-400"
            )}
          >
            {registration.registrationStatus}
          </span>
        </div>

        {/* Card Body - Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Candidate Name</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{registration.studentName}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Enrollment Number / Roll</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{registration.rollNumber}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Course Code</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{registration.courseCode}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Course Name</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{registration.courseName}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Exam Name / Session</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {registration.examName} ({registration.examType})
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Exam Date</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-zinc-400" />
              {registration.examDate ? new Date(registration.examDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="md:col-span-2 flex flex-col gap-1 pt-3 border-t border-zinc-100 dark:border-zinc-900">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Registration ID</span>
            <span className="text-xs font-mono text-zinc-500">{registration.examRegistrationId}</span>
          </div>
        </div>

        {/* Card Footer - Instructions */}
        <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-150 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 mb-2 text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-zinc-650" />
            <span>Candidate Instructions</span>
          </div>
          <ul className="list-disc pl-4 space-y-1 text-zinc-500">
            <li>Candidates must bring a printed copy of this Hall Ticket to the exam venue.</li>
            <li>Please verify all scheduling data and report any mismatches to the controller of exams.</li>
            <li>No mobile phones, electronic devices, or unauthorised resources are permitted inside the hall.</li>
            <li>Exam seating registration status must read &quot;REGISTERED&quot; to sit for the session.</li>
          </ul>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center justify-end gap-3 mt-2 print:hidden">
        <Button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 px-5 font-semibold h-10 border-none rounded-lg"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Export Hall Ticket</span>
        </Button>
      </div>
    </div>
  );
}
