export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    HOME: '/dashboard',
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings',
  },
  ACADEMIC: {
    HOME: '/academic',
    COURSES: '/academic/courses',
    OFFERINGS: '/academic/offerings',
  },
  STUDENTS: {
    HOME: '/students',
    ATTENDANCE: '/students/attendance',
    GRADES: '/students/grades',
  },
  FACULTY: {
    HOME: '/faculty',
    TIMETABLE: '/faculty/timetable',
  },
  ADMIN: {
    HOME: '/admin',
    USERS: '/admin/users',
    ROLES: '/admin/roles',
    SETTINGS: '/admin/settings',
  },
} as const;
