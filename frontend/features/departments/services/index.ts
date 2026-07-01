import { api } from '@/services/api';
import { Department, DepartmentFilters, DepartmentListResponse } from '../types';

interface RawDepartment {
  department_id: string;
  school_id: string;
  department_code: string;
  department_name: string;
  description?: string;
  school_name: string;
  hod_name: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const departmentService = {
  getDepartments: async (
    filters: DepartmentFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<DepartmentListResponse> => {
    const res = await api.get<RawDepartment[]>('/departments', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        search: filters.search,
        status: filters.status,
        school: filters.school,
      },
    });

    const list = res.data || [];
    const meta = (res as unknown as Record<string, unknown>).meta as { total?: number } || {
      page: pageIndex + 1,
      limit: pageSize,
      total: list.length,
    };
    const totalCount = meta.total || list.length;

    const departments: Department[] = list.map((item) => ({
      departmentId: item.department_id,
      schoolId: item.school_id,
      departmentCode: item.department_code,
      departmentName: item.department_name,
      description: item.description || '',
      school: item.school_name || 'School of Computing',
      hod: item.hod_name || 'N/A',
      status: (item.status || 'active').toLowerCase() as 'active' | 'inactive',
      createdAt: item.created_at || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString(),
    }));

    return {
      departments,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createDepartment: async (
    dept: Omit<Department, 'createdAt' | 'updatedAt'>
  ): Promise<Department> => {
    // 1. Resolve school ID from list
    const schoolsRes = await api.get<{ school_name: string; school_id: string }[]>('/schools').catch(() => ({ data: [] }));
    const schools = schoolsRes.data || [];
    let school = schools.find((s) => s.school_name === dept.school);
    if (!school && schools.length > 0) {
      school = schools[0];
    }
    const schoolId = school?.school_id || '00000000-0000-0000-0000-000000000000';

    // 2. Create Department
    await api.post<unknown>('/departments', {
      school_id: schoolId,
      department_code: dept.departmentCode,
      department_name: dept.departmentName,
      description: dept.description || '',
    });

    // 3. Retrieve details to find created ID
    const listRes = await api.get<RawDepartment[]>('/departments');
    const list = listRes.data || [];
    const matched = list.find((item) => item.department_code === dept.departmentCode);

    if (!matched) throw new Error('Failed to resolve created department ID');

    return {
      ...dept,
      departmentId: matched.department_id,
      schoolId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateDepartment: async (
    departmentId: string,
    dept: Partial<Omit<Department, 'createdAt' | 'updatedAt'>>
  ): Promise<Department> => {
    await api.put(`/departments/${departmentId}`, {
      department_name: dept.departmentName,
      description: dept.description || '',
    });
    return {
      ...dept,
      departmentId,
      updatedAt: new Date().toISOString(),
    } as unknown as Department;
  },

  deleteDepartment: async (departmentId: string): Promise<string> => {
    await api.delete(`/departments/${departmentId}`);
    return departmentId;
  },
};
