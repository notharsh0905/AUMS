export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface User {
  userId: string;
  username: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  status: UserStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  roleId: string;
  roleCode: string;
  roleName: string;
  description?: string;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  permissionId: string;
  permissionCode: string;
  permissionName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  assignedAt: string;
  expiresAt: string;
}
