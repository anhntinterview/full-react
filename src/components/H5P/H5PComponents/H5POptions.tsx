/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DownloadIcon,
} from '@heroicons/react/outline';
import { IContentListEntry, IH5PContentList, ParamsH5P } from 'types/H5P.type';

// SERVICE
import h5pServices from 'services/h5p.service';
import { H5PModal } from '.';
import { H5P_MODAL } from 'constant/modal.const';
import { errorNoti, successNoti, updateList } from 'components/H5P/H5PFN';
import { H5PContext } from 'contexts/H5P/H5PContext';
import { useTranslation } from 'react-i18next';
import h5pService from 'services/h5p.service';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const iconStyle = 'w-ooolab_w_4 h-ooolab_w_4 text-ooolab_dark_2';

interface H5POptionsInterface {
    canDelete: boolean;
    id: string;
    workspace: string;
    setSelected: React.Dispatch<
        React.SetStateAction<IContentListEntry | undefined>
    >;
    contentList: IH5PContentList | undefined;
    setContentList: React.Dispatch<React.SetStateAction<IH5PContentList>>;
}

const h5POptions: React.FC<H5POptionsInterface> = ({
    canDelete,
    id,
    workspace,
    setSelected,
    contentList,
    setContentList,
}) => {
    const { t: translator } = useTranslation();
    const history = useHistory();
    const h5PCtx = useContext(H5PContext);
    const {
        dispatch: h5pDispatch,
        H5PState: { params },
    } = h5PCtx;

    const paramsUrl: { id: string } = useParams();

    const [isModal, setIsModal] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState<{
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

    async function onDelete() {
        try {
            if (contentList) {
                const argsId = {
                    workspaceId: workspace,
                    contentId: id,
                };

                setSelected(undefined);
                await h5pServices.h5pDeletePromise(argsId).then((res) => {
                    if (res) {
                        const contents: IH5PContentList = {
                            items: contentList?.items?.filter(
                                (d) => d.contentId !== id
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
            }
        } catch (error) {
            console.error(error);
        }
    }

    const MenuList = [
        {
            name: translator('DASHBOARD.H5P_CONTENTS.PREVIEW'),
            icons: <EyeIcon className={iconStyle} />,
            function: () =>
                history.push(
                    `/workspace/${workspace}/h5p-content/${id}/preview`
                ),
            isDisplay: true,
        },
        {
            name: translator('DOWNLOAD'),
            icons: <DownloadIcon className={iconStyle} />,
            function: async () => {
                updateProgress(0);
                const data: any = await h5pService.h5pEditPromise({
                    workspaceId: workspace,
                    contentId: id,
                });
                const messageChannel = new MessageChannel();
                messageChannel.port1.onmessage = (event: any) => {
                    switch (event.data.type) {
                        case 'done':
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            document.body.appendChild(a);
                            a.download = `${data.metadata.title}.h5p`;
                            a.href = URL.createObjectURL(event.data.data);

                            // Trigger the download by simulating click
                            a.click();

                            // Cleanup
                            window.URL.revokeObjectURL(a.href);
                            document.body.removeChild(a);
                            updateProgress(undefined);
                            break;
                        case 'progress':
                            updateProgress(event.data.progress);
                            break;
                        default:
                            break;
                    }
                };
                try {
                    (navigator as any).serviceWorker.controller.postMessage(
                        {
                            type: 'download',
                            data,
                            env: process.env.REACT_APP_S3_PATH,
                            id,
                        },
                        [messageChannel.port2]
                    );
                } catch (e) {}
            },
            isDisplay: 'serviceWorker' in navigator,
        },
        {
            name: translator('DASHBOARD.H5P_CONTENTS.EDIT'),
            icons: <PencilIcon className={iconStyle} />,
            function: () =>
                history.push(`/workspace/${workspace}/h5p-content/${id}`),
            isDisplay: true,
        },
        {
            name: translator('DASHBOARD.H5P_CONTENTS.DELETE'),
            icons: <TrashIcon className={iconStyle} />,
            function: onDeleteH5P,
            isDisplay: canDelete ? true : false,
        },
    ];

    async function onDeleteH5P() {
        setIsModal(true);
        const modalProps = {
            component: H5P_MODAL.deleteH5P,
            onFetch: onDelete,
        };
        setModalProps(modalProps);
    }

    const [progress, updateProgress] = useState<number | undefined>(undefined);

    return (
        <>
            <Transition.Root show={progress !== undefined} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    onClose={() => {}}
                    className="fixed z-1 inset-0 overflow-y-auto"
                    open={progress !== undefined}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:items-start sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <div className="mt-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all relative px-5 py-2 text-ooolab_blue_3">
                                {progress !== undefined &&
                                    (progress === 100
                                        ? translator('ALMOST_DONE')
                                        : `${translator(
                                              'PROCESSING'
                                          )} ${progress}%`)}
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            <Menu as="div" className="inline-block text-left">
                {({ open }) => (
                    <>
                        <div>
                            <Menu.Button className="flex justify-center items-center text-ooolab_dark_1 hover:bg-ooolab_bg_sub_tab_hover hover:text-white focus:outline-none w-ooolab_w_6 h-ooolab_h_6 rounded-full">
                                <DotsVerticalIcon
                                    className="w-ooolab_w_4 h-ooolab_h_4"
                                    aria-hidden="true"
                                />
                            </Menu.Button>
                        </div>

                        <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="z-9999 shadow-ooolab_box_shadow_container origin-top-right absolute right-ooolab_inset_7 mt-ooolab_m_2 w-ooolab_w_44 rounded-header_menu divide-y divide-gray-100 focus:outline-none">
                                <div className="py-ooolab_p_1">
                                    {MenuList.map((i) => {
                                        return (
                                            <Menu.Item key={i.name}>
                                                {({}) => (
                                                    <div
                                                        onClick={(e) => {
                                                            if (i.function) {
                                                                i.function();
                                                            }
                                                        }}
                                                        className={`flex  px-ooolab_p_2 w-full bg-white hover:bg-ooolab_bg_sub_tab_hover cursor-pointer ${
                                                            !i.isDisplay &&
                                                            'hidden'
                                                        } `}
                                                    >
                                                        {i.icons}
                                                        <a
                                                            className={classNames(
                                                                'block px-ooolab_p_4 py-ooolab_p_1 text-ooolab_sm'
                                                            )}
                                                        >
                                                            {i.name}
                                                        </a>
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        );
                                    })}
                                </div>
                            </Menu.Items>
                        </Transition>
                        {isModal && (
                            <H5PModal
                                isModal={true}
                                setIsModal={setIsModal}
                                modalProps={modalProps}
                            />
                        )}
                    </>
                )}
            </Menu>
        </>
    );
};

export default h5POptions;
