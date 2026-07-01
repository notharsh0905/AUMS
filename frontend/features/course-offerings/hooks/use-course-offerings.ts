"use client";

import { useState, useEffect, useCallback } from 'react';
import { CourseOffering, CourseOfferingFilters } from '../types';
import { courseOfferingService } from '../services';
import { toast } from 'sonner';

export type CourseOfferingDrawerMode = 'create' | 'edit' | 'view';

export function useCourseOfferings(initialPageSize = 10) {
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<CourseOfferingFilters, 'search'>>({
    academicYear: '',
    semester: '',
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<CourseOfferingDrawerMode>('create');
  const [selectedCourseOffering, setSelectedCourseOffering] = useState<CourseOffering | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [offeringToDelete, setOfferingToDelete] = useState<CourseOffering | null>(null);

  const fetchOfferings = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: CourseOfferingFilters = {
        search,
        ...filters,
      };
      const response = await courseOfferingService.getCourseOfferings(activeFilters, pageIndex, pageSize);
      setCourseOfferings(response.courseOfferings);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch course offerings:', e);
      toast.error('Failed to load offerings list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOfferings();
  }, [fetchOfferings]);

  // Mutations
  const createOffering = async (coData: Omit<CourseOffering, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newCo = await courseOfferingService.createCourseOffering(coData);
      setCourseOfferings((prev) => [newCo, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Course Offering Created Successfully');
      setIsDrawerOpen(false);

      fetchOfferings();
    } catch (e) {
      console.error('Error creating course offering:', e);
      toast.error('Failed to create course offering');
    } finally {
      setIsMutating(false);
    }
  };

  const updateOffering = async (
    courseOfferingId: string,
    coData: Partial<Omit<CourseOffering, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await courseOfferingService.updateCourseOffering(courseOfferingId, coData);
      setCourseOfferings((prev) => prev.map((co) => (co.courseOfferingId === courseOfferingId ? { ...co, ...updated } : co)));
      toast.success('Course Offering Updated Successfully');
      setIsDrawerOpen(false);

      fetchOfferings();
    } catch (e) {
      console.error('Error updating course offering:', e);
      toast.error('Failed to update course offering');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteOffering = async (courseOfferingId: string) => {
    setIsMutating(true);
    try {
      await courseOfferingService.deleteCourseOffering(courseOfferingId);
      setCourseOfferings((prev) => prev.filter((co) => co.courseOfferingId !== courseOfferingId));
      setTotalCount((prev) => prev - 1);
      toast.success('Course Offering Deleted Successfully');
      setIsConfirmOpen(false);

      fetchOfferings();
    } catch (e) {
      console.error('Error deleting course offering:', e);
      toast.error('Failed to delete course offering');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedCourseOffering(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (co: CourseOffering) => {
    setDrawerMode('edit');
    setSelectedCourseOffering(co);
    setIsDrawerOpen(true);
  };

  const triggerView = (co: CourseOffering) => {
    setDrawerMode('view');
    setSelectedCourseOffering(co);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (co: CourseOffering) => {
    setOfferingToDelete(co);
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
    courseOfferings,
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
    selectedCourseOffering,
    isConfirmOpen,
    setIsConfirmOpen,
    offeringToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createOffering,
    updateOffering,
    deleteOffering,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchOfferings,
  };
}
