"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, BookOpen, Users, Calendar, GraduationCap, Building2, Shield, Settings, LayoutDashboard, FileText } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  href: string;
  icon: React.ElementType;
  keywords?: string[];
}

const COMMANDS: CommandItem[] = [
  { id: 'dashboard', title: 'Dashboard', category: 'General', href: '/dashboard', icon: LayoutDashboard },
  { id: 'campuses', title: 'Campuses', category: 'Hierarchy', href: '/campuses', icon: Building2 },
  { id: 'schools', title: 'Schools of Study', category: 'Hierarchy', href: '/schools', icon: Building2 },
  { id: 'departments', title: 'Departments', category: 'Hierarchy', href: '/departments', icon: Building2 },
  { id: 'programs', title: 'Degree Programs', category: 'Hierarchy', href: '/programs', icon: BookOpen },
  { id: 'academic-years', title: 'Academic Years', category: 'Catalog', href: '/academic-years', icon: Calendar },
  { id: 'semesters', title: 'Semesters', category: 'Catalog', href: '/semesters', icon: Calendar },
  { id: 'courses', title: 'Course Catalog', category: 'Catalog', href: '/courses', icon: BookOpen },
  { id: 'course-offerings', title: 'Course Offerings', category: 'Catalog', href: '/course-offerings', icon: BookOpen },
  { id: 'timetable', title: 'Timetable Scheduling', category: 'Catalog', href: '/timetable', icon: Calendar },
  { id: 'students', title: 'Student Directory', category: 'People', href: '/students', icon: Users },
  { id: 'faculty', title: 'Faculty Members', category: 'People', href: '/faculty', icon: GraduationCap },
  { id: 'allocations', title: 'Faculty Allocations', category: 'People', href: '/faculty-course-allocations', icon: GraduationCap },
  { id: 'registrations', title: 'Student Registrations', category: 'People', href: '/student-course-registrations', icon: Users },
  { id: 'attendance', title: 'Class Attendance', category: 'Classroom', href: '/attendance', icon: Users },
  { id: 'assignments', title: 'Assignments', category: 'Classroom', href: '/assignments', icon: FileText },
  { id: 'submissions', title: 'Assignment Submissions', category: 'Classroom', href: '/assignment-submissions', icon: FileText },
  { id: 'internal-assessments', title: 'Internal Assessments (CIE)', category: 'Classroom', href: '/internal-assessments', icon: FileText },
  { id: 'examinations', title: 'Examinations', category: 'Exams', href: '/examinations', icon: FileText },
  { id: 'exam-rooms', title: 'Exam Rooms & Halls', category: 'Exams', href: '/exam-rooms', icon: Building2 },
  { id: 'hall-tickets', title: 'Hall Tickets & Registrations', category: 'Exams', href: '/exam-registrations', icon: FileText },
  { id: 'marks-entry', title: 'Exam Marks Entry', category: 'Exams', href: '/exam-attempts', icon: FileText },
  { id: 'course-results', title: 'Course Results & Grades', category: 'Records', href: '/course-results', icon: FileText },
  { id: 'semester-results', title: 'Semester SGPA Results', category: 'Records', href: '/semester-results', icon: FileText },
  { id: 'program-results', title: 'Program CGPA Results', category: 'Records', href: '/program-results', icon: FileText },
  { id: 'transcripts', title: 'Official Transcripts', category: 'Records', href: '/transcripts', icon: GraduationCap },
  { id: 'admin-users', title: 'User Management', category: 'Admin', href: '/admin/users', icon: Users },
  { id: 'admin-roles', title: 'Role Permissions & RBAC', category: 'Admin', href: '/admin/roles', icon: Shield },
  { id: 'admin-permissions', title: 'Security Policies', category: 'Admin', href: '/admin/permissions', icon: Shield },
  { id: 'settings', title: 'System & Profile Settings', category: 'Settings', href: '/settings', icon: Settings },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.href.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      onClose();
      router.push(item.href);
    },
    [onClose, router]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          setQuery('');
          setSelectedIndex(0);
        }
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleSelect(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredCommands, selectedIndex, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search commands, modules, roll numbers, or pages... (Type / for help)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-100 dark:divide-zinc-800/40">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No matching modules or records found for &quot;{query}&quot;
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-50'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-white/10 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span
                        className={`text-[11px] ${
                          isSelected ? 'text-zinc-300' : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {item.category} • {item.href}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-xs text-zinc-300">
                      <span>Open</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Logged in as: <strong className="text-zinc-600 dark:text-zinc-300">{user?.username || 'User'}</strong></span>
            <span>•</span>
            <span>Role: <strong className="text-zinc-600 dark:text-zinc-300">{user?.roles?.[0] || 'SUPER_ADMIN'}</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
