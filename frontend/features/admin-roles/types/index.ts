export interface AdminRole {
  roleId: string;
  roleCode: string;
  roleName: string;
  description?: string;
  permissionsCount?: number;
}

export interface RoleListResponse {
  roles: AdminRole[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
