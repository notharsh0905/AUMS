import { api } from '@/services/api';
import { AdminUser, CreateAdminUserInput, AdminUserListResponse } from '../types';

interface RawUser {
  user_id: string;
  username: string;
  email: string;
  phone_number?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  status: string;
}

export const adminUserService = {
  getUsers: async (pageIndex: number, pageSize: number, search?: string): Promise<AdminUserListResponse> => {
    const res = await api.get<RawUser[]>('/users', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
      },
    }).catch(() => ({ data: [] }));

    let list: AdminUser[] = (res.data || []).map((u) => ({
      userId: u.user_id,
      username: u.username,
      email: u.email,
      phoneNumber: u.phone_number || '',
      firstName: u.first_name,
      middleName: u.middle_name || '',
      lastName: u.last_name || '',
      status: u.status || 'ACTIVE',
    }));

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q)
      );
    }

    return {
      users: list,
      totalCount: list.length,
      pageCount: Math.ceil(list.length / pageSize) || 1,
      pageIndex,
      pageSize,
    };
  },

  createUser: async (data: CreateAdminUserInput): Promise<void> => {
    await api.post('/users', data);
  },
};
