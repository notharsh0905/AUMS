"use client";

import React from 'react';
import { UserPlus, UserCog, FolderPlus, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RequireRole, RequirePermission } from '@/components/shared/rbac';
import { QuickActionData } from '../types';

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'user-plus': UserPlus,
  'user-cog': UserCog,
  'folder-plus': FolderPlus,
  'award': Award,
};

interface QuickActionsProps {
  actions: QuickActionData[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const renderButton = (action: QuickActionData) => {
    const IconComponent = actionIcons[action.icon] || UserPlus;

    return (
      <Button
        key={action.id}
        variant="outline"
        className="flex items-center gap-2.5 justify-start h-11 px-4 text-sm font-medium border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 w-full"
      >
        <IconComponent className="h-4.5 w-4.5 text-zinc-500" />
        <span>{action.label}</span>
      </Button>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Rapid console tools (RBAC authorized)</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-1">
        {actions.map((action) => {
          if (action.requiredRoles) {
            return (
              <RequireRole key={action.id} roles={action.requiredRoles} fallback={null}>
                {renderButton(action)}
              </RequireRole>
            );
          }

          if (action.requiredPermissions) {
            return (
              <RequirePermission
                key={action.id}
                permissions={action.requiredPermissions}
                fallback={null}
              >
                {renderButton(action)}
              </RequirePermission>
            );
          }

          return renderButton(action);
        })}
      </CardContent>
    </Card>
  );
}
