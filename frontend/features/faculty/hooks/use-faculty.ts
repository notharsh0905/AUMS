"use client";

import { useState, useEffect, useCallback } from 'react';
import { Faculty, FacultyFilters } from '../types';
import { facultyService } from '../services';
import { toast } from 'sonner';

export type FacultyDrawerMode = 'create' | 'edit' | 'view';

export function useFaculty(initialPageSize = 10) {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<FacultyFilters, 'search'>>({
    status: '',
    department: '',
    employmentType: '',
    designation: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<FacultyDrawerMode>('create');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);

  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: FacultyFilters = {
        search,
        ...filters,
      };
      const response = await facultyService.getFaculty(activeFilters, pageIndex, pageSize);
      setFaculty(response.faculty);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch faculty:', e);
      toast.error('Failed to load faculty list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFaculty();
  }, [fetchFaculty]);

  // Mutations
  const createFaculty = async (facultyData: Omit<Faculty, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newMember = await facultyService.createFaculty(facultyData);
      setFaculty((prev) => [newMember, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Faculty Member Created Successfully');
      setIsDrawerOpen(false);

      fetchFaculty();
    } catch (e) {
      console.error('Error creating faculty:', e);
      toast.error('Failed to create faculty member');
    } finally {
      setIsMutating(false);
    }
  };

  const updateFaculty = async (
    facultyId: string,
    facultyData: Partial<Omit<Faculty, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await facultyService.updateFaculty(facultyId, facultyData);
      setFaculty((prev) => prev.map((f) => (f.facultyId === facultyId ? { ...f, ...updated } : f)));
      toast.success('Faculty Profile Updated Successfully');
      setIsDrawerOpen(false);

      fetchFaculty();
    } catch (e) {
      console.error('Error updating faculty:', e);
      toast.error('Failed to update faculty profile');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteFaculty = async (facultyId: string) => {
    setIsMutating(true);
    try {
      await facultyService.deleteFaculty(facultyId);
      setFaculty((prev) => prev.filter((f) => f.facultyId !== facultyId));
      setTotalCount((prev) => prev - 1);
      toast.success('Faculty Record Deleted Successfully');
      setIsConfirmOpen(false);

      fetchFaculty();
    } catch (e) {
      console.error('Error deleting faculty:', e);
      toast.error('Failed to delete faculty record');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedFaculty(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (member: Faculty) => {
    setDrawerMode('edit');
    setSelectedFaculty(member);
    setIsDrawerOpen(true);
  };

  const triggerView = (member: Faculty) => {
    setDrawerMode('view');
    setSelectedFaculty(member);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (member: Faculty) => {
    setFacultyToDelete(member);
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
    faculty,
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
    selectedFaculty,
    isConfirmOpen,
    setIsConfirmOpen,
    facultyToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchFaculty,
  };
}
