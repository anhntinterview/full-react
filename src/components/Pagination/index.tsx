import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import React from 'react';
import ReactPaginate from 'react-paginate';

import './style.css';

interface TablePaginationProps {
    total: number;
    perPage: number;
    onClickPagination: (e: number) => void;
    forcePage?: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
    total,
    perPage,
    onClickPagination,
    forcePage,
}) => {
    return (
        <ReactPaginate
            forcePage={forcePage}
            previousClassName="absolute left-0 text-ooolab_gray_pagination hover:text-black "
            previousLabel={
                <p className="inline-flex flex-row-reverse">
                    <ArrowLeftIcon className="w-ooolab_w_5 h-ooolab_h_5 mr-ooolab_m_1" />
                </p>
            }
            nextClassName="absolute right-0 text-ooolab_gray_pagination hover:text-black"
            nextLabel={
                <p className="inline-flex ">
                    <ArrowRightIcon className="w-ooolab_w_5 h-ooolab_h_5 ml-ooolab_m_1 " />
                </p>
            }
            breakLabel={'...'}
            pageCount={total ? total / perPage : 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(e) => onClickPagination(e.selected + 1)}
            containerClassName={'pagination'}
        />
    );
};

export default TablePagination;
