"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Search,
  X,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle,
  FileText,
  Calendar,
  GraduationCap,
  Shield,
  Settings,
  LayoutDashboard,
  LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { navigationConfig } from '@/config/navigation';
import { filterNavigation, hasRole, hasAnyRole } from '@/utils/rbac';

interface PaletteCommand {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  keywords?: string[];
  action: () => void;
  badge?: string;
  url?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 1. Build role-filtered navigation commands from navigationConfig
  const accessibleNavCommands = useMemo<PaletteCommand[]>(() => {
    const filteredGroups = filterNavigation(navigationConfig, user);
    const commands: PaletteCommand[] = [];

    filteredGroups.forEach((group) => {
      group.items.forEach((item) => {
        commands.push({
          id: `nav-${item.id}`,
          title: item.title,
          category: group.title,
          icon: item.icon,
          url: item.href,
          keywords: [group.title.toLowerCase(), item.href.replace('/', ''), item.title.toLowerCase()],
          action: () => {
            router.push(item.href);
          },
        });
      });
    });

    return commands;
  }, [user, router]);

  // 2. Build quick action commands (Theme toggle, role-scoped actions)
  const quickActions = useMemo<PaletteCommand[]>(() => {
    const actions: PaletteCommand[] = [
      {
        id: 'action-theme-toggle',
        title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        category: 'Quick Actions',
        icon: theme === 'dark' ? Sun : Moon,
        keywords: ['theme', 'mode', 'dark', 'light', 'appearance', 'toggle'],
        badge: 'Appearance',
        action: () => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        },
      },
    ];

    // Faculty Actions
    if (hasRole(user, 'FACULTY')) {
      actions.push(
        {
          id: 'action-mark-attendance',
          title: 'Mark Class Attendance Roll Call',
          category: 'Quick Actions',
          icon: CheckCircle,
          keywords: ['attendance', 'roll call', 'present', 'absent', 'class'],
          badge: 'Faculty',
          url: '/attendance',
          action: () => router.push('/attendance'),
        },
        {
          id: 'action-review-submissions',
          title: 'Review Assignment Submissions',
          category: 'Quick Actions',
          icon: FileText,
          keywords: ['grading', 'assignments', 'submissions', 'marks', 'evaluate'],
          badge: 'Faculty',
          url: '/assignment-submissions',
          action: () => router.push('/assignment-submissions'),
        },
        {
          id: 'action-teaching-schedule',
          title: 'View Teaching Schedule Hub',
          category: 'Quick Actions',
          icon: Calendar,
          keywords: ['schedule', 'classes', 'today', 'timetable', 'teaching'],
          badge: 'Faculty',
          url: '/dashboard',
          action: () => router.push('/dashboard'),
        }
      );
    }

    // Student Actions
    if (hasRole(user, 'STUDENT')) {
      actions.push(
        {
          id: 'action-degree-audit',
          title: 'Check Degree Progress & Audit',
          category: 'Quick Actions',
          icon: GraduationCap,
          keywords: ['degree', 'progress', 'audit', 'credits', 'gpa', 'transcript'],
          badge: 'Student',
          url: '/transcripts',
          action: () => router.push('/transcripts'),
        },
        {
          id: 'action-view-timetable',
          title: 'View Class Timetable',
          category: 'Quick Actions',
          icon: Calendar,
          keywords: ['timetable', 'schedule', 'classes', 'slots'],
          badge: 'Student',
          url: '/timetable',
          action: () => router.push('/timetable'),
        }
      );
    }

    // Dean / HOD Actions
    if (hasAnyRole(user, ['DEAN', 'HOD'])) {
      actions.push({
        id: 'action-academic-oversight',
        title: 'Open Academic Unit Oversight Portal',
        category: 'Quick Actions',
        icon: LayoutDashboard,
        keywords: ['oversight', 'dean', 'hod', 'department', 'school', 'faculty', 'programs'],
        badge: 'Oversight',
        url: '/dashboard',
        action: () => router.push('/dashboard'),
      });
    }

    // Admin Actions
    if (hasAnyRole(user, ['SUPER_ADMIN', 'INSTITUTION_ADMIN'])) {
      actions.push(
        {
          id: 'action-manage-users',
          title: 'Manage System Users & Roles',
          category: 'Quick Actions',
          icon: Shield,
          keywords: ['users', 'roles', 'permissions', 'rbac', 'security'],
          badge: 'Admin',
          url: '/admin/users',
          action: () => router.push('/admin/users'),
        },
        {
          id: 'action-system-settings',
          title: 'Open System Settings',
          category: 'Quick Actions',
          icon: Settings,
          keywords: ['settings', 'platform', 'config'],
          badge: 'Settings',
          url: '/settings',
          action: () => router.push('/settings'),
        }
      );
    }

    return actions;
  }, [user, router, theme, setTheme]);

  // Combine and deduplicate commands
  const allCommands = useMemo(() => {
    return [...quickActions, ...accessibleNavCommands];
  }, [quickActions, accessibleNavCommands]);

  // Search filtering
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase().trim();
    return allCommands.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchCategory = c.category.toLowerCase().includes(q);
      const matchUrl = c.url?.toLowerCase().includes(q);
      const matchKeywords = c.keywords?.some((k) => k.includes(q));
      return matchTitle || matchCategory || matchUrl || matchKeywords;
    });
  }, [allCommands, query]);

  const handleSelect = useCallback(
    (item: PaletteCommand) => {
      onClose();
      item.action();
    },
    [onClose]
  );

  // Global and local keyboard shortcuts
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
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-listbox"
            aria-autocomplete="list"
            placeholder="Search commands, pages, actions, or shortcuts..."
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
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Command Item List */}
        <div
          id="command-listbox"
          role="listbox"
          aria-label="Commands and actions"
          className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-100 dark:divide-zinc-800/40"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No matching modules or actions found for &quot;{query}&quot;
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-50'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-white/10 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[11px] truncate ${
                          isSelected ? 'text-zinc-300' : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {item.category} {item.url && `• ${item.url}`}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-xs text-zinc-300 shrink-0 ml-2">
                      <span>Execute</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>User: <strong className="text-zinc-600 dark:text-zinc-300">{user?.username || 'Authenticated'}</strong></span>
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
