import React, { Fragment } from 'react';
// PACKAGE
import { XIcon } from '@heroicons/react/outline';
// ASSETS
import default_user from 'assets/SVG/default_user.svg';
import { Dialog, Transition } from '@headlessui/react';
// UTILS
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';

export interface UserDetailFormProps {
    openUserDetail: boolean;
    setOpenUserDetail: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenEditUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleOpenEditUserModal(
    setOpenEditUserModal: React.Dispatch<React.SetStateAction<boolean>>
) {
    return () => {
        setOpenEditUserModal((prevState) => {
            return !prevState;
        });
    };
}

const UserDetailForm: React.FC<UserDetailFormProps> = ({
    openUserDetail,
    setOpenUserDetail,
    setOpenEditUserModal,
}) => {
    const userInfo = getLocalStorageAuthData();
    return (
        <Transition.Root show={openUserDetail} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed inset-0 overflow-hidden z-70"
                open={openUserDetail}
                onClose={setOpenUserDetail}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="relative">
                                <div className="bg-white flex justify-end h-screen">
                                    <div className="w-ooolab_w_1">
                                        <div className="flex items-center justify-between p-ooolab_p_3 bg-ooolab_gray_9 ">
                                            <div className="flex">
                                                <Transition.Child
                                                    as={Fragment}
                                                    enter="ease-in-out duration-500"
                                                    enterFrom="opacity-0"
                                                    enterTo="opacity-100"
                                                    leave="ease-in-out duration-500"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <button
                                                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                        onClick={() =>
                                                            setOpenUserDetail(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <span className="sr-only">
                                                            Close panel
                                                        </span>
                                                        <XIcon
                                                            className="h-6 w-6"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </Transition.Child>
                                                <label
                                                    htmlFor="_myProfile"
                                                    className="text-ooolab_gray_5 ml-ooolab_m_3 text-ooolab_base"
                                                >
                                                    My profile
                                                </label>
                                            </div>

                                            <button
                                                className="text-ooolab_base rounded-3xl bg-white border-ooolab_blue_1 text-ooolab_blue_3 border-1 w-ooolab_min_w_3 border-2 py-ooolab_p_1 hover:bg-ooolab_blue_3 hover:text-white"
                                                onClick={handleOpenEditUserModal(
                                                    setOpenEditUserModal
                                                )}
                                            >
                                                Edit profile
                                            </button>
                                        </div>
                                        <div className="flex flex-col items-center justify-center mt-ooolab_m_9">
                                            <div className="w-ooolab_user_detail_avatar">
                                                <img
                                                    className="w-full"
                                                    src={userInfo.avatar_url}
                                                    alt="_defaultUser"
                                                />
                                            </div>
                                            <label
                                                htmlFor="_nameUser"
                                                className="font-semibold text-ooolab_lg text-ooolab_gray_5 mt-ooolab_m_4"
                                            >
                                                {userInfo.name}
                                            </label>
                                            {/* <span className="text-ooolab_gray_6 bg-ooolab_gray_9 rounded-3xl w-ooolab_min_w_2 block text-center text-ooolab_sm mt-ooolab_m_2">
                                                Admin
                                            </span> */}
                                        </div>
                                        <div className="p-ooolab_p_4 mt-ooolab_m_9">
                                            <div className="flex items-center">
                                                <label
                                                    htmlFor="_contactEmailKey"
                                                    className="w-ooolab_min_w_1 text-ooolab_1xs text-ooolab_gray_6"
                                                >
                                                    Contact email
                                                </label>
                                                <span className="text-ooolab_1xs text-ooolab_gray_5">
                                                    {userInfo.email}
                                                </span>
                                            </div>
                                            {/* <div className="flex items-center mt-ooolab_m_4">
                                                <label
                                                    htmlFor="_statusKey"
                                                    className="w-ooolab_min_w_1 text-ooolab_1xs text-ooolab_gray_6"
                                                >
                                                    Status
                                                </label>
                                                <span className="text-ooolab_1xs text-ooolab_green_0">
                                                    Activated
                                                </span>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default UserDetailForm;
