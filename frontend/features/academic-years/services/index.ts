import { api } from '@/services/api';
import { AcademicYear, AcademicYearFilters, AcademicYearListResponse } from '../types';

interface RawAcademicYear {
  academic_year_id: string;
  academic_year_name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export const academicYearService = {
  getAcademicYears: async (
    filters: AcademicYearFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<AcademicYearListResponse> => {
    // 1. Fetch raw academic years
    const res = await api.get<RawAcademicYear[]>('/academic-years', {
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

    // 2. Perform mapping
    let academicYears: AcademicYear[] = list.map((item) => {
      const startClean = item.start_date ? item.start_date.slice(0, 10) : '';
      const endClean = item.end_date ? item.end_date.slice(0, 10) : '';

      // Determine code: e.g. "2026-2027" from "Academic Year 2026-2027"
      let codeVal = item.academic_year_name;
      if (item.academic_year_name.startsWith('Academic Year ')) {
        codeVal = item.academic_year_name.replace('Academic Year ', '');
      }

      return {
        academicYearId: item.academic_year_id,
        academicYearName: item.academic_year_name,
        code: codeVal,
        startDate: startClean,
        endDate: endClean,
        isCurrent: item.is_current,
        status: item.is_current ? 'active' : 'inactive',
      };
    });

    // Client-side search / filter fallbacks
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      academicYears = academicYears.filter(
        (ay) =>
          ay.academicYearName.toLowerCase().includes(searchLower) ||
          ay.code.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      academicYears = academicYears.filter((ay) => ay.status === filters.status);
    }

    return {
      academicYears,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createAcademicYear: async (
    ay: Omit<AcademicYear, 'createdAt' | 'updatedAt'>
  ): Promise<AcademicYear> => {
    // Submit year_name, start_date, end_date, is_current
    await api.post<unknown>('/academic-years', {
      year_name: ay.academicYearName,
      start_date: ay.startDate,
      end_date: ay.endDate,
      is_current: ay.isCurrent,
    });

    // Fetch list to find created ID
    const listRes = await api.get<RawAcademicYear[]>('/academic-years');
    const list = listRes.data || [];
    const matched = list.find((item) => item.academic_year_name === ay.academicYearName);

    if (!matched) throw new Error('Failed to resolve created academic year ID');

    return {
      ...ay,
      academicYearId: matched.academic_year_id,
    };
  },

  updateAcademicYear: async (
    academicYearId: string,
    ay: Partial<Omit<AcademicYear, 'createdAt' | 'updatedAt'>>
  ): Promise<AcademicYear> => {
    // Simulated updates as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...ay,
      academicYearId,
    } as unknown as AcademicYear;
  },

  deleteAcademicYear: async (academicYearId: string): Promise<string> => {
    // Simulated deletion as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return academicYearId;
  },
};
