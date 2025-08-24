// src/pages/admin/assets/_components/Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  handlePageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  handlePageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    if (currentPage > 2) {
      pages.push(1);
    }
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    if (currentPage < totalPages - 1 && totalPages > 1) {
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 sm:mt-6 mb-4">
      <div className="flex justify-center items-center space-x-1 sm:space-x-2">
        <button
          onClick={() => hasPreviousPage && handlePageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex items-center">
          {pageNumbers.map((page, index) => {
            if (index > 0 && pageNumbers[index - 1] !== page - 1) {
              return (
                <React.Fragment key={`ellipsis-${page}`}>
                  <span className="px-1 sm:px-2 text-xs sm:text-sm">...</span>
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 mx-0.5 sm:mx-1 flex items-center justify-center rounded-md text-xs sm:text-sm ${
                      currentPage === page
                        ? "bg-neutral-900 text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            }
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-7 h-7 sm:w-8 sm:h-8 mx-0.5 sm:mx-1 flex items-center justify-center rounded-md text-xs sm:text-sm ${
                  currentPage === page
                    ? "bg-neutral-900 text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;