"use client";

import { useState, useEffect, useCallback } from 'react';
import { School, CreateSchoolInput } from '../types';
import { schoolService } from '../services';
import { toast } from 'sonner';

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'view'>('create');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const fetchSchools = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await schoolService.getSchools(pageIndex, pageSize, search);
      setSchools(res.schools);
      setTotalCount(res.totalCount);
      setPageCount(res.pageCount);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load schools');
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSchools();
  }, [fetchSchools]);

  const triggerCreate = () => {
    setSelectedSchool(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const triggerView = (s: School) => {
    setSelectedSchool(s);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const createSchool = async (data: CreateSchoolInput) => {
    setIsMutating(true);
    try {
      await schoolService.createSchool(data);
      toast.success('School created successfully');
      setIsDrawerOpen(false);
      fetchSchools();
    } catch (e) {
      console.error(e);
      toast.error('Failed to create school');
    } finally {
      setIsMutating(false);
    }
  };

  return {
    schools,
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
    selectedSchool,
    triggerCreate,
    triggerView,
    createSchool,
    handlePageChange: setPageIndex,
    handlePageSizeChange: setPageSize,
    handleSearchChange: setSearch,
    refresh: fetchSchools,
  };
}
