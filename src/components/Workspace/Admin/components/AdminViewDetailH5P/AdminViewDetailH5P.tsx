import React, { useContext } from 'react';
// PACKAGES
import { Link, useHistory, useParams } from 'react-router-dom';
// COMPONENTS
import H5PPlayerContentComponent from 'components/H5P/H5PPlayer/H5PPlayerContentComponent';
import H5PEditor from 'components/H5P/H5PEditor';
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
import { ChevronRightIcon } from '@heroicons/react/solid';
import TagRender from 'components/TagRender';
import { XIcon } from '@heroicons/react/outline';
import { H5PEditorUI } from 'packages/h5p-react';
// UTILS

//SERVIES
import h5pServices from 'services/h5p.service';
import { H5P_MODAL } from 'constant/modal.const';
import { TagType } from 'types/GetListOfWorkspace.type';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceAdminContext } from 'contexts/Workspace/WorkspaceContext';
import { toast, ToastContainer } from 'react-toastify';

import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import h5pMiddlware from 'middleware/h5p.middlware';
import {
    approveH5PRequest,
    cancelApproval,
} from 'components/H5P/H5PComponents/H5PComponentsFN';
import { H5PModal } from 'components/H5P/H5PComponents';
import { H5P_LIBRARY } from 'constant/h5p.const';
import { useTranslation } from 'react-i18next';

