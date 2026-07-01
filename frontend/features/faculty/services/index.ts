import { api } from '@/services/api';
import { Faculty, FacultyFilters, FacultyListResponse } from '../types';

interface RawFaculty {
  faculty_profile_id: string;
  user_id: string;
  employee_code: string;
  department_id: string;
  designation: string;
  employment_type: string;
  joining_date?: string;
  status: string;
  years_of_experience?: string;
  office_location?: string;
  bio?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  department_name: string;
}

export const facultyService = {
  getFaculty: async (
    filters: FacultyFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<FacultyListResponse> => {
    const res = await api.get<RawFaculty[]>('/faculty', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        search: filters.search,
        status: filters.status?.toUpperCase(),
        department: filters.department,
        designation: filters.designation?.toUpperCase(),
        employmentType: filters.employmentType?.toUpperCase(),
      },
    });

    const list = res.data || [];
    const meta = (res as unknown as Record<string, unknown>).meta as { total?: number } || {
      page: pageIndex + 1,
      limit: pageSize,
      total: list.length,
    };
    const totalCount = meta.total || list.length;

    const faculty: Faculty[] = list.map((item) => ({
      facultyId: item.faculty_profile_id,
      employeeCode: item.employee_code,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      phone: item.phone,
      department: item.department_name,
      designation: item.designation,
      employmentType: item.employment_type,
      joiningDate: item.joining_date ? item.joining_date.slice(0, 10) : '',
      status: (item.status || 'active').toLowerCase() as 'active' | 'on_leave' | 'suspended' | 'retired' | 'resigned',
      yearsOfExperience: item.years_of_experience || '',
      officeLocation: item.office_location || '',
      bio: item.bio || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return {
      faculty,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createFaculty: async (
    member: Omit<Faculty, 'createdAt' | 'updatedAt'>
  ): Promise<Faculty> => {
    // 1. Resolve departments to match department_id
    const departmentsRes = await api.get<{ department_name: string; department_id: string }[]>('/departments').catch(() => ({ data: [] }));
    const departments = departmentsRes.data || [];
    let department = departments.find((d) => d.department_name === member.department);
    if (!department && departments.length > 0) {
      department = departments[0];
    }
    const departmentId = department?.department_id || '00000000-0000-0000-0000-000000000000';

    // 2. Create User first
    const username = `${member.firstName.toLowerCase()}_${member.lastName.toLowerCase()}_${Date.now().toString().slice(-4)}`;
    const userRes = await api.post<{ user_id: string }>('/users', {
      username,
      email: member.email,
      password: 'TemporaryPassword123!',
      phone_number: member.phone,
      first_name: member.firstName,
      last_name: member.lastName,
    });

    const user = userRes.data || userRes;
    const userId = user.user_id;

    // 3. Create Faculty Profile
    await api.post<unknown>('/faculty', {
      user_id: userId,
      employee_code: member.employeeCode,
      department_id: departmentId,
      designation: member.designation.toUpperCase(),
      employment_type: member.employmentType.toUpperCase(),
      joining_date: member.joiningDate,
      status: member.status.toUpperCase(),
      years_of_experience: member.yearsOfExperience || '0',
      office_location: member.officeLocation || '',
      bio: member.bio || '',
    });

    // 4. Find newly created profile ID
    const profilesRes = await api.get<RawFaculty[]>('/faculty');
    const profiles = profilesRes.data || [];
    const profile = profiles.find((p) => p.user_id === userId);

    if (!profile) throw new Error('Failed to resolve faculty profile');

    return {
      ...member,
      facultyId: profile.faculty_profile_id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateFaculty: async (
    facultyId: string,
    member: Partial<Omit<Faculty, 'createdAt' | 'updatedAt'>>
  ): Promise<Faculty> => {
    const rawFaculty = await api.get<RawFaculty>(`/faculty/${facultyId}`).then((r) => r.data || r);

    await api.put(`/faculty/${facultyId}`, {
      designation: (member.designation || rawFaculty.designation).toUpperCase(),
      employment_type: (member.employmentType || rawFaculty.employment_type).toUpperCase(),
      status: (member.status || rawFaculty.status).toUpperCase(),
      years_of_experience: member.yearsOfExperience || rawFaculty.years_of_experience || '0',
      office_location: member.officeLocation || rawFaculty.office_location || '',
      bio: member.bio || rawFaculty.bio || '',
    });

    return {
      ...member,
      facultyId,
      updatedAt: new Date().toISOString(),
    } as unknown as Faculty;
  },

  deleteFaculty: async (facultyId: string): Promise<string> => {
    await api.delete(`/faculty/${facultyId}`);
    return facultyId;
  },
};
