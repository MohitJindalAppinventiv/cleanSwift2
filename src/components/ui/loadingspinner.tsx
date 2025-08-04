// src/components/ui/loading-spinner.tsx
import React from "react";

export const LoadingSpinner = ({ className = "" }) => (
  <div className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}>
    <span className="sr-only">Loading...</span>
  </div>
);