export interface School {
  schoolId: string;
  schoolCode: string;
  schoolName: string;
  campusId?: string;
  campusName?: string;
  description?: string;
}

export interface CreateSchoolInput {
  campus_id: string;
  school_code: string;
  school_name: string;
  description?: string;
}

export interface SchoolListResponse {
  schools: School[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
