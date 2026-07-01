"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ComingSoon({ icon: Icon, title, description }: ComingSoonProps) {
  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader title={title} description={description} />
        <ContentArea>
          <div className="flex flex-col items-center justify-center min-h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-8 text-center shadow-sm">
            <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 text-zinc-500 dark:text-zinc-400 mb-4">
              <Icon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              {title} Module
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
              {description}
            </p>
            <span className="inline-flex items-center rounded-full bg-zinc-900 px-3.5 py-1 text-xs font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
              Coming in Frontend V1
            </span>
          </div>
        </ContentArea>
      </PageContainer>
    </DashboardLayout>
  );
}
