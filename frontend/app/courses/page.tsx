"use client";

import React from 'react';
import { BookOpen } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';
import { ProtectedRoute } from '@/utils/route-guards';

export default function CoursesPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        icon={BookOpen}
        title="Courses"
        description="Configure catalog courses, syllabus details, pre-requisites, and course allocation policies."
      />
    </ProtectedRoute>
  );
}
