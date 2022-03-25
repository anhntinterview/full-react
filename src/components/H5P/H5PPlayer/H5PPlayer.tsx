import React, { useContext } from 'react';
// PACKAGES
import { Link, useHistory, useParams } from 'react-router-dom';
// COMPONENTS
import H5PPlayerContentComponent from './H5PPlayerContentComponent';
import H5PEditor from '../H5PEditor';
// MIDDLWARE
import h5pMiddleware from 'middleware/h5p.middlware';
// CONTEXT
import { H5PContext } from 'contexts/H5P/H5PContext';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
// TYPES
import {
    IH5PContentList,
    IContentListEntry,
    TagsType,
    IH5PPlayerArgs,
    TagIdType,
} from 'types/H5P.type';
import { ChevronRightIcon, SaveIcon } from '@heroicons/react/solid';
import TagRender from 'components/TagRender';
import {
    ExclamationCircleIcon,
    TagIcon,
    TrashIcon,
    XIcon,
} from '@heroicons/react/outline';
import { H5PEditorUI } from 'packages/h5p-react';
// UTILS

//SERVIES
import h5pServices from 'services/h5p.service';
import { H5PModal, H5PPublish } from '../H5PComponents';
import {
    CANCEL_H5P,
    DELETE_H5P,
    H5P_MODAL,
    SAVE_H5P,
} from 'constant/modal.const';
import { TagType } from 'types/GetListOfWorkspace.type';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { CreateTagBody } from 'types/ApiData.type';
import { WorkspaceService } from 'services';
import { toast, ToastContainer } from 'react-toastify';

import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import h5pMiddlware from 'middleware/h5p.middlware';
import { H5P_LIBRARY } from 'constant/h5p.const';
import { errorNoti, successNoti } from 'components/H5P/H5PFN';
import { useTranslation } from 'react-i18next';
import lodash from 'lodash';
import Modal from 'components/Modal';
import { errorTitle } from 'components/Modal/Common';
import { StatusContent } from 'constant/util.const';

