import React, { useContext, useState } from 'react';

import { H5PEditorUI } from 'packages/h5p-react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
    ChevronRightIcon,
    SaveIcon,
    TagIcon,
    TrashIcon,
    XIcon,
} from '@heroicons/react/outline';
import TagRender from 'components/TagRender';

import h5pServices from 'services/h5p.service';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

import { H5PContext } from 'contexts/H5P/H5PContext';

import workspaceMiddleware from 'middleware/workspace.middleware';

import h5pMiddlware from 'middleware/h5p.middlware';

import SaveChanges from 'assets/SVG/save-changes.svg';

import {
    IContentListEntry,
    IH5PPlayerArgs,
    TagIdType,
    TagsType,
} from 'types/H5P.type';
import { CreateTagBody } from 'types/ApiData.type';
import { TagType } from 'types/GetListOfWorkspace.type';
import { WorkspaceService } from 'services';
import { toast, ToastContainer } from 'react-toastify';
import { H5PModal, H5PPublish } from 'components/H5P/H5PComponents';
import { CANCEL_H5P, DELETE_H5P, SAVE_H5P } from 'constant/modal.const';
import { errorNoti, successNoti } from 'components/H5P/H5PFN';
import { H5P_LIBRARY } from 'constant/h5p.const';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { useTranslation } from 'react-i18next';
import Modal from 'components/Modal';
import { StatusContent } from 'constant/util.const';

interface ViewProps {}

