"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Search, Sun, Moon, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Breadcrumb } from './breadcrumb';
import { useAuth } from '@/providers/auth-provider';
import { CommandPalette } from '@/components/shared/command-palette';

interface HeaderProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Header({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Avoid hydration mismatch for theme toggle
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="h-16 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 md:hidden"
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Collapsed sidebar trigger */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden md:flex p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
              aria-label="Expand sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Breadcrumb container */}
          <div className="hidden sm:block">
            <Breadcrumb />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Command Palette Trigger Input */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="relative hidden md:flex items-center justify-between w-64 px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              <span>Search modules...</span>
            </span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          {/* User Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="User profile menu"
            >
              <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:flex flex-col items-start text-left">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username || 'User'}
                </span>
                <span className="text-[10px] text-zinc-400 leading-tight">
                  {user?.roles?.[0] || 'SUPER_ADMIN'}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 hidden lg:block" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl z-40 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/60 mb-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username || 'User'}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{user?.email || 'user@aums.edu'}</p>
                    <div className="mt-1.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono uppercase font-bold">
                        {user?.roles?.[0] || 'SUPER_ADMIN'}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings & Preferences</span>
                  </Link>

                  <div className="h-px bg-zinc-100 dark:bg-zinc-850 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}
