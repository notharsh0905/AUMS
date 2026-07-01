"use client";

import { useState, useEffect, useCallback } from 'react';
import { Program, ProgramFilters } from '../types';
import { programService } from '../services';
import { toast } from 'sonner';

export type ProgramDrawerMode = 'create' | 'edit' | 'view';

export function usePrograms(initialPageSize = 10) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<ProgramFilters, 'search'>>({
    department: '',
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<ProgramDrawerMode>('create');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  const fetchPrograms = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: ProgramFilters = {
        search,
        ...filters,
      };
      const response = await programService.getPrograms(activeFilters, pageIndex, pageSize);
      setPrograms(response.programs);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch programs:', e);
      toast.error('Failed to load programs list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPrograms();
  }, [fetchPrograms]);

  // Mutations
  const createProgram = async (progData: Omit<Program, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newProg = await programService.createProgram(progData);
      setPrograms((prev) => [newProg, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Program Created Successfully');
      setIsDrawerOpen(false);

      fetchPrograms();
    } catch (e) {
      console.error('Error creating program:', e);
      toast.error('Failed to create program');
    } finally {
      setIsMutating(false);
    }
  };

  const updateProgram = async (
    programId: string,
    progData: Partial<Omit<Program, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await programService.updateProgram(programId, progData);
      setPrograms((prev) => prev.map((p) => (p.programId === programId ? { ...p, ...updated } : p)));
      toast.success('Program Updated Successfully');
      setIsDrawerOpen(false);

      fetchPrograms();
    } catch (e) {
      console.error('Error updating program:', e);
      toast.error('Failed to update program');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteProgram = async (programId: string) => {
    setIsMutating(true);
    try {
      await programService.deleteProgram(programId);
      setPrograms((prev) => prev.filter((p) => p.programId !== programId));
      setTotalCount((prev) => prev - 1);
      toast.success('Program Deleted Successfully');
      setIsConfirmOpen(false);

      fetchPrograms();
    } catch (e) {
      console.error('Error deleting program:', e);
      toast.error('Failed to delete program');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedProgram(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (prog: Program) => {
    setDrawerMode('edit');
    setSelectedProgram(prog);
    setIsDrawerOpen(true);
  };

  const triggerView = (prog: Program) => {
    setDrawerMode('view');
    setSelectedProgram(prog);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (prog: Program) => {
    setProgramToDelete(prog);
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
    programs,
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
    selectedProgram,
    isConfirmOpen,
    setIsConfirmOpen,
    programToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createProgram,
    updateProgram,
    deleteProgram,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchPrograms,
  };
}
