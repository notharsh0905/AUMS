"use client";

import { useState, useEffect, useCallback } from 'react';
import { TimetableSlot, TimetableFilters } from '../types';
import { timetableService } from '../services';
import { toast } from 'sonner';

export type TimetableDrawerMode = 'create' | 'edit' | 'view';

export function useTimetable(initialPageSize = 10) {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<TimetableFilters, 'search'>>({
    dayOfWeek: '',
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<TimetableDrawerMode>('create');
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<TimetableSlot | null>(null);

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: TimetableFilters = {
        search,
        ...filters,
      };
      const response = await timetableService.getTimetableSlots(activeFilters, pageIndex, pageSize);
      setSlots(response.slots);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch timetable slots:', e);
      toast.error('Failed to load timetable list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSlots();
  }, [fetchSlots]);

  // Mutations
  const createSlot = async (slotData: Omit<TimetableSlot, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newSlot = await timetableService.createTimetableSlot(slotData);
      setSlots((prev) => [newSlot, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Timetable Slot Created Successfully');
      setIsDrawerOpen(false);

      fetchSlots();
    } catch (e) {
      console.error('Error creating slot:', e);
      toast.error('Failed to create timetable slot');
    } finally {
      setIsMutating(false);
    }
  };

  const updateSlot = async (
    timetableSlotId: string,
    slotData: Partial<Omit<TimetableSlot, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await timetableService.updateTimetableSlot(timetableSlotId, slotData);
      setSlots((prev) => prev.map((s) => (s.timetableSlotId === timetableSlotId ? { ...s, ...updated } : s)));
      toast.success('Timetable Slot Updated Successfully');
      setIsDrawerOpen(false);

      fetchSlots();
    } catch (e) {
      console.error('Error updating slot:', e);
      toast.error('Failed to update timetable slot');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteSlot = async (timetableSlotId: string) => {
    setIsMutating(true);
    try {
      await timetableService.deleteTimetableSlot(timetableSlotId);
      setSlots((prev) => prev.filter((s) => s.timetableSlotId !== timetableSlotId));
      setTotalCount((prev) => prev - 1);
      toast.success('Timetable Slot Deleted Successfully');
      setIsConfirmOpen(false);

      fetchSlots();
    } catch (e) {
      console.error('Error deleting slot:', e);
      toast.error('Failed to delete timetable slot');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedSlot(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (slot: TimetableSlot) => {
    setDrawerMode('edit');
    setSelectedSlot(slot);
    setIsDrawerOpen(true);
  };

  const triggerView = (slot: TimetableSlot) => {
    setDrawerMode('view');
    setSelectedSlot(slot);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (slot: TimetableSlot) => {
    setSlotToDelete(slot);
    setIsConfirmOpen(true);
  };

  const handlePageChange = (index: number) => {
    setPageIndex(index);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPageIndex(0);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPageIndex(0);
  };

  return {
    slots,
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
    selectedSlot,
    isConfirmOpen,
    setIsConfirmOpen,
    slotToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createSlot,
    updateSlot,
    deleteSlot,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchSlots,
  };
}
