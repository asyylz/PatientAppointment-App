import React from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import classes from './PaginationButtons.module.css';
interface PaginationButtonsProps {
  // setPagination expect type of function or number
  setPagination: (pagination: (prevPagination: number) => number) => void;
  length: number;
  pagination: number;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  setPagination,
  pagination,
  length,
}) => {
  const handlePaginationClick = (direction: string) => {
    setPagination((prevPagination) => {
      if (direction === 'next' && length >= 10) {
        return prevPagination + 1;
      } else if (direction === 'prev') {
        return Math.max(prevPagination - 1, 1);
      }
      return prevPagination; // Default case
    });
  };

  return (
    <div className={classes.paginationWrapper}>
      <div
        className={classes.iconBox}
        onClick={() => handlePaginationClick('prev')}
      >
        {' '}
        <GrPrevious />
        <p>Prev</p>
      </div>
      <p>Page:{pagination}</p>
      <div
        className={classes.iconBox}
        onClick={() => handlePaginationClick('next')}
      >
        <p>Next</p>
        <GrNext />
      </div>
    </div>
  );
};

export default PaginationButtons;
