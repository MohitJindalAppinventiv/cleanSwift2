import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  to: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-500">
      {items.map((item, index) => (
        <React.Fragment key={item.to}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {index === items.length - 1 ? (
            <span className="font-medium text-gray-900">{item.label}</span>
          ) : (
            <NavLink
              to={item.to}
              className="hover:text-gray-900 transition-colors"
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </NavLink>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}