const AdminViewDetailH5P: React.FC = () => {
    const [entryState, setEntryState] = React.useState({
        editing: false,
        playing: false,
        loading: false,
        saved: false,
        saving: false,
        saveError: false,
        saveErrorMessage: '',
    });

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
    const { t: translator } = useTranslation();
    const params: { id: string; contentId: string } = useParams();

    const [errMsg, setErrMsg] = React.useState<string>();
    const [
        h5pContentListEntryState,
        setH5PContentListEntryState,
    ] = React.useState<IContentListEntry>();
    const h5PCtx = React.useContext(H5PContext);

    const [h5pData, setH5PData] = React.useState<IContentListEntry>();

    const {
        dispatch,
        H5PState: { err, h5PApproveContentResult, currentH5P },
    } = h5PCtx;

    React.useEffect(() => {
        h5pMiddleware.getCurentH5P(dispatch, {
            workspaceId: params.id,
            contentId: params.contentId,
        });
        workspaceMiddleware.getLessonTags(dispatchWorkspace, params.id);
    }, []);

    const { dispatch: dispatchWorkspace, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    React.useEffect(() => {
        if (h5pData && h5PApproveContentResult) {
            setH5PData({
                argsId: h5pData?.argsId,
                contentId: h5pData?.contentId,
                mainLibrary: h5pData?.mainLibrary,
                title: h5pData?.title,
                status: 'public',
            });
        }
    }, [h5PApproveContentResult]);

    React.useEffect(() => {
        if (currentH5P) {
            setH5PContentListEntryState({
                argsId: {
                    workspaceId: params.id,
                    contentId: params.contentId,
                },
                contentId: params.contentId,
                mainLibrary: currentH5P?.metadata?.mainLibrary,
                title: currentH5P?.metadata?.title,
                status: currentH5P?.status,
                tags: currentH5P?.tags,
                uid: currentH5P?.uid,
                updated_on: currentH5P?.updated_on,
            });
        }
    }, [currentH5P]);

    React.useEffect(() => {
        if (h5pContentListEntryState) {
            setH5PData(h5pContentListEntryState);
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

    async function approve() {
        approveH5PRequest(dispatch, {
            workspaceId: params.id,
            contentId: params.contentId,
        });
    }

    async function decline() {
        cancelApproval(dispatch, {
            workspaceId: params.id,
            contentId: params.contentId,
        });
    }
    async function onDecline() {
        setIsModal(true);
        const modalProps = {
            component: H5P_MODAL.declineAdmin,
            onFetch: decline,
        };
        await setModalProps(modalProps);
    }

    async function onApprove() {
        setIsModal(true);
        const modalProps = {
            component: H5P_MODAL.approveAdmin,
            onFetch: approve,
        };
        await setModalProps(modalProps);
    }

    return (
        <div>
            <div className="px-ooolab_p_16 py-ooolab_p_2 w-full h-screen relative  ">
                <ToastContainer />
                <div className="grid auto-rows-max grid-cols-6 gap-3 h-full">
                    <div className="col-span-4 flex items-center text-ooolab_xl py-ooolab_p_1 font-semibold">
                        <Link to={`/workspace/${params.id}/admin`}>
                            <p className="text-ooolab_xl font-semibold text-ooolab_dark_2">
                                Admin
                            </p>
                        </Link>
                        <ChevronRightIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_1" />
                        <p className="text-ooolab_dark_1"> {h5pData?.title}</p>
                    </div>
                    <div className="col-span-2 flex justify-end items-center  text-white">
                        {h5pData?.status === 'pending' && (
                            <>
                                <button
                                    className={` text-ooolab_sm  bg-ooolab_blue_1 rounded-lg p-ooolab_p_1 px-ooolab_p_3 focus:outline-none  text-white mr-ooolab_m_4 `}
                                    onClick={onDecline}
                                >
                                    Decline
                                </button>
                                <button
                                    className={` text-ooolab_sm  bg-ooolab_blue_1 rounded-lg p-ooolab_p_1 px-ooolab_p_3 focus:outline-none  text-white  `}
                                    onClick={onApprove}
                                >
                                    Approve
                                </button>
                            </>
                        )}
                        <Link to={`/workspace/${params.id}/admin`}>
                            <div className="w-ooolab_w_8 h-ooolab_h_8 rounded-full  ml-ooolab_m_4 flex justify-center items-center group hover:shadow-ooolab_box_shadow_2 ">
                                <XIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 cursor-pointer focus:outline-none  group-hover:text-ooolab_blue_1" />
                            </div>
                        </Link>
                    </div>
                    <div
                        style={{
                            borderRadius: 20,
                            height: 'calc(100vh - calc(88*(100vw/1440)))',
                        }}
                        className="col-span-2 w-full h-full shadow-ooolab_box_shadow_container px-ooolab_p_5 py-ooolab_p_5"
                    >
                        <div className="flex justify-between">
                            <input
                                defaultValue={h5pData?.title}
                                value={h5pData?.title}
                                disabled
                                id="h5p-name-input"
                                className="focus:outline-none border-b border-white focus:border-ooolab_gray_2 text-ooolab_base bg-white"
                            />
                            <p className="capitalize flex items-center">
                                <span
                                    className={`w-ooolab_w_2_root h-ooolab_h_2 shadow-ooolab_lesson_status rounded-full mr-ooolab_m_2 ${generateStatusBg(
                                        h5pData?.status
                                    )}`}
                                />
                                <span className={`text-ooolab_xs `}>
                                    {h5pData?.status}
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
                            </div>

                            <div className="relative h-ooolab_h_8 border-ooolab_bar_color border rounded-lg mb-ooolab_m_4">
                                <div className="absolute top-0 left-0 flex items-center justify-center h-full ">
                                    <label
                                        className="flex items-center border-r text-ooolab_sm px-ooolab_p_3 border-ooolab_bar_color  text-ooolab_dark_1  h-full rounded-r-xl"
                                        htmlFor="author"
                                    >
                                        Content Type
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
                                <TagRender
                                    title={translator('TAGS')}
                                    data={h5pData?.tags}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="h-max col-span-4 px-ooolab_p_10 py-ooolab_p_5 shadow-ooolab_box_shadow_container rounded-3xl overflow-hidden ml-ooolab_m_6">
                        <H5PPlayerContentComponent
                            argsId={{
                                workspaceId: params.id,
                                contentId: params.contentId,
                            }}
                            entryState={entryState}
                            setEntryState={setEntryState}
                        />
                    </div>
                    <H5PModal
                        isModal={isModal}
                        setIsModal={setIsModal}
                        modalProps={modalProps}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminViewDetailH5P;
