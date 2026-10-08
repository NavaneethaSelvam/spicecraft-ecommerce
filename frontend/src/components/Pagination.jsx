import React from "react";
import "./Pagination.css";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
    }
  };

  return (
    <nav className="pagination" aria-label="Product pagination">
      <button
        type="button"
        className="pagination-btn"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>

      <div className="pagination-pages">
        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <button
            type="button"
            key={page}
            className={`pagination-page ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pagination-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </nav>
  );
};

export default Pagination;