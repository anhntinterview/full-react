import { Fragment, FC, useRef, useEffect } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    imgSrc?: string | React.ReactNode;
    title: string | React.ReactNode;
    contentText?: string;
    mainBtn?: React.ReactNode;
    subBtn?: React.ReactNode;
    closable?: boolean;
}

const Modal: FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    imgSrc,
    contentText,
    mainBtn,
    subBtn,
    closable = true,
}) => {
    const cancelButtonRef = useRef(null);

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
                <div className="flex justify-center h-screen pt-4 px-4 pb-20 text-center items-center">
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
                        <div className="bg-white rounded-header_menu text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle  max-w-ooolab_w_80 w-ooolab_w_80 min-h-ooolab_h_18 relative pt-ooolab_p_4 pb-ooolab_p_8 px-ooolab_p_6">
                            <div className="flex flex-col items-center">
                                {(typeof imgSrc === 'string' && (
                                    <img
                                        className="w-ooolab_w_25 h-ooolab_h_25 mb-ooolab_m_3"
                                        src={imgSrc}
                                        alt=""
                                    />
                                )) ||
                                    imgSrc}

                                {/* title */}
                                <p className="mb-ooolab_m_2 text-center leading-ooolab_24px tracking-wide font-medium text-ooolab_sm">
                                    {title}
                                </p>
                                {/* content */}
                                <p className="text-center text-ooolab_sm mb-ooolab_m_6 leading-ooolab_24px font-normal">
                                    {contentText || ''}
                                </p>
                                <div
                                    className={`flex ${
                                        !subBtn || !mainBtn
                                            ? 'justify-center'
                                            : 'justify-between'
                                    } w-full`}
                                >
                                    {subBtn || null}
                                    {mainBtn || null}
                                </div>
                            </div>
                            {closable && (
                                <XIcon
                                    onClick={() => onClose()}
                                    className="w-ooolab_w_5 h-ooolab_h_5 absolute top-4 right-5 cursor-pointer"
                                />
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default Modal;
