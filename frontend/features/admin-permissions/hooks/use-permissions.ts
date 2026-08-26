"use client";

import { useState, useEffect, useCallback } from 'react';
import { AdminPermission } from '../types';
import { adminPermissionService } from '../services';
import { toast } from 'sonner';

export function useAdminPermissions() {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminPermissionService.getPermissions(pageIndex, pageSize, search);
      setPermissions(res.permissions);
      setTotalCount(res.totalCount);
      setPageCount(res.pageCount);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    search,
    handlePageChange: setPageIndex,
    handlePageSizeChange: setPageSize,
    handleSearchChange: setSearch,
    refresh: fetchPermissions,
  };
}
