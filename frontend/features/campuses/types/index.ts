export interface Campus {
  campusId: string;
  campusCode: string;
  campusName: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface CreateCampusInput {
  campus_code: string;
  campus_name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface CampusListResponse {
  campuses: Campus[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
