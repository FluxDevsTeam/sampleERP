import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  
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
    return (
      <Pagination >
        <div className="overflow-hidden">
        <PaginationContent >
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPreviousPage && handlePageChange(currentPage - 1)}
              className={!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
            </PaginationItem>
          )}
          {currentPage > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {currentPage < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
          {currentPage < totalPages - 1 && totalPages > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
              className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
        </div>
      </Pagination>
    );
  };
  
  export default PaginationComponent;
  