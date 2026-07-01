import {
  StatCardData,
  EnrollmentData,
  AttendanceData,
  QuickActionData,
  RecentActivityData,
  NotificationData,
  UpcomingEventData,
  SystemStatusData,
} from '@/features/dashboard/types';

export const STATS_CARDS: StatCardData[] = [
  {
    id: 'students',
    title: 'Total Students',
    value: '12,450',
    percentageChange: 4.2,
    trend: 'up',
    icon: 'users',
  },
  {
    id: 'faculty',
    title: 'Faculty Members',
    value: '840',
    percentageChange: -0.5,
    trend: 'down',
    icon: 'graduation-cap',
  },
  {
    id: 'departments',
    title: 'Departments',
    value: '16',
    percentageChange: 0,
    trend: 'neutral',
    icon: 'school',
  },
  {
    id: 'courses',
    title: 'Active Courses',
    value: '312',
    percentageChange: 8.5,
    trend: 'up',
    icon: 'book-open',
  },
  {
    id: 'active-users',
    title: 'Active Users Today',
    value: '3,840',
    percentageChange: 12.1,
    trend: 'up',
    icon: 'user-check',
  },
  {
    id: 'attendance',
    title: 'Attendance Today',
    value: '94.2%',
    percentageChange: 1.8,
    trend: 'up',
    icon: 'calendar',
  },
];

export const ENROLLMENT_TRENDS: EnrollmentData[] = [
  { month: 'Jan', count: 10200, graduateCount: 1500 },
  { month: 'Feb', count: 10500, graduateCount: 1600 },
  { month: 'Mar', count: 10800, graduateCount: 1800 },
  { month: 'Apr', count: 11200, graduateCount: 1900 },
  { month: 'May', count: 11900, graduateCount: 2200 },
  { month: 'Jun', count: 12450, graduateCount: 2400 },
];

export const ATTENDANCE_TRENDS: AttendanceData[] = [
  { day: 'Mon', percentage: 92.5 },
  { day: 'Tue', percentage: 94.8 },
  { day: 'Wed', percentage: 95.2 },
  { day: 'Thu', percentage: 93.9 },
  { day: 'Fri', percentage: 91.4 },
];

export const QUICK_ACTIONS: QuickActionData[] = [
  {
    id: 'add-student',
    label: 'Add Student',
    icon: 'user-plus',
    href: '/students',
    requiredPermissions: ['students.create'],
  },
  {
    id: 'add-faculty',
    label: 'Add Faculty',
    icon: 'user-cog',
    href: '/faculty',
    requiredPermissions: ['faculty.create'],
  },
  {
    id: 'create-course',
    label: 'Create Course',
    icon: 'folder-plus',
    href: '/courses',
    requiredPermissions: ['courses.create'],
  },
  {
    id: 'schedule-exam',
    label: 'Schedule Exam',
    icon: 'award',
    href: '/examinations',
    requiredRoles: ['SUPER_ADMIN', 'FACULTY'],
  },
];

export const RECENT_ACTIVITIES: RecentActivityData[] = [
  {
    id: 'act-1',
    actor: 'Dr. John Smith',
    description: 'submitted grades for Advanced Algebra - Section A.',
    timestamp: '2 hours ago',
    icon: 'check-circle2',
  },
  {
    id: 'act-2',
    actor: 'System Admin',
    description: 'applied system security patches and cleaned log cache.',
    timestamp: '4 hours ago',
    icon: 'terminal',
  },
  {
    id: 'act-3',
    actor: 'Jane Doe (Student)',
    description: 'submitted mid-semester assignment for Physics II.',
    timestamp: '5 hours ago',
    icon: 'file-text',
  },
  {
    id: 'act-4',
    actor: 'Registrar Office',
    description: 'enrolled 14 new freshman students to CSE course tree.',
    timestamp: '1 day ago',
    icon: 'user-check',
  },
];

export const NOTIFICATIONS: NotificationData[] = [
  {
    id: 'notif-1',
    title: 'Database connection delay detected in standby replica node.',
    priority: 'high',
    timestamp: '30m ago',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Grade report submission deadline approaching (Faculty advisory).',
    priority: 'medium',
    timestamp: '2h ago',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Regular system maintenance scheduled for Sunday at 02:00 UTC.',
    priority: 'low',
    timestamp: '1d ago',
    unread: false,
  },
];

export const UPCOMING_EVENTS: UpcomingEventData[] = [
  {
    id: 'event-1',
    title: 'Midterm Physics Lab Exams',
    date: 'July 5, 2026',
    type: 'exam',
  },
  {
    id: 'event-2',
    title: 'Department Head Board Meeting',
    date: 'July 8, 2026',
    type: 'meeting',
  },
  {
    id: 'event-3',
    title: 'Academic Independence Day Break',
    date: 'July 15, 2026',
    type: 'holiday',
  },
];

export const SYSTEM_STATUSES: SystemStatusData[] = [
  { name: 'Core Backend V1', status: 'healthy' },
  { name: 'PostgreSQL DB', status: 'healthy' },
  { name: 'Redis Cache Server', status: 'healthy' },
  { name: 'MinIO Storage S3', status: 'warning' },
  { name: 'AUMS AI Service', status: 'healthy' },
];