const H5PBuilder: React.FC<ViewProps> = ({ children }) => {
    const history = useHistory();
    const userInfo = getLocalStorageAuthData();
    const h5pEditor: React.RefObject<H5PEditorUI> = React.useRef(null);
    const { h5pEditPromise, h5pSavePromise } = h5pServices;
    const [h5pPublish, setH5PPublish] = React.useState<boolean>(true);
    const [taglist, setTaglist] = React.useState<TagType[]>([]);
    const [tagData, setTagData] = React.useState<TagType[]>([]);
    const [entryState, setEntryState] = useState({
        editing: 'new',
        playing: false,
        saving: false,
        saved: false,
        loading: true,
        saveErrorMessage: '',
        saveError: false,
    });
    const params: { id: string } = useParams();
    const [isModal, setIsModal] = React.useState<boolean>(false);
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
    let newCounter = 0;
    const { t: translator } = useTranslation();
    const h5PCtx = React.useContext(H5PContext);
    const [modalCreate, setModalCreate] = useState(false);
    const {
        dispatch: h5PDispatch,
        H5PState: { h5PPlayerResult, h5PApproveContentResult, err, currentH5P },
    } = h5PCtx;

    const [content, setContent] = useState<IContentListEntry>({
        contentId: 'new',
        argsId: {
            workspaceId: params.id,
            contentId: 'new',
        },
        mainLibrary: undefined,
        title: 'New H5P',
        originalNewKey: `new-${newCounter++}`,
        status: '',
        tags: undefined,
    });

    const { dispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const { result: workspaceDetailInformation } = getWorkspaceDetailState;

    const H5PCtx = useContext(H5PContext);

    React.useEffect(() => {
        if (content?.status === 'draft') {
            setH5PPublish(false);
        }
        if (content?.status === 'public') {
            setH5PPublish(true);
        }
    }, [content]);

    React.useEffect(() => {
        if (getWorkspaceDetailState.tagList) {
            setTaglist(getWorkspaceDetailState.tagList.items);
        }
    }, [getWorkspaceDetailState.tagList]);

    // React.useEffect(() => {
    //     if (workspaceDetailInformation.id === -1) {
    //         workspaceMiddleware.getWorkspace(dispatch, {
    //             id: params.id,
    //         });
    //     }
    // }, []);

    React.useEffect(() => {
        if (h5PApproveContentResult) {
            setContent({
                ...content,
                status: 'public',
            });
        }
    }, [h5PApproveContentResult]);

    const handleSaved = async () => {
        setEntryState({
            ...entryState,
            saving: false,
            saved: true,
        });

        setTimeout(() => {
            setEntryState({
                ...entryState,
                saved: false,
            });
        }, 3000);
    };

    async function onSave() {
        setEntryState({ ...entryState, saving: true });
        try {
            const returnData: any = await h5pEditor?.current?.save();
            let tagsId: TagsType = {
                tags: [],
            };
            if (content?.contentId !== 'new') {
                tagData.map((t) => {
                    const tagId: TagIdType = {
                        tag_id: t.id,
                    };
                    tagsId.tags.push(tagId);
                });
                if (tagsId.tags.length) {
                    await h5pServices
                        .h5pAddTag(
                            {
                                workspaceId: params.id,
                                contentId: content.contentId,
                            },
                            tagsId
                        )
                        .then((res) => {
                            if (res === 1) {
                                successNoti(
                                    translator(
                                        'DASHBOARD.H5P_CONTENTS.TAGS_SUCCESS'
                                    ),
                                    <TagIcon />
                                );
                            }
                        })
                        .catch(() => {
                            errorNoti(
                                translator(
                                    'DASHBOARD.H5P_CONTENTS.TAGS_FAILED'
                                ),
                                <TagIcon />
                            );
                        });
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
                    }
                }
                if (returnData?.contentId) {
                    setContent({
                        contentId: returnData?.contentId,
                        argsId: {
                            workspaceId: params.id,
                            contentId: returnData?.contentId,
                        },
                        mainLibrary: returnData?.metadata?.mainLibrary,
                        title: returnData?.metadata?.title,
                        originalNewKey: content.originalNewKey,
                        status: 'draft',
                        tags: content?.tags,
                        created_by: {
                            id: userInfo.id,
                        },
                    });
                    setModalCreate(true);
                    setTimeout(
                        () =>
                            history.push(`/workspace/${params.id}/h5p-content`),
                        2000
                    );
                    // successNoti(
                    //     translator(
                    //         'DASHBOARD.H5P_CONTENTS.H5P_SAVE_CONTENT_SUCCESS'
                    //     ),
                    //     <SaveIcon />
                    // );
                    if (content?.contentId === 'new') {
                        const newArgsId: IH5PPlayerArgs = {
                            workspaceId: params.id,
                            contentId: returnData.contentId,
                            contentUid: returnData.uid,
                        };
                        tagData.map((t) => {
                            const tagId: TagIdType = {
                                tag_id: t.id,
                            };
                            tagsId.tags.push(tagId);
                        });
                        if (tagsId.tags.length) {
                            await h5pMiddlware.h5pAddTag(
                                H5PCtx.dispatch,
                                newArgsId,
                                tagsId
                            );
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onEditorLoaded = () => {
        setEntryState({ ...entryState, loading: false });
    };

    const onSaveError = async (event: any) => {
        setEntryState({
            ...entryState,
            saving: false,
            saved: false,
            saveError: true,
            saveErrorMessage: event?.detail?.message,
        });

        setTimeout(() => {
            setEntryState({
                ...entryState,
                saveError: false,
            });
        }, 5000);
    };

    React.useEffect(() => {
        if (currentH5P) {
            setContent({
                argsId: content.argsId,
                contentId: content.argsId.contentId,
                mainLibrary: currentH5P?.metadata?.mainLibrary,
                title: currentH5P?.metadata?.title,
                status: currentH5P?.status,
                tags: currentH5P?.tags,
                uid: currentH5P?.uid,
                updated_on: currentH5P?.updated_on,
            });
        }
    }, [currentH5P]);

    const handleSearchTag = (e: string) => {
        workspaceMiddleware.getLessonTags(dispatch, params.id, e);
    };

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

    const generateStatus = (status?: string) => {
        let style = 'text-ooolab_dark_2';
        switch (status) {
            case 'pending':
                return (style = ' text-ooolab_warn');
            case 'public':
                return (style = ' text-ooolab_green_1');
            default:
                return style;
        }
    };

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

    async function onCancelNewH5P() {
        history.push(`/workspace/${params.id}/h5p-content`);
    }

    async function onDelete() {
        if (content.mainLibrary) {
            await h5pServices
                .h5pDeletePromise(content.argsId)
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

    async function onCloseH5P() {
        if (content.contentId !== 'new') {
            history.push(`/workspace/${params.id}/h5p-content`);
        } else {
            setIsModal(true);
            const modalCancelProps = {
                component: CANCEL_H5P(translator),
                onFetch: onCancelNewH5P,
            };
            await setModalProps(modalCancelProps);
        }
    }

    async function onCreateH5P() {
        setIsModal(true);
        const modalProps = {
            component: SAVE_H5P(translator),
            onFetch: onSave,
        };
        await setModalProps(modalProps);
    }

    async function onDeleteH5P() {
        setIsModal(true);
        const modalProps = {
            component: DELETE_H5P(translator),
            onFetch: onDelete,
        };
        setModalProps(modalProps);
    }

    return (
        <div className="px-ooolab_p_16 py-ooolab_p_2 w-full h-screen">
            <ToastContainer />
            <div className="grid auto-rows-max grid-cols-6 gap-3 h-full">
                <div className="col-span-4 flex items-center text-ooolab_xl py-ooolab_p_1 font-semibold">
                    {children}
                    {/* <Link to={`/workspace/${params.id}/h5p-content`}>
                        <p className="text-ooolab_xl font-semibold text-ooolab_dark_2">
                            {translator('DASHBOARD.H5P_CONTENTS.H5P_CONTENTS')}
                        </p>
                    </Link>
                    <ChevronRightIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_1" />
                    <p className="text-ooolab_dark_1">
                        {translator('DASHBOARD.H5P_CONTENTS.CREATE_NEW_H5P')}
                    </p> */}
                </div>
                <div className="col-span-2 flex justify-end items-center  text-white">
                    <button
                        className={` shadow-ooolab_login_1 text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex items-center bg-ooolab_blue_1 text-white ${
                            entryState.saved && `bg-ooolab_gray_10`
                        }`}
                        onClick={onCreateH5P}
                    >
                        {translator('DASHBOARD.H5P_CONTENTS.SAVE')}
                    </button>
                    <div className="ml-ooolab_m_4">
                        <H5PPublish
                            status={content?.status}
                            canPublish={
                                workspaceDetailInformation.membership.role ===
                                'admin'
                            }
                            content={content}
                        />
                    </div>
                    <div className="w-ooolab_w_8 h-ooolab_h_8 rounded-full  ml-ooolab_m_4 flex justify-center items-center group hover:shadow-ooolab_box_shadow_2 ">
                        <XIcon
                            className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 cursor-pointer focus:outline-none  group-hover:text-ooolab_blue_1"
                            onClick={onCloseH5P}
                        />
                    </div>
                </div>
                <div
                    style={{
                        borderRadius: 20,
                    }}
                    className="col-span-2 w-full h-full shadow-ooolab_box_shadow_container px-ooolab_p_5 py-ooolab_p_5"
                >
                    <div className="flex justify-between">
                        <input
                            defaultValue={
                                content?.title?.length < 20
                                    ? content?.title
                                    : `${content?.title?.slice(0, 21)}...`
                            }
                            id="h5p-name-input"
                            className="focus:outline-none border-b border-white focus:border-ooolab_gray_2 text-ooolab_base bg-white"
                            value={
                                content?.title?.length < 20
                                    ? content?.title
                                    : `${content?.title?.slice(0, 21)}...`
                            }
                            disabled
                        />
                        <p className="capitalize flex items-center">
                            <span
                                className={`w-ooolab_w_2_root h-ooolab_h_2 shadow-ooolab_lesson_status rounded-full  mr-ooolab_m_2 ${generateStatusBg(
                                    content?.status
                                )}`}
                            />
                            <span
                                className={`text-ooolab_xs ${generateStatus(
                                    content?.status
                                )}`}
                            >
                                {content?.status
                                    ? StatusContent(translator, content?.status)
                                    : translator('STATUS_CONTENT.DRAFT')}
                            </span>
                        </p>
                    </div>
                    <div className="w-full mt-ooolab_m_4">
                        <div className="flex mb-ooolab_m_4">
                            {content.contentId !== 'new' && (
                                <Link
                                    to={`/workspace/${params.id}/h5p-content/${content.contentId}/preview`}
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
                            )}

                            {content.contentId !== 'new' &&
                            (workspaceDetailInformation.membership.role ===
                                'admin' ||
                                (content?.created_by?.id ===
                                    workspaceDetailInformation.membership
                                        .user_id &&
                                    content?.status !== 'public')) ? (
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
                            <div className="absolute top-0 left-0 flex items-center justify-center h-full  ">
                                <label
                                    className="flex items-center border-r text-ooolab_sm px-ooolab_p_3 border-ooolab_bar_color  text-ooolab_dark_1  h-full rounded-r-xl"
                                    htmlFor="author"
                                >
                                    {translator(
                                        'DASHBOARD.H5P_CONTENTS.CONTENT_TYPE'
                                    )}
                                </label>
                                {content.mainLibrary && (
                                    <label className="flex items-center border text-ooolab_xs px-ooolab_p_3 border-ooolab_bar_color  text-ooolab_dark_1  rounded-xl bg-ooolab_light_blue_0 py-ooolab_p_1_half mx-ooolab_m_1">
                                        {content?.mainLibrary &&
                                            H5P_LIBRARY[
                                                content?.mainLibrary?.split(
                                                    '.'
                                                )[1]
                                            ]}
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="mb-ooolab_m_4">
                            <TagRender
                                title={translator('TAGS')}
                                data={tagData}
                                isEditable
                                onCheck={handleAddTag}
                                onUnCheck={handleRemoveTag}
                            />
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        height: 'calc(100vh - calc(88*(100vw/1440)))',
                    }}
                    className="col-span-4 px-ooolab_p_10 py-ooolab_p_5 shadow-ooolab_box_shadow_container rounded-3xl relative overflow-y-auto ml-ooolab_m_4 "
                >
                    <H5PEditorUI
                        ref={h5pEditor}
                        argsId={content.argsId}
                        loadContentCallback={h5pEditPromise}
                        saveContentCallback={h5pSavePromise}
                        onSaved={handleSaved}
                        onLoaded={onEditorLoaded}
                        onSaveError={onSaveError}
                    />
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
                isOpen={modalCreate}
                onClose={() =>
                    history.push(`/workspace/${params.id}/h5p-content`)
                }
                closable={false}
                title={
                    <div className="mb-ooolab_m_1">
                        <p>{translator('MODALS.SUCCESS.H5P_CREATE')}</p>
                        <p className="text-ooolab_dark_2 text-ooolab_xs mt-ooolab_m_2">
                            {translator('MODALS.SUCCESS.H5P_REDIRECT_TO_LIST')}
                        </p>
                    </div>
                }
                imgSrc={SaveChanges}
            />
        </div>
    );
};

export default H5PBuilder;
