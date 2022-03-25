import React, { useContext, useEffect, useReducer, useState } from 'react';

// The .js references are necessary for requireJs to work in the browser.
import {
    IContentService,
    IContentListEntry,
    IH5PContentList,
} from 'types/H5P.type';

import H5PTableView from './H5PTableView';
import ContentListEntryComponentHook from './ContentListEntryComponentHook';
import { H5PContext } from 'contexts/H5P/H5PContext';
import h5pMiddlware from 'middleware/h5p.middlware';
import { updateList } from './H5PFN';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

interface ContentListComponentHookProp {
    contentService: IContentService;
    workspaceId: string;
    contentList: IH5PContentList;
    setContentList: React.Dispatch<React.SetStateAction<IH5PContentList>>;
}

const ContentListComponentHook: React.FC<ContentListComponentHookProp> = ({
    contentService,
    workspaceId,
    setContentList,
    contentList,
}) => {
    let newCounter = 0;

    const { dispatch: workspaceDispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const h5PCtx = React.useContext(H5PContext);
    const {
        dispatch,
        H5PState: { h5PContentListResult, params },
    } = h5PCtx;

    const { result: WorkspaceDetailInformation } = getWorkspaceDetailState;
    const {
        membership: { role, type },
    } = WorkspaceDetailInformation;

    useEffect(() => {
        h5pMiddlware.h5pResetStatus(dispatch);
        h5pMiddlware.h5pContentList(dispatch, workspaceId);
        // workspaceMiddleware.getWorkspace(workspaceDispatch, {
        //     id: workspaceId,
        // });
    }, []);

    useEffect(() => {
        if (h5PContentListResult) {
            setContentList(h5PContentListResult);
        }
    }, [h5PContentListResult]);

    async function handlePagination(p: number) {
        const newParams = {
            ...params,
            page: p,
        };
        h5pMiddlware.h5pParamsContent(dispatch, newParams);
        updateList(dispatch, workspaceId, newParams);
    }

    function onDiscard(content: IContentListEntry) {
        return () => {
            const contentsDiscard: IH5PContentList = {
                items: contentList?.items?.filter((c) => c !== content),
                order: contentList?.order,
                page: contentList?.page,
                per_page: contentList?.per_page,
                sort_by: contentList?.sort_by,
                total: contentList?.total,
            };

            setContentList(contentsDiscard);
        };
    }

    async function onDelete(content: IContentListEntry) {
        if (!content.contentId) {
            return;
        }
        try {
            await contentService.delete(content.contentId);
            const contentsDelete: IH5PContentList = {
                items: contentList?.items?.filter((c) => c !== content),
                order: contentList?.order,
                page: contentList?.page,
                per_page: contentList?.per_page,
                sort_by: contentList?.sort_by,
                total: contentList?.total,
            };
            setContentList(contentsDelete);
        } catch (error) {
            console.log(error);
        }
    }

    async function onSaved(
        oldData: IContentListEntry,
        newData: IContentListEntry
    ) {
        const content = contentList?.items?.map((c) =>
            c === oldData ? newData : c
        );

        const contentSaved: IH5PContentList = {
            items: content,
            order: contentList?.order,
            page: contentList?.page,
            per_page: contentList?.per_page,
            sort_by: contentList?.sort_by,
            total: contentList?.total,
        };
        await setContentList(contentSaved);
    }
    return (
        <div className="rounded-ooolab_card shadow-ooolab_box_shadow_container p-ooolab_p_5 relative">
            {contentList &&
                contentList?.items?.map((content) => (
                    <ContentListEntryComponentHook
                        workspaceId={workspaceId}
                        contentService={contentService}
                        data={content}
                        key={content.originalNewKey ?? content.contentId}
                        onDiscard={onDiscard(content)}
                        onDelete={() => onDelete(content)}
                        onSaved={(newData) => onSaved(content, newData)}
                        generateDownloadLink={
                            contentService.generateDownloadLink
                        }
                    ></ContentListEntryComponentHook>
                ))}
            <div className="">
                <H5PTableView
                    contentList={contentList}
                    handlePagination={handlePagination}
                    setContentList={setContentList}
                />
            </div>
        </div>
    );
};

export default ContentListComponentHook;
