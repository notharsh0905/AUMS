import { api } from '@/services/api';
import { CreateCampusInput, CampusListResponse } from '../types';

interface RawCampus {
  campus_id: string;
  campus_code: string;
  campus_name: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export const campusService = {
  getCampuses: async (pageIndex: number, pageSize: number, search?: string): Promise<CampusListResponse> => {
    const res = await api.get<RawCampus[]>('/campuses', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
      },
    }).catch(() => ({ data: [] }));

    let list = (res.data || []).map((c) => ({
      campusId: c.campus_id,
      campusCode: c.campus_code,
      campusName: c.campus_name,
      addressLine1: c.address_line_1 || '',
      addressLine2: c.address_line_2 || '',
      city: c.city || '',
      state: c.state || '',
      country: c.country || '',
      postalCode: c.postal_code || '',
    }));

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.campusName.toLowerCase().includes(q) || c.campusCode.toLowerCase().includes(q));
    }

    return {
      campuses: list,
      totalCount: list.length,
      pageCount: Math.ceil(list.length / pageSize) || 1,
      pageIndex,
      pageSize,
    };
  },

  createCampus: async (data: CreateCampusInput): Promise<void> => {
    await api.post('/campuses', data);
  },
};
