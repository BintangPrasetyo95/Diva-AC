import React from 'react';

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ children, className = '' }: DataTableProps) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212] ${className}`}
    >
      {children}
    </div>
  );
}

export function DataTableInner({
  children,
  className = '',
}: DataTableProps) {
  return <div className={`overflow-x-auto ${className}`}>{children}</div>;
}

export function DataTableHead({
  children,
  className = '',
}: DataTableProps) {
  return (
    <thead className={`border-b border-[#1b1b18]/5 bg-[#1b1b18]/2 dark:border-white/5 dark:bg-white/2 ${className}`}>
      {children}
    </thead>
  );
}

export function DataTableBody({
  children,
  className = '',
}: DataTableProps) {
  return (
    <tbody className={`divide-y divide-[#1b1b18]/5 dark:divide-white/5 ${className}`}>
      {children}
    </tbody>
  );
}

interface DataTableCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function DataTableHeaderCell({
  children,
  className = '',
  ...props
}: DataTableCellProps) {
  return (
    <th
      className={`px-6 py-5 text-xs font-bold tracking-widest uppercase text-[#1b1b18]/40 dark:text-white/40 ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

interface DataTableBodyCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function DataTableCell({
  children,
  className = '',
  ...props
}: DataTableBodyCellProps) {
  return (
    <td className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </td>
  );
}
