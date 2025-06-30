import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async (signal, limit = 500) => {
    const res = await fetch(`http://localhost:3001/api/items?limit=${limit}`, {
      signal
    });
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