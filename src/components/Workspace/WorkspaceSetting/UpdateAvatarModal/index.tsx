import React, { Fragment, useRef } from 'react';
// PACKAGE
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
// COMPONENT
import UpdateAvatarForm from './UpdateAvatarForm';
// CONTEXT
import UploadAvatarProvider from 'contexts/User/UploadAvatarProvider';

export interface UpdateAvatarModalProps {
    titleText: string;
    access_token: string | undefined;
    avatar_url: string | undefined;
    onUpdatedAvatar: (e?: string) => void;
    onCancel: () => void;
}

const UpdateAvatarModal: React.FC<UpdateAvatarModalProps> = ({
    titleText,
    access_token,
    avatar_url,
    onUpdatedAvatar,
    onCancel,
}) => {
    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={true}
                onClose={onCancel}
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
                        <div className="bg-white rounded-ooolab_radius_20px text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-ooolab_w_140 relative">
                            <button
                                onClick={onCancel}
                                ref={cancelButtonRef}
                                className="absolute w-ooolab_w_6 h-ooolab_h_6 right-ooolab_inset_32px top-ooolab_inset_20px"
                            >
                                <XIcon className={'text-ooolab_dark_1'} />
                            </button>
                            <div className="bg-white h-full w-full">
                                <UpdateAvatarForm
                                    titleText={titleText}
                                    access_token={access_token}
                                    avatar_url={avatar_url}
                                    onCancel={onCancel}
                                    onUpdatedAvatar={(avatar) => {
                                        onUpdatedAvatar(avatar);
                                    }}
                                />
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default UpdateAvatarModal;
