"use client";

import { useState, useEffect, useCallback } from 'react';
import { ExamRoom, ExamRoomFilters } from '../types';
import { examRoomService } from '../services';
import { toast } from 'sonner';

export type ExamRoomDrawerMode = 'create' | 'edit' | 'view';

export function useExamRooms(initialPageSize = 10) {
  const [examRooms, setExamRooms] = useState<ExamRoom[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<ExamRoomFilters, 'search'>>({
    status: '',
    roomType: '',
    building: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<ExamRoomDrawerMode>('create');
  const [selectedRoom, setSelectedRoom] = useState<ExamRoom | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<ExamRoom | null>(null);

  const fetchExamRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: ExamRoomFilters = {
        search,
        ...filters,
      };
      const response = await examRoomService.getExamRooms(activeFilters, pageIndex, pageSize);
      setExamRooms(response.examRooms);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch exam rooms:', e);
      toast.error('Failed to load exam rooms list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExamRooms();
  }, [fetchExamRooms]);

  // Mutations
  const createExamRoom = async (roomData: Omit<ExamRoom, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newRoom = await examRoomService.createExamRoom(roomData);
      setExamRooms((prev) => [newRoom, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Exam Room Created Successfully');
      setIsDrawerOpen(false);

      fetchExamRooms();
    } catch (e) {
      console.error('Error creating exam room:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to create exam room');
    } finally {
      setIsMutating(false);
    }
  };

  const updateExamRoom = async (
    examRoomId: string,
    roomData: Partial<Omit<ExamRoom, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await examRoomService.updateExamRoom(examRoomId, roomData);
      setExamRooms((prev) =>
        prev.map((r) => (r.examRoomId === examRoomId ? { ...r, ...updated } : r))
      );
      toast.success('Exam Room Updated Successfully');
      setIsDrawerOpen(false);

      fetchExamRooms();
    } catch (e) {
      console.error('Error updating exam room:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to update exam room');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteExamRoom = async (examRoomId: string) => {
    setIsMutating(true);
    try {
      await examRoomService.deleteExamRoom(examRoomId);
      setExamRooms((prev) => prev.filter((r) => r.examRoomId !== examRoomId));
      setTotalCount((prev) => Math.max(0, prev - 1));
      toast.success('Exam Room Deleted Successfully');
      setIsConfirmOpen(false);
      setRoomToDelete(null);

      fetchExamRooms();
    } catch (e) {
      console.error('Error deleting exam room:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to delete exam room');
    } finally {
      setIsMutating(false);
    }
  };

  // Trigger Helpers
  const triggerCreate = () => {
    setSelectedRoom(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const triggerEdit = (room: ExamRoom) => {
    setSelectedRoom(room);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const triggerView = (room: ExamRoom) => {
    setSelectedRoom(room);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const triggerDelete = (room: ExamRoom) => {
    setRoomToDelete(room);
    setIsConfirmOpen(true);
  };

  // Pagination/Filter Handlers
  const handlePageChange = (index: number) => {
    setPageIndex(index);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPageIndex(0);
  };

  const handleFilterChange = (key: keyof Omit<ExamRoomFilters, 'search'>, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  return {
    examRooms,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    isMutating,
    search,
    filters,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedRoom,
    isConfirmOpen,
    setIsConfirmOpen,
    roomToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createExamRoom,
    updateExamRoom,
    deleteExamRoom,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  };
}
