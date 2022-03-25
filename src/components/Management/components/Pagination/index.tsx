import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import React from 'react';
import ReactPaginate from 'react-paginate';

// import './style.css';

interface TablePaginationProps {
    total: number;
    perPage: number;
    onClickPagination: (e: number) => void;
    forcePage?: number;
}

const Pagination: React.FC<TablePaginationProps> = ({
    total,
    perPage,
    onClickPagination,
    forcePage,
}) => {
    return (
        <ReactPaginate
            forcePage={forcePage}
            previousClassName="text-ooolab_gray_pagination hover:text-black "
            previousLabel={
                <ChevronLeftIcon className="w-ooolab_w_5 h-ooolab_h_5 mr-ooolab_m_1" />
            }
            // nextClassName="absolute right-0 text-ooolab_gray_pagination hover:text-black"
            nextLabel={
                <ChevronRightIcon className="w-ooolab_w_5 h-ooolab_h_5 ml-ooolab_m_1 " />
            }
            pageClassName="p-0"
            breakLinkClassName="flex items-center justify-center"
            pageLinkClassName="w-ooolab_w_6 h-ooolab_h_6 flex items-center justify-center rounded text-ooolab_xs font-semibold leading-ooolab_24px"
            activeLinkClassName="w-ooolab_w_6 p-0 h-ooolab_h_6 flex items-center justify-center rounded text-ooolab_xs font-semibold leading-ooolab_24px bg-ooolab_border_logout "
            activeClassName="border-none"
            breakLabel={'...'}
            pageCount={total ? total / perPage : 1}
            marginPagesDisplayed={3}
            pageRangeDisplayed={5}
            onPageChange={(e) => onClickPagination(e.selected + 1)}
            containerClassName="flex items-center"
        />
    );
};

export default Pagination;
