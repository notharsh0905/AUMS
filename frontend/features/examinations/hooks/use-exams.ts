"use client";

import { useState, useEffect, useCallback } from 'react';
import { Examination, ExamFilters } from '../types';
import { examService } from '../services';
import { toast } from 'sonner';

export type ExamDrawerMode = 'create' | 'edit' | 'view' | 'schedule';

export function useExams(initialPageSize = 10) {
  const [exams, setExams] = useState<Examination[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<ExamFilters, 'search'>>({
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<ExamDrawerMode>('create');
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Examination | null>(null);

  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: ExamFilters = {
        search,
        ...filters,
      };
      const response = await examService.getExams(activeFilters, pageIndex, pageSize);
      setExams(response.exams);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch exams:', e);
      toast.error('Failed to load examinations');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExams();
  }, [fetchExams]);

  // Mutations
  const createExam = async (examData: Omit<Examination, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newExam = await examService.createExam(examData);
      setExams((prev) => [newExam, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Examination Scheduled Successfully');
      setIsDrawerOpen(false);

      fetchExams();
    } catch (e) {
      console.error('Error creating exam:', e);
      toast.error('Failed to create examination');
    } finally {
      setIsMutating(false);
    }
  };

  const updateExam = async (
    examId: string,
    examData: Partial<Omit<Examination, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await examService.updateExam(examId, examData);
      setExams((prev) => prev.map((e) => (e.examId === examId ? { ...e, ...updated } : e)));
      toast.success('Examination Schedule Updated');
      setIsDrawerOpen(false);

      fetchExams();
    } catch (e) {
      console.error('Error updating exam:', e);
      toast.error('Failed to update examination');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteExam = async (examId: string) => {
    setIsMutating(true);
    try {
      await examService.deleteExam(examId);
      setExams((prev) => prev.filter((e) => e.examId !== examId));
      setTotalCount((prev) => prev - 1);
      toast.success('Examination Cancelled / Deleted');
      setIsConfirmOpen(false);

      fetchExams();
    } catch (e) {
      console.error('Error deleting exam:', e);
      toast.error('Failed to delete examination');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedExam(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (exam: Examination) => {
    setDrawerMode('edit');
    setSelectedExam(exam);
    setIsDrawerOpen(true);
  };

  const triggerView = (exam: Examination) => {
    setDrawerMode('view');
    setSelectedExam(exam);
    setIsDrawerOpen(true);
  };

  const triggerSchedule = (exam: Examination) => {
    setDrawerMode('schedule');
    setSelectedExam(exam);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (exam: Examination) => {
    setExamToDelete(exam);
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
    exams,
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
    selectedExam,
    isConfirmOpen,
    setIsConfirmOpen,
    examToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerSchedule,
    triggerDelete,
    createExam,
    updateExam,
    deleteExam,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchExams,
  };
}
