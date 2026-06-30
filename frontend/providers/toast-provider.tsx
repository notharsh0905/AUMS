"use client";

import { Toaster as SonnerToaster } from "sonner";

export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      theme="system"
      closeButton
      richColors
      expand={false}
    />
  );
}
