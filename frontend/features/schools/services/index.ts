import { api } from '@/services/api';
import { School, CreateSchoolInput, SchoolListResponse } from '../types';

interface RawSchool {
  school_id: string;
  school_code: string;
  school_name: string;
  description?: string;
}

interface RawCampus {
  campus_id: string;
  campus_name: string;
}

export const schoolService = {
  getSchools: async (pageIndex: number, pageSize: number, search?: string): Promise<SchoolListResponse> => {
    const [schoolsRes, campusesRes] = await Promise.all([
      api.get<RawSchool[]>('/schools', {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
        },
      }).catch(() => ({ data: [] })),
      api.get<RawCampus[]>('/campuses').catch(() => ({ data: [] })),
    ]);

    const campuses = campusesRes.data || [];
    let list: School[] = (schoolsRes.data || []).map((s) => ({
      schoolId: s.school_id,
      schoolCode: s.school_code,
      schoolName: s.school_name,
      description: s.description || '',
      campusName: campuses[0]?.campus_name || 'Main Campus',
    }));

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.schoolName.toLowerCase().includes(q) || s.schoolCode.toLowerCase().includes(q));
    }

    return {
      schools: list,
      totalCount: list.length,
      pageCount: Math.ceil(list.length / pageSize) || 1,
      pageIndex,
      pageSize,
    };
  },

  createSchool: async (data: CreateSchoolInput): Promise<void> => {
    await api.post('/schools', data);
  },
};
