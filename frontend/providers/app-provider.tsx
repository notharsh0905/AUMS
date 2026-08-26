"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";
import { AcademicProvider } from "./academic-context";
import { ToastProvider } from "./toast-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AcademicProvider>
          {children}
          <ToastProvider />
        </AcademicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
