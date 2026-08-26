"use client";

import { useState, useEffect, useCallback } from 'react';
import { AdminRole } from '../types';
import { adminRoleService } from '../services';
import { toast } from 'sonner';

export function useAdminRoles() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminRoleService.getRoles(pageIndex, pageSize, search);
      setRoles(res.roles);
      setTotalCount(res.totalCount);
      setPageCount(res.pageCount);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoles();
  }, [fetchRoles]);

  const triggerView = (r: AdminRole) => {
    setSelectedRole(r);
    setIsDrawerOpen(true);
  };

  return {
    roles,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    search,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedRole,
    triggerView,
    handlePageChange: setPageIndex,
    handlePageSizeChange: setPageSize,
    handleSearchChange: setSearch,
    refresh: fetchRoles,
  };
}
