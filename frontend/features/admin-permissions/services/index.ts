import { api } from '@/services/api';
import { AdminPermission, PermissionListResponse } from '../types';

interface RawPermission {
  permission_id: string;
  permission_code: string;
  permission_name: string;
  description?: string;
}

export const adminPermissionService = {
  getPermissions: async (pageIndex: number, pageSize: number, search?: string): Promise<PermissionListResponse> => {
    const res = await api.get<RawPermission[]>('/permissions', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
      },
    }).catch(() => ({ data: [] }));

    let list: AdminPermission[] = (res.data || []).map((p) => {
      const parts = p.permission_code.split('.');
      const moduleName = parts[0] ? parts[0].replace(/_/g, ' ').toUpperCase() : 'GENERAL';
      return {
        permissionId: p.permission_id,
        permissionCode: p.permission_code,
        permissionName: p.permission_name || p.permission_code,
        module: moduleName,
        description: p.description || '',
      };
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.permissionCode.toLowerCase().includes(q) ||
          p.permissionName.toLowerCase().includes(q) ||
          p.module.toLowerCase().includes(q)
      );
    }

    return {
      permissions: list,
      totalCount: list.length,
      pageCount: Math.ceil(list.length / pageSize) || 1,
      pageIndex,
      pageSize,
    };
  },
};
