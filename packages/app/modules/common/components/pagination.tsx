interface PaginationProps {
  total: number;
  offset: number;
  pageSize: number;
  onChange: (offset: number) => void;
}

/*
  Create an array of certain length and set the elements within it from
  start value to end value.
*/
const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const siblingCount = 2;
const dots = '...';

const usePagination = ({ total, offset = 0, pageSize }: Pick<PaginationProps, 'total' | 'offset' | 'pageSize'>) => {
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.ceil(offset / pageSize) + 1;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  const result = { prevDisabled, nextDisabled, currentPage: currentPage, totalPages };

  // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
  const totalPageNumbers = siblingCount + 5;

  /*
    If the number of pages is less than the page numbers we want to show in our
    paginationComponent, we return the range [1..totalPageCount]
  */
  if (totalPageNumbers >= totalPages) {
    return { ...result, pagination: range(1, totalPages) };
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPages
  );

  /*
    We do not want to show dots if there is only one position left
    after/before the left/right page count as that would lead to a change if our Pagination
    component size which we do not want
  */
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = range(1, leftItemCount);

    return { ...result, pagination: [...leftRange, dots, totalPages] };
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = range(
      totalPages - rightItemCount + 1,
      totalPages
    );
    return { ...result, pagination: [firstPageIndex, dots, ...rightRange] };
  }

  // shouldShowLeftDots && shouldShowRightDots
  let middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return { ...result, pagination: [firstPageIndex, dots, ...middleRange, dots, lastPageIndex] };
}

const Pagination = ({ total, offset, pageSize, onChange }: PaginationProps) => {
  const { pagination, currentPage } = usePagination({ total, offset, pageSize });

  return (
    <div className="text-right mt-4">
      {pagination.map((page, index) => {
        if (typeof page === 'string') {
          return (<span key={index} className="p-1">{page}</span>);
        }

        if (page === currentPage) {
          return (<span key={index} className="p-1 text-red-600">{page}</span>);
        }

        return (
          <a key={index} onClick={() => onChange((page - 1) * pageSize)} className='hover:text-blue-700 p-1 cursor-pointer'>{page}</a>
        );
      })}
    </div>
  );
}

export default Pagination;
