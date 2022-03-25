import React, { Fragment, useRef, useState } from 'react';
// PACKAGE
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
// COMPONENT
import EditUserProfileForm from '../EditUserProfileForm';
// CONTEXT
import UpdateUserProvider from 'contexts/User/UpdateUserProvider';
// TYPES
import { AuthLocalStorageType } from 'types/Auth.type';

export interface EditUserProfileModalProps {
    titleText: string;
    openEditUserModal: boolean;
    setOpenEditUserModal: React.Dispatch<React.SetStateAction<boolean>>;
    setAuthStorage?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditUserProfileModal: React.FC<EditUserProfileModalProps> = ({
    titleText,
    openEditUserModal,
    setOpenEditUserModal,
    setAuthStorage,
}) => {
    const cancelButtonRef = useRef(null);

    function onSave() {
        console.log('save');
    }

    function onClose() {
        setOpenEditUserModal(false);
    }
    return (
        <Transition.Root show={openEditUserModal} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={openEditUserModal}
                onClose={setOpenEditUserModal}
            >
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
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
                        <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-8/12 lg:w-ooolab_w_7 sm:rounded-3xl relative">
                            <button
                                onClick={onClose}
                                ref={cancelButtonRef}
                                className="absolute w-8 right-2 top-2 opacity-50"
                            >
                                <XIcon />
                            </button>
                            <div className="bg-white h-full sm:w-full">
                                <UpdateUserProvider>
                                    <EditUserProfileForm
                                        titleText={titleText}
                                        setOpenEditUserModal={
                                            setOpenEditUserModal
                                        }
                                        setAuthStorage={setAuthStorage}
                                    />
                                </UpdateUserProvider>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default EditUserProfileModal;
