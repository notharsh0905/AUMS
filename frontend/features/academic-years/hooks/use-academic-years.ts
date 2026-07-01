"use client";

import { useState, useEffect, useCallback } from 'react';
import { AcademicYear, AcademicYearFilters } from '../types';
import { academicYearService } from '../services';
import { toast } from 'sonner';

export type AcademicYearDrawerMode = 'create' | 'edit' | 'view';

export function useAcademicYears(initialPageSize = 10) {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<AcademicYearFilters, 'search'>>({
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<AcademicYearDrawerMode>('create');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [academicYearToDelete, setAcademicYearToDelete] = useState<AcademicYear | null>(null);

  const fetchAcademicYears = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: AcademicYearFilters = {
        search,
        ...filters,
      };
      const response = await academicYearService.getAcademicYears(activeFilters, pageIndex, pageSize);
      setAcademicYears(response.academicYears);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch academic years:', e);
      toast.error('Failed to load academic years list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAcademicYears();
  }, [fetchAcademicYears]);

  // Mutations
  const createAcademicYear = async (ayData: Omit<AcademicYear, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newAy = await academicYearService.createAcademicYear(ayData);
      setAcademicYears((prev) => [newAy, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Academic Year Created Successfully');
      setIsDrawerOpen(false);

      fetchAcademicYears();
    } catch (e) {
      console.error('Error creating academic year:', e);
      toast.error('Failed to create academic year');
    } finally {
      setIsMutating(false);
    }
  };

  const updateAcademicYear = async (
    academicYearId: string,
    ayData: Partial<Omit<AcademicYear, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await academicYearService.updateAcademicYear(academicYearId, ayData);
      setAcademicYears((prev) => prev.map((ay) => (ay.academicYearId === academicYearId ? { ...ay, ...updated } : ay)));
      toast.success('Academic Year Updated Successfully');
      setIsDrawerOpen(false);

      fetchAcademicYears();
    } catch (e) {
      console.error('Error updating academic year:', e);
      toast.error('Failed to update academic year');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteAcademicYear = async (academicYearId: string) => {
    setIsMutating(true);
    try {
      await academicYearService.deleteAcademicYear(academicYearId);
      setAcademicYears((prev) => prev.filter((ay) => ay.academicYearId !== academicYearId));
      setTotalCount((prev) => prev - 1);
      toast.success('Academic Year Deleted Successfully');
      setIsConfirmOpen(false);

      fetchAcademicYears();
    } catch (e) {
      console.error('Error deleting academic year:', e);
      toast.error('Failed to delete academic year');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedAcademicYear(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (ay: AcademicYear) => {
    setDrawerMode('edit');
    setSelectedAcademicYear(ay);
    setIsDrawerOpen(true);
  };

  const triggerView = (ay: AcademicYear) => {
    setDrawerMode('view');
    setSelectedAcademicYear(ay);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (ay: AcademicYear) => {
    setAcademicYearToDelete(ay);
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
    academicYears,
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
    selectedAcademicYear,
    isConfirmOpen,
    setIsConfirmOpen,
    academicYearToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchAcademicYears,
  };
}
