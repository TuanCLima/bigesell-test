import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';

export const LOCALHOST_URL = 'http://localhost:3001';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
    hasNext: false,
    hasPrev: false
  });

  const fetchItems = useCallback(async (signal, limit = 10, page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${LOCALHOST_URL}/api/items?limit=${limit}&page=${page}`, {
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
    fetchItems
  }), [items, isLoading, pagination, fetchItems]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);