"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuth } from './auth-provider';

export interface AcademicYear {
  academic_year_id: string;
  academic_year_name: string;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'UPCOMING' | 'ARCHIVED' | string;
}

export interface Semester {
  semester_id: string;
  semester_name: string;
  semester_number: number;
  academic_year_id: string;
  start_date: string;
  end_date: string;
  status?: string;
}

interface AcademicContextType {
  academicYears: AcademicYear[];
  semesters: Semester[];
  activeYear: AcademicYear | null;
  activeSemester: Semester | null;
  selectedYearId: string;
  selectedSemesterId: string;
  setSelectedYearId: (id: string) => void;
  setSelectedSemesterId: (id: string) => void;
  isLoading: boolean;
  refreshAcademicContext: () => Promise<void>;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadAcademicData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [yearsRes, semRes] = await Promise.all([
        api.get<AcademicYear[]>('/academic-years').catch(() => ({ data: [] })),
        api.get<Semester[]>('/semesters').catch(() => ({ data: [] })),
      ]);

      const years = yearsRes.data || [];
      const sems = semRes.data || [];

      setAcademicYears(years);
      setSemesters(sems);

      // Pick active year or fallback to first
      const activeY = years.find((y) => y.status === 'ACTIVE') || years[0];
      if (activeY) {
        setSelectedYearId((prev) => prev || activeY.academic_year_id);
      }

      // Pick matching active semester
      if (sems.length > 0) {
        setSelectedSemesterId((prev) => prev || sems[0].semester_id);
      }
    } catch (e) {
      console.error('Failed to load academic context:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAcademicData();
  }, [loadAcademicData]);

  const activeYear = academicYears.find((y) => y.academic_year_id === selectedYearId) || academicYears[0] || null;
  const activeSemester = semesters.find((s) => s.semester_id === selectedSemesterId) || semesters[0] || null;

  return (
    <AcademicContext.Provider
      value={{
        academicYears,
        semesters,
        activeYear,
        activeSemester,
        selectedYearId,
        selectedSemesterId,
        setSelectedYearId,
        setSelectedSemesterId,
        isLoading,
        refreshAcademicContext: loadAcademicData,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
}
