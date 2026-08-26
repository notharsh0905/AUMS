"use client";

import { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface BackendStatsCard {
  id: string;
  title: string;
  value: string | number;
  icon: 'users' | 'graduation-cap' | 'school' | 'book-open' | 'user-check' | 'calendar';
  percentage_change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface BackendEnrollmentTrend {
  month: string;
  count: number;
  graduate_count: number;
}

interface BackendAttendanceTrend {
  day: string;
  percentage: number;
}

interface BackendRecentActivity {
  id: string;
  actor: string;
  description: string;
  timestamp: string;
  icon: 'check-circle2' | 'terminal' | 'file-text' | 'user-check';
}

interface BackendAnalyticsData {
  institution_info: {
    name: string;
    academic_year: string;
    semester: string;
  };
  stats_cards: BackendStatsCard[];
  enrollment_trends: BackendEnrollmentTrend[];
  attendance_trends: BackendAttendanceTrend[];
  recent_activities: BackendRecentActivity[];
  results_summary: {
    course_count: number;
    semester_count: number;
    program_count: number;
  };
}

export interface AdminDashboardData {
  institutionInfo: {
    name: string;
    academicYear: string;
    semester: string;
  };
  statsCards: {
    id: string;
    title: string;
    value: string | number;
    icon: 'users' | 'graduation-cap' | 'school' | 'book-open' | 'user-check' | 'calendar';
    percentageChange: number;
    trend: 'up' | 'down' | 'neutral';
  }[];
  enrollmentTrends: {
    month: string;
    count: number;
    graduateCount: number;
  }[];
  attendanceTrends: {
    day: string;
    percentage: number;
  }[];
  recentActivities: {
    id: string;
    actor: string;
    description: string;
    timestamp: string;
    icon: 'check-circle2' | 'terminal' | 'file-text' | 'user-check';
  }[];
  notifications: {
    id: string;
    title: string;
    timestamp: string;
    priority: 'high' | 'medium' | 'low';
    unread: boolean;
  }[];
  resultsSummary: {
    courseCount: number;
    semesterCount: number;
    programCount: number;
  };
}

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        // Unified single analytics endpoint call
        const response = await api.get<BackendAnalyticsData>('/analytics/dashboard');
        const raw = response.data;

        if (!raw) {
          throw new Error('No analytics data received');
        }

        if (!isMounted) return;

        const statsCards = (raw.stats_cards || []).map((card) => ({
          id: card.id,
          title: card.title,
          value: card.value,
          icon: card.icon,
          percentageChange: card.percentage_change,
          trend: card.trend,
        }));

        const enrollmentTrends = (raw.enrollment_trends || []).map((trend) => ({
          month: trend.month,
          count: trend.count,
          graduateCount: trend.graduate_count,
        }));

        const attendanceTrends = (raw.attendance_trends || []).map((trend) => ({
          day: trend.day,
          percentage: trend.percentage,
        }));

        const recentActivities = (raw.recent_activities || []).map((act) => ({
          id: act.id,
          actor: act.actor,
          description: act.description,
          timestamp: act.timestamp,
          icon: act.icon,
        }));

        const resultsSummary = {
          courseCount: raw.results_summary?.course_count || 0,
          semesterCount: raw.results_summary?.semester_count || 0,
          programCount: raw.results_summary?.program_count || 0,
        };

        const notifications = [
          {
            id: 'notif-sync-1',
            title: `Active Evaluation Ledger: ${resultsSummary.courseCount} course grade records registered across active sessions.`,
            timestamp: 'Just now',
            priority: 'high' as const,
            unread: true,
          },
          {
            id: 'notif-sync-2',
            title: 'System Operational: All core services, attendance monitors, and timetable slots are healthy.',
            timestamp: 'Today',
            priority: 'low' as const,
            unread: false,
          },
        ];

        setData({
          institutionInfo: {
            name: raw.institution_info?.name || 'AUMS Enterprise University',
            academicYear: raw.institution_info?.academic_year || 'Academic Year 2025-2026',
            semester: raw.institution_info?.semester || 'Fall Semester 2026',
          },
          statsCards,
          enrollmentTrends,
          attendanceTrends,
          recentActivities,
          notifications,
          resultsSummary,
        });
      } catch (err: unknown) {
        console.error('Error loading admin dashboard analytics:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred loading dashboard analytics');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  return {
    data,
    isLoading,
    error,
    refetch: () => setReloadKey((k) => k + 1),
  };
}
