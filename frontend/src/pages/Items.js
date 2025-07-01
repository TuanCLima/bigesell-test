import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { Virtuoso } from 'react-virtuoso';

// Item renderer for react-virtuoso
const ItemContent = (index, item) => (
  <div style={{ 
    padding: '16px 20px', 
    borderBottom: '1px solid #333',
    backgroundColor: '#1e1e1e',
    cursor: 'pointer'
  }}
  >
    <Link 
      to={'/items/' + item.id}
      style={{
        color: '#e0e0e0',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: '400',
        display: 'block',
      }}
    >
      {item.name}
    </Link>
  </div>
);

function Items() {
  const { items, isLoading, pagination, fetchItems } = useData();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const abortController = new AbortController();

    // Pass the abort signal to fetchItems with pagination
    fetchItems(abortController.signal, 10, currentPage).catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });

    // Clean‑up to avoid memory leak
    return () => {
      abortController.abort();
    };
  }, [fetchItems, currentPage]);

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading && !items.length) return <p>Loading...</p>;

  return (
    <div style={{
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: '#121212'
    }}>      
      <div style={{ 
        height: '70vh', 
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        border: '1px solid #333',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        position: 'relative' // Ensure proper positioning context
      }}>
        {isLoading ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            backgroundColor: '#2a2a2a', 
            margin: '20px',
            borderRadius: '8px',
            color: '#e0e0e0',
            fontSize: '18px'
          }}>
            <div style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid #bb86fc',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginRight: '10px'
            }}></div>
            Loading...
          </div>
        ) : (
          <Virtuoso
            data={items}
            itemContent={ItemContent}
            style={{
              backgroundColor: '#1a1a1a',
              width: '100%'
            }}
          />
        )}
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <Pagination 
          pagination={pagination}
          currentPage={currentPage}
          onPrevious={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>
    </div>
  );
}

export default Items;