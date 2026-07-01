"use client";

import { useState, useEffect, useCallback } from 'react';
import { Semester, SemesterFilters } from '../types';
import { semesterService } from '../services';
import { toast } from 'sonner';

export type SemesterDrawerMode = 'create' | 'edit' | 'view';

export function useSemesters(initialPageSize = 10) {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<SemesterFilters, 'search'>>({
    academicYear: '',
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<SemesterDrawerMode>('create');
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState<Semester | null>(null);

  const fetchSemesters = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: SemesterFilters = {
        search,
        ...filters,
      };
      const response = await semesterService.getSemesters(activeFilters, pageIndex, pageSize);
      setSemesters(response.semesters);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch semesters:', e);
      toast.error('Failed to load semesters list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSemesters();
  }, [fetchSemesters]);

  // Mutations
  const createSemester = async (semData: Omit<Semester, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newSem = await semesterService.createSemester(semData);
      setSemesters((prev) => [newSem, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Semester Created Successfully');
      setIsDrawerOpen(false);

      fetchSemesters();
    } catch (e) {
      console.error('Error creating semester:', e);
      toast.error('Failed to create semester');
    } finally {
      setIsMutating(false);
    }
  };

  const updateSemester = async (
    semesterId: string,
    semData: Partial<Omit<Semester, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await semesterService.updateSemester(semesterId, semData);
      setSemesters((prev) => prev.map((s) => (s.semesterId === semesterId ? { ...s, ...updated } : s)));
      toast.success('Semester Updated Successfully');
      setIsDrawerOpen(false);

      fetchSemesters();
    } catch (e) {
      console.error('Error updating semester:', e);
      toast.error('Failed to update semester');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteSemester = async (semesterId: string) => {
    setIsMutating(true);
    try {
      await semesterService.deleteSemester(semesterId);
      setSemesters((prev) => prev.filter((s) => s.semesterId !== semesterId));
      setTotalCount((prev) => prev - 1);
      toast.success('Semester Deleted Successfully');
      setIsConfirmOpen(false);

      fetchSemesters();
    } catch (e) {
      console.error('Error deleting semester:', e);
      toast.error('Failed to delete semester');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedSemester(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (sem: Semester) => {
    setDrawerMode('edit');
    setSelectedSemester(sem);
    setIsDrawerOpen(true);
  };

  const triggerView = (sem: Semester) => {
    setDrawerMode('view');
    setSelectedSemester(sem);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (sem: Semester) => {
    setSemesterToDelete(sem);
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
    semesters,
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
    selectedSemester,
    isConfirmOpen,
    setIsConfirmOpen,
    semesterToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createSemester,
    updateSemester,
    deleteSemester,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchSemesters,
  };
}
