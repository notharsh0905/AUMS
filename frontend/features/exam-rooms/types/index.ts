export interface RawExamRoom {
  exam_room_id: string;
  building: string;
  room_number: string;
  room_name: string;
  floor: number;
  block?: string;
  capacity: number;
  room_type: string;
  status: string;
  has_projector: boolean;
  has_ac: boolean;
  wheelchair_accessible: boolean;
  institution_id: string;
  created_at: string;
  updated_at: string;
}

export interface ExamRoom {
  examRoomId: string;
  building: string;
  roomNumber: string;
  roomName: string;
  floor: number;
  block?: string;
  capacity: number;
  roomType: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  hasProjector: boolean;
  hasAc: boolean;
  wheelchairAccessible: boolean;
  institutionId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamRoomFilters {
  search?: string;
  status?: string;
  roomType?: string;
  building?: string;
}

export interface ExamRoomListResponse {
  examRooms: ExamRoom[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
