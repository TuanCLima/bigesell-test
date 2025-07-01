import React, { useState, useEffect } from 'react';
import { useData } from '../state/DataContext';

function SearchBar() {
  const { searchQuery, setSearchQuery } = useData();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Keep localQuery in sinc with context
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (event) => {
    setLocalQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setSearchQuery(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: '0 0 auto',
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
        <input
          type="text"
          placeholder="Search items..."
          value={localQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          style={{
            padding: '8px 36px 8px 12px',
            borderRadius: '6px',
            border: '1px solid #444',
            backgroundColor: '#2a2a2a',
            color: '#e0e0e0',
            fontSize: '14px',
            outline: 'none',
            width: '240px',
          }}
        />
        {localQuery && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: '22px',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
