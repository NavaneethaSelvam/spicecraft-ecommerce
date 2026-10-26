
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const buttonBase =
    "inline-flex h-9 items-center justify-center gap-1 rounded-full border px-3 text-xs font-semibold transition sm:h-10 sm:px-4 sm:text-sm";

  const inactiveButton =
    "border-[#e7d8c7] bg-white text-[#654a35] hover:border-[#b78b62] hover:bg-[#faf3e9]";

  const disabledButton =
    "cursor-not-allowed border-[#eee7de] bg-[#f7f4ef] text-[#b7aa9b]";

  return (
    <nav
      className="flex w-full flex-wrap items-center justify-center gap-2"
      aria-label="Product pagination"
    >
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`${buttonBase} ${
          currentPage === 1 ? disabledButton : inactiveButton
        }`}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <button
            type="button"
            key={page}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange?.(page)}
            className={`h-9 min-w-9 rounded-full px-2 text-xs font-bold transition sm:h-10 sm:min-w-10 sm:text-sm ${
              currentPage === page
                ? "bg-[#754426] text-white shadow-sm"
                : "border border-[#e7d8c7] bg-white text-[#654a35] hover:bg-[#f5eadb]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`${buttonBase} ${
          currentPage === totalPages
            ? disabledButton
            : inactiveButton
        }`}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
