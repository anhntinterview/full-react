/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef } from 'react';
// PACKAGE
import { Dialog, Transition } from '@headlessui/react';

import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { useLocation, useParams } from 'react-router-dom';

export interface WorkspaceNotificationProps {
    isNotify: boolean;
    setIsNotify: React.Dispatch<React.SetStateAction<boolean>>;
    title: string | React.ReactNode;
}

const WorkspaceNotification: React.FC<WorkspaceNotificationProps> = ({
    isNotify,
    setIsNotify,
    title,
}) => {
    const cancelButtonRef = useRef(null);
    // const localInfor = getLocalStorageAuthData();

    // const params: { id: string } = useParams();
    // const locations = useLocation();

    function onClose() {
        setIsNotify(false);
    }

    return (
        <Transition.Root show={isNotify} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isNotify}
                onClose={setIsNotify}
            >
                <div className="flex i justify-start min-h-screen pt-4 px-ooolab_p_20 pb-20 text-center items-start ">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-opacity-75 transition-opacity" />
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
                        <div className="inline-block align-bottom bg-white rounded-header_menu text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle w-3/12 relative pt-ooolab_p_4 pb-ooolab_p_2">
                            {typeof title === 'string' ? (
                                <p className="text-ooolab_1xs px-ooolab_p_3">
                                    {title}
                                </p>
                            ) : (
                                title
                            )}

                            <p
                                className="text-ooolab_1xs px-ooolab_p_4 hover:text-ooolab_blue_4 cursor-pointer text-right p-ooolab_p_1 text-ooolab_gray_6 "
                                onClick={onClose}
                                ref={cancelButtonRef}
                            >
                                Dismiss
                            </p>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default WorkspaceNotification;
