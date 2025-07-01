import React from 'react';

function Pagination({ pagination, onPrevious, onNext }) {
  const buttonStyle = {
    padding: '12px 24px',
    margin: '0 8px',
    backgroundColor: '#bb86fc',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#333',
    color: '#666',
    cursor: 'not-allowed',
  };

  const pageInfoStyle = {
    margin: '0 20px',
    fontSize: '16px',
    color: '#e0e0e0',
    fontWeight: '400'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <button 
        onClick={onPrevious} 
        disabled={!pagination.hasPrev}
        style={pagination.hasPrev ? buttonStyle : disabledButtonStyle}
      >
        ← Previous
      </button>
      <span style={pageInfoStyle}>
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
      <button 
        onClick={onNext} 
        disabled={!pagination.hasNext}
        style={pagination.hasNext ? buttonStyle : disabledButtonStyle}
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
