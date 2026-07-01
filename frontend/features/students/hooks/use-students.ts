"use client";

import { useState, useEffect, useCallback } from 'react';
import { Student, StudentFilters } from '../types';
import { studentService } from '../services';
import { toast } from 'sonner';

export type StudentDrawerMode = 'create' | 'edit' | 'view';

export function useStudents(initialPageSize = 10) {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<StudentFilters, 'search'>>({
    status: '',
    department: '',
    program: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<StudentDrawerMode>('create');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: StudentFilters = {
        search,
        ...filters,
      };
      const response = await studentService.getStudents(activeFilters, pageIndex, pageSize);
      setStudents(response.students);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch students:', e);
      toast.error('Failed to load students list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
  }, [fetchStudents]);

  // Mutations
  const createStudent = async (studentData: Omit<Student, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newStudent = await studentService.createStudent(studentData);
      // Optimistic UI updates
      setStudents((prev) => [newStudent, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Student Created Successfully');
      setIsDrawerOpen(false);

      // Refresh to align with live backend
      fetchStudents();
    } catch (e) {
      console.error('Error creating student:', e);
      toast.error('Failed to create student');
    } finally {
      setIsMutating(false);
    }
  };

  const updateStudent = async (
    studentId: string,
    studentData: Partial<Omit<Student, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await studentService.updateStudent(studentId, studentData);
      // Optimistic UI updates
      setStudents((prev) => prev.map((s) => (s.studentId === studentId ? updated : s)));
      toast.success('Student Updated Successfully');
      setIsDrawerOpen(false);

      // Refresh to align with live backend
      fetchStudents();
    } catch (e) {
      console.error('Error updating student:', e);
      toast.error('Failed to update student');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteStudent = async (studentId: string) => {
    setIsMutating(true);
    try {
      await studentService.deleteStudent(studentId);
      // Optimistic UI updates
      setStudents((prev) => prev.filter((s) => s.studentId !== studentId));
      setTotalCount((prev) => prev - 1);
      toast.success('Student Deleted Successfully');
      setIsConfirmOpen(false);

      // Refresh to align with live backend
      fetchStudents();
    } catch (e) {
      console.error('Error deleting student:', e);
      toast.error('Failed to delete student');
    } finally {
      setIsMutating(false);
    }
  };

  // UI action triggers
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedStudent(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (student: Student) => {
    setDrawerMode('edit');
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const triggerView = (student: Student) => {
    setDrawerMode('view');
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (student: Student) => {
    setStudentToDelete(student);
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
    students,
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
    selectedStudent,
    isConfirmOpen,
    setIsConfirmOpen,
    studentToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createStudent,
    updateStudent,
    deleteStudent,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchStudents,
  };
}
