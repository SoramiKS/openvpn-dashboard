// components/ui/SortableHeader.tsx
"use client";

import { TableHead } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
    children: React.ReactNode;
    column: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSort: (column: string) => void;
    className?: string;
}

export const SortableHeader = ({ children, column, sortBy, sortOrder, onSort, className }: SortableHeaderProps) => {
    const isActive = sortBy === column;

    return (
        <TableHead 
            className={cn("cursor-pointer hover:bg-muted/50", className)} 
            onClick={() => onSort(column)}
        >
            <div className="flex items-center">
                {children}
                {isActive && (
                    sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
            </div>
        </TableHead>
    );
};