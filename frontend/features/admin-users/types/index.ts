export interface AdminUser {
  userId: string;
  username: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | string;
}

export interface CreateAdminUserInput {
  username: string;
  email: string;
  password: string;
  phone_number?: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
