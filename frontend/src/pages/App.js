import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <DataProvider>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#ffffff'
      }}>
        <nav style={{
          padding: '16px 24px',
          borderBottom: '1px solid #333',
          backgroundColor: '#1e1e1e',
        }}>
          {isHomePage ? (
            <span
              style={{
                color: '#666',
                fontSize: '18px',
                fontWeight: '500',
              }}
            >
              Items
            </span>
          ) : (
            <Link 
              to="/"
              style={{
                color: '#bb86fc',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '500',
              }}
            >
              Items
            </Link>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </div>
    </DataProvider>
  );
}

export default App;