const H5PViewer: React.FC = ({ children }) => {
    const [entryState, setEntryState] = React.useState({
        editing: false,
        playing: false,
        loading: false,
        saved: false,
        saving: false,
        saveError: false,
        saveErrorMessage: '',
    });

    const [isEdit, setIsEdit] = React.useState<boolean>(false);
    const [isModal, setIsModal] = React.useState<boolean>(false);

    const h5pEditorRef: React.RefObject<H5PEditorUI> = React.useRef(null);

    const [modalProps, setModalProps] = React.useState<{
        component: {
            type: string;
            title: string;
            subTitle: string;
            btnCancel: string;
            btnSubmit: string;
            color: string;
            img: string;
        };
        onFetch: () => Promise<void>;
    }>();

    const history = useHistory();
    const pathname = history.location.pathname;
    const pathArray = pathname.split('/');
    const workspacePos = pathArray.indexOf('workspace');
    const contentPos = pathArray.indexOf('h5p-content');
    const workspaceId = pathArray[workspacePos + 1];
    const contentId = pathArray[contentPos + 1];

    const argsId = {
        workspaceId,
        contentId,
    };

    const params: { id: string; contentId: string } = useParams();

    const [errMsg, setErrMsg] = React.useState<string>();
    const [
        h5pContentListEntryState,
        setH5PContentListEntryState,
    ] = React.useState<IContentListEntry>();
    const h5PCtx = React.useContext(H5PContext);

    const userInfo = getLocalStorageAuthData();

    const [h5pApprove, setH5pApprove] = React.useState<boolean>(false);
    const [h5pData, setH5PData] = React.useState<IContentListEntry>();
    const [taglist, setTaglist] = React.useState<TagType[]>([]);
    const [tagData, setTagData] = React.useState<TagType[]>([]);
    const [modalError, setModalError] = React.useState(false);
    const [statusError, setStatusError] = React.useState(0);
    // status = 1 => add fail, status = 2 delete fail , status = 3 both

    const saveButton = React.useRef(null);
    const { t: translator } = useTranslation();
    const {
        dispatch,
        H5PState: {
            h5PContentListResult,
            err,
            h5PApproveContentResult,
            currentH5P,
        },
    } = h5PCtx;

    const { dispatch: dispatchWorkspace, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const { result: workspaceDetailInformation } = getWorkspaceDetailState;

    React.useEffect(() => {
        if (getWorkspaceDetailState.tagList) {
            setTaglist(getWorkspaceDetailState.tagList.items);
        }
    }, [getWorkspaceDetailState.tagList]);

    React.useEffect(() => {
        h5pMiddleware.getCurentH5P(dispatch, argsId);
        workspaceMiddleware.getLessonTags(dispatchWorkspace, workspaceId);
        // if (workspaceDetailInformation.id === -1) {
        //     workspaceMiddleware.getWorkspace(dispatchWorkspace, {
        //         id: params.id,
        //     });
        // }
    }, []);

    React.useEffect(() => {
        if (h5pData && h5PApproveContentResult) {
            setH5PData({
                argsId: h5pData?.argsId,
                contentId: h5pData?.contentId,
                mainLibrary: h5pData?.mainLibrary,
                title: h5pData?.title,
                status: 'public',
                created_by: {
                    id: h5pData.created_by?.id,
                },
            });
        }
    }, [h5PApproveContentResult]);

    React.useEffect(() => {
        if (currentH5P) {
            setH5PContentListEntryState({
                argsId: argsId,
                contentId: argsId.contentId,
                mainLibrary: currentH5P?.metadata?.mainLibrary,
                title: currentH5P?.metadata?.title,
                status: currentH5P?.status,
                tags: currentH5P?.tags,
                uid: currentH5P?.uid,
                updated_on: currentH5P?.updated_on,
                created_by: {
                    id: currentH5P?.created_by?.id,
                },
            });
            workspaceMiddleware.setCurrentRouteDetail(dispatchWorkspace, [
                {
                    name: currentH5P?.metadata?.title,
                    routeId: 'contentId',
                },
            ]);
            setTagData(currentH5P?.tags);
        }
    }, [currentH5P]);

    React.useEffect(() => {
        if (h5pContentListEntryState) {
            setH5PData(h5pContentListEntryState);
            if (h5pContentListEntryState)
                if (h5pContentListEntryState.status === 'draft') {
                    if (
                        currentH5P?.created_by?.email === userInfo.email ||
                        workspaceDetailInformation.membership.role === 'admin'
                    )
                        setH5pApprove(true);
                } else {
                    setH5pApprove(false);
                    setIsEdit(false);
                }
        }
    }, [h5pContentListEntryState]);

    React.useEffect(() => {
        setErrMsg(err);
    }, [err]);

    if (!h5pContentListEntryState) {
        return null;
    }

    const generateStatus = (status?: string) => {
        let style = 'text-ooolab_dark_2';
        switch (status) {
            case 'pending':
                return (style = 'text-ooolab_warn');
            case 'public':
                return (style = 'text-ooolab_green_1');
            default:
                return style;
        }
    };

    async function save() {
        setEntryState({ ...entryState, saving: true });
        try {
            const returnData: any = await h5pEditorRef.current?.save();
            let tagsId: TagsType = {
                tags: [],
            };
            let deletedTags: number[] = [];
            let addedTags: number[] = [];

            //tags received from api
            const originListTags = h5pData?.tags?.length
                ? h5pData.tags.map((i) => i.id)
                : [];
            //tags user interacted before submitting
            if (tagData?.length) {
                const modifiedListTags = tagData.map((i) => i.id);
                if (!modifiedListTags.length && !originListTags.length) {
                    deletedTags = [];
                    addedTags = [];
                }

                if (!modifiedListTags.length && originListTags.length) {
                    addedTags = [];
                    deletedTags = originListTags;
                }

                if (modifiedListTags.length && !originListTags.length) {
                    deletedTags = [];
                    addedTags = modifiedListTags;
                }

                if (modifiedListTags.length && originListTags.length) {
                    addedTags = [
                        ...lodash.difference(modifiedListTags, originListTags),
                    ];
                    originListTags.forEach((i) => {
                        if (!modifiedListTags.includes(i)) {
                            deletedTags.push(i);
                        }
                    });
                }
            } else {
                deletedTags = originListTags;
            }

            const listRemoveTags: TagsType = {
                tags: [],
            };
            addedTags.map((t) => {
                const tagId: TagIdType = {
                    tag_id: t,
                };
                tagsId.tags.push(tagId);
            });
            if (deletedTags.length) {
                deletedTags.forEach((i) => {
                    const tagId: TagIdType = {
                        tag_id: i,
                    };
                    listRemoveTags.tags.push(tagId);
                });
            }
            let addStatus = 0;
            let deleteStatus = 0;

            await h5pServices
                .h5pAddTag(argsId, tagsId)
                .then(async (res) => {
                    addStatus = res;
                    await h5pServices
                        .h5pRemoveMultiTag(argsId, listRemoveTags)
                        .then((res) => {
                            deleteStatus = res;
                        })
                        .catch((error) => {
                            deleteStatus = error;
                        });
                })
                .catch(async (error) => {
                    addStatus = error;
                    await h5pServices
                        .h5pRemoveMultiTag(argsId, listRemoveTags)
                        .then((res) => {
                            deleteStatus = res;
                        })
                        .catch((error) => {
                            deleteStatus = error;
                        });
                });

            if (addStatus !== 0 || deleteStatus !== 0) {
                if (addStatus === 1 && deleteStatus === 1) {
                    successNoti(
                        translator('DASHBOARD.H5P_CONTENTS.TAGS_SUCCESS'),
                        <TagIcon />
                    );
                } else if (addStatus === -1 || deleteStatus === -1) {
                    if (addStatus === -1 && deleteStatus === -1) {
                        setStatusError(3);
                    } else if (addStatus === -1) {
                        setStatusError(1);
                    } else if (deleteStatus === -1) {
                        setStatusError(2);
                    }
                    setModalError(true);
                    setTimeout(() => location.reload(), 1500);
                } else if (
                    (addStatus === 1 && deleteStatus === 0) ||
                    (addStatus === 0 && deleteStatus === 1)
                ) {
                    successNoti(
                        translator('DASHBOARD.H5P_CONTENTS.TAGS_SUCCESS'),
                        <TagIcon />
                    );
                }
            }

            if (returnData) {
                if (returnData?.error) {
                    if (returnData?.error?.name === 'NOTHING_CHANGED') {
                        errorNoti(
                            translator(
                                'DASHBOARD.H5P_CONTENTS.H5P_CONTENT_NOT_CHANGED'
                            ),
                            <SaveIcon />
                        );
                        if (tagsId.tags.length || listRemoveTags.tags.length) {
                            setH5PData({
                                ...h5pData,
                                tags: tagData,
                            });
                        }
                    }
                }
                if (returnData?.contentId) {
                    setH5PData({
                        contentId: returnData?.contentId,
                        argsId: {
                            workspaceId: params.id,
                            contentId: returnData?.contentId,
                        },
                        mainLibrary: returnData?.metadata?.mainLibrary,
                        title: returnData?.metadata?.title,
                        status: h5pData?.status,
                        tags: tagData,
                        created_by: {
                            id: userInfo.id,
                        },
                    });
                    successNoti(
                        translator(
                            'DASHBOARD.H5P_CONTENTS.H5P_SAVE_CONTENT_SUCCESS'
                        ),
                        <SaveIcon />
                    );
                }
            }
            setIsEdit(false);
        } catch (error) {
            console.log(error);
        }
    }

    const generateStatusBg = (status?: string) => {
        let style = 'bg-ooolab_dark_50 shadow-ooolab_draft';
        switch (status) {
            case 'pending':
                return (style = ' bg-ooolab_warning shadow-ooolab_pending');

            case 'public':
                return (style = ' bg-ooolab_green_1 shadow-ooolab_publish');
            default:
                return style;
        }
    };

    function handleEditH5P() {
        setIsEdit(true);
    }

    async function onDelete() {
        if (h5pData) {
            await h5pServices
                .h5pDeletePromise(h5pData.argsId)
                .then((res) =>
                    res
                        ? successNoti(
                              translator(
                                  'DASHBOARD.H5P_CONTENTS.H5P_MOVE_TO_TRASH'
                              ),
                              <TrashIcon />
                          )
                        : errorNoti(
                              translator(
                                  'DASHBOARD.H5P_CONTENTS.H5P_MOVE_TO_TRASH_FAILED'
                              ),
                              <TrashIcon />
                          )
                );
            setTimeout(() => {
                history.push(`/workspace/${params.id}/h5p-content`);
            }, 1000);
        }
    }

    async function onCancelNewH5P() {
        setIsEdit(false);
    }

    async function onCloseH5P() {
        setIsModal(true);
        const modalCancelProps = {
            component: CANCEL_H5P(translator),
            onFetch: onCancelNewH5P,
        };
        await setModalProps(modalCancelProps);
    }

    async function onDeleteH5P() {
        setIsModal(true);
        const modalProps = {
            component: DELETE_H5P(translator),
            onFetch: onDelete,
        };
        setModalProps(modalProps);
    }

    const handleAddTag = async (tagId: number) => {
        const tag = taglist?.find((d) => tagId === d.id);
        if (tagData) {
            tag && setTagData([...tagData, tag]);
        } else {
            tag && setTagData([tag]);
        }
    };

    const handleRemoveTag = async (tagId: number) => {
        const tag = tagData?.filter((d) => tagId !== d.id);
        setTagData(tag);
    };

    const handleCreateTag = (body: CreateTagBody) => {
        WorkspaceService.createlessonTags(params?.id, body)
            .then((res) => {
                if (res && res.id) {
                    workspaceMiddleware.getLessonTags(dispatch, params?.id);
                    return true;
                }
                return false;
            })
            .catch((err) => {
                toast.error('Duplicate tag!', {
                    position: 'bottom-left',
                });
            });
    };
    const handleSearchTag = (e: string) => {
        workspaceMiddleware.getLessonTags(dispatch, params.id, e);
    };

    async function onSaveH5P() {
        setIsModal(true);
        const modalProps = {
            component: SAVE_H5P(translator),
            onFetch: save,
        };
        await setModalProps(modalProps);
    }
    return (
        <>
            <div className="px-ooolab_p_16 w-full h-screen relative">
                <ToastContainer />
                <div className="grid auto-rows-max grid-cols-6 gap-3 h-full">
                    <div className="col-span-4 flex items-center text-ooolab_xl py-ooolab_p_1 font-semibold">
                        <div className="">{children}</div>
                        {/* <Link to={`/workspace/${params.id}/h5p-content`}>
                            <p className="text-ooolab_xl font-semibold text-ooolab_dark_2">
                                {translator(
                                    'DASHBOARD.H5P_CONTENTS.H5P_CONTENTS'
                                )}
                            </p>
                        </Link> */}
                        {/* <ChevronRightIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_1" />
                        <p className="text-ooolab_dark_1">
                            {translator(
                                'DASHBOARD.H5P_CONTENTS.DETAIL_CONTENT'
                            )}
                        </p> */}
                    </div>
                    <div className="col-span-2 flex justify-end items-center  text-white">
                        {isEdit ? (
                            <>
                                <button
                                    ref={saveButton}
                                    className={` shadow-ooolab_login_1 text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex items-center bg-ooolab_blue_1 text-white  ${
                                        entryState.saved && `bg-ooolab_gray_10`
                                    }`}
                                    onClick={onSaveH5P}
                                >
                                    {translator('DASHBOARD.H5P_CONTENTS.SAVE')}
                                </button>
                            </>
                        ) : (
                            <>
                                {h5pApprove && (
                                    <button
                                        onClick={handleEditH5P}
                                        className={` shadow-ooolab_login_1 text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex items-center bg-ooolab_blue_1 text-white `}
                                    >
                                        {translator(
                                            'DASHBOARD.H5P_CONTENTS.EDIT'
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                        {h5pData && (
                            <div className="ml-ooolab_m_4">
                                <H5PPublish
                                    status={h5pData?.status}
                                    canPublish={
                                        workspaceDetailInformation.membership
                                            .role === 'admin'
                                    }
                                    content={h5pData}
                                />
                            </div>
                        )}
                        {isEdit && (
                            <div className="w-ooolab_w_8 h-ooolab_h_8 rounded-full  ml-ooolab_m_4 flex justify-center items-center group hover:shadow-ooolab_box_shadow_2 ">
                                <XIcon
                                    className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 cursor-pointer focus:outline-none group-hover:text-ooolab_blue_1"
                                    onClick={onCloseH5P}
                                />
                            </div>
                        )}
                    </div>
                    <div
                        style={{
                            borderRadius: 20,
                            height: 'calc(100vh - calc(88*(100vw/1440)))',
                        }}
                        className="col-span-2 w-full h-full shadow-ooolab_box_shadow_container px-ooolab_p_5 py-ooolab_p_5"
                    >
                        <div className="flex justify-between">
                            <p
                                id="h5p-name-input"
                                className="focus:outline-none border-b border-white focus:border-ooolab_gray_2 text-ooolab_base mr-ooolab_m_2"
                            >
                                {h5pData?.title}
                            </p>
                            <p className="capitalize flex items-center">
                                <span
                                    className={`w-ooolab_w_2_root h-ooolab_h_2 shadow-ooolab_lesson_status rounded-full mr-ooolab_m_2 ${generateStatusBg(
                                        h5pData?.status
                                    )}`}
                                />
                                <span
                                    className={`text-ooolab_xs  ${generateStatus(
                                        h5pData?.status
                                    )}`}
                                >
                                    {StatusContent(translator, h5pData?.status)}
                                </span>
                            </p>
                        </div>
                        <div className="w-full mt-ooolab_m_4">
                            <div className="flex mb-ooolab_m_4">
                                <Link
                                    to={`/workspace/${params.id}/h5p-content/${h5pData?.contentId}/preview`}
                                >
                                    <div className="group hover:bg-ooolab_blue_0 cursor-pointer  rounded-ooolab_circle p-ooolab_p_2 mr-ooolab_m_3">
                                        <svg
                                            className="w-ooolab_w_4 h-ooolab_h_4 "
                                            viewBox="0 0 16 12"
                                            fill="none"
                                        >
                                            <path
                                                className="group-hover:fill-item_bar_hover"
                                                d="M10.25 6C10.25 7.24264 9.24264 8.25 8 8.25C6.75736 8.25 5.75 7.24264 5.75 6C5.75 4.75736 6.75736 3.75 8 3.75C9.24264 3.75 10.25 4.75736 10.25 6Z"
                                                fill="#8F90A6"
                                            />
                                            <path
                                                className="group-hover:fill-item_bar_hover"
                                                d="M15.4208 5.66459C13.8022 2.42726 10.9273 0.75 8 0.75C5.07266 0.75 2.19784 2.42726 0.57918 5.66459C0.473607 5.87574 0.473607 6.12426 0.57918 6.33541C2.19784 9.57274 5.07266 11.25 8 11.25C10.9273 11.25 13.8022 9.57274 15.4208 6.33541C15.5264 6.12426 15.5264 5.87574 15.4208 5.66459ZM8 9.75C5.77341 9.75 3.49854 8.53441 2.09724 6C3.49854 3.46558 5.77341 2.25 8 2.25C10.2266 2.25 12.5015 3.46558 13.9028 6C12.5015 8.53441 10.2266 9.75 8 9.75Z"
                                                fill="#8F90A6"
                                            />
                                        </svg>
                                    </div>
                                </Link>

                                {(h5pData?.created_by?.id ===
                                    workspaceDetailInformation.membership
                                        .user_id &&
                                    h5pData?.status !== 'public') ||
                                workspaceDetailInformation.membership.role ===
                                    'admin' ? (
                                    <div
                                        className=" group hover:bg-ooolab_blue_0 rounded-ooolab_circle p-ooolab_p_2 cursor-pointer "
                                        onClick={onDeleteH5P}
                                    >
                                        <svg
                                            className="w-ooolab_w_4 h-ooolab_h_4"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                        >
                                            <path
                                                className="group-hover:fill-item_bar_hover"
                                                d="M4.25 2C4.25 1.17157 4.92157 0.5 5.75 0.5H10.25C11.0784 0.5 11.75 1.17157 11.75 2V3.5H13.2423C13.2469 3.49996 13.2515 3.49996 13.2562 3.5H14.75C15.1642 3.5 15.5 3.83579 15.5 4.25C15.5 4.66421 15.1642 5 14.75 5H13.9483L13.2978 14.1069C13.2418 14.8918 12.5886 15.5 11.8017 15.5H4.19834C3.41138 15.5 2.75822 14.8918 2.70215 14.1069L2.05166 5H1.25C0.835786 5 0.5 4.66421 0.5 4.25C0.5 3.83579 0.835786 3.5 1.25 3.5H2.74381C2.74846 3.49996 2.75311 3.49996 2.75774 3.5H4.25V2ZM5.75 3.5H10.25V2H5.75V3.5ZM3.55548 5L4.19834 14H11.8017L12.4445 5H3.55548ZM6.5 6.5C6.91421 6.5 7.25 6.83579 7.25 7.25V11.75C7.25 12.1642 6.91421 12.5 6.5 12.5C6.08579 12.5 5.75 12.1642 5.75 11.75V7.25C5.75 6.83579 6.08579 6.5 6.5 6.5ZM9.5 6.5C9.91421 6.5 10.25 6.83579 10.25 7.25V11.75C10.25 12.1642 9.91421 12.5 9.5 12.5C9.08579 12.5 8.75 12.1642 8.75 11.75V7.25C8.75 6.83579 9.08579 6.5 9.5 6.5Z"
                                                fill="#8F90A6"
                                            />
                                        </svg>
                                    </div>
                                ) : null}
                            </div>

                            <div className="relative h-ooolab_h_8 border-ooolab_bar_color border rounded-lg mb-ooolab_m_4">
                                <div className="absolute top-0 left-0 flex items-center justify-center h-full ">
                                    <label
                                        className="flex items-center border-r text-ooolab_sm px-ooolab_p_3 border-ooolab_bar_color  text-ooolab_dark_1  h-full rounded-r-xl"
                                        htmlFor="author"
                                    >
                                        {translator(
                                            'DASHBOARD.H5P_CONTENTS.CONTENT_TYPE'
                                        )}
                                    </label>

                                    <label className="flex items-center border text-ooolab_xs px-ooolab_p_3 border-ooolab_bar_color  text-ooolab_dark_1  rounded-xl bg-ooolab_light_blue_0 py-ooolab_p_1_half mx-ooolab_m_1">
                                        {h5pData?.mainLibrary &&
                                            H5P_LIBRARY[
                                                h5pData?.mainLibrary?.split(
                                                    '.'
                                                )[1]
                                            ]}
                                    </label>
                                </div>
                            </div>
                            <div className="mb-ooolab_m_4">
                                {isEdit ? (
                                    <TagRender
                                        title={translator('TAGS')}
                                        data={tagData}
                                        isEditable
                                        onCheck={handleAddTag}
                                        onUnCheck={handleRemoveTag}
                                    />
                                ) : (
                                    <TagRender
                                        title={translator('TAGS')}
                                        data={tagData}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="h-max col-span-4 px-ooolab_p_10 py-ooolab_p_5 shadow-ooolab_box_shadow_container rounded-3xl overflow-hidden ml-ooolab_m_4">
                        {isEdit ? (
                            <H5PEditor
                                h5pContentListEntryState={
                                    h5pContentListEntryState
                                }
                                setH5PContentListEntryState={
                                    setH5PContentListEntryState
                                }
                                entryState={entryState}
                                setEntryState={setEntryState}
                                h5pEditorRef={h5pEditorRef}
                            />
                        ) : (
                            <H5PPlayerContentComponent
                                argsId={argsId}
                                entryState={entryState}
                                setEntryState={setEntryState}
                            />
                        )}
                    </div>
                </div>
            </div>
            {isModal && (
                <H5PModal
                    isModal={true}
                    setIsModal={setIsModal}
                    modalProps={modalProps}
                />
            )}
            <Modal
                isOpen={modalError}
                onClose={() => location.reload()}
                closable={false}
                title={
                    <div className="">
                        <div className="mb-ooolab_m_6">
                            {' '}
                            {errorTitle(statusError)}
                        </div>
                        <p className="text-ooolab_dark_2 text-ooolab_xs mt-ooolab_m_2">
                            {translator('MODALS.ERRORS.REFRESH_THIS_PAGE')}
                        </p>
                    </div>
                }
            />

            {/* <div className="pt-8 pl-10 mx-auto">
                <h2 className="text-ooolab_black text-ooolab_lg pb-ooolab_p_2 mb-ooolab_m_3">
                    {h5pContentListEntryState.title}
                </h2>

                <H5PPlayerContentComponent
                    argsId={argsId}
                    entryState={entryState}
                    setEntryState={setEntryState}
                />
                <H5PEditor
                    h5pContentListEntryState={h5pContentListEntryState}
                    setH5PContentListEntryState={setH5PContentListEntryState}
                    entryState={entryState}
                    setEntryState={setEntryState}
                />
                {errMsg}
            </div> */}
        </>
    );
};

export default H5PViewer;
