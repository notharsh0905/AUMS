"use client";

import { useState, useEffect, useCallback } from 'react';
import { Student, StudentFilters } from '../types';
import { studentService } from '../services';

export function useStudents(initialPageSize = 10) {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<StudentFilters, 'search'>>({
    status: '',
    department: '',
    program: '',
  });

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
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
  }, [fetchStudents]);

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
    search,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchStudents,
  };
}
