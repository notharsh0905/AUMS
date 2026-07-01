"use client";

import { useState, useEffect, useCallback } from 'react';
import { AttendanceSession, StudentAttendanceRow, AttendanceFilters } from '../types';
import { attendanceService } from '../services';
import { toast } from 'sonner';

export type AttendanceDrawerMode = 'create' | 'edit' | 'view' | 'mark';

export function useAttendance(initialPageSize = 10) {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<AttendanceFilters, 'search'>>({
    status: '',
  });

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<AttendanceDrawerMode>('create');
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);

  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<AttendanceSession | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters: AttendanceFilters = {
        search,
        ...filters,
      };
      const response = await attendanceService.getAttendanceSessions(activeFilters, pageIndex, pageSize);
      setSessions(response.sessions);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (e) {
      console.error('Failed to fetch attendance sessions:', e);
      toast.error('Failed to load attendance list');
    } finally {
      setIsLoading(false);
    }
  }, [search, filters, pageIndex, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSessions();
  }, [fetchSessions]);

  // Mutations
  const createSession = async (sessData: Omit<AttendanceSession, 'createdAt' | 'updatedAt' | 'students' | 'totalStudents' | 'present' | 'absent' | 'percentage'>) => {
    setIsMutating(true);
    try {
      const newSess = await attendanceService.createAttendanceSession(sessData);
      setSessions((prev) => [newSess, ...prev.slice(0, pageSize - 1)]);
      setTotalCount((prev) => prev + 1);
      toast.success('Attendance Session Created Successfully');
      setIsDrawerOpen(false);

      fetchSessions();
    } catch (e) {
      console.error('Error creating attendance session:', e);
      toast.error('Failed to create attendance session');
    } finally {
      setIsMutating(false);
    }
  };

  const saveMarked = async (sessionId: string, rows: StudentAttendanceRow[]) => {
    setIsMutating(true);
    try {
      await attendanceService.saveMarkedAttendance(sessionId, rows);
      toast.success('Attendance Marked Successfully');
      setIsDrawerOpen(false);

      fetchSessions();
    } catch (e) {
      console.error('Error marking attendance:', e);
      toast.error('Failed to save attendance markings');
    } finally {
      setIsMutating(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    setIsMutating(true);
    try {
      await attendanceService.deleteAttendanceSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.attendanceSessionId !== sessionId));
      setTotalCount((prev) => prev - 1);
      toast.success('Attendance Session Deleted Successfully');
      setIsConfirmOpen(false);

      fetchSessions();
    } catch (e) {
      console.error('Error deleting attendance session:', e);
      toast.error('Failed to delete session');
    } finally {
      setIsMutating(false);
    }
  };

  // UI actions
  const triggerCreate = () => {
    setDrawerMode('create');
    setSelectedSession(null);
    setIsDrawerOpen(true);
  };

  const triggerMark = (sess: AttendanceSession) => {
    setDrawerMode('mark');
    setSelectedSession(sess);
    setIsDrawerOpen(true);
  };

  const triggerView = (sess: AttendanceSession) => {
    setDrawerMode('view');
    setSelectedSession(sess);
    setIsDrawerOpen(true);
  };

  const triggerDelete = (sess: AttendanceSession) => {
    setSessionToDelete(sess);
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
    sessions,
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
    selectedSession,
    isConfirmOpen,
    setIsConfirmOpen,
    sessionToDelete,
    triggerCreate,
    triggerMark,
    triggerView,
    triggerDelete,
    createSession,
    saveMarked,
    deleteSession,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
    refresh: fetchSessions,
  };
}
