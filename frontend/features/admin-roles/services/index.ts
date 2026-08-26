import { api } from '@/services/api';
import { AdminRole, RoleListResponse } from '../types';

interface RawRole {
  role_id: string;
  role_code: string;
  role_name: string;
  description?: string;
}

export const adminRoleService = {
  getRoles: async (pageIndex: number, pageSize: number, search?: string): Promise<RoleListResponse> => {
    const res = await api.get<RawRole[]>('/roles', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
      },
    }).catch(() => ({ data: [] }));

    let list: AdminRole[] = (res.data || []).map((r) => ({
      roleId: r.role_id,
      roleCode: r.role_code,
      roleName: r.role_name,
      description: r.description || '',
      permissionsCount: 16,
    }));

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.roleName.toLowerCase().includes(q) || r.roleCode.toLowerCase().includes(q));
    }

    return {
      roles: list,
      totalCount: list.length,
      pageCount: Math.ceil(list.length / pageSize) || 1,
      pageIndex,
      pageSize,
    };
  },
};
