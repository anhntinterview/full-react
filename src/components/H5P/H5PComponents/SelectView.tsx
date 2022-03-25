import { TrashIcon, XIcon } from '@heroicons/react/outline';
import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import { IContentListEntry, IH5PContentList, ParamsH5P } from 'types/H5P.type';

// SERVICE
import h5pServices from 'services/h5p.service';
import { H5PModal } from '.';
import { DELETE_H5P, H5P_MODAL } from 'constant/modal.const';
import { Link } from 'react-router-dom';

import { successNoti, errorNoti, updateList } from 'components/H5P/H5PFN';
import { H5PContext } from 'contexts/H5P/H5PContext';
import { useTranslation } from 'react-i18next';

interface ViewProps {
    canDelete: boolean;
    data: IContentListEntry | undefined;
    setSelected: React.Dispatch<
        React.SetStateAction<IContentListEntry | undefined>
    >;
    contentList: IH5PContentList | undefined;
    setContentList: React.Dispatch<React.SetStateAction<IH5PContentList>>;
}

const SelectView: React.FC<ViewProps> = ({
    canDelete,
    data,
    setSelected,
    contentList,
    setContentList,
}) => {
    const { t: translator } = useTranslation();
    const history = useHistory();
    const paramsUrl: { id: string } = useParams();

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

    const h5PCtx = useContext(H5PContext);

    const {
        dispatch: h5pDispatch,
        H5PState: { params },
    } = h5PCtx;

    async function onDelete() {
        try {
            if (data && contentList) {
                const argsId = {
                    workspaceId: paramsUrl.id,
                    contentId: data.contentId,
                };
                await h5pServices.h5pDeletePromise(argsId).then((res) => {
                    if (res) {
                        const contents: IH5PContentList = {
                            items: contentList?.items?.filter(
                                (d) => d.contentId !== data.contentId
                            ),
                            order: contentList?.order,
                            page: contentList?.page,
                            per_page: contentList?.per_page,
                            sort_by: contentList?.sort_by,
                            total: contentList?.total,
                        };
                        setContentList(contents);
                        if (!contents.items.length) {
                            const h5PList: ParamsH5P = {
                                ...params,
                                page: 1,
                            };
                            setTimeout(() => {
                                updateList(h5pDispatch, paramsUrl.id, h5PList);
                            }, 1000);
                        }
                        successNoti(
                            translator(
                                'DASHBOARD.H5P_CONTENTS.H5P_MOVE_TO_TRASH'
                            ),
                            <TrashIcon />
                        );
                    } else {
                        errorNoti(
                            translator(
                                'DASHBOARD.H5P_CONTENTS.H5P_MOVE_TO_TRASH_FAILED'
                            ),
                            <TrashIcon />
                        );
                    }
                });

                setSelected(undefined);
            }
        } catch (error) {
            console.log(error);
        }
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
        <div className="flex items-center mb-ooolab_m_2 justify-start">
            <div className="flex text-ooolab_xl items-center w-10/12">
                <XIcon
                    className="h-ooolab_h_5 w-ooolab_w_5 text-ooolab_dark_2 cursor-pointer hover:text-ooolab_pink_1"
                    onClick={() => setSelected(undefined)}
                />
                <p className="text-ooolab_gray_5 px-ooolab_p_1">
                    {data?.title}
                </p>
                <p className="text-ooolab_dark_2">
                    {' '}
                    {translator('DASHBOARD.H5P_CONTENTS.IS_SELECTED')}
                </p>
            </div>
            <div className="flex justify-end w-full items-center">
                <Link
                    to={`/workspace/${paramsUrl.id}/h5p-content/${data?.contentId}/preview`}
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
                {canDelete && (
                    <div
                        className=" group hover:bg-ooolab_blue_0 rounded-ooolab_circle p-ooolab_p_2 cursor-pointer mr-ooolab_m_2 "
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
                )}

                {/* <div
                    className="flex items-cente justify-center rounded-lg  py-ooolab_p_1 px-ooolab_p_3 group bg-ooolab_blue_1"
                    onClick={() =>
                        history.push(
                            `/workspace/${paramsUrl.id}/h5p-content/${data?.contentId}/play-content`
                        )
                    }
                >
                    <div className="text-white text-ooolab_sm ">Edit</div>
                </div> */}
            </div>
            <H5PModal
                isModal={isModal}
                setIsModal={setIsModal}
                modalProps={modalProps}
            />
        </div>
    );
};

export default SelectView;
