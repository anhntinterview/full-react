import { Fragment, FC, useRef, useEffect, useState } from 'react';
import { Transition, Dialog, Popover } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import CaretDowm from 'assets/SVG/caret-down.svg';
import { useForm } from 'react-hook-form';
import { FORM_CONST } from 'constant/form.const';
import workspaceService from 'services/workspace.service';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { ERROR_MESSAGE } from 'constant/message.const';
import SaveChanges from 'assets/SVG/save-changes.svg';
import CancelChanges from 'assets/SVG/cancel.svg';

import { useTranslation } from 'react-i18next';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    getMembers: Function;
    workspaceId: number;
}

const LoadingSVG = () => (
    <svg
        className="animate-spin w-ooolab_w_10 h-ooolab_w_10 opacity-100"
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
            fill="red"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

const ModalInvite: FC<ModalProps> = ({ isOpen, onClose, workspaceId }) => {
    const cancelButtonRef = useRef(null);
    const [role, setRole] = useState('member');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'init' | 'done' | 'error'>('init');
    const errorRef = useRef('');
    const { t: translator } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
    } = useForm();

    const handleInviteMember = async (email: string, role: string) => {
        setLoading(true);
        workspaceService
            .inviteMembers({
                workspaceId,
                members: [
                    {
                        email,
                        role,
                        message: '',
                    },
                ],
            })
            .then(async (res) => {
                if (res.status === 204) {
                    setStatus('done');
                }
            })
            .catch((err) => {
                setStatus('error');
                errorRef.current = err ? ERROR_MESSAGE[err.error?.body_params[0]?.msg] : '';
            })
            .finally(() => setTimeout(() => setLoading(false), 500));
    };

    const onSubmit = () => {
        const values = getValues();
        handleInviteMember(values.email_address, role);
    };

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setRole('member');
                reset();
                setStatus('init');
            }, 200);
        }
    }, [isOpen]);

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
                <div className="flex justify-center h-screen pt-0 px-4 pb-20 text-center items-center">
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
                        <div className="bg-white rounded-header_menu text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle  w-ooolab_w_512px h-ooolab_h_60 relative">
                            {!loading ? (
                                status === 'init' ? (
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className=""
                                    >
                                        <XIcon
                                            onClick={() => onClose()}
                                            className="h-ooolab_h_4 w-ooolab_w_4 absolute top-ooolab_inset_20px right-ooolab_inset_20px cursor-pointer"
                                        />
                                        <div className="p-ooolab_p_8 w-full">
                                            <p className="text-ooolab_dark_1 mb-ooolab_m_5 ">
                                                {translator(
                                                    'DASHBOARD.SIDEBAR.INVITE_MEMBERS'
                                                )}
                                            </p>
                                            <input
                                                autoComplete="off"
                                                autoFocus={false}
                                                type="text"
                                                placeholder={translator(
                                                    'DASHBOARD.WORKSPACE_SETTING.ENTER_EMAIL_ADDRESS'
                                                )}
                                                className={`${
                                                    (errors['email_address'] &&
                                                        'focus:border-red-500') ||
                                                    'focus:border-item_bar_hover'
                                                } w-full focus:bg-ooolab_light_100 rounded  border h-ooolab_h_8 px-ooolab_p_3 py-ooolab_p_1`}
                                                id=""
                                                {...register('email_address', {
                                                    required:
                                                        'This field is required!',
                                                    pattern: {
                                                        value:
                                                            FORM_CONST.EMAIL_REGEX,
                                                        message:
                                                            'Please enter a valid email!',
                                                    },
                                                })}
                                            />
                                            {errors['email_address'] &&
                                            errors['email_address'].message ? (
                                                <p className="text-ooolab_xs text-red-500">
                                                    {
                                                        errors['email_address']
                                                            .message
                                                    }
                                                </p>
                                            ) : null}
                                            <Popover
                                                as="div"
                                                className="relative"
                                            >
                                                {({ open }) => {
                                                    return (
                                                        <>
                                                            <Popover.Button className="text-ooolab_sm focus:outline-none font-light text-ooolab_blue_1 my-ooolab_m_3 inline-flex items-center">
                                                                {translator(
                                                                    'DASHBOARD.WORKSPACE_SETTING.INVITE_AS'
                                                                )}
                                                                {(role && (
                                                                    <span className="px-ooolab_p_1">
                                                                        {role ===
                                                                        'admin'
                                                                            ? translator(
                                                                                  'ADMIN'
                                                                              )
                                                                            : translator(
                                                                                  'MEMBERS'
                                                                              )}
                                                                    </span>
                                                                )) ||
                                                                    null}{' '}
                                                                <img
                                                                    src={
                                                                        CaretDowm
                                                                    }
                                                                />
                                                            </Popover.Button>

                                                            <Transition
                                                                show={open}
                                                                as={'div'}
                                                                enter="transition ease-out duration-100"
                                                                enterFrom="transform opacity-0 scale-95"
                                                                enterTo="transform opacity-100 scale-100"
                                                                leave="transition ease-in duration-75"
                                                                leaveFrom="transform opacity-100 scale-100"
                                                                leaveTo="transform opacity-0 scale-95"
                                                            >
                                                                <Popover.Panel className="z-9999 bg-white border py-ooolab_p_2 absolute left-0 -top-2 w-ooolab_w_44 rounded-header_menu focus:outline-none">
                                                                    {({
                                                                        close,
                                                                    }) => (
                                                                        <>
                                                                            <p
                                                                                onClick={() => {
                                                                                    setRole(
                                                                                        'admin'
                                                                                    );
                                                                                    close();
                                                                                }}
                                                                                className="px-ooolab_p_3 py-ooolab_p_1_e text-ooolab_sm text-ooolab_dark_1 mb-ooolab_m_1 cursor-pointer hover:bg-ooolab_blue_0"
                                                                            >
                                                                                {translator(
                                                                                    'ADMIN'
                                                                                )}
                                                                            </p>
                                                                            <p
                                                                                onClick={() => {
                                                                                    setRole(
                                                                                        'member'
                                                                                    );
                                                                                    close();
                                                                                }}
                                                                                className="px-ooolab_p_3 py-ooolab_p_1_e text-ooolab_sm text-ooolab_dark_1 mb-ooolab_m_1 cursor-pointer hover:bg-ooolab_blue_0"
                                                                            >
                                                                                {translator(
                                                                                    'MEMBERS'
                                                                                )}
                                                                            </p>
                                                                        </>
                                                                    )}
                                                                </Popover.Panel>
                                                            </Transition>
                                                        </>
                                                    );
                                                }}
                                            </Popover>
                                            <div
                                                className="absolute right-ooolab_inset_32px bottom-ooolab_inset_32px
                            "
                                            >
                                                <button
                                                    onClick={() => onClose()}
                                                    type="button"
                                                    className="border focus:outline-none px-ooolab_p_2 py-ooolab_p_1 rounded-lg border-black mr-ooolab_m_5"
                                                >
                                                    {translator(
                                                        'MODALS.CANCEL'
                                                    )}
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="border-none focus:outline-none px-ooolab_p_3 py-ooolab_p_1 rounded-lg bg-ooolab_blue_1 text-white"
                                                >
                                                    {translator('MODALS.SEND')}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : status === 'done' ? (
                                    <div className="flex flex-col justify-center items-center w-full h-full">
                                        <img src={SaveChanges} alt="" />
                                        <p className="py-ooolab_p_1_e">
                                            {translator(
                                                'MODALS.WORKSPACE_INVITE_MEMBERS.INVITATION_IS_SENT'
                                            )}
                                        </p>
                                        <button
                                            onClick={() => onClose()}
                                            className="capitalize px-ooolab_p_3 py-ooolab_p_1 bg-ooolab_blue_1 text-white rounded-lg"
                                        >
                                            {translator('MODALS.CLOSE')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center w-full h-full">
                                        <img src={SaveChanges} alt="" />
                                        <p className="py-ooolab_p_1_e">
                                            {errorRef.current}
                                        </p>
                                        <button
                                            onClick={() => onClose()}
                                            className="capitalize px-ooolab_p_3 py-ooolab_p_1 bg-red-500 text-white rounded-lg"
                                        >
                                            {translator('MODALS.CLOSE')}
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col justify-center items-center w-full h-full">
                                    <LoadingSVG />
                                </div>
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ModalInvite;
