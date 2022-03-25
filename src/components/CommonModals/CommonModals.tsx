/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useState } from 'react';
// PACKAGE
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/outline';

export interface CommonModalsProps {
    titleText: string;
    contentText: string;
    handleAgree: () => void;
    handleDismiss?: () => void;
    agreeText?: string;
    dismissName?: string;
}

const CommonModals: React.FC<CommonModalsProps> = ({
    titleText,
    contentText,
    handleAgree,
    handleDismiss,
    agreeText,
    dismissName,
}) => {
    const [open, setOpen] = useState(true);

    const cancelButtonRef = useRef(null);

    function onAgree() {
        handleAgree();
        setOpen(false);
    }

    function onDismiss() {
        if (handleDismiss) {
            handleDismiss();
        }
    }

    function onClose() {
        setOpen(false);
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={open}
                onClose={setOpen}
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

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-8/12 lg:w-5/12 sm:rounded-3xl relative">
                            <button
                                onClick={onClose}
                                ref={cancelButtonRef}
                                className="absolute w-8 right-2 top-2 opacity-50 focus:outline-none"
                            >
                                <XIcon />
                            </button>
                            <div className="bg-white px-10 pt-5 pb-4 h-full sm:p-6 sm:pb-4 sm:px-4 sm:w-full">
                                <div className=" sm:flex sm:items-start sm:w-full">
                                    <div className="w-full mx-auto  justify-start flex-shrink-0 flex items-center sm:justify-center h-24  sm:mx-0 sm:w-2/12 ">
                                        <div className=" flex w-3/12 bg-ooolab_gray_8 sm:w-full  h-4/5 rounded-xl sm:rounded-3xl justify-center items-center ">
                                            <CheckCircleIcon
                                                className="h-4/5 w-4/12 text-center text-ooolab_green_0"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 text-left sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-ooolab_24px font-semibold text-ooolab_green_0"
                                        >
                                            {titleText}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {contentText}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={onAgree}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ooolab_blue_3 text-base font-medium text-white hover:bg-ooolab_blue_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    {agreeText || `Agree`}
                                </button>
                                {handleDismiss && (
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={onDismiss}
                                        ref={cancelButtonRef}
                                    >
                                        {`${dismissName || 'Dismiss'}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default CommonModals;
