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
