import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SkeletonVariant = 'text' | 'card' | 'table-row' | 'circle';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

export default function Skeleton({ variant = 'text', className, ...props }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";
  
  const variantClasses = {
    text: "h-4 w-3/4 rounded-md",
    card: "h-48 w-full rounded-xl",
    'table-row': "h-12 w-full rounded-md",
    circle: "h-12 w-12 rounded-full"
  };

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}
