"use client";

import { useState, useEffect, useCallback } from 'react';
import { Assignment, AssignmentFilters } from '../types';
import { assignmentService } from '../services';
import { toast } from 'sonner';

export type AssignmentDrawerMode = 'create' | 'edit' | 'view';

export function useAssignments(initialPageSize = 10) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<AssignmentFilters, 'search'>>({
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<AssignmentDrawerMode>('create');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: AssignmentFilters = {
        search,
        ...filters,
      };
      const response = await assignmentService.getAssignments(activeFilters, pageIndex, pageSize);
      setAssignments(response.assignments);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch assignments:', e);
      toast.error('Failed to load assignments list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAssignments();
  }, [fetchAssignments]);

  // Mutations
  const createAssignment = async (assignData: Omit<Assignment, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newAssign = await assignmentService.createAssignment(assignData);
      setAssignments((prev) => [newAssign, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Assignment Created Successfully');
      setIsDrawerOpen(false);

      fetchAssignments();
    } catch (e) {
      console.error('Error creating assignment:', e);
      toast.error('Failed to create assignment');
    } finally {
      setIsMutating(false);
    }
  };

  const updateAssignment = async (
    assignmentId: string,
    assignData: Partial<Omit<Assignment, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await assignmentService.updateAssignment(assignmentId, assignData);
      setAssignments((prev) => prev.map((a) => (a.assignmentId === assignmentId ? { ...a, ...updated } : a)));
      toast.success('Assignment Updated Successfully');
      setIsDrawerOpen(false);

      fetchAssignments();
    } catch (e) {
      console.error('Error updating assignment:', e);
      toast.error('Failed to update assignment');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    setIsMutating(true);
    try {
      await assignmentService.deleteAssignment(assignmentId);
      setAssignments((prev) => prev.filter((a) => a.assignmentId !== assignmentId));
      setTotalCount((prev) => prev - 1);
      toast.success('Assignment Deleted Successfully');
      setIsConfirmOpen(false);

      fetchAssignments();
    } catch (e) {
      console.error('Error deleting assignment:', e);
      toast.error('Failed to delete assignment');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedAssignment(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (assign: Assignment) => {
    setDrawerMode('edit');
    setSelectedAssignment(assign);
    setIsDrawerOpen(true);
  };

  const triggerView = (assign: Assignment) => {
    setDrawerMode('view');
    setSelectedAssignment(assign);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (assign: Assignment) => {
    setAssignmentToDelete(assign);
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
    assignments,
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
    selectedAssignment,
    isConfirmOpen,
    setIsConfirmOpen,
    assignmentToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchAssignments,
  };
}
