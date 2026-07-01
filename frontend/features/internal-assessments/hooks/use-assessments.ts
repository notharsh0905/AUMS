"use client";

import { useState, useEffect, useCallback } from 'react';
import { InternalAssessment, AssessmentFilters } from '../types';
import { assessmentService } from '../services';
import { toast } from 'sonner';

export type AssessmentDrawerMode = 'create' | 'edit' | 'view' | 'breakdown';

export function useAssessments(initialPageSize = 10) {
  const [assessments, setAssessments] = useState<InternalAssessment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<AssessmentFilters, 'search'>>({
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<AssessmentDrawerMode>('create');
  const [selectedAssessment, setSelectedAssessment] = useState<InternalAssessment | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<InternalAssessment | null>(null);

  const fetchAssessments = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: AssessmentFilters = {
        search,
        ...filters,
      };
      const response = await assessmentService.getAssessments(activeFilters, pageIndex, pageSize);
      setAssessments(response.assessments);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch assessments:', e);
      toast.error('Failed to load internal assessments');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAssessments();
  }, [fetchAssessments]);

  // Mutations
  const createAssessment = async (data: Omit<InternalAssessment, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      await assessmentService.createAssessment(data);
      toast.success('Assessment Marks Saved');
      setIsDrawerOpen(false);

      fetchAssessments();
    } catch (e) {
      console.error('Error creating assessment:', e);
      toast.error('Failed to save assessment');
    } finally {
      setIsMutating(false);
    }
  };

  const updateAssessment = async (
    assessmentId: string,
    data: Partial<Omit<InternalAssessment, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      await assessmentService.updateAssessment(assessmentId, data);
      toast.success('Assessment Marks Updated');
      setIsDrawerOpen(false);

      fetchAssessments();
    } catch (e) {
      console.error('Error updating assessment:', e);
      toast.error('Failed to update assessment');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteAssessment = async (assessmentId: string) => {
    setIsMutating(true);
    try {
      await assessmentService.deleteAssessment(assessmentId);
      setAssessments((prev) => prev.filter((a) => a.assessmentId !== assessmentId));
      setTotalCount((prev) => prev - 1);
      toast.success('Assessment Deleted');
      setIsConfirmOpen(false);

      fetchAssessments();
    } catch (e) {
      console.error('Error deleting assessment:', e);
      toast.error('Failed to delete assessment');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedAssessment(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (assign: InternalAssessment) => {
    setDrawerMode('edit');
    setSelectedAssessment(assign);
    setIsDrawerOpen(true);
  };

  const triggerView = (assign: InternalAssessment) => {
    setDrawerMode('view');
    setSelectedAssessment(assign);
    setIsDrawerOpen(true);
  };

  const triggerBreakdown = (assign: InternalAssessment) => {
    setDrawerMode('breakdown');
    setSelectedAssessment(assign);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (assign: InternalAssessment) => {
    setAssessmentToDelete(assign);
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
    assessments,
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
    selectedAssessment,
    isConfirmOpen,
    setIsConfirmOpen,
    assessmentToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerBreakdown,
    triggerDelete,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchAssessments,
  };
}
