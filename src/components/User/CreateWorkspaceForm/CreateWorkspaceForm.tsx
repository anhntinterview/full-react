import React, { useState, useEffect } from 'react';
// PACKAGES
import { useForm } from 'react-hook-form';
import { PlusIcon } from '@heroicons/react/solid';
import { CameraIcon, XIcon } from '@heroicons/react/outline';
import { Transition } from '@headlessui/react';
// COMPONENTS
import CommonButton from '../../CommonButton';
// TYPES
import { MemberType } from 'types/CreateWorkspace.type';
// LOGIC
import {
    handleChangeWorkspaceName,
    CreateWorkspaceFormProps,
} from './CreateWorkspaceFormFn';
import { getLocalStorageAuthData } from '../../../utils/handleLocalStorage';
import Camera from '../../../assets/SVG/camera.svg';
import { ArrowIcon } from '../../../constant/authNode.const';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';

const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({
    // submit,
    isLoading,
    status,
    apiErrorMsg,
    memberListMsg,
    setMemberListMsg,
    apiSuccessMsg,
    setApiSuccessMsg,
    onMoveToInviteMember,
    onSelectAvatar,
}) => {
    const { t: translator } = useTranslation();
    const [isInvitedMembers, setInvitedMembers] = useState<boolean>();
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const [listMember, setListMember] = useState<MemberType[]>([]);
    const { display_name } = getLocalStorageAuthData();
    const [avatar, setAvatar] = useState<File>();
    const {
        register,
        formState: { errors },
        reset,
        clearErrors,
        getValues,
        setValue,
        trigger,
        handleSubmit,
    } = useForm();

    useEffect(() => {
        if (avatar) {
            onSelectAvatar(avatar);
        }
    }, [avatar]);

    useEffect(() => {
        clearErrors('workspace');
        reset();
        setListMember([]);
    }, [isCreate]);

    useEffect(() => {
        if (!isLoading && status === 'done') {
            setIsCreate(false);
        }
    }, [isLoading, status]);

    React.useEffect(() => {
        if (isInvitedMembers) {
            setApiSuccessMsg(undefined);
            if (listMember.length > 0) {
                setMemberListMsg(undefined);
            } else {
                setMemberListMsg('email invitation is empty!');
            }
        }
    }, [listMember, isInvitedMembers]);

    return (
        <>
            <div className={'flex flex-col animate-ooolab_fade_in'}>
                <label
                    className={
                        'text-ooolab_dark_1 text-ooolab_32px leading-ooolab_44px text-center font-semibold mt-ooolab_m_20'
                    }
                >
                    {translator('AUTHENTICATION.WORKSPACE.HI_DISPLAY_NAME', {
                        display_name: display_name,
                    })}
                </label>
                <label
                    className={
                        'text-ooolab_dark_1 text-ooolab_32px leading-ooolab_44px text-center font-semibold'
                    }
                >
                    {translator(
                        'AUTHENTICATION.WORKSPACE.LETS_CREATE_YOUR_WORKSPACE'
                    )}
                </label>
                <form
                    onSubmit={handleSubmit(() => {
                        onMoveToInviteMember(getValues('workspace'));
                    })}
                    className="w-full mt-ooolab_m_10 flex flex-col justify-center items-center"
                >
                    <div className="flex flex-row items-center space-x-5">
                        <PhotoComponent onSelectAvatar={setAvatar} />
                        <div className={'flex flex-col'}>
                            <input
                                className={`w-ooolab_w_150 ooolab_input_1 flex items-center pl-ooolab_p_5 bg-transparent ${
                                    errors.workspace && 'border-red-600'
                                }`}
                                type="text"
                                placeholder={`${translator(
                                    'AUTHENTICATION.WORKSPACE.WORKSPACE_NAME'
                                )}`}
                                {...register('workspace', {
                                    required: true,
                                })}
                                name="workspace"
                                onChange={handleChangeWorkspaceName(
                                    setValue,
                                    trigger
                                )}
                            />
                            {errors?.workspace?.type === 'required' && (
                                <span className="text-red-500 pt-ooolab_p_2 pl-ooolab_p_3 block">
                                    {translator('FORM_CONST.REQUIRED_FIELD')}
                                </span>
                            )}
                        </div>
                    </div>
                    {memberListMsg && (
                        <span className="text-red-500 pl-ooolab_p_7 block">
                            {memberListMsg}
                        </span>
                    )}
                    {apiErrorMsg && (
                        <span className="text-red-500 pl-ooolab_p_7 block">
                            {apiErrorMsg}
                        </span>
                    )}
                    {apiSuccessMsg && (
                        <span className="text-green-500 pl-ooolab_p_7 block">
                            {apiSuccessMsg}
                        </span>
                    )}
                    <CommonButton
                        classStyle={
                            'group mt-ooolab_m_17 mb-ooola w-ooolab_w_15 h-ooolab_h_15 rounded-ooolab_circle shadow-ooolab_login_1 flex justify-center items-center hover:bg-ooolab_blue_0 focus:bg-ooolab_blue_1'
                        }
                        type="circular"
                        loading={isLoading}
                        title="Update Information"
                        Icon={ArrowIcon}
                    />
                </form>
            </div>
        </>
    );
};

const PhotoComponent: React.FC<{ onSelectAvatar: (avatar: File) => void }> = ({
    onSelectAvatar,
}) => {
    const [avatar, setAvatar] = useState<File>();

    useEffect(() => {
        if (avatar) {
            onSelectAvatar(avatar);
        }
    }, [avatar]);
    return (
        <div className={'w-ooolab_w_25 h-ooolab_h_25 relative'}>
            <Dropzone
                onDrop={(acceptedFiles) => {
                    if (acceptedFiles && acceptedFiles.length > 0) {
                        setAvatar(acceptedFiles[0]);
                    }
                }}
            >
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                        {...getRootProps()}
                        className={
                            'justify-center flex flex-col w-full h-full items-center absolute rounded-ooolab_circle shadow-ooolab_login_1'
                        }
                    >
                        <input {...getInputProps()} accept={'image/*'} />
                        {avatar ? (
                            <img
                                src={URL.createObjectURL(avatar)}
                                alt={avatar.name}
                                className={
                                    'h-full w-full rounded-ooolab_circle'
                                }
                            />
                        ) : (
                            <img
                                src={`https://ui-avatars.com/api?name=${'Workspace'}&size=92`}
                                alt={'_avatar'}
                                className={
                                    'w-full h-full rounded-ooolab_circle bg-ooolab_light_100'
                                }
                            />
                        )}
                        <div
                            className={
                                'rounded-ooolab_circle bg-white w-ooolab_w_12 h-ooolab_h_12 flex justify-center items-center absolute -right-2 -bottom-2'
                            }
                        >
                            <div
                                className={
                                    'shadow-ooolab_menu rounded-ooolab_circle w-ooolab_w_9 h-ooolab_h_9 flex justify-center items-center'
                                }
                            >
                                <img
                                    src={Camera}
                                    alt={'_camera'}
                                    className={'w-ooolab_w_5 h-ooolab_h_5'}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Dropzone>
        </div>
    );
};

export default CreateWorkspaceForm;
