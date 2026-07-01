"use client";

import { useState, useEffect, useCallback } from 'react';
import { ProgramResult, ProgramResultFilters } from '../types';
import { programResultService } from '../services';
import { api } from '@/services/api';
import { toast } from 'sonner';

export type ResultDrawerMode = 'create' | 'edit' | 'view';

interface SimpleEnrollment {
  enrollment_id: string;
  student_profile_id: string;
  program_id: string;
  academic_year_id: string;
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

interface SimpleAcademicYear {
  academic_year_id: string;
  academic_year_name: string;
}

export function useProgramResults(initialPageSize = 10) {
  const [results, setResults] = useState<ProgramResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<ProgramResultFilters, 'search'>>({
    enrollmentId: '',
    programId: '',
    status: '',
    batch: '',
  });

  // Dropdown list options
  const [studentOptions, setStudentOptions] = useState<{ label: string; value: string }[]>([]);
  const [programOptions, setProgramOptions] = useState<{ label: string; value: string }[]>([]);
  const [batchOptions, setBatchOptions] = useState<{ label: string; value: string }[]>([]);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<ResultDrawerMode>('create');
  const [selectedResult, setSelectedResult] = useState<ProgramResult | null>(null);

  // Deletion confirm states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<ProgramResult | null>(null);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: ProgramResultFilters = {
        search,
        ...filters,
      };
      const response = await programResultService.getProgramResults(activeFilters, pageIndex, pageSize);
      setResults(response.results);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch program results:', e);
      toast.error('Failed to load program results list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  // Load dropdown selectors options list
  useEffect(() => {
    Promise.all([
      api.get<SimpleEnrollment[]>('/student-enrollments').catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students').catch(() => ({ data: [] })),
      api.get<SimpleProgram[]>('/programs').catch(() => ({ data: [] })),
      api.get<SimpleAcademicYear[]>('/academic-years').catch(() => ({ data: [] })),
    ])
      .then(([enrollRes, studentRes, programRes, batchRes]) => {
        const enrollments = enrollRes.data || [];
        const students = studentRes.data || [];
        const programs = programRes.data || [];
        const academicYears = batchRes.data || [];

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

        // Batch options (academic year names represent batches)
        setBatchOptions(
          academicYears.map((ay) => ({
            label: `Batch ${ay.academic_year_name}`,
            value: ay.academic_year_name, // we filter client side by batch string
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
  const createResult = async (
    data: Omit<
      ProgramResult,
      | 'programResultId'
      | 'createdAt'
      | 'updatedAt'
      | 'creditsRemaining'
      | 'overallPercentage'
      | 'degreeClassification'
      | 'graduationEligibility'
      | 'academicStanding'
    >
  ) => {
    setIsMutating(true);
    try {
      await programResultService.createProgramResult(data);
      toast.success('Program graduation CGPA recorded successfully');
      setIsDrawerOpen(false);
      fetchResults();
    } catch (e) {
      console.error('Error creating program result:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to save program result');
    } finally {
      setIsMutating(false);
    }
  };

  const updateResult = async (
    id: string,
    data: Partial<
      Omit<
        ProgramResult,
        | 'programResultId'
        | 'createdAt'
        | 'updatedAt'
        | 'creditsRemaining'
        | 'overallPercentage'
        | 'degreeClassification'
        | 'graduationEligibility'
        | 'academicStanding'
      >
    >
  ) => {
    setIsMutating(true);
    try {
      await programResultService.updateProgramResult(id, data);
      toast.success('Program graduation CGPA updated successfully');
      setIsDrawerOpen(false);
      fetchResults();
    } catch (e) {
      console.error('Error updating program result:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to update program result');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteResult = async (id: string) => {
    setIsMutating(true);
    try {
      await programResultService.deleteProgramResult(id);
      toast.success('Program graduation CGPA deleted successfully');
      setIsConfirmOpen(false);
      setResultToDelete(null);
      fetchResults();
    } catch (e) {
      console.error('Error deleting program result:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to delete program result');
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

  const triggerEdit = (res: ProgramResult) => {
    setSelectedResult(res);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const triggerView = (res: ProgramResult) => {
    setSelectedResult(res);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const triggerDelete = (res: ProgramResult) => {
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

  const handleFilterChange = (key: keyof Omit<ProgramResultFilters, 'search'>, val: string) => {
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
    batchOptions,
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
