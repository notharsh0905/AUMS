"use client";

import { useState, useEffect, useCallback } from 'react';
import { FacultyCourseAllocation, AllocationFilters } from '../types';
import { allocationService } from '../services';
import { toast } from 'sonner';

export type AllocationDrawerMode = 'create' | 'edit' | 'view';

export function useAllocations(initialPageSize = 10) {
  const [allocations, setAllocations] = useState<FacultyCourseAllocation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<AllocationFilters, 'search'>>({
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<AllocationDrawerMode>('create');
  const [selectedAllocation, setSelectedAllocation] = useState<FacultyCourseAllocation | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [allocationToDelete, setAllocationToDelete] = useState<FacultyCourseAllocation | null>(null);

  const fetchAllocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: AllocationFilters = {
        search,
        ...filters,
      };
      const response = await allocationService.getAllocations(activeFilters, pageIndex, pageSize);
      setAllocations(response.allocations);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch allocations:', e);
      toast.error('Failed to load faculty allocations list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllocations();
  }, [fetchAllocations]);

  // Mutations
  const createAllocation = async (allocData: Omit<FacultyCourseAllocation, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newAlloc = await allocationService.createAllocation(allocData);
      setAllocations((prev) => [newAlloc, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Allocation Created Successfully');
      setIsDrawerOpen(false);

      fetchAllocations();
    } catch (e) {
      console.error('Error creating allocation:', e);
      toast.error('Failed to create allocation');
    } finally {
      setIsMutating(false);
    }
  };

  const updateAllocation = async (
    allocationId: string,
    allocData: Partial<Omit<FacultyCourseAllocation, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await allocationService.updateAllocation(allocationId, allocData);
      setAllocations((prev) => prev.map((a) => (a.facultyCourseAllocationId === allocationId ? { ...a, ...updated } : a)));
      toast.success('Allocation Updated Successfully');
      setIsDrawerOpen(false);

      fetchAllocations();
    } catch (e) {
      console.error('Error updating allocation:', e);
      toast.error('Failed to update allocation');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteAllocation = async (allocationId: string) => {
    setIsMutating(true);
    try {
      await allocationService.deleteAllocation(allocationId);
      setAllocations((prev) => prev.filter((a) => a.facultyCourseAllocationId !== allocationId));
      setTotalCount((prev) => prev - 1);
      toast.success('Allocation Deleted Successfully');
      setIsConfirmOpen(false);

      fetchAllocations();
    } catch (e) {
      console.error('Error deleting allocation:', e);
      toast.error('Failed to delete allocation');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedAllocation(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (alloc: FacultyCourseAllocation) => {
    setDrawerMode('edit');
    setSelectedAllocation(alloc);
    setIsDrawerOpen(true);
  };

  const triggerView = (alloc: FacultyCourseAllocation) => {
    setDrawerMode('view');
    setSelectedAllocation(alloc);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (alloc: FacultyCourseAllocation) => {
    setAllocationToDelete(alloc);
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
    allocations,
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
    selectedAllocation,
    isConfirmOpen,
    setIsConfirmOpen,
    allocationToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createAllocation,
    updateAllocation,
    deleteAllocation,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchAllocations,
  };
}
