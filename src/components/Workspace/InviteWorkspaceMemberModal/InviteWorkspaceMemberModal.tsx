/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useState } from 'react';
// PACKAGE
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { LinkIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
// CONTEXT
import { InviteMemberWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { GetListOfWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
// CONSTANT
import { FORM_CONST } from 'constant/form.const';
import { INVITE_MEMBERS_MODALS } from 'constant/modal.const';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
//URL
import { HOST_URL } from 'constant/api.const';
// TYPE
import { InviteMembersAgsType } from 'types/InviteMembers.type';
import {
    GetListOfWorkspaceType,
    WorkspaceItem,
} from 'types/GetListOfWorkspace.type';
import CommonModals from 'components/CommonModals';

// LOGIC
import {
    InviteWorkspaceFormProps,
    handleChangeEmail,
    handleSelectedRole,
    memberListSubmit,
    onSubmit,
} from './InviteWorkspaceMemberModalFn';
import CommonButton from 'components/CommonButton';
import { useLocation, useParams } from 'react-router-dom';
import { MESSAGE } from 'constant/message.const';

export interface CommonModalsProps {
    isModal: boolean;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
    access_token: string | undefined;
}

const InviteWorkspaceMemberModal: React.FC<CommonModalsProps> = ({
    isModal,
    setIsModal,
    access_token,
}) => {
    const {
        register,
        unregister,
        clearErrors,
        handleSubmit,
        reset,
        getValues,
        setValue,
        trigger,
        formState: { errors },
    } = useForm();

    const [modal, setModal] = useState<boolean>(false);
    const [roleError, setRoleError] = React.useState<boolean>();
    const [emailError, setEmailError] = React.useState<string>();
    const [email, setEmail] = React.useState<string>();
    const [getLink, setGetLink] = React.useState<boolean>(false);
    const [workspace, setWorkspace] = React.useState<InviteMembersAgsType>();
    const cancelButtonRef = useRef(null);
    const getListOfWorkspaceCtx = React.useContext(GetListOfWorkspaceContext);

    const inviteMemberWorkspaceCtx = React.useContext(
        InviteMemberWorkspaceContext
    );
    const inviteMemberWorkspaceDispatch = inviteMemberWorkspaceCtx.dispatch;
    const { inviteMemberWorkspaceState } = inviteMemberWorkspaceCtx;

    const { getWorkspaceDetailState, dispatch } = React.useContext(
        GetWorkspaceContext
    );
    const [
        currentWorkspace,
        setCurrentWorkspace,
    ] = React.useState<GetListOfWorkspaceType>();
    const { getListOfWorkspaceState } = getListOfWorkspaceCtx;
    const getListOfWorkspaceDispatch = getListOfWorkspaceCtx.dispatch;
    const submitBtnRef = React.useRef<HTMLButtonElement>(null);

    const params: { id: string } = useParams();

    const [apiErrorMsg, setApiErrorMsg] = useState<string>();

    const [workspaceName, setWorkspaceName] = useState<string>();

    const [apiSuccessMsg, setApiSuccessMsg] = useState<string>();

    const {
        isLoading,
        result: inviteMemberWorkspaceStateResult,
        err: inviteMemberWorkspaceStateError,
        valErr: inviteMemberWorkspaceStateValError,
    } = inviteMemberWorkspaceState;

    const getListOfWorkspaceStateResult = getListOfWorkspaceState.result;
    const routeArgument = useLocation<WorkspaceItem>().state;
    const { name, id } = routeArgument || {};

    React.useEffect(() => {
        if (inviteMemberWorkspaceStateResult?.status === 204) {
            setModal(false);
            setValue('email', '');
        }
    }, [inviteMemberWorkspaceState]);

    React.useEffect(() => {
        if (access_token) {
            workspaceMiddleware.getListOfWorkspace(getListOfWorkspaceDispatch);
        }
    }, []);

    React.useEffect(() => {
        if (getListOfWorkspaceState.result) {
            setCurrentWorkspace(getListOfWorkspaceState.result);
            setWorkspaceName(
                getListOfWorkspaceState.result.items.find(
                    (d) => d.id.toString() === params.id
                )?.name
            );
        }
    }, [getListOfWorkspaceState.result]);

    function handleAgreeModal() {
        return () => {
            console.log('Returen InviteMemberPage');
        };
    }

    function onClose() {
        setIsModal(false);
        reset({ email: '' });
        setApiErrorMsg('');
        setApiSuccessMsg('');
        setGetLink(false);
        let newWorkspace: InviteMembersAgsType;
        setWorkspace(() => {
            return newWorkspace;
        });
        setEmail('');
    }

    React.useEffect(() => {
        if (inviteMemberWorkspaceStateResult?.status === 204) {
            setApiSuccessMsg(MESSAGE.INVITE_MEMBER_SUCCESS);
        }
        if (inviteMemberWorkspaceStateError) {
            setApiErrorMsg(inviteMemberWorkspaceStateError.error.description);
        }
        if (inviteMemberWorkspaceStateValError) {
            setApiErrorMsg(
                inviteMemberWorkspaceStateValError.validation_error
                    .body_params[0].msg
            );
        }
    }, [
        inviteMemberWorkspaceStateResult,
        inviteMemberWorkspaceStateError,
        inviteMemberWorkspaceStateValError,
    ]);

    function CopyLink() {
        const link = document.getElementById(
            'getLinkInvite'
        ) as HTMLInputElement;
        link.select();
        document.execCommand('copy');
    }

    return (
        <>
            <Transition.Root show={isModal} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed z-70 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    open={isModal}
                    onClose={() => onClose()}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:items-center sm:p-0">
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
                        <div className="w-full flex flex-col items-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div className="inline-block align-bottom bg-white rounded-md text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle sm:w-8/12 lg:w-6/12 sm:rounded-xl relative">
                                    <button
                                        onClick={onClose}
                                        ref={submitBtnRef}
                                        className="absolute w-8 right-2 top-2 opacity-50 focus:outline-none hover:text-ooolab_blue_4"
                                    >
                                        <XIcon />
                                    </button>

                                    <div className=" bg-gray-50 px-4 py-3 sm:px-6 sm:block sm:flex-row-reverse">
                                        <div className="inline-flex py-ooolab_p_6">
                                            <h3>
                                                Invite people to&nbsp;
                                                <span className="font-bold">
                                                    {workspaceName ||
                                                        'workspace'}
                                                    &nbsp;
                                                </span>
                                            </h3>

                                            <span> by email</span>
                                        </div>
                                        <form
                                            className="pb-7"
                                            onSubmit={handleSubmit(
                                                onSubmit(
                                                    workspace,
                                                    setWorkspace,
                                                    setGetLink,
                                                    inviteMemberWorkspaceDispatch,
                                                    reset,
                                                    clearErrors,
                                                    unregister
                                                )
                                            )}
                                        >
                                            <div
                                                className={`flex flex-row border opacity-75 rounded-xl  mt-ooolab_m_3 py-2 ${
                                                    errors.email &&
                                                    'border-red-600'
                                                }`}
                                            >
                                                <input
                                                    className="border w-4/6 outline-none border-none rounded-xl px-4 text-sm md:h-ooolab_h_12  md:w-5/6  lg:w-5/6 xl:w-5/6 focus:rotate"
                                                    type="text"
                                                    placeholder="Enter your email"
                                                    {...register('email', {
                                                        required: true,
                                                        pattern:
                                                            FORM_CONST.EMAIL_REGEX,
                                                    })}
                                                    name="email"
                                                    onChange={handleChangeEmail(
                                                        setValue,
                                                        trigger
                                                    )}
                                                />
                                                <span
                                                    onClick={memberListSubmit(
                                                        parseInt(params.id),
                                                        setEmailError,
                                                        setWorkspace,
                                                        access_token,
                                                        getValues,
                                                        trigger
                                                    )}
                                                    className="  w-2/6 flex items-center border-0 rounded-l-none rounded-xl md:w-1/6  lg:w-1/6 xl:w-1/6 focus:outline-none"
                                                >
                                                    <p className=" cursor-pointer w-full text-sm lg:text-ooolab_base  text-ooolab_pink_1 items-center focus:outline-none">
                                                        Add email
                                                    </p>
                                                </span>
                                            </div>

                                            {errors.email &&
                                                errors.email.type ===
                                                    'required' && (
                                                    <p className="text-red-500">
                                                        {FORM_CONST.IS_REQUIRED}
                                                    </p>
                                                )}
                                            {errors.email &&
                                                errors.email.type ===
                                                    'pattern' && (
                                                    <p className="text-red-500">
                                                        {
                                                            FORM_CONST.EMAIL_VALIDATE
                                                        }
                                                    </p>
                                                )}
                                            {emailError && (
                                                <p className="text-red-500">
                                                    {emailError}
                                                </p>
                                            )}
                                            <div>
                                                <label
                                                    htmlFor="_invitationEmail"
                                                    className="font-ooolab_gray_6 mb-ooolab_m_2 block font-ooolab_base py-ooolab_p_4"
                                                >
                                                    People added
                                                </label>
                                                <ul className="w-full relative">
                                                    {workspace?.members.map(
                                                        (item, index) => (
                                                            <li
                                                                className="font-ooolab_base mb-ooolab_m_3 w-full"
                                                                key={item.id}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <div className="flex flex-row justify-between">
                                                                        <label className="block text-ooolab_lg">
                                                                            {
                                                                                item.email
                                                                            }
                                                                        </label>
                                                                        <select
                                                                            {...register(
                                                                                `role-${index}`,
                                                                                {
                                                                                    required: true,
                                                                                }
                                                                            )}
                                                                            className="block text-ooolab_lg bg-transparent focus:outline-none"
                                                                            name="role"
                                                                            value={getValues(
                                                                                `role-${index}`
                                                                            )}
                                                                            onChange={handleSelectedRole(
                                                                                index,
                                                                                setWorkspace,
                                                                                setValue,
                                                                                trigger
                                                                            )}
                                                                        >
                                                                            <option value="">
                                                                                Select
                                                                                member
                                                                                role
                                                                            </option>
                                                                            <option value="admin">
                                                                                admin
                                                                            </option>
                                                                            <option value="member">
                                                                                member
                                                                            </option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                {errors?.[
                                                                    `role-${index}`
                                                                ]?.type ===
                                                                    'required' && (
                                                                    <p className="text-red-500 text-right pt-ooolab_p_1_half">
                                                                        {
                                                                            FORM_CONST.IS_REQUIRED
                                                                        }
                                                                    </p>
                                                                )}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                            <div className=" border-b pt-ooolab_p_9 " />
                                            <div className="flex items-center justify-center sm:justify-end my-ooolab_m_6">
                                                <CommonButton
                                                    classStyle={
                                                        ' ml-ooolab_m_5 p-ooolab_p_3 bg-ooolab_blue_1 text-white border rounded-2xl w-ooolab_w_56 flex justify-center'
                                                    }
                                                    loading={isLoading}
                                                    title="Invite"
                                                    type="circular"
                                                />
                                                {/* <button
                                                ref={submitBtnRef}
                                                onClick={handleInviteMembers}
                                                className="opacity-50 hover:opacity-100 font-ooolab_base ml-ooolab_m_5 p-ooolab_p_3 bg-ooolab_blue_1 text-white border rounded-xl w-ooolab_w_56"
                                            >
                                                Invite
                                            </button> */}
                                            </div>
                                            {apiErrorMsg && (
                                                <span className="text-red-500 w-full text-center block">
                                                    {apiErrorMsg}
                                                </span>
                                            )}
                                            {apiSuccessMsg && (
                                                <span className="text-green-500 w-full text-center block">
                                                    {apiSuccessMsg}
                                                </span>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </Transition.Child>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div className="flex flex-col align-bottom bg-white rounded-md text-left overflow-hidden shadow-xl transform transition-all sm:my-ooolab_m_4  sm:w-8/12 lg:w-6/12 sm:rounded-lg relative">
                                    <div className="w-full flex">
                                        <button
                                            onClick={() => CopyLink()}
                                            className="w-1/5  focus:outline-none "
                                        >
                                            <div className="flex items-center justify-center ">
                                                <LinkIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_blue_1" />
                                                <p className="px-ooolab_p_2 text-ooolab_blue_1">
                                                    Copy link
                                                </p>
                                            </div>
                                        </button>

                                        <div className="w-4/5  flex items-center px-ooolab_p_3 ">
                                            <div className=" select-all border-2 w-full m-ooolab_m_3 rounded-md">
                                                <input
                                                    readOnly
                                                    value={
                                                        getLink
                                                            ? `${HOST_URL}/workspace/${params.id}`
                                                            : ''
                                                    }
                                                    id="getLinkInvite"
                                                    className="w-full pl-ooolab_p_5 py-ooolab_p_2 leading-relaxed focus:border-transparent focus:outline-none select-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            {modal && (
                <CommonModals
                    titleText={INVITE_MEMBERS_MODALS.titleText}
                    contentText={INVITE_MEMBERS_MODALS.contentText}
                    handleAgree={handleAgreeModal()}
                />
            )}
        </>
    );
};

export default InviteWorkspaceMemberModal;
