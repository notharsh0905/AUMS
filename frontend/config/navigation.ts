import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  Shield,
  UserCheck,
  Key,
  Building2,
  Calendar,
  FileText,
  LucideIcon
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  children?: NavigationItem[];
}

export interface NavigationGroup {
  id: string;
  title: string;
  items: NavigationItem[];
}

export const navigationConfig: NavigationGroup[] = [
  {
    id: 'dashboard-group',
    title: 'General',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
      }
    ]
  },
  {
    id: 'academic',
    title: 'Academic',
    items: [
      {
        id: 'students',
        title: 'Students',
        icon: Users,
        href: '/students',
        requiredPermissions: ['students.read'],
      },
      {
        id: 'faculty',
        title: 'Faculty',
        icon: GraduationCap,
        href: '/faculty',
        requiredPermissions: ['faculty.read'],
      },
      {
        id: 'courses',
        title: 'Courses',
        icon: BookOpen,
        href: '/courses',
        requiredPermissions: ['courses.read'],
      },
      {
        id: 'departments',
        title: 'Departments',
        icon: Building2,
        href: '/departments',
        requiredPermissions: ['departments.read'],
      },
      {
        id: 'programs',
        title: 'Programs',
        icon: BookOpen,
        href: '/programs',
        requiredPermissions: ['programs.read'],
      },
      {
        id: 'academic-years',
        title: 'Academic Years',
        icon: Calendar,
        href: '/academic-years',
        requiredPermissions: ['academic_years.read'],
      },
      {
        id: 'semesters',
        title: 'Semesters',
        icon: Calendar,
        href: '/semesters',
        requiredPermissions: ['semesters.read'],
      },
      {
        id: 'course-offerings',
        title: 'Course Offerings',
        icon: BookOpen,
        href: '/course-offerings',
        requiredPermissions: ['course_offerings.read'],
      },
      {
        id: 'faculty-course-allocations',
        title: 'Faculty Allocations',
        icon: GraduationCap,
        href: '/faculty-course-allocations',
        requiredPermissions: ['faculty_course_allocations.read'],
      },
      {
        id: 'student-course-registrations',
        title: 'Student Registrations',
        icon: Users,
        href: '/student-course-registrations',
        requiredPermissions: ['student_course_registrations.read'],
      },
      {
        id: 'timetable',
        title: 'Timetable',
        icon: Calendar,
        href: '/timetable',
        requiredPermissions: ['timetable.read'],
      },
      {
        id: 'attendance',
        title: 'Attendance',
        icon: UserCheck,
        href: '/attendance',
        requiredPermissions: ['attendance.read'],
      },
      {
        id: 'assignments',
        title: 'Assignments',
        icon: FileText,
        href: '/assignments',
        requiredPermissions: ['assignments.read'],
      },
      {
        id: 'assignment-submissions',
        title: 'Submissions',
        icon: FileText,
        href: '/assignment-submissions',
        requiredPermissions: ['assignment_submissions.read'],
      },
      {
        id: 'internal-assessments',
        title: 'Internal Assessments',
        icon: FileText,
        href: '/internal-assessments',
        requiredPermissions: ['internal_assessments.read'],
      },
      {
        id: 'examinations',
        title: 'Examinations',
        icon: FileText,
        href: '/examinations',
        requiredPermissions: ['examinations.read'],
      }
    ]
  },
  {
    id: 'administration',
    title: 'Administration',
    items: [
      {
        id: 'users',
        title: 'Users',
        icon: UserCheck,
        href: '/admin/users',
        requiredRoles: ['SUPER_ADMIN'],
        requiredPermissions: ['users.read'],
      },
      {
        id: 'roles',
        title: 'Roles',
        icon: Shield,
        href: '/admin/roles',
        requiredRoles: ['SUPER_ADMIN'],
        requiredPermissions: ['roles.read'],
      },
      {
        id: 'permissions',
        title: 'Permissions',
        icon: Key,
        href: '/admin/permissions',
        requiredRoles: ['SUPER_ADMIN'],
        requiredPermissions: ['permissions.read'],
      }
    ]
  },
  {
    id: 'settings-group',
    title: 'Settings',
    items: [
      {
        id: 'settings',
        title: 'Settings',
        icon: Settings,
        href: '/settings',
      }
    ]
  }
];
