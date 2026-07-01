"use client";

import { useState, useEffect, useCallback } from 'react';
import { ExamRegistration, ExamRegistrationFilters } from '../types';
import { examRegistrationService } from '../services';
import { api } from '@/services/api';
import { toast } from 'sonner';

export type RegistrationDrawerMode = 'create' | 'edit' | 'view';

interface SimpleExam {
  exam_id: string;
  exam_name?: string;
  course_code?: string;
  exam_type?: string;
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

export function useExamRegistrations(initialPageSize = 10) {
  const [registrations, setRegistrations] = useState<ExamRegistration[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<ExamRegistrationFilters, 'search'>>({
    examId: '',
    enrollmentId: '',
    status: '',
  });

  // Lookups for filter dropdowns
  const [examOptions, setExamOptions] = useState<{ label: string; value: string }[]>([]);
  const [studentOptions, setStudentOptions] = useState<{ label: string; value: string }[]>([]);

  // Drawer modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<RegistrationDrawerMode>('create');
  const [selectedRegistration, setSelectedRegistration] = useState<ExamRegistration | null>(null);

  // Cancellation confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<ExamRegistration | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: ExamRegistrationFilters = {
        search,
        ...filters,
      };
      const response = await examRegistrationService.getExamRegistrations(
        activeFilters,
        pageIndex,
        pageSize
      );
      setRegistrations(response.registrations);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch exam registrations:', e);
      toast.error('Failed to load exam registrations list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  // Load filter lookups
  useEffect(() => {
    Promise.all([
      api.get<SimpleExam[]>('/exams').catch(() => ({ data: [] })),
      api.get<SimpleEnrollment[]>('/student-enrollments').catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students').catch(() => ({ data: [] })),
    ])
      .then(([examsRes, enrollmentsRes, studentsRes]) => {
        const examList = examsRes.data || [];
        const enrollmentList = enrollmentsRes.data || [];
        const studentList = studentsRes.data || [];

        setExamOptions(
          examList.map((e) => ({
            label: e.exam_name || `${e.course_code} - ${e.exam_type}`,
            value: e.exam_id,
          }))
        );

        setStudentOptions(
          enrollmentList.map((enroll) => {
            const student = studentList.find((s) => s.student_profile_id === enroll.student_profile_id);
            const name = student ? `${student.first_name} ${student.last_name}`.trim() : 'N/A';
            return {
              label: `${name} (${enroll.enrollment_number})`,
              value: enroll.enrollment_id,
            };
          })
        );
      })
      .catch((err) => console.warn('Failed to load filter lookups:', err));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Actions
  const registerStudent = async (data: { examId: string; enrollmentId: string; registrationStatus: 'REGISTERED' | 'ABSENT' | 'DISQUALIFIED' }) => {
    setIsMutating(true);
    try {
      await examRegistrationService.createExamRegistration({
        examId: data.examId,
        enrollmentId: data.enrollmentId,
        registrationStatus: data.registrationStatus,
      });
      toast.success('Student Registered Successfully for Exam');
      setIsDrawerOpen(false);
      fetchRegistrations();
    } catch (e) {
      console.error('Error registering student:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to register student');
    } finally {
      setIsMutating(false);
    }
  };

  const updateRegistrationStatus = async (
    registrationId: string,
    status: 'REGISTERED' | 'ABSENT' | 'DISQUALIFIED'
  ) => {
    setIsMutating(true);
    try {
      await examRegistrationService.updateExamRegistration(registrationId, status);
      toast.success('Registration Status Updated');
      setIsDrawerOpen(false);
      fetchRegistrations();
    } catch (e) {
      console.error('Error updating status:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to update status');
    } finally {
      setIsMutating(false);
    }
  };

  const cancelRegistration = async (registrationId: string) => {
    setIsMutating(true);
    try {
      await examRegistrationService.deleteExamRegistration(registrationId);
      toast.success('Exam Registration Cancelled');
      setIsConfirmOpen(false);
      setRegistrationToDelete(null);
      fetchRegistrations();
    } catch (e) {
      console.error('Error cancelling registration:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to cancel registration');
    } finally {
      setIsMutating(false);
    }
  };

  // Triggers
  const triggerCreate = () => {
    setSelectedRegistration(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const triggerEdit = (reg: ExamRegistration) => {
    setSelectedRegistration(reg);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const triggerView = (reg: ExamRegistration) => {
    setSelectedRegistration(reg);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const triggerCancel = (reg: ExamRegistration) => {
    setRegistrationToDelete(reg);
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

  const handleFilterChange = (key: keyof Omit<ExamRegistrationFilters, 'search'>, val: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: val,
    }));
    setPageIndex(0);
  };

  return {
    registrations,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    isMutating,
    search,
    filters,
    examOptions,
    studentOptions,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedRegistration,
    isConfirmOpen,
    setIsConfirmOpen,
    registrationToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerCancel,
    registerStudent,
    updateRegistrationStatus,
    cancelRegistration,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  };
}
