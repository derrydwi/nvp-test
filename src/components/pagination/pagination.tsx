"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/utils/style";

type PaginationProps = {
  forcePage?: number;
  pageCount: number;
  onPageChange: (...args: any) => void;
  pageRangeDisplayed?: number;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  breakLabel?: string;
  containerClassName?: string;
  pageClassName?: string;
  activeClassName?: string;
  previousClassName?: string;
  nextClassName?: string;
  breakClassName?: string;
  disabledClassName?: string;
};

export const Pagination = ({
  forcePage,
  pageCount,
  onPageChange,
  pageRangeDisplayed = 2,
  previousLabel = <ChevronLeft className="h-6 w-4" />,
  nextLabel = <ChevronRight className="h-6 w-4" />,
  breakLabel = "...",
  containerClassName = "flex justify-center gap-0.5",
  pageClassName = "px-4 py-2 flex items-center justify-center min-w-[2rem] text-sm hover:bg-primary hover:text-primary-foreground rounded-lg",
  activeClassName = "px-4 py-2 flex items-center justify-center min-w-[2rem] text-sm bg-primary text-primary-foreground rounded-lg",
  previousClassName = "px-3 py-2 flex items-center justify-center min-w-[2rem] text-sm hover:bg-primary hover:text-primary-foreground rounded-lg",
  nextClassName = "px-3 py-2 flex items-center justify-center min-w-[2rem] text-sm hover:bg-primary hover:text-primary-foreground rounded-lg",
  breakClassName = "px-4 py-2 flex items-center justify-center min-w-[2rem] text-sm cursor-not-allowed hover:bg-transparent rounded-lg",
  disabledClassName = "cursor-not-allowed opacity-20 text-inherit hover:bg-transparent hover:text-inherit",
}: PaginationProps) => {
  const currentPage = forcePage || 0;

  const handlePageClick = useCallback(
    (page: number) => {
      onPageChange({ selected: page });
    },
    [onPageChange],
  );

  const pages = useMemo(() => {
    const totalVisiblePages = pageRangeDisplayed + 4; // Add Prev, Two of Break, and Next
    const leftSide = Math.ceil((totalVisiblePages - 3) / 2);
    const rightSide = Math.floor((totalVisiblePages - 3) / 2);

    let startPage = 0;
    let endPage = pageCount - 1;

    if (pageCount > totalVisiblePages) {
      if (currentPage <= leftSide) {
        startPage = 0;
        endPage = totalVisiblePages - 2; // 2 for the break labels and the Prev button
      } else if (currentPage >= pageCount - rightSide - 1) {
        startPage = Math.max(pageCount - totalVisiblePages + 1, 0); // 1 for the break labels and the Next button
        endPage = pageCount - 1;
      } else {
        startPage = currentPage - leftSide;
        endPage = currentPage + rightSide;
      }
    }

    return [...Array(endPage - startPage + 1 || 1)].map((_, i) => {
      const pageIndex = startPage + i;
      if (i === 0 && startPage > 0) {
        return (
          <Fragment key={pageIndex}>
            <button
              onClick={() => handlePageClick(0)}
              className={cn(
                previousClassName,
                currentPage === 0 && disabledClassName,
              )}
              disabled={currentPage === 0}
            >
              1
            </button>
            <span className={breakClassName}>{breakLabel}</span>
          </Fragment>
        );
      } else if (i === endPage - startPage && endPage < pageCount - 1) {
        return (
          <Fragment key={pageIndex}>
            <span className={breakClassName}>{breakLabel}</span>
            <button
              onClick={() => handlePageClick(pageCount - 1)}
              className={cn(
                nextClassName,
                currentPage === pageCount - 1 && disabledClassName,
              )}
              disabled={currentPage === pageCount - 1}
            >
              {pageCount}
            </button>
          </Fragment>
        );
      } else {
        return (
          <button
            key={pageIndex}
            onClick={() => handlePageClick(pageIndex)}
            className={cn(
              pageClassName,
              pageIndex === currentPage && activeClassName,
            )}
          >
            {pageIndex + 1}
          </button>
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    pageCount,
    pageRangeDisplayed,
    pageClassName,
    activeClassName,
    breakClassName,
    breakLabel,
  ]);

  return (
    <div className={containerClassName}>
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        className={cn(
          previousClassName,
          currentPage === 0 && disabledClassName,
        )}
        disabled={currentPage === 0}
      >
        {previousLabel}
      </button>
      {pages}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        className={cn(
          nextClassName,
          currentPage === pageCount - 1 && disabledClassName,
        )}
        disabled={currentPage === pageCount - 1}
      >
        {nextLabel}
      </button>
    </div>
  );
};
