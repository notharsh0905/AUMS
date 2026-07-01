"use client";

import { useState, useEffect, useCallback } from 'react';
import { Course, CourseFilters } from '../types';
import { courseService } from '../services';
import { toast } from 'sonner';

export type CourseDrawerMode = 'create' | 'edit' | 'view';

export function useCourses(initialPageSize = 10) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<CourseFilters, 'search'>>({
    department: '',
    program: '',
    semester: '',
    courseType: '',
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<CourseDrawerMode>('create');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: CourseFilters = {
        search,
        ...filters,
      };
      const response = await courseService.getCourses(activeFilters, pageIndex, pageSize);
      setCourses(response.courses);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch courses:', e);
      toast.error('Failed to load courses list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses();
  }, [fetchCourses]);

  // Mutations
  const createCourse = async (courseData: Omit<Course, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newCourse = await courseService.createCourse(courseData);
      setCourses((prev) => [newCourse, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Course Created Successfully');
      setIsDrawerOpen(false);

      fetchCourses();
    } catch (e) {
      console.error('Error creating course:', e);
      toast.error('Failed to create course');
    } finally {
      setIsMutating(false);
    }
  };

  const updateCourse = async (
    courseId: string,
    courseData: Partial<Omit<Course, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await courseService.updateCourse(courseId, courseData);
      setCourses((prev) => prev.map((c) => (c.courseId === courseId ? { ...c, ...updated } : c)));
      toast.success('Course Updated Successfully');
      setIsDrawerOpen(false);

      fetchCourses();
    } catch (e) {
      console.error('Error updating course:', e);
      toast.error('Failed to update course');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    setIsMutating(true);
    try {
      await courseService.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.courseId !== courseId));
      setTotalCount((prev) => prev - 1);
      toast.success('Course Deleted Successfully');
      setIsConfirmOpen(false);

      fetchCourses();
    } catch (e) {
      console.error('Error deleting course:', e);
      toast.error('Failed to delete course');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedCourse(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (course: Course) => {
    setDrawerMode('edit');
    setSelectedCourse(course);
    setIsDrawerOpen(true);
  };

  const triggerView = (course: Course) => {
    setDrawerMode('view');
    setSelectedCourse(course);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (course: Course) => {
    setCourseToDelete(course);
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
    courses,
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
    selectedCourse,
    isConfirmOpen,
    setIsConfirmOpen,
    courseToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createCourse,
    updateCourse,
    deleteCourse,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchCourses,
  };
}
