"use client";

import { useState, useEffect, useCallback } from 'react';
import { Campus, CreateCampusInput } from '../types';
import { campusService } from '../services';
import { toast } from 'sonner';

export function useCampuses() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'view'>('create');
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);

  const fetchCampuses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await campusService.getCampuses(pageIndex, pageSize, search);
      setCampuses(res.campuses);
      setTotalCount(res.totalCount);
      setPageCount(res.pageCount);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load campuses');
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCampuses();
  }, [fetchCampuses]);

  const triggerCreate = () => {
    setSelectedCampus(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const triggerView = (c: Campus) => {
    setSelectedCampus(c);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const createCampus = async (data: CreateCampusInput) => {
    setIsMutating(true);
    try {
      await campusService.createCampus(data);
      toast.success('Campus created successfully');
      setIsDrawerOpen(false);
      fetchCampuses();
    } catch (e) {
      console.error(e);
      toast.error('Failed to create campus');
    } finally {
      setIsMutating(false);
    }
  };

  return {
    campuses,
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
    selectedCampus,
    triggerCreate,
    triggerView,
    createCampus,
    handlePageChange: setPageIndex,
    handlePageSizeChange: setPageSize,
    handleSearchChange: setSearch,
    refresh: fetchCampuses,
  };
}
