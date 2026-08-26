"use client";

import { useState, useEffect, useCallback } from 'react';
import { AdminUser, CreateAdminUserInput } from '../types';
import { adminUserService } from '../services';
import { toast } from 'sonner';

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'view'>('create');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminUserService.getUsers(pageIndex, pageSize, search);
      setUsers(res.users);
      setTotalCount(res.totalCount);
      setPageCount(res.pageCount);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const triggerCreate = () => {
    setSelectedUser(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const triggerView = (u: AdminUser) => {
    setSelectedUser(u);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const createUser = async (data: CreateAdminUserInput) => {
    setIsMutating(true);
    try {
      await adminUserService.createUser(data);
      toast.success('User account created successfully');
      setIsDrawerOpen(false);
      fetchUsers();
    } catch (e) {
      console.error(e);
      toast.error('Failed to create user');
    } finally {
      setIsMutating(false);
    }
  };

  return {
    users,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    isMutating,
    search,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedUser,
    triggerCreate,
    triggerView,
    createUser,
    handlePageChange: setPageIndex,
    handlePageSizeChange: setPageSize,
    handleSearchChange: setSearch,
    refresh: fetchUsers,
  };
}
