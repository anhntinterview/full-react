import { Transition, Dialog } from '@headlessui/react';
import { FC, useRef, useState, Fragment, useEffect } from 'react';
import workspaceService from 'services/workspace.service';
import { useHistory, useParams } from 'react-router';
import ConfirmSave from 'assets/img/confirm_save.png';
import ActionDone from 'assets/img/done.png';
import ActionFailed from 'assets/img/action_failed.png';
import { XIcon } from '@heroicons/react/outline';
import { NormalResponseError } from 'types/Common.type';
import { useTranslation } from 'react-i18next';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    submitData: Record<string, any>;
    onSave: () => void;
    createError: NormalResponseError;
    createStatus:
        | 'init'
        | 'done'
        | 'error'
        | 'loading'
        | 'error_update'
        | 'done_update';
};

const ModalCreateClass: FC<ModalProps> = ({
    isOpen,
    onClose,
    onSave,
    createStatus,
    createError,
}) => {
    const { t: translator } = useTranslation();

    const params: { id: string; classId: string } = useParams();
    const cancelButtonRef = useRef(null);
    const [status, setStatus] = useState<
        'creating' | 'done' | 'error_upload' | 'error_create' | 'error_update'
    >('creating');
    const handleUpdateClass = async (e: string, courseId: number) => {};

    useEffect(() => {
        if (status === 'done') {
        }
    }),
        [status];
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isOpen}
                onClose={onClose}
            >
                <div className="flex justify-center h-screen text-center items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-700"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-ooolab_gray_4 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
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
                        <div className="min-w-ooolab_w_80 max-w-ooolab_w_80 min-h-ooolab_h_60 grid grid-rows-1 p-ooolab_p_5 bg-white rounded-ooolab_card text-left shadow-xl transform transition-all sm:align-middle relative">
                            <XIcon
                                onClick={onClose}
                                className="text-ooolab_dark_1 cursor-pointer w-ooolab_w_6 h-ooolab_h_6 top-6 right-6 absolute"
                            />
                            {(createStatus === 'init' ||
                                createStatus === 'loading') && (
                                <div className="row-span-1 flex flex-col justify-between items-center h-full">
                                    <img
                                        className="w-ooolab_w_25 h-ooolab_h_25"
                                        src={ConfirmSave}
                                        alt=""
                                    />
                                    <p className="text-ooolab_sm text-ooolab_dark_1 font-normal my-ooolab_m_3">
                                        {translator('MODALS.SAVE_CHANGES')}
                                    </p>
                                    <p className="text-ooolab_sm text-ooolab_dark_1 font-light mb-ooolab_m_8">
                                        {translator(
                                            'MODALS.SUB_TITLE_SAVE_CHANGE'
                                        )}
                                    </p>
                                    <div className="flex justify-evenly w-full">
                                        <button
                                            className={
                                                'rounded-ooolab_radius_8px bg-white border border-ooolab_dark_2 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-ooolab_dark_1 font-medium'
                                            }
                                            onClick={onClose}
                                        >
                                            {translator('MODALS.CANCEL')}
                                        </button>
                                        <button
                                            className={
                                                'rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium'
                                            }
                                            onClick={onSave}
                                        >
                                            {createStatus === 'loading' ? (
                                                <svg
                                                    className="animate-spin text-white w-ooolab_w_5 h-ooolab_h_5"
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
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                <span>
                                                    {' '}
                                                    {translator(
                                                        'MODALS.YES_SAVE_IT'
                                                    )}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {createStatus === 'done_update' && (
                                <div className="row-span-1 flex flex-col justify-center items-center h-full">
                                    <img
                                        className="w-ooolab_w_25 h-ooolab_h_25"
                                        src={ActionDone}
                                    />
                                    <p className="text-ooolab_base text-ooolab_dark_1 font-semibold mt-ooolab_m_3">
                                        {translator('CLASSES.CLASS_UPDATED')}
                                    </p>
                                </div>
                            )}
                            {createStatus === 'error_update' && (
                                <div className="row-span-1 flex flex-col justify-center items-center h-full">
                                    <img
                                        className="w-ooolab_w_25 h-ooolab_h_25"
                                        src={ActionFailed}
                                    />

                                    {createError?.error?.description ? (
                                        <p className="text-ooolab_xs text-center mt-ooolab_m_1 font-medium text-ooolab_dark_1">
                                            {createError?.error?.description}
                                        </p>
                                    ) : (
                                        <>
                                            <p>
                                                {translator(
                                                    'CLASSES.SOMETHING_WRONG'
                                                )}
                                            </p>
                                            <ul className="text-ooolab_sxs ">
                                                {createError?.error
                                                    ?.body_params &&
                                                    createError?.error.body_params.map(
                                                        (i) => (
                                                            <li className="text-red-500 inline-flex items-center">
                                                                <XIcon className="w-ooolab_w_2_e h-ooolab_w_2_e mr-ooolab_m_1" />
                                                                {i.msg}
                                                            </li>
                                                        )
                                                    )}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ModalCreateClass;
