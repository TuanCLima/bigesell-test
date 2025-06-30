import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async (signal) => {
    const res = await fetch('http://localhost:3001/api/items?limit=500', {
      signal
    }); // Intentional bug: backend ignores limit
    const json = await res.json();
    setItems(json);
  }, []);

  const contextValue = useMemo(() => ({
    items,
    fetchItems
  }), [items, fetchItems]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);