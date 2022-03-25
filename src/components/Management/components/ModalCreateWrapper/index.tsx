import { Fragment, FC, useRef, useCallback } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import CancelChanges from 'assets/SVG/cancel.svg';
import Modal from 'components/Modal';
import { useBoolean } from 'hooks/custom';
import { useTranslation } from 'react-i18next';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string | React.ReactNode;
    shouldWarningBeforeClose?: boolean;
}

const ModalCreate: FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    shouldWarningBeforeClose = false,
}) => {
    const { t: translator } = useTranslation();
    const cancelButtonRef = useRef(null);
    const {
        booleanValue: warningClose,
        toggleBooleanValue: toggleWarningClose,
    } = useBoolean();

    const handleClose = () => {
        if (shouldWarningBeforeClose) {
            toggleWarningClose();
        } else {
            onClose();
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isOpen}
                onClose={() => handleClose()}
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
                    {/* <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span> */}
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out"
                        enterFrom="transform opacity-0"
                        enterTo="transform opacity-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100"
                        leaveTo="transform opacity-0"
                    >
                        <div className="bg-white text-left overflow-hidden shadow-xl transform transition-all sm:align-middle w-ooolab_w_120 relative pt-ooolab_p_4 pb-ooolab_p_8 px-ooolab_p_5">
                            <div className="flex items-center justify-between">
                                <p className="text-ooolab_xs text-ooolab_dark_1 font-semibold">
                                    {title}
                                </p>
                                <XIcon
                                    onClick={handleClose}
                                    className="h-ooolab_h_5 w-ooolab_w_5 text-ooolab_dark_2 cursor-pointer"
                                />
                            </div>
                            {children}
                        </div>
                    </Transition.Child>
                </div>
                <Modal
                    imgSrc={CancelChanges}
                    title={`${translator('MODALS.UNSAVED_PROMPT')}`}
                    isOpen={warningClose}
                    onClose={() => {}}
                    mainBtn={
                        <button
                            // onClick={() => {
                            //     if (modalState.func) {
                            //         modalState.func(true);
                            //         handleClosePromptModal();
                            //     }
                            // }}
                            onClick={() => {
                                toggleWarningClose();
                                setTimeout(() => {
                                    onClose();
                                }, 100);
                            }}
                            className="bg-red-500 text-white text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none"
                        >
                            {translator('MODALS.CONFIRM')}
                        </button>
                    }
                    subBtn={
                        <button
                            onClick={() => toggleWarningClose()}
                            className="border text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none"
                        >
                            {translator('MODALS.NO_CANCEL')}
                        </button>
                    }
                />
            </Dialog>
        </Transition.Root>
    );
};

export default ModalCreate;
