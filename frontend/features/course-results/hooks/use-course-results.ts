"use client";

import { useState, useEffect, useCallback } from 'react';
import { CourseResult, CourseResultFilters } from '../types';
import { courseResultService } from '../services';
import { api } from '@/services/api';
import { toast } from 'sonner';

export type ResultDrawerMode = 'create' | 'edit' | 'view';

interface SimpleEnrollment {
  enrollment_id: string;
  student_profile_id: string;
  enrollment_number: string;
}

interface SimpleStudent {
  student_profile_id: string;
  first_name: string;
  last_name: string;
}

interface SimpleOffering {
  course_offering_id: string;
  course_id: string;
  semester_id: string;
}

interface SimpleCourse {
  course_id: string;
  course_code: string;
  course_name: string;
}

interface SimpleSemester {
  semester_id: string;
  semester_name: string;
}

export function useCourseResults(initialPageSize = 10) {
  const [results, setResults] = useState<CourseResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<CourseResultFilters, 'search'>>({
    enrollmentId: '',
    courseOfferingId: '',
    status: '',
    semesterId: '',
  });

  // Dropdown Lookups
  const [studentOptions, setStudentOptions] = useState<{ label: string; value: string }[]>([]);
  const [courseOfferingOptions, setCourseOfferingOptions] = useState<{ label: string; value: string }[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<{ label: string; value: string }[]>([]);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<ResultDrawerMode>('create');
  const [selectedResult, setSelectedResult] = useState<CourseResult | null>(null);

  // Confirm delete states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<CourseResult | null>(null);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: CourseResultFilters = {
        search,
        ...filters,
      };
      const response = await courseResultService.getCourseResults(activeFilters, pageIndex, pageSize);
      setResults(response.results);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch course results:', e);
      toast.error('Failed to load course results list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  // Load dropdown options
  useEffect(() => {
    Promise.all([
      api.get<SimpleEnrollment[]>('/student-enrollments').catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students').catch(() => ({ data: [] })),
      api.get<SimpleOffering[]>('/course-offerings').catch(() => ({ data: [] })),
      api.get<SimpleCourse[]>('/courses').catch(() => ({ data: [] })),
      api.get<SimpleSemester[]>('/semesters').catch(() => ({ data: [] })),
    ])
      .then(([enrollRes, studentRes, offeringRes, courseRes, semRes]) => {
        const enrollments = enrollRes.data || [];
        const students = studentRes.data || [];
        const offerings = offeringRes.data || [];
        const courses = courseRes.data || [];
        const semesters = semRes.data || [];

        // Student options
        setStudentOptions(
          enrollments.map((en) => {
            const student = students.find((s) => s.student_profile_id === en.student_profile_id);
            const name = student ? `${student.first_name} ${student.last_name}`.trim() : 'N/A';
            return {
              label: `${name} (${en.enrollment_number})`,
              value: en.enrollment_id,
            };
          })
        );

        // Course Offering options
        setCourseOfferingOptions(
          offerings.map((off) => {
            const course = courses.find((c) => c.course_id === off.course_id);
            const semester = semesters.find((s) => s.semester_id === off.semester_id);
            const label = course
              ? `${course.course_code} - ${course.course_name} (${semester?.semester_name || 'Term'})`
              : `Offering ${off.course_offering_id}`;
            return {
              label,
              value: off.course_offering_id,
            };
          })
        );

        // Semester options
        setSemesterOptions(
          semesters.map((s) => ({
            label: s.semester_name,
            value: s.semester_id,
          }))
        );
      })
      .catch((err) => console.warn('Failed to load lookup configurations:', err));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResults();
  }, [fetchResults]);

  // Mutations
  const createResult = async (data: Omit<CourseResult, 'courseResultId'>) => {
    setIsMutating(true);
    try {
      await courseResultService.createCourseResult(data);
      toast.success('Course result record created successfully');
      setIsDrawerOpen(false);
      fetchResults();
    } catch (e) {
      console.error('Error creating course result:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to create course result');
    } finally {
      setIsMutating(false);
    }
  };

  const updateResult = async (
    id: string,
    data: Partial<Omit<CourseResult, 'courseResultId'>>
  ) => {
    setIsMutating(true);
    try {
      await courseResultService.updateCourseResult(id, data);
      toast.success('Course result record updated successfully');
      setIsDrawerOpen(false);
      fetchResults();
    } catch (e) {
      console.error('Error updating course result:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to update course result');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteResult = async (id: string) => {
    setIsMutating(true);
    try {
      await courseResultService.deleteCourseResult(id);
      toast.success('Course result record deleted successfully');
      setIsConfirmOpen(false);
      setResultToDelete(null);
      fetchResults();
    } catch (e) {
      console.error('Error deleting course result:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to delete course result');
    } finally {
      setIsMutating(false);
    }
  };

  // Triggers
  const triggerCreate = () => {
    setSelectedResult(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const triggerEdit = (res: CourseResult) => {
    setSelectedResult(res);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const triggerView = (res: CourseResult) => {
    setSelectedResult(res);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const triggerDelete = (res: CourseResult) => {
    setResultToDelete(res);
    setIsConfirmOpen(true);
  };

  // Handlers
  const handlePageChange = (index: number) => {
    setPageIndex(index);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPageIndex(0);
  };

  const handleFilterChange = (key: keyof Omit<CourseResultFilters, 'search'>, val: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: val,
    }));
    setPageIndex(0);
  };

  return {
    results,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    isMutating,
    search,
    filters,
    studentOptions,
    courseOfferingOptions,
    semesterOptions,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedResult,
    isConfirmOpen,
    setIsConfirmOpen,
    resultToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createResult,
    updateResult,
    deleteResult,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  };
}
