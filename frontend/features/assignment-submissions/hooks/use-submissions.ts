"use client";

import { useState, useEffect, useCallback } from 'react';
import { AssignmentSubmission, SubmissionFilters } from '../types';
import { submissionService } from '../services';
import { toast } from 'sonner';

export type SubmissionDrawerMode = 'create' | 'edit' | 'view' | 'grade';

export function useSubmissions(initialPageSize = 10) {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<SubmissionFilters, 'search'>>({
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<SubmissionDrawerMode>('create');
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<AssignmentSubmission | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: SubmissionFilters = {
        search,
        ...filters,
      };
      const response = await submissionService.getSubmissions(activeFilters, pageIndex, pageSize);
      setSubmissions(response.submissions);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch submissions:', e);
      toast.error('Failed to load submissions list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Mutations
  const createSubmission = async (subData: Omit<AssignmentSubmission, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newSub = await submissionService.createSubmission(subData);
      setSubmissions((prev) => [newSub, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Assignment Submitted Successfully');
      setIsDrawerOpen(false);

      fetchSubmissions();
    } catch (e) {
      console.error('Error creating submission:', e);
      toast.error('Failed to submit assignment');
    } finally {
      setIsMutating(false);
    }
  };

  const gradeSubmission = async (submissionId: string, marks: number, feedback: string) => {
    setIsMutating(true);
    try {
      await submissionService.gradeSubmission(submissionId, marks, feedback);
      toast.success('Submission Graded Successfully');
      setIsDrawerOpen(false);

      fetchSubmissions();
    } catch (e) {
      console.error('Error grading submission:', e);
      toast.error('Failed to grade submission');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteSubmission = async (submissionId: string) => {
    setIsMutating(true);
    try {
      await submissionService.deleteSubmission(submissionId);
      setSubmissions((prev) => prev.filter((s) => s.assignmentSubmissionId !== submissionId));
      setTotalCount((prev) => prev - 1);
      toast.success('Submission Record Deleted Successfully');
      setIsConfirmOpen(false);

      fetchSubmissions();
    } catch (e) {
      console.error('Error deleting submission:', e);
      toast.error('Failed to delete submission');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedSubmission(null);
    setIsDrawerOpen(true);
  };

  const triggerGrade = (sub: AssignmentSubmission) => {
    setDrawerMode('grade');
    setSelectedSubmission(sub);
    setIsDrawerOpen(true);
  };

  const triggerView = (sub: AssignmentSubmission) => {
    setDrawerMode('view');
    setSelectedSubmission(sub);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (sub: AssignmentSubmission) => {
    setSubmissionToDelete(sub);
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
    submissions,
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
    selectedSubmission,
    isConfirmOpen,
    setIsConfirmOpen,
    submissionToDelete,
    triggerCreate,
    triggerGrade,
    triggerView,
    triggerDelete,
    createSubmission,
    gradeSubmission,
    deleteSubmission,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchSubmissions,
  };
}
