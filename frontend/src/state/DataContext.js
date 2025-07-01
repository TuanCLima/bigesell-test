import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';

export const LOCALHOST_URL = 'http://localhost:3001';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
    hasNext: false,
    hasPrev: false
  });

  const fetchItems = useCallback(async (signal, limit = 10, page = 1, query = '') => {
    setIsLoading(true);
    try {
      const searchParam = query ? `&q=${encodeURIComponent(query)}` : '';
      const res = await fetch(`${LOCALHOST_URL}/api/items?limit=${limit}&page=${page}${searchParam}`, {
        signal
      });
      const json = await res.json();
      setItems(json.items);
      setPagination(json.pagination);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    items,
    isLoading,
    pagination,
    fetchItems,
    searchQuery,
    setSearchQuery
  }), [items, isLoading, pagination, fetchItems, searchQuery]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);