import { api } from '@/services/api';
import { Semester, SemesterFilters, SemesterListResponse } from '../types';

interface RawSemester {
  semester_id: string;
  academic_year_id: string;
  semester_number: number;
  semester_name: string;
  start_date: string;
  end_date: string;
}

interface RawAcademicYear {
  academic_year_id: string;
  academic_year_name: string;
}

export const semesterService = {
  getSemesters: async (
    filters: SemesterFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<SemesterListResponse> => {
    // 1. Fetch raw semesters
    const res = await api.get<RawSemester[]>('/semesters', {
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

    // 2. Fetch parallel academic years to resolve names
    const ayRes = await api.get<RawAcademicYear[]>('/academic-years', {
      params: { limit: 1000 },
    }).catch(() => ({ data: [] }));
    const academicYearsList = ayRes.data || [];

    // 3. Map items
    let semesters: Semester[] = list.map((item) => {
      const ayItem = academicYearsList.find((ay) => ay.academic_year_id === item.academic_year_id);
      const startClean = item.start_date ? item.start_date.slice(0, 10) : '';
      const endClean = item.end_date ? item.end_date.slice(0, 10) : '';

      return {
        semesterId: item.semester_id,
        academicYearId: item.academic_year_id,
        academicYear: ayItem?.academic_year_name || 'Academic Year 2026-2027',
        semesterNumber: item.semester_number,
        semesterName: item.semester_name,
        startDate: startClean,
        endDate: endClean,
        status: 'active',
      };
    });

    // Client-side search / filter fallbacks
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      semesters = semesters.filter(
        (s) =>
          s.semesterName.toLowerCase().includes(searchLower) ||
          s.academicYear.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      semesters = semesters.filter((s) => s.status === filters.status);
    }

    if (filters.academicYear) {
      semesters = semesters.filter((s) => s.academicYear === filters.academicYear);
    }

    return {
      semesters,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createSemester: async (
    sem: Omit<Semester, 'createdAt' | 'updatedAt'>
  ): Promise<Semester> => {
    await api.post<unknown>('/semesters', {
      academic_year_id: sem.academicYearId,
      semester_number: Number(sem.semesterNumber),
      semester_name: sem.semesterName,
      start_date: sem.startDate,
      end_date: sem.endDate,
    });

    // Fetch list to resolve created ID
    const listRes = await api.get<RawSemester[]>('/semesters');
    const list = listRes.data || [];
    const matched = list.find(
      (item) =>
        item.semester_name === sem.semesterName &&
        item.academic_year_id === sem.academicYearId
    );

    if (!matched) throw new Error('Failed to resolve created semester ID');

    return {
      ...sem,
      semesterId: matched.semester_id,
    };
  },

  updateSemester: async (
    semesterId: string,
    sem: Partial<Omit<Semester, 'createdAt' | 'updatedAt'>>
  ): Promise<Semester> => {
    // Simulated updates as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...sem,
      semesterId,
    } as unknown as Semester;
  },

  deleteSemester: async (semesterId: string): Promise<string> => {
    // Simulated deletion as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return semesterId;
  },
};
