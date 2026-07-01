"use client";

import { useState, useEffect, useCallback } from 'react';
import { Department, DepartmentFilters } from '../types';
import { departmentService } from '../services';
import { toast } from 'sonner';

export type DepartmentDrawerMode = 'create' | 'edit' | 'view';

export function useDepartments(initialPageSize = 10) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<DepartmentFilters, 'search'>>({
    school: '',
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DepartmentDrawerMode>('create');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: DepartmentFilters = {
        search,
        ...filters,
      };
      const response = await departmentService.getDepartments(activeFilters, pageIndex, pageSize);
      setDepartments(response.departments);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch departments:', e);
      toast.error('Failed to load departments list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDepartments();
  }, [fetchDepartments]);

  // Mutations
  const createDepartment = async (deptData: Omit<Department, 'createdAt' | 'updatedAt'>) => {
    setIsMutating(true);
    try {
      const newDept = await departmentService.createDepartment(deptData);
      setDepartments((prev) => [newDept, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Department Created Successfully');
      setIsDrawerOpen(false);

      fetchDepartments();
    } catch (e) {
      console.error('Error creating department:', e);
      toast.error('Failed to create department');
    } finally {
      setIsMutating(false);
    }
  };

  const updateDepartment = async (
    departmentId: string,
    deptData: Partial<Omit<Department, 'createdAt' | 'updatedAt'>>
  ) => {
    setIsMutating(true);
    try {
      const updated = await departmentService.updateDepartment(departmentId, deptData);
      setDepartments((prev) => prev.map((d) => (d.departmentId === departmentId ? { ...d, ...updated } : d)));
      toast.success('Department Updated Successfully');
      setIsDrawerOpen(false);

      fetchDepartments();
    } catch (e) {
      console.error('Error updating department:', e);
      toast.error('Failed to update department');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteDepartment = async (departmentId: string) => {
    setIsMutating(true);
    try {
      await departmentService.deleteDepartment(departmentId);
      setDepartments((prev) => prev.filter((d) => d.departmentId !== departmentId));
      setTotalCount((prev) => prev - 1);
      toast.success('Department Deleted Successfully');
      setIsConfirmOpen(false);

      fetchDepartments();
    } catch (e) {
      console.error('Error deleting department:', e);
      toast.error('Failed to delete department');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedDepartment(null);
    setIsDrawerOpen(true);
  };

  const triggerEdit = (dept: Department) => {
    setDrawerMode('edit');
    setSelectedDepartment(dept);
    setIsDrawerOpen(true);
  };

  const triggerView = (dept: Department) => {
    setDrawerMode('view');
    setSelectedDepartment(dept);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (dept: Department) => {
    setDepartmentToDelete(dept);
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
    departments,
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
    selectedDepartment,
    isConfirmOpen,
    setIsConfirmOpen,
    departmentToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchDepartments,
  };
}
