"use client";

import { useState, useEffect, useCallback } from 'react';
import { ExamAttempt, ExamAttemptFilters } from '../types';
import { examAttemptService } from '../services';
import { api } from '@/services/api';
import { toast } from 'sonner';

export type AttemptDrawerMode = 'create' | 'edit' | 'view';

interface SimpleRegistration {
  exam_registration_id: string;
  exam_id: string;
  enrollment_id: string;
}

interface SimpleExam {
  exam_id: string;
  exam_name?: string;
  course_code?: string;
  exam_type?: string;
  total_marks?: number | { Float64: number; Valid: boolean };
  passing_marks?: number | { Float64: number; Valid: boolean };
}

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

interface SimpleFaculty {
  faculty_profile_id: string;
  first_name: string;
  last_name: string;
}

export function useExamAttempts(initialPageSize = 10) {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<ExamAttemptFilters, 'search'>>({
    examId: '',
    registrationId: '',
    enrollmentId: '',
    status: '',
  });

  // Lookups for Dropdowns
  const [examOptions, setExamOptions] = useState<{ label: string; value: string }[]>([]);
  const [evaluatorOptions, setEvaluatorOptions] = useState<{ label: string; value: string }[]>([]);
  const [registrationOptions, setRegistrationOptions] = useState<{
    label: string;
    value: string;
    examId: string;
    maxMarks: number;
    passingMarks: number;
  }[]>([]);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<AttemptDrawerMode>('create');
  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(null);

  // Confirmation dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [attemptToDelete, setAttemptToDelete] = useState<ExamAttempt | null>(null);

  const fetchAttempts = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: ExamAttemptFilters = {
        search,
        ...filters,
      };
      const response = await examAttemptService.getExamAttempts(activeFilters, pageIndex, pageSize);
      setAttempts(response.attempts);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch exam attempts:', e);
      toast.error('Failed to load exam attempts list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  // Load filter and form lookups
  useEffect(() => {
    Promise.all([
      api.get<SimpleRegistration[]>('/exam-registrations').catch(() => ({ data: [] })),
      api.get<SimpleExam[]>('/exams').catch(() => ({ data: [] })),
      api.get<SimpleEnrollment[]>('/student-enrollments').catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students').catch(() => ({ data: [] })),
      api.get<SimpleFaculty[]>('/faculty').catch(() => ({ data: [] })),
    ])
      .then(([regsRes, examsRes, enrollmentsRes, studentsRes, facultyRes]) => {
        const regs = regsRes.data || [];
        const exams = examsRes.data || [];
        const enrollments = enrollmentsRes.data || [];
        const students = studentsRes.data || [];
        const faculty = facultyRes.data || [];

        // Evaluators lookup
        setEvaluatorOptions(
          faculty.map((f) => ({
            label: `Dr. ${f.first_name} ${f.last_name}`,
            value: f.faculty_profile_id,
          }))
        );

        // Exams lookup
        setExamOptions(
          exams.map((e) => ({
            label: e.exam_name || `${e.course_code} - ${e.exam_type}`,
            value: e.exam_id,
          }))
        );

        // Registrations lookup (resolves to student name + roll + course)
        setRegistrationOptions(
          regs.map((r) => {
            const exam = exams.find((e) => e.exam_id === r.exam_id);
            const enrollment = enrollments.find((en) => en.enrollment_id === r.enrollment_id);
            const student = enrollment ? students.find((s) => s.student_profile_id === enrollment.student_profile_id) : null;
            const sName = student ? `${student.first_name} ${student.last_name}` : 'N/A';
            const courseCode = exam?.course_code || 'N/A';
            const roll = enrollment?.enrollment_number || 'N/A';

            const max = exam
              ? (typeof exam.total_marks === 'object' && exam.total_marks !== null
                  ? exam.total_marks.Float64
                  : Number(exam.total_marks || 100))
              : 100;

            const passThreshold = exam
              ? (typeof exam.passing_marks === 'object' && exam.passing_marks !== null
                  ? exam.passing_marks.Float64
                  : Number(exam.passing_marks || 40))
              : 40;

            return {
              label: `${sName} (${roll}) - ${courseCode} (${exam?.exam_name || 'Exam'})`,
              value: r.exam_registration_id,
              examId: r.exam_id,
              maxMarks: max,
              passingMarks: passThreshold,
            };
          })
        );
      })
      .catch((err) => console.warn('Failed to load attempt lookups:', err));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAttempts();
  }, [fetchAttempts]);

  // Mutations
  const recordAttemptMarks = async (data: Omit<ExamAttempt, 'examAttemptId'>) => {
    setIsMutating(true);
    try {
      await examAttemptService.createExamAttempt(data);
      toast.success('Exam attempt marks recorded successfully');
      setIsDrawerOpen(false);
      fetchAttempts();
    } catch (e) {
      console.error('Error recording marks:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to record marks');
    } finally {
      setIsMutating(false);
    }
  };

  const updateAttemptMarks = async (
    attemptId: string,
    data: Partial<Omit<ExamAttempt, 'examAttemptId'>>
  ) => {
    setIsMutating(true);
    try {
      await examAttemptService.updateExamAttempt(attemptId, data);
      toast.success('Exam attempt marks updated successfully');
      setIsDrawerOpen(false);
      fetchAttempts();
    } catch (e) {
      console.error('Error updating marks:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to update marks');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteAttempt = async (attemptId: string) => {
    setIsMutating(true);
    try {
      await examAttemptService.deleteExamAttempt(attemptId);
      toast.success('Exam attempt deleted successfully');
      setIsConfirmOpen(false);
      setAttemptToDelete(null);
      fetchAttempts();
    } catch (e) {
      console.error('Error deleting attempt:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to delete attempt');
    } finally {
      setIsMutating(false);
    }
  };

  // Triggers
  const triggerCreate = () => {
    setSelectedAttempt(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const triggerEdit = (attempt: ExamAttempt) => {
    setSelectedAttempt(attempt);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const triggerView = (attempt: ExamAttempt) => {
    setSelectedAttempt(attempt);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const triggerDelete = (attempt: ExamAttempt) => {
    setAttemptToDelete(attempt);
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

  const handleFilterChange = (key: keyof Omit<ExamAttemptFilters, 'search'>, val: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: val,
    }));
    setPageIndex(0);
  };

  return {
    attempts,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    isMutating,
    search,
    filters,
    examOptions,
    evaluatorOptions,
    registrationOptions,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedAttempt,
    isConfirmOpen,
    setIsConfirmOpen,
    attemptToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    recordAttemptMarks,
    updateAttemptMarks,
    deleteAttempt,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  };
}
