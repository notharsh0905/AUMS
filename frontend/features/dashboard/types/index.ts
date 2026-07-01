export interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  percentageChange?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface EnrollmentData {
  month: string;
  count: number;
  graduateCount: number;
}

export interface AttendanceData {
  day: string;
  percentage: number;
}

export interface QuickActionData {
  id: string;
  label: string;
  icon: string;
  href?: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export interface RecentActivityData {
  id: string;
  actor: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface NotificationData {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  unread: boolean;
}

export interface UpcomingEventData {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'meeting' | 'holiday';
}

export interface SystemStatusData {
  name: string;
  status: 'healthy' | 'warning' | 'offline';
}
