import React, { useState } from 'react';
// PACKAGES
import { Link, useHistory } from 'react-router-dom';
// COMPONENTS
// TYPES
import {
    IContentListEntry,
    IContentService,
    IH5PContentList,
    ParamsH5P,
} from 'types/H5P.type';
// SERVICES
import { ContentService } from 'services/h5p/ContentService';
import { PlusIcon, SearchIcon } from '@heroicons/react/solid';
import { updateList } from './H5PFN';
import ContentListComponentHook from './ContentListComponentHook';
import { debounce } from 'lodash';
// CONTEXT
import { H5PContext } from 'contexts/H5P/H5PContext';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import h5pMiddlware from 'middleware/h5p.middlware';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// UTILS

const H5P: React.FC = ({ children }) => {
    const { t: translator } = useTranslation();
    const history = useHistory();
    const pathname = history.location.pathname;
    const pathArray = pathname.split('/');
    const workspacePos = pathArray.indexOf('workspace');
    const workspaceId = pathArray[workspacePos + 1];

    const contentService: IContentService = new ContentService(
        `/v1/h5p/workspaces/${workspaceId}`
    );

    const h5PCtx = React.useContext(H5PContext);

    const {
        dispatch: h5pDispatch,
        H5PState: { h5PContentListResult, params },
    } = h5PCtx;

    const [inputValue, setInputValue] = useState<string>();

    const [contentList, setContentList] = useState<IH5PContentList>({
        items: [],
        order: undefined,
        page: undefined,
        per_page: undefined,
        sort_by: undefined,
        total: undefined,
    });

    React.useEffect(() => {
        if (h5PContentListResult) {
            setContentList(h5PContentListResult);
        }
    }, [h5PContentListResult]);

    const debounceInput = React.useCallback(
        debounce((nextValue: string, asyncFunction: (p: string) => void) => {
            setInputValue(nextValue);
            asyncFunction(nextValue);
        }, 1000),
        []
    );

    function handleSearchH5P(t: string) {
        const searchH5p: ParamsH5P = {
            ...params,
            title: t,
            page: 1,
        };
        h5pMiddlware.h5pParamsContent(h5pDispatch, searchH5p);
        updateList(h5pDispatch, workspaceId, searchH5p);
    }

    const onChangeInput = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="px-ooolab_p_10 h-full py-ooolab_p_4">
            <ToastContainer />
            <div className="flex justify-between w-full mb-ooolab_m_6 ">
                <div className="flex items-center w-9/12">
                    <div className=''>{children}</div>
                    {/* <Link to={`/workspace/${workspaceId}/h5p-content`}>
                        <p className="text-ooolab_xl font-semibold text-ooolab_dark_1">
                            {translator('DASHBOARD.H5P_CONTENTS.H5P_CONTENTS')}
                        </p>
                    </Link> */}

                    <div className="bg-ooolab_gray_10 h-8 mx-ooolab_m_3 w-ooolab_w_2px" />
                    <div className="relative">
                        <input
                            className={` border-2 border-ooolab_border_logout rounded-sub_tab pl-ooolab_p_3 overflow-hidden ease-linear transition-transform duration-500 w-full h-ooolab_h_10 focus:outline-none pr-ooolab_p_9`}
                            type="text"
                            placeholder={translator('SEARCH')}
                            onChange={(e) => onChangeInput(e)}
                            onKeyDown={(e: any) => {
                                if (e.key === 'Enter') {
                                    handleSearchH5P(e.target.value);
                                }
                            }}
                        />
                        <SearchIcon
                            className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 absolute cursor-pointer top-ooolab_inset_22 right-ooolab_inset_5 "
                            onClick={() => handleSearchH5P(inputValue)}
                        />
                    </div>
                </div>
                <div className="w-3/12 flex justify-end">
                    <button
                        className=" px-ooolab_p_2 bg-ooolab_blue_1 text-white flex items-center focus:outline-none rounded-lg h-4/5"
                        onClick={() =>
                            history.push(
                                `/workspace/${workspaceId}/h5p-content/new`
                            )
                        }
                    >
                        <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_2 " />
                        <p className="text-ooolab_1xs">
                            {translator('DASHBOARD.H5P_CONTENTS.NEW_H5P')}
                        </p>
                    </button>
                </div>
            </div>
            <div className="h-ooolab_below_top_sidebar">
                <ContentListComponentHook
                    contentService={contentService}
                    workspaceId={workspaceId}
                    contentList={contentList}
                    setContentList={setContentList}
                ></ContentListComponentHook>
            </div>
        </div>
    );
};

export default H5P;
