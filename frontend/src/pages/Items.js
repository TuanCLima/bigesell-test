import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { Virtuoso } from 'react-virtuoso';

// Item renderer for react-virtuoso
const ItemContent = (index, item) => (
  <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
    <Link to={'/items/' + item.id}>{item.name}</Link>
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
    <div>      
      <div style={{ height: '400px', width: '100%' }}>
           {isLoading ? (
        <div style={{ 
          padding: '10px', 
          textAlign: 'center', 
          backgroundColor: '#f0f0f0', 
          marginBottom: '10px',
          borderRadius: '4px'
        }}>
          Loading...
        </div>
      ) :  <Virtuoso
          data={items}
          itemContent={ItemContent}
        />}
      </div>
      
      <Pagination 
        pagination={pagination}
        currentPage={currentPage}
        onPrevious={handlePrevPage}
        onNext={handleNextPage}
      />
    </div>
  );
}

export default Items;