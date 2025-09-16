// hooks/useTableSorting.ts
"use client";

import { useState } from "react";

type SortOrder = 'asc' | 'desc';

export const useTableSorting = (defaultColumn: string, defaultOrder: SortOrder = 'asc') => {
    const [sortBy, setSortBy] = useState<string>(defaultColumn);
    const [sortOrder, setSortOrder] = useState<SortOrder>(defaultOrder);

    const handleSort = (column: string) => {
        // Jika mengklik kolom yang sama, balik arahnya. Jika tidak, ganti kolom dan set ke 'asc'.
        const isAsc = sortBy === column && sortOrder === 'asc';
        setSortBy(column);
        setSortOrder(isAsc ? 'desc' : 'asc');
    };

    return { sortBy, sortOrder, handleSort };
};