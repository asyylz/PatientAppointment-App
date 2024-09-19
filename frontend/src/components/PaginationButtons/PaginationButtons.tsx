import React from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import classes from './PaginationButtons.module.css';
interface PaginationButtonsProps {
  // setPagination expect type of function or number
  setPagination: (pagination: (prevPagination: number) => number) => void;
  length: number;
  pagination: number;
  limit: number;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  setPagination,
  pagination,
  length,
  limit,
}) => {

  const handlePaginationClick = (direction: string) => {
    setPagination((prevPagination) => {
      console.log('asiye');
      if (direction === 'next' && length >= limit) {
        return prevPagination + 1;
      } else if (direction === 'prev') {
        return Math.max(prevPagination - 1, 1);
      }
      return prevPagination; // Default case
    });
  };

  return (
    <div className={classes['pagination__wrapper']}>
      <div
        className={classes['pagination__icon--wrapper']}
        onClick={() => handlePaginationClick('prev')}
      >
        <GrPrevious />
        <p>Prev</p>
      </div>
      <p className={classes['pagination__page-number']}>Page: {pagination}</p>
      <div
        className={
          length < limit
            ? `${classes['pagination__icon--wrapper']} ${classes.passive}`
            : classes['pagination__icon--wrapper']
        }
        onClick={() => handlePaginationClick('next')}
      >
        <p>Next</p>
        <GrNext />
      </div>
    </div>
  );
};

export default PaginationButtons;
