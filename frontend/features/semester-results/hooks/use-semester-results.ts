"use client";

import { useState, useEffect, useCallback } from 'react';
import { SemesterResult, SemesterResultFilters } from '../types';
import { semesterResultService } from '../services';
import { api } from '@/services/api';
import { toast } from 'sonner';

export type ResultDrawerMode = 'create' | 'edit' | 'view';

interface SimpleEnrollment {
  enrollment_id: string;
  student_profile_id: string;
  program_id: string;
  enrollment_number: string;
}

interface SimpleStudent {
  student_profile_id: string;
  first_name: string;
  last_name: string;
}

interface SimpleProgram {
  program_id: string;
  program_code: string;
  program_name: string;
}

interface SimpleSemester {
  semester_id: string;
  semester_name: string;
}

export function useSemesterResults(initialPageSize = 10) {
  const [results, setResults] = useState<SemesterResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<SemesterResultFilters, 'search'>>({
    enrollmentId: '',
    semesterId: '',
    status: '',
    programId: '',
  });

  // Dropdown options
  const [studentOptions, setStudentOptions] = useState<{ label: string; value: string }[]>([]);
  const [programOptions, setProgramOptions] = useState<{ label: string; value: string }[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<{ label: string; value: string }[]>([]);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<ResultDrawerMode>('create');
  const [selectedResult, setSelectedResult] = useState<SemesterResult | null>(null);

  // Deletion confirm states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<SemesterResult | null>(null);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: SemesterResultFilters = {
        search,
        ...filters,
      };
      const response = await semesterResultService.getSemesterResults(activeFilters, pageIndex, pageSize);
      setResults(response.results);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch semester results:', e);
      toast.error('Failed to load semester results list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  // Load dropdown lists
  useEffect(() => {
    Promise.all([
      api.get<SimpleEnrollment[]>('/student-enrollments').catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students').catch(() => ({ data: [] })),
      api.get<SimpleProgram[]>('/programs').catch(() => ({ data: [] })),
      api.get<SimpleSemester[]>('/semesters').catch(() => ({ data: [] })),
    ])
      .then(([enrollRes, studentRes, programRes, semRes]) => {
        const enrollments = enrollRes.data || [];
        const students = studentRes.data || [];
        const programs = programRes.data || [];
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

        // Program options
        setProgramOptions(
          programs.map((p) => ({
            label: `${p.program_code} - ${p.program_name}`,
            value: p.program_id,
          }))
        );

        // Semester options
        setSemesterOptions(
          semesters.map((s) => ({
            label: s.semester_name,
            value: s.semester_id,
          }))
        );
      })
      .catch((err) => console.warn('Failed to load lookup listings:', err));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResults();
  }, [fetchResults]);

  // Mutations
  const createResult = async (data: Omit<SemesterResult, 'semesterResultId'>) => {
    setIsMutating(true);
    try {
      await semesterResultService.createSemesterResult(data);
      toast.success('Semester SGPA result recorded successfully');
      setIsDrawerOpen(false);
      fetchResults();
    } catch (e) {
      console.error('Error creating semester result:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to save semester result');
    } finally {
      setIsMutating(false);
    }
  };

  const updateResult = async (
    id: string,
    data: Partial<Omit<SemesterResult, 'semesterResultId'>>
  ) => {
    setIsMutating(true);
    try {
      await semesterResultService.updateSemesterResult(id, data);
      toast.success('Semester SGPA result updated successfully');
      setIsDrawerOpen(false);
      fetchResults();
    } catch (e) {
      console.error('Error updating semester result:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to update semester result');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteResult = async (id: string) => {
    setIsMutating(true);
    try {
      await semesterResultService.deleteSemesterResult(id);
      toast.success('Semester SGPA result deleted successfully');
      setIsConfirmOpen(false);
      setResultToDelete(null);
      fetchResults();
    } catch (e) {
      console.error('Error deleting semester result:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to delete semester result');
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

  const triggerEdit = (res: SemesterResult) => {
    setSelectedResult(res);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const triggerView = (res: SemesterResult) => {
    setSelectedResult(res);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const triggerDelete = (res: SemesterResult) => {
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

  const handleFilterChange = (key: keyof Omit<SemesterResultFilters, 'search'>, val: string) => {
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
    programOptions,
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
