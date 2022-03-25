import React, { useState, useEffect, useContext } from 'react';
// PACKAGE
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ArrowSmRightIcon } from '@heroicons/react/outline';
// COMPONENTS
import CommonButton from 'components/CommonButton';
// CONTEXT
import { InviteMemberWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { GetListOfWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
// CONSTANT
import { FORM_CONST } from 'constant/form.const';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
// TYPE
import { InviteMembersAgsType } from 'types/InviteMembers.type';
import { GetListOfWorkspaceType } from 'types/GetListOfWorkspace.type';
// LOGIC
import {
    InviteWorkspaceFormProps,
    handleSelectedWorkspace,
    handleChangeEmail,
    handleSelectedRole,
    memberListSubmit,
    onSubmit,
} from './InviteWorkspaceMemberFn';
// CONTEXT
import { AuthContext } from 'contexts/Auth/AuthContext';
// UTILS
import { handleLogout } from 'utils/handleLogout';
import { MESSAGE } from 'constant/message.const';
import { AUTH_CONST } from 'constant/auth.const';

const InviteWorkspaceMemberForm: React.FC<InviteWorkspaceFormProps> = ({
    setAuthStorage,
    storageUserInfo,
}) => {
    // const [isModal, setModal] = useState<boolean>(false);
    const [apiErrorMsg, setApiErrorMsg] = useState<string>();
    const [apiSuccessMsg, setApiSuccessMsg] = useState<string>();
    const [emailError, setEmailError] = useState<string>();
    const [workspace, setWorkspace] = useState<InviteMembersAgsType>();
    const [skipInvite, setSkipInvite] = React.useState<boolean>(false);

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
    } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        shouldUnregister: true,
    });
    const [
        currentWorkspace,
        setCurrentWorkspace,
    ] = useState<GetListOfWorkspaceType>();
    const { access_token } = storageUserInfo;

    const inviteMemberWorkspaceCtx = useContext(InviteMemberWorkspaceContext);
    const getListOfWorkspaceCtx = useContext(GetListOfWorkspaceContext);

    const {
        inviteMemberWorkspaceState,
        dispatch: inviteMemberWorkspaceDispatch,
    } = inviteMemberWorkspaceCtx;
    const {
        getListOfWorkspaceState,
        dispatch: getListOfWorkspaceDispatch,
    } = getListOfWorkspaceCtx;

    const {
        result: getListOfWorkspaceStateResult,
        err: getListOfWorkspaceStateError,
    } = getListOfWorkspaceState;
    const {
        isLoading,
        result: inviteMemberWorkspaceStateResult,
        err: inviteMemberWorkspaceStateError,
        valErr: inviteMemberWorkspaceStateValError,
    } = inviteMemberWorkspaceState;

    const { err: listWorkspaceErr } = getListOfWorkspaceState;

    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;

    useEffect(() => {
        if (listWorkspaceErr?.error?.name === AUTH_CONST.TOKEN_EXPIRED) {
            handleLogout(authDispatch, setAuthStorage);
        }
    }, [listWorkspaceErr]);

    useEffect(() => {
        if (workspace && workspace.members.length > 0) {
            clearErrors('email');
            unregister('email');
        }
    }, [workspace]);

    useEffect(() => {
        if (access_token) {
            workspaceMiddleware.getListOfWorkspace(getListOfWorkspaceDispatch);
        }
    }, []);

    useEffect(() => {
        setCurrentWorkspace(getListOfWorkspaceStateResult);
        if (getListOfWorkspaceStateError) {
            setApiErrorMsg(getListOfWorkspaceStateError.error.description);
        }
    }, [getListOfWorkspaceStateResult, getListOfWorkspaceStateError]);

    useEffect(() => {
        if (skipInvite && access_token) {
            workspaceMiddleware.getListOfWorkspace(getListOfWorkspaceDispatch);
        }
    }, [skipInvite]);

    useEffect(() => {
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

    return (
        <>
            <div className="contents justify-center h-ooolab_body_3 ooolab_ipad_portrait:h-ooolab_body_1 sm:h-4/5 lg:h-ooolab_body_1 my-3">
                <div className="flex justify-center">
                    <div className="lg:w-1/2 md:w-2/3 w-10/12 mt-12 md:mt-ooolab_m_14  relative ">
                        <form
                            className="pb-7"
                            onSubmit={handleSubmit(
                                onSubmit(
                                    workspace,
                                    setWorkspace,
                                    inviteMemberWorkspaceDispatch,
                                    reset,
                                    setSkipInvite,
                                    skipInvite,
                                    errors,
                                    clearErrors,
                                    unregister
                                )
                            )}
                        >
                            <h3 className="text-ooolab_gray_5 text-ooolab_xl md:text-ooolab_2xl mb-4 flex">
                                Invite people to{' '}
                                <select
                                    {...register('workspaceId', {
                                        required: true,
                                    })}
                                    className="text-ooolab_blue_1"
                                    onChange={handleSelectedWorkspace(
                                        setValue,
                                        trigger
                                    )}
                                >
                                    <option className="font-bold" value="">
                                        your workspace
                                    </option>
                                    {currentWorkspace?.items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors?.workspaceId?.type === 'required' && (
                                    <p className="text-red-500 ml-ooolab_m_4">
                                        {FORM_CONST.IS_REQUIRED}
                                    </p>
                                )}
                            </h3>
                            <div className="flex flex-row border border-ooolab_pink_1 opacity-75 rounded-xl  mt-ooolab_m_3 py-2">
                                <input
                                    className="border w-4/6 outline-none border-none rounded-xl px-4 text-sm md:h-ooolab_h_12  md:w-5/6  lg:w-5/6 xl:w-5/6 focus:rotate"
                                    type="text"
                                    placeholder="Enter your email"
                                    {...register('email', {
                                        required: true,
                                        pattern: FORM_CONST.EMAIL_REGEX,
                                    })}
                                    name="email"
                                    onChange={handleChangeEmail(
                                        setValue,
                                        trigger
                                    )}
                                />
                                <span className="  w-2/6 flex items-center border-0 rounded-l-none rounded-xl md:w-1/6  lg:w-1/6 xl:w-1/6 focus:outline-none">
                                    <button
                                        onClick={memberListSubmit(
                                            setEmailError,
                                            setWorkspace,
                                            access_token,
                                            getValues,
                                            setValue
                                        )}
                                        className=" w-full text-sm lg:text-ooolab_base  text-ooolab_pink_1 items-center focus:outline-none"
                                    >
                                        Add email
                                    </button>
                                </span>
                            </div>

                            {errors.email &&
                                errors.email.type === 'required' && (
                                    <p className="text-red-500">
                                        {FORM_CONST.IS_REQUIRED}
                                    </p>
                                )}
                            {errors.email &&
                                errors.email.type === 'pattern' && (
                                    <p className="text-red-500">
                                        {FORM_CONST.EMAIL_VALIDATE}
                                    </p>
                                )}
                            {emailError && (
                                <p className="text-red-500">{emailError}</p>
                            )}
                            <div className="mt-ooolab_m_6 flex justify-end items-center mb-7">
                                <Link
                                    to={`/workspace/${currentWorkspace?.items[0]?.id}`}
                                    className="w-ooolab_w_40 flex items-center"
                                >
                                    <span className="text-center items-center text-ooolab_blue_3 lg:text-ooolab_base text-sm">
                                        Skip inviting
                                    </span>
                                    <ArrowSmRightIcon className=" lg:w-ooolab_w_5 xl:w-ooolab_w_5 w-6 text-ooolab_blue_3 pt-1" />
                                </Link>
                            </div>
                            {/* {workspace ? ( */}
                            <>
                                <label
                                    htmlFor="_invitationEmail"
                                    className="font-ooolab_gray_6 mb-ooolab_m_2 block"
                                >
                                    People added
                                </label>
                                <ul className="w-full relative">
                                    {workspace?.members.map((item, index) => (
                                        <li
                                            className="mb-ooolab_m_3 w-full text-ooolab_xl md:text-ooolab_2xl"
                                            key={item.id}
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex flex-row justify-between">
                                                    <label className="block text-ooolab_lg md:text-ooolab_2xl">
                                                        {item.email}
                                                    </label>
                                                    <select
                                                        {...register(
                                                            `role-${index}`,
                                                            {
                                                                required: true,
                                                            }
                                                        )}
                                                        className="block focus:outline-none text-ooolab_lg md:text-ooolab_2xl"
                                                        onChange={handleSelectedRole(
                                                            index,
                                                            setWorkspace,
                                                            setValue,
                                                            trigger
                                                        )}
                                                        name="role"
                                                    >
                                                        <option value="">
                                                            Select member role
                                                        </option>
                                                        <option value="admin">
                                                            admin
                                                        </option>
                                                        <option value="member">
                                                            member
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="justify-end w-full flex text-ooolab_xl md:text-ooolab_2xl">
                                                    {errors?.[`role-${index}`]
                                                        ?.type ===
                                                        'required' && (
                                                        <p className="text-red-500">
                                                            {
                                                                FORM_CONST.IS_REQUIRED
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-center mt-ooolab_m_10">
                                    <span className="">
                                        Finish sending invitations?
                                    </span>
                                    <CommonButton
                                        classStyle={
                                            ' ml-ooolab_m_5 p-ooolab_p_3 bg-ooolab_blue_1 text-white border rounded-2xl w-ooolab_w_56 flex justify-center'
                                        }
                                        loading={isLoading}
                                        title="Invite"
                                        type="circular"
                                    />
                                </div>
                            </>

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
            </div>
        </>
    );
};

export default InviteWorkspaceMemberForm;
