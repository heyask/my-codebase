import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../pagination';

const splitPagesToLimit = (
  totalCnt: number,
  currentPage: number,
  rowsPerPage: number,
  visiblePageCnt: number
) => {
  let pages = [1];

  if (totalCnt <= rowsPerPage) {
    pages = Array(visiblePageCnt).fill(1);
  } else {
    pages = Array(visiblePageCnt).fill(
      Math.floor((currentPage - 1) / visiblePageCnt) * visiblePageCnt + 1
    );
  }

  pages = pages
    .map((val, idx) => val + idx)
    .filter((page) => page <= Math.ceil(totalCnt / rowsPerPage));
  if (pages.length <= 0) pages = [1];

  return pages;
};

interface PaginationActionsProps {
  totalRows: number;
  page: number;
  rowsPerPage: number;
  visiblePageCnt?: number;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
}

export function PaginationActions(props: PaginationActionsProps) {
  const {
    totalRows: totalCnt,
    page: currentPage,
    rowsPerPage,
    isLoading,
    visiblePageCnt = 20,
    onPageChange,
  } = props;

  const _currentPage = currentPage < 1 ? 1 : currentPage;

  const handleFirstPageButtonClick = (e: any) => {
    const firstPage = 1;
    onPageChange(firstPage);
  };

  const handlePrevButtonClick = () => {
    onPageChange(Math.max(1, _currentPage - 1));
  };

  const handleNumberPageButtonClick = (page: number) => {
    onPageChange(page);
  };

  const handleNextButtonClick = () => {
    onPageChange(Math.min(Math.ceil(totalCnt / rowsPerPage), _currentPage + 1));
  };

  const handleLastPageButtonClick = () => {
    const lastPage = Math.max(0, Math.ceil(totalCnt / rowsPerPage));
    onPageChange(lastPage);
  };

  const pages = splitPagesToLimit(
    totalCnt,
    _currentPage,
    rowsPerPage,
    visiblePageCnt
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst onClick={handleFirstPageButtonClick} />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevButtonClick} />
        </PaginationItem>
        {pages.map((page, idx) => (
          <PaginationItem key={`page-${page}`}>
            <PaginationLink
              isActive={page === _currentPage}
              onClick={(e) => handleNumberPageButtonClick(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={handleNextButtonClick} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast onClick={handleLastPageButtonClick} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
