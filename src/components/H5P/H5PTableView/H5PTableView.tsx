import React, { useContext, useEffect, useState } from 'react';
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
import H5PFileTableView from './H5PFileTableView';
import { H5PFilterBar, SelectView } from '../H5PComponents';
import TablePagination from 'components/Pagination';
import { H5PContext } from 'contexts/H5P/H5PContext';
import h5pMiddlware from 'middleware/h5p.middlware';
import { updateList } from '../H5PFN';
import { useParams } from 'react-router';
import { ChevronUpIcon } from '@heroicons/react/outline';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { useTranslation } from 'react-i18next';

interface H5PTableViewProps {
    contentList: IH5PContentList | undefined;
    handlePagination(page: number): void;
    setContentList: React.Dispatch<React.SetStateAction<IH5PContentList>>;
}

const H5PTableView: React.FC<H5PTableViewProps> = ({
    contentList,
    handlePagination,
    setContentList,
}) => {
    const { t: translator } = useTranslation();
    const [selected, setSelected] = useState<IContentListEntry>();
    const h5PCtx = React.useContext(H5PContext);
    const paramUrl: { id: string } = useParams();
    const {
        dispatch: h5pDispatch,
        H5PState: { params, isLoading },
    } = h5PCtx;

    const { getWorkspaceDetailState } = useContext(GetWorkspaceContext);

    const { result: workspaceDetailInformation } = getWorkspaceDetailState;

    function handleSort() {
        const searchH5p: ParamsH5P = {
            ...params,
            order: params.order === 'desc' ? 'asc' : 'desc',
        };
        h5pMiddlware.h5pParamsContent(h5pDispatch, searchH5p);
        updateList(h5pDispatch, paramUrl.id, searchH5p);
    }
    return (
        <div>
            <div className="">
                {selected ? (
                    <SelectView
                        canDelete={
                            workspaceDetailInformation.membership.role ===
                                'admin' ||
                            (selected?.created_by?.id ===
                                workspaceDetailInformation.membership.user_id &&
                                selected.status !== 'public')
                        }
                        data={selected}
                        setSelected={setSelected}
                        contentList={contentList}
                        setContentList={setContentList}
                    />
                ) : (
                    <H5PFilterBar />
                )}
            </div>
            <div className="overflow-x-auto">
                <div className="py-ooolab_p_3 align-middle inline-block min-w-full px-ooolab_p_2 ">
                    <div className=" overflow-hidden h-ooolab_h_table">
                        <div className="grid gap-2 grid-cols-12 mb-ooolab_m_3">
                            <div className="col-span-4 font-medium text-ooolab_gray_10  flex items-center pl-ooolab_p_3">
                                <p className="text-ooolab_1xs">  {translator('NAME')}</p>
                                {/* <ChevronDownIcon className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer ml-ooolab_m_1" /> */}
                            </div>
                            <div
                                className="col-span-3 font-medium text-ooolab_blue_1 flex  items-center  cursor-pointer "
                                onClick={handleSort}
                            >
                                <p className="text-ooolab_1xs ">
                                {translator('LAST_MODIFIED')}
                                </p>
                                {params.order === 'desc' ? (
                                    <ArrowDownIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-ooolab_m_1 " />
                                ) : (
                                    <ArrowUpIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-ooolab_m_1 " />
                                )}
                            </div>
                            <div className="col-span-2 font-medium text-ooolab_gray_10">
                                <p className="text-ooolab_1xs"> {translator('STATUS')}</p>
                            </div>
                            <div className="col-span-2 font-medium text-ooolab_gray_10 ">
                                <p className="text-ooolab_1xs">{translator('DASHBOARD.H5P_CONTENTS.H5P_CONTENTS')}</p>
                            </div>
                        </div>

                        {contentList &&
                            contentList?.items?.map((d) => {
                                return (
                                    <div className="my-ooolab_m_2">
                                        <H5PFileTableView
                                            canDelete={
                                                workspaceDetailInformation
                                                    .membership.role ===
                                                    'admin' ||
                                                (d?.created_by?.id ===
                                                    workspaceDetailInformation
                                                        .membership.user_id &&
                                                    d.status === 'draft')
                                            }
                                            H5PItem={d}
                                            selected={selected}
                                            setSelected={setSelected}
                                            contentList={contentList}
                                            setContentList={setContentList}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                </div>
                {isLoading && (
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
                )}
                <div className="w-3/12 absolute bottom-ooolab_inset_1 right-ooolab_inset_1 text-ooolab_xs">
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

export default H5PTableView;
