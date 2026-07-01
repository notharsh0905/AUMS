import { api } from '@/services/api';
import { Program, ProgramFilters, ProgramListResponse } from '../types';

interface RawProgram {
  program_id: string;
  department_id: string;
  program_code: string;
  program_name: string;
  degree_type: string;
  duration_value: number;
  duration_unit: string;
  total_semesters: number;
  created_at?: string;
  updated_at?: string;
}

interface RawDepartment {
  department_id: string;
  department_name: string;
}

export const programService = {
  getPrograms: async (
    filters: ProgramFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<ProgramListResponse> => {
    // 1. Fetch raw programs
    const res = await api.get<RawProgram[]>('/programs', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
      },
    });

    const list = res.data || [];
    const meta = (res as unknown as Record<string, unknown>).meta as { total?: number } || {
      page: pageIndex + 1,
      limit: pageSize,
      total: list.length,
    };
    const totalCount = meta.total || list.length;

    // 2. Fetch departments in parallel to resolve joins
    const deptsRes = await api.get<RawDepartment[]>('/departments', { params: { limit: 1000 } }).catch(() => ({ data: [] }));
    const depts = deptsRes.data || [];

    // 3. Filter and map
    let programs: Program[] = list.map((item) => {
      const dept = depts.find((d) => d.department_id === item.department_id);
      return {
        programId: item.program_id,
        departmentId: item.department_id,
        programCode: item.program_code,
        programName: item.program_name,
        degreeType: item.degree_type,
        durationValue: item.duration_value,
        durationUnit: item.duration_unit,
        totalSemesters: item.total_semesters,
        department: dept?.department_name || 'Computer Science',
        status: 'active',
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      };
    });

    // Client-side search / filters fallback if needed
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      programs = programs.filter(
        (p) =>
          p.programName.toLowerCase().includes(searchLower) ||
          p.programCode.toLowerCase().includes(searchLower)
      );
    }

    if (filters.department) {
      programs = programs.filter((p) => p.department === filters.department);
    }

    return {
      programs,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createProgram: async (
    prog: Omit<Program, 'createdAt' | 'updatedAt'>
  ): Promise<Program> => {
    // 1. Resolve department ID from list
    const deptsRes = await api.get<RawDepartment[]>('/departments').catch(() => ({ data: [] }));
    const depts = deptsRes.data || [];
    let dept = depts.find((d) => d.department_name === prog.department);
    if (!dept && depts.length > 0) {
      dept = depts[0];
    }
    const departmentId = dept?.department_id || '00000000-0000-0000-0000-000000000000';

    // 2. Create Program
    await api.post<unknown>('/programs', {
      department_id: departmentId,
      program_code: prog.programCode,
      program_name: prog.programName,
      degree_type: prog.degreeType.toUpperCase(),
      duration_value: Number(prog.durationValue),
      duration_unit: prog.durationUnit.toUpperCase(),
      total_semesters: Number(prog.totalSemesters),
    });

    // 3. Find created program from list
    const listRes = await api.get<RawProgram[]>('/programs');
    const list = listRes.data || [];
    const matched = list.find((item) => item.program_code === prog.programCode);

    if (!matched) throw new Error('Failed to resolve created program ID');

    return {
      ...prog,
      programId: matched.program_id,
      departmentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateProgram: async (
    programId: string,
    prog: Partial<Omit<Program, 'createdAt' | 'updatedAt'>>
  ): Promise<Program> => {
    // Simulated updates as backend v1.1 is frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...prog,
      programId,
      updatedAt: new Date().toISOString(),
    } as unknown as Program;
  },

  deleteProgram: async (programId: string): Promise<string> => {
    // Simulated deletion as backend v1.1 is frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return programId;
  },
};
