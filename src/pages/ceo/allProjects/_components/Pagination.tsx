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
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 sm:mt-6 mb-4">
      <div className="flex justify-center items-center space-x-1 sm:space-x-2">
        {/* Previous button */}
        <button
          onClick={() => hasPreviousPage && handlePageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center">
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-xs sm:text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                className={`w-7 h-7 sm:w-8 sm:h-8 mx-0.5 sm:mx-1 flex items-center justify-center rounded-md text-xs sm:text-sm ${
                  currentPage === page
                    ? "bg-blue-400 text-white"
                    : "border hover:bg-blue-300"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next button */}
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
