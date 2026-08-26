export interface AdminPermission {
  permissionId: string;
  permissionCode: string;
  permissionName: string;
  module: string;
  description?: string;
}

export interface PermissionListResponse {
  permissions: AdminPermission[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
