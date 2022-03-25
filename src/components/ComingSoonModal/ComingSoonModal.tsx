/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useState } from 'react';
// PACKAGE
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import comingsoon from 'assets/SVG/comingsoon.svg';

export interface ComingSoonModalProps {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
    isOpen,
    setOpen,
}) => {
    const cancelButtonRef = useRef(null);

    function onClose() {
        setOpen(false);
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isOpen}
                onClose={setOpen}
            >
                <div className="flex i justify-center min-h-screen pt-4 px-4 pb-20 text-center items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
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
                        <div className="inline-block align-bottom bg-white rounded-header_menu text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle w-4/12 relative py-ooolab_p_6">
                            <button
                                onClick={onClose}
                                ref={cancelButtonRef}
                                className="absolute w-ooolab_w_8 right-2 top-2 opacity-50 focus:outline-none"
                            >
                                <XIcon className="hover:text-ooolab_blue_4 focus:text-ooolab_blue_4" />
                            </button>
                            <img className="w-full" src={comingsoon} alt="" />
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ComingSoonModal;
