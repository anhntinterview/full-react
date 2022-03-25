import * as React from 'react';
// PACKAGE
import {PencilAltIcon} from '@heroicons/react/outline';
// UTILS
import {getLocalStorageAuthData} from 'utils/handleLocalStorage';
import UpdateAvatarModal from '../UserProfile/UpdateAvatarModal';

export interface AccountSettingFormProps {
}

export function openAvatarModal(
    setOpenUpdateAvatarModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
) {
    return () => {
        setOpenUpdateAvatarModal(true);
    };
}

const AccountSettingFormOld: React.FC<AccountSettingFormProps> = () => {
    const [
        openUpdateAvatarModal,
        setOpenUpdateAvatarModal,
    ] = React.useState<boolean>();
    const [openTab, setOpenTab] = React.useState(1);
    const userInfo = getLocalStorageAuthData();
    const {access_token, avatar_url, name, email, time_zone} = userInfo;

    return (
        <>
            <div className="w-full bg-ooolab_gray_0">
                <h3 className="text-ooolab_2xl pl-ooolab_p_16 py-ooolab_p_10 block">
                    Account setting
                </h3>
                <div className="flex">
                    <div className="w-full">
                        <ul
                            className="flex mb-0 list-none pt-3 flex-row pl-ooolab_p_16"
                            role="tablist"
                        >
                            <li className="-mb-px mr-2 last:mr-0 text-center w-ooolab_w_40 h-ooolab_h_11">
                                <button
                                    className={
                                        'text-ooolab_base rounded block leading-normal w-full h-full focus:outline-none' +
                                        (openTab === 1
                                            ? 'text-ooolab_blue_3 bg-white'
                                            : 'text-ooolab_gray_5')
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpenTab(1);
                                    }}
                                    data-toggle="tab"
                                    role="tablist"
                                >
                                    General
                                </button>
                            </li>
                            <li className="-mb-px mr-2 last:mr-0 text-center w-ooolab_w_40">
                                <button
                                    className={
                                        'text-ooolab_base rounded block leading-normal w-full h-full focus:outline-none' +
                                        (openTab === 2
                                            ? 'text-ooolab_blue_3 bg-white'
                                            : 'text-ooolab_gray_5')
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpenTab(2);
                                    }}
                                    data-toggle="tab"
                                    role="tablist"
                                >
                                    Security
                                </button>
                            </li>
                            <li className="-mb-px mr-2 last:mr-0 text-center w-ooolab_w_40">
                                <button
                                    className={
                                        'text-ooolab_base rounded block leading-normal w-full h-full focus:outline-none ' +
                                        (openTab === 3
                                            ? 'text-ooolab_blue_3 bg-white'
                                            : 'text-ooolab_gray_5')
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpenTab(3);
                                    }}
                                    data-toggle="tab"
                                    role="tablist"
                                >
                                    Workspace Drive
                                </button>
                            </li>
                        </ul>
                        <div
                            className="pl-ooolab_p_16 relative flex flex-col min-w-0 break-words bg-white w-full rounded">
                            <div className="py-ooolab_p_9 w-ooolab_account_setting">
                                <div className="tab-content tab-space">
                                    <div
                                        className={
                                            openTab === 1 ? 'block' : 'hidden'
                                        }
                                        id="link1"
                                    >
                                        <div
                                            className="flex justify-between border-b border-ooolab_gray_4 pb-ooolab_p_3">
                                            <label
                                                htmlFor="_myProfile"
                                                className="font-semibold"
                                            >
                                                My profile
                                            </label>
                                            <button
                                                className="flex focus:outline-none"
                                                onClick={openAvatarModal(
                                                    setOpenUpdateAvatarModal
                                                )}
                                            >
                                                <PencilAltIcon
                                                    className="h-ooolab_w_6 w-ooolab_w_6 text-ooolab_blue_3"
                                                    aria-hidden="true"
                                                />
                                                <span className="text-ooolab_blue_3 ml-ooolab_m_2 ">
                                                    Edit
                                                </span>
                                            </button>
                                        </div>
                                        <>
                                            <div className="mt-ooolab_m_7 flex items-center">
                                                <label
                                                    htmlFor="_photoKey"
                                                    className="w-ooolab_w_40 text-ooolab_gray_6 text-ooolab_sm"
                                                >
                                                    Photo
                                                </label>
                                                <div className="w-ooolab_w_12 h-ooolab_h_12">
                                                    <img
                                                        src={avatar_url}
                                                        alt="_avatar"
                                                    />
                                                </div>
                                            </div>

                                            {/* <div className="mt-ooolab_m_7 flex items-center">
                                            <label
                                                htmlFor="_statusKey"
                                                className="w-ooolab_w_40 text-ooolab_gray_6 text-ooolab_sm"
                                            >
                                                Status
                                            </label>
                                            <p className="text-ooolab_green_0 text-ooolab_sm">
                                                Activated
                                            </p>
                                        </div> */}
                                            {/* <div className="mt-ooolab_m_7 flex items-center">
                                            <label
                                                htmlFor="_accountTypeKey"
                                                className="w-ooolab_w_40 text-ooolab_gray_6 text-ooolab_sm"
                                            >
                                                Account type
                                            </label>
                                            <p className="text-ooolab_gray_5 text-ooolab_sm">
                                                Admin
                                            </p>
                                        </div> */}
                                        </>
                                        <div
                                            className="flex justify-between border-b border-ooolab_gray_4 pb-ooolab_p_3 mt-ooolab_m_16">
                                            <label
                                                htmlFor="_myProfile"
                                                className="font-semibold"
                                            >
                                                Current location
                                            </label>
                                            <div className="flex">
                                                <PencilAltIcon
                                                    className="h-ooolab_w_6 w-ooolab_w_6 text-ooolab_blue_3"
                                                    aria-hidden="true"
                                                />
                                                <span className="text-ooolab_blue_3 ml-ooolab_m_2 focus:outline-none">
                                                    Edit
                                                </span>
                                            </div>
                                        </div>
                                        <>
                                            {/* <div className="mt-ooolab_m_7 flex items-center">
                                            <label
                                                htmlFor="_photoKey"
                                                className="w-ooolab_w_40 text-ooolab_gray_6 text-ooolab_sm"
                                            >
                                                City
                                            </label>
                                            <p className="text-ooolab_gray_5 text-ooolab_sm">
                                                Houston, USA
                                            </p>
                                        </div> */}
                                            <div className="mt-ooolab_m_7 flex items-center">
                                                <label
                                                    htmlFor="_nameKey"
                                                    className="w-ooolab_w_40 text-ooolab_gray_6 text-ooolab_sm"
                                                >
                                                    Name
                                                </label>
                                                <p className="text-ooolab_gray_5 text-ooolab_sm">
                                                    {name}
                                                </p>
                                            </div>
                                            <div className="mt-ooolab_m_7 flex items-center">
                                                <label
                                                    htmlFor="_contactKey"
                                                    className="w-ooolab_w_40 text-ooolab_gray_6 text-ooolab_sm"
                                                >
                                                    Contact email
                                                </label>
                                                <p className="text-ooolab_gray_5 text-ooolab_sm">
                                                    {email}
                                                </p>
                                            </div>
                                            <div className="mt-ooolab_m_7 flex items-center">
                                                <label
                                                    htmlFor="_nameKey"
                                                    className="w-ooolab_w_40 text-ooolab_gray_6 text-ooolab_sm"
                                                >
                                                    Time zone
                                                </label>
                                                <p className="text-ooolab_gray_5 text-ooolab_sm">
                                                    {time_zone}
                                                </p>
                                            </div>
                                        </>
                                    </div>
                                    <div
                                        className={
                                            openTab === 2 ? 'block' : 'hidden'
                                        }
                                        id="link2"
                                    />
                                    <div
                                        className={
                                            openTab === 3 ? 'block' : 'hidden'
                                        }
                                        id="link2"
                                    >
                                        Manage Workspace Drive
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UpdateAvatarModal
                titleText="Update Avatar"
                setOpenUpdateAvatarModal={setOpenUpdateAvatarModal}
                openUpdateAvatarModal={openUpdateAvatarModal}
                access_token={access_token}
                avatar_url={avatar_url}
            />
        </>
    );
};

