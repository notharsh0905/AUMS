import { api } from '@/services/api';
import {
  RawExamRoom,
  ExamRoom,
  ExamRoomFilters,
  ExamRoomListResponse,
} from '../types';

const mapExamRoom = (raw: RawExamRoom): ExamRoom => ({
  examRoomId: raw.exam_room_id,
  building: raw.building,
  roomNumber: raw.room_number,
  roomName: raw.room_name,
  floor: raw.floor,
  block: raw.block || '',
  capacity: raw.capacity,
  roomType: raw.room_type,
  status: raw.status as 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE',
  hasProjector: raw.has_projector,
  hasAc: raw.has_ac,
  wheelchairAccessible: raw.wheelchair_accessible,
  institutionId: raw.institution_id,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

export const examRoomService = {
  getExamRooms: async (
    filters: ExamRoomFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<ExamRoomListResponse> => {
    const res = await api.get<RawExamRoom[]>('/exam-rooms', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        search: filters.search || undefined,
        status: filters.status || undefined,
        room_type: filters.roomType || undefined,
      },
    });

    const list = res.data || [];
    const meta = (res as unknown as Record<string, unknown>).meta as { total?: number } || {
      page: pageIndex + 1,
      limit: pageSize,
      total: list.length,
    };
    const totalCount = meta.total || list.length;

    const examRooms = list.map(mapExamRoom);

    return {
      examRooms,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  getExamRoom: async (id: string): Promise<ExamRoom> => {
    const res = await api.get<RawExamRoom>(`/exam-rooms/${id}`);
    if (!res.data) {
      throw new Error('No exam room data returned');
    }
    return mapExamRoom(res.data);
  },

  createExamRoom: async (room: Omit<ExamRoom, 'createdAt' | 'updatedAt'>): Promise<ExamRoom> => {
    const res = await api.post<RawExamRoom>('/exam-rooms', {
      building: room.building,
      room_number: room.roomNumber,
      room_name: room.roomName,
      floor: Number(room.floor),
      block: room.block || undefined,
      capacity: Number(room.capacity),
      room_type: room.roomType,
      status: room.status,
      has_projector: room.hasProjector,
      has_ac: room.hasAc,
      wheelchair_accessible: room.wheelchairAccessible,
      institution_id: room.institutionId,
    });
    if (!res.data) {
      throw new Error('No exam room data returned on create');
    }
    return mapExamRoom(res.data);
  },

  updateExamRoom: async (
    id: string,
    room: Partial<Omit<ExamRoom, 'createdAt' | 'updatedAt'>>
  ): Promise<ExamRoom> => {
    const res = await api.put<RawExamRoom>(`/exam-rooms/${id}`, {
      building: room.building,
      room_number: room.roomNumber,
      room_name: room.roomName,
      floor: room.floor !== undefined ? Number(room.floor) : undefined,
      block: room.block || undefined,
      capacity: room.capacity !== undefined ? Number(room.capacity) : undefined,
      room_type: room.roomType,
      status: room.status,
      has_projector: room.hasProjector,
      has_ac: room.hasAc,
      wheelchair_accessible: room.wheelchairAccessible,
    });
    if (!res.data) {
      throw new Error('No exam room data returned on update');
    }
    return mapExamRoom(res.data);
  },

  deleteExamRoom: async (id: string): Promise<string> => {
    await api.delete(`/exam-rooms/${id}`);
    return id;
  },
};
