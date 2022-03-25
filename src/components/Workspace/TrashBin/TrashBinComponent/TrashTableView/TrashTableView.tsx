import React, { useEffect, useState } from 'react';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChevronDownIcon,
} from '@heroicons/react/solid';
import {
    H5PFile,
    IContentListEntry,
    IH5PContentList,
    ParamsH5P,
} from 'types/H5P.type';

import TablePagination from 'components/Pagination';

import TrashFileTableView from './TrashFileTableView';

import { useTranslation } from 'react-i18next';

interface TrashTableViewProps {
    contentList: any;
    setContentList: React.Dispatch<React.SetStateAction<IH5PContentList>>;
    selected: number | undefined;
    setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
    handlePagination(page: number): void;
}

const TrashTableView: React.FC<TrashTableViewProps> = ({
    contentList,
    setContentList,
    selected,
    setSelected,
    handlePagination,
}) => {
    const { t: translator } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);
    return (
        <div>
            <div className="overflow-x-auto">
                <div className="py-ooolab_p_3 align-middle inline-block min-w-full px-ooolab_p_2 ">
                    <div className=" overflow-hidden h-ooolab_h_table">
                        <div className="grid gap-2 grid-cols-12 mb-ooolab_m_3">
                            <div className="col-span-5 font-medium text-ooolab_gray_10  flex items-center pl-ooolab_p_3">
                                <p className="text-ooolab_1xs">
                                    {translator('NAME')}
                                </p>
                            </div>
                            <div className="col-span-4 font-medium text-ooolab_blue_1 flex  items-center  cursor-pointer ">
                                <p className="text-ooolab_1xs ">
                                    {translator('LAST_MODIFIED')}
                                </p>
                                <ArrowDownIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-ooolab_m_1 " />
                                {/* {params.order === 'desc' ? (
                                    <ArrowDownIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-ooolab_m_1 " />
                                ) : (
                                    <ArrowUpIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-ooolab_m_1 " />
                                )} */}
                            </div>
                            <div className="col-span-3 font-medium text-ooolab_gray_10">
                                <p className="text-ooolab_1xs">
                                    Owner
                                </p>
                            </div>
                        </div>
                        {loading ? (
                            <svg
                                className="animate-spin -ml-1 mr-3 w-ooolab_w_5 h-ooolab_h_5 opacity-100 absolute top-1/2 left-1/2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="red"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            contentList &&
                            contentList?.items?.map((d: any) => {
                                return (
                                    <div className="my-ooolab_m_2">
                                        <TrashFileTableView
                                            item={d}
                                            selected={selected}
                                            setSelected={setSelected}
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="w-4/12 absolute bottom-ooolab_inset_1 right-ooolab_inset_1 text-ooolab_xs">
                    {contentList && (
                        <TablePagination
                            total={contentList?.total || 0}
                            perPage={10}
                            onClickPagination={handlePagination}
                            forcePage={contentList.page && contentList.page - 1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrashTableView;
