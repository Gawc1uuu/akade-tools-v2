import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginatorProps {
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
  showPreviousNext: boolean;
  className?: string;
}

const Paginator = ({ onPageChange, page, totalPages, showPreviousNext, className }: PaginatorProps) => {
  return (
    <Pagination className={className}>
      <PaginationContent>
        {showPreviousNext && totalPages ? (
          <PaginationItem>
            <PaginationPrevious
              className={`${page === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => page > 1 && onPageChange(page - 1)}
              disabled={page === 1}
            />
          </PaginationItem>
        ) : null}
        {generatePaginationLinks(page, totalPages, onPageChange)}
        {showPreviousNext && totalPages ? (
          <PaginationItem>
            <PaginationNext
              className={`${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => page < totalPages && onPageChange(page + 1)}
              disabled={page === totalPages}
            />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
};

export default Paginator;

const generatePaginationLinks = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
  const pages: React.ReactNode[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            className={`${i === currentPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
  } else {
    for (let i = 1; i <= 2; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    if (currentPage > 2 && currentPage < totalPages - 1) {
      pages.push(<PaginationEllipsis key="start-ellipsis" />);
      pages.push(
        <PaginationItem key={currentPage}>
          <PaginationLink onClick={() => onPageChange(currentPage)} isActive={true}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    pages.push(<PaginationEllipsis key="end-ellipsis" />);
    for (let i = totalPages - 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
  }

  return pages;
};
