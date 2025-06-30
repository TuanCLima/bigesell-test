import React from 'react';

function Pagination({ pagination, currentPage, onPrevious, onNext }) {
  return (
    <div>
      <button onClick={onPrevious} disabled={!pagination.hasPrev}>
        Previous
      </button>
      <span> Page {pagination.currentPage} of {pagination.totalPages} </span>
      <button onClick={onNext} disabled={!pagination.hasNext}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
