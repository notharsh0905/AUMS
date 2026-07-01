"use client";

import { useState, useEffect, useCallback } from 'react';
import { StudentCourseRegistration, RegistrationFilters } from '../types';
import { registrationService } from '../services';
import { toast } from 'sonner';

export type RegistrationDrawerMode = 'create' | 'edit' | 'view';

export function useRegistrations(initialPageSize = 10) {
  const [registrations, setRegistrations] = useState<StudentCourseRegistration[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<RegistrationFilters, 'search'>>({
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<RegistrationDrawerMode>('create');
  const [selectedRegistration, setSelectedRegistration] = useState<StudentCourseRegistration | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<StudentCourseRegistration | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: RegistrationFilters = {
        search,
        ...filters,
      };
      const response = await registrationService.getRegistrations(activeFilters, pageIndex, pageSize);
      setRegistrations(response.registrations);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch registrations:', e);
      toast.error('Failed to load registrations list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Mutations
  const createRegistration = async (regData: Omit<StudentCourseRegistration, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newReg = await registrationService.createRegistration(regData);
      setRegistrations((prev) => [newReg, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Registration Created Successfully');
      setIsDrawerOpen(false);

      fetchRegistrations();
    } catch (e) {
      console.error('Error creating registration:', e);
      toast.error('Failed to register student for course');
    } finally {
      setIsMutating(false);
    }
  };

  const updateRegistration = async (
    registrationId: string,
    regData: Partial<Omit<StudentCourseRegistration, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await registrationService.updateRegistration(registrationId, regData);
      setRegistrations((prev) => prev.map((r) => (r.studentCourseRegistrationId === registrationId ? { ...r, ...updated } : r)));
      toast.success('Registration Updated Successfully');
      setIsDrawerOpen(false);

      fetchRegistrations();
    } catch (e) {
      console.error('Error updating registration:', e);
      toast.error('Failed to update registration');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteRegistration = async (registrationId: string) => {
    setIsMutating(true);
    try {
      await registrationService.deleteRegistration(registrationId);
      setRegistrations((prev) => prev.filter((r) => r.studentCourseRegistrationId !== registrationId));
      setTotalCount((prev) => prev - 1);
      toast.success('Registration Cancelled Successfully');
      setIsConfirmOpen(false);

      fetchRegistrations();
    } catch (e) {
      console.error('Error deleting registration:', e);
      toast.error('Failed to delete registration');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedRegistration(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (reg: StudentCourseRegistration) => {
    setDrawerMode('edit');
    setSelectedRegistration(reg);
    setIsDrawerOpen(true);
  };

  const triggerView = (reg: StudentCourseRegistration) => {
    setDrawerMode('view');
    setSelectedRegistration(reg);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (reg: StudentCourseRegistration) => {
    setRegistrationToDelete(reg);
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
    registrations,
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
    selectedRegistration,
    isConfirmOpen,
    setIsConfirmOpen,
    registrationToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createRegistration,
    updateRegistration,
    deleteRegistration,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchRegistrations,
  };
}
