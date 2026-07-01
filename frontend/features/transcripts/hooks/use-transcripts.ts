"use client";

import { useState, useEffect, useCallback } from 'react';
import { TranscriptResponse } from '../types';
import { transcriptService } from '../services';
import { toast } from 'sonner';

export function useTranscript(studentId: string) {
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTranscript = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await transcriptService.getTranscript(studentId);
      setTranscript(data);
    } catch (e: unknown) {
      console.error('Failed to fetch transcript:', e);
      const msg = e instanceof Error ? e.message : 'Failed to load student transcript';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTranscript();
  }, [fetchTranscript]);

  return {
    transcript,
    isLoading,
    error,
    refetch: fetchTranscript,
  };
}
