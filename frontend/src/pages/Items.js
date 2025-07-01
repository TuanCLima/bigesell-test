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
  const { items, isLoading, pagination, fetchItems, searchQuery } = useData();
  const [currentPage, setCurrentPage] = useState(1);

  const renderContent = () => {
    if (isLoading) {
      return (
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
            marginRight: '10px'
          }}></div>
          Loading...
        </div>
      );
    }
    
    if (items.length === 0) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: '#2a2a2a', 
          margin: '20px',
          borderRadius: '8px',
          color: '#e0e0e0',
          fontSize: '18px'
        }}>
          {searchQuery && (
            <>
              <div>No items found for "{searchQuery}"</div>
              <div style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
                Try searching with different keywords
              </div>
            </>
          )}
        </div>
      );
    }
    
    return (
      <Virtuoso
        data={items}
        itemContent={ItemContent}
        style={{
          backgroundColor: '#1a1a1a',
          width: '100%'
        }}
      />
    );
  };

  useEffect(() => {
    const abortController = new AbortController();

    // Pass the abort signal to fetchItems with pagination and search
    fetchItems(abortController.signal, 10, currentPage, searchQuery).catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });

    // Clean‑up to avoid memory leak
    return () => {
      abortController.abort();
    };
  }, [fetchItems, currentPage, searchQuery]);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
      {searchQuery && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 20px',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
          border: '1px solid #444',
          color: '#e0e0e0',
          fontSize: '14px',
          maxWidth: '800px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>
            Showing results for: <span style={{ color: '#bb86fc', fontWeight: '500' }}>"{searchQuery}"</span>
            {pagination.totalItems > 0 && (
              <span style={{ color: '#888', marginLeft: '8px' }}>
                ({pagination.totalItems} item{pagination.totalItems !== 1 ? 's' : ''} found)
              </span>
            )}
          </span>
        </div>
      )}      
      <div style={{ 
        height: '70vh', 
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        border: '1px solid #333',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {renderContent()}
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