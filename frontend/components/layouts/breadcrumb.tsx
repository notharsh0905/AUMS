"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

export function Breadcrumb() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname) return [];

    const paths = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Base root
    items.push({
      label: 'Home',
      href: '/dashboard',
      isLast: paths.length === 0,
    });

    let currentHref = '';
    paths.forEach((path, idx) => {
      if (path === 'dashboard' && idx === 0) {
        return;
      }

      currentHref += `/${path}`;
      const label = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      items.push({
        label,
        href: currentHref,
        isLast: idx === paths.length - 1,
      });
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1 && pathname === '/') {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0 text-zinc-400 dark:text-zinc-600" />
            )}
            {item.isLast ? (
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center"
              >
                {index === 0 && <Home className="h-3.5 w-3.5 mr-1" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
