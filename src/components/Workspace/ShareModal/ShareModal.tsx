import React, { Fragment, useContext, useEffect, useState } from 'react';
// PACKAGES
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Transition, Dialog } from '@headlessui/react';
import { XIcon, PaperClipIcon, ArrowLeftIcon } from '@heroicons/react/outline';
import { CogIcon } from '@heroicons/react/solid';
import Select, { StylesConfig, components, OptionsType } from 'react-select';
// ASSETS
import Avatar from 'assets/avatar_option.png';
// CONTEXT
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import { AuthContext } from 'contexts/Auth/AuthContext';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
import googleMiddleware from 'middleware/google.middleware';
// UITLS
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { handleLogout } from 'utils/handleLogout';
// LOGIC
import { CustomOptionsType, ShareModalProps } from './ShareModalFN';
// COMPONENTS
import SharedMembersUI from './SharedMembersUI';
// CONSTANT
import { shareOptions } from 'constant/google.const';
// SERVICES
import { GoogleService } from 'services';
import {AUTH_CONST} from "constant/auth.const";

const formFields = {
    selectedMembers: 'selectedMembers',
    notify: 'notify',
    message: 'message',
    role: 'role',
};

const ShareModal: React.FC<ShareModalProps> = ({ setAuthStorage }) => {
    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;

    const cancelButtonRef = React.useRef(null);
    const routerParam: { id: string } = useParams();

    //list members of workspace
    const [listMembers, setListMembers] = useState<CustomOptionsType[]>([]);

    // check if any members is selected or not
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const {
        control,
        setValue,
        register,
        handleSubmit,
        getValues,
        reset,
    } = useForm();

    const {
        dispatch: workspaceDispatch,
        getWorkspaceDetailState: { members, err },
    } = useContext(GetWorkspaceContext);

    const { dispatch: googleDispatch, googleState } = useContext(
        GoogleAPIAndServicesContext
    );

    const { contextAction, fileDetail } = googleState;

    const customSelectMemberStyles: StylesConfig<CustomOptionsType, true> = {
        clearIndicator: (base) => ({ ...base, display: 'none' }),
        dropdownIndicator: (base) => ({ ...base, display: 'none' }),
        control: (_, props) => ({
            border: 'none',
            borderBottom: props.isFocused ? '1px solid blue' : '1px solid grey',
            height: '100%',
        }),
        indicatorsContainer: (base) => ({ ...base, display: 'none' }),
        option: (base, props) => ({
            ...base,
            backgroundColor: props.isFocused
                ? 'rgba(240, 240, 240, 0.7)'
                : 'white',
            ':hover': {
                background: 'rgba(240, 240, 240, 0.7)',
            },
            borderRadius: '10px',
        }),
        menu: (base) => ({
            ...base,
            boxShadow: 'none',
            zIndex: 999,
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: 'rgba(0, 191, 214, 0.2)',
        }),
    };

    const customPermissionSelect: StylesConfig<any, false> = {
        control: (_, props) => ({
            display: 'flex',
            border: 'none',
            borderBottom: props.isFocused ? '1px solid blue' : '1px solid grey',
            height: '100%',
        }),
        indicatorSeparator: (base) => ({ ...base, display: 'none' }),
        valueContainer: (base) => ({
            ...base,
            display: 'flex',
            justifyContent: 'flex-end',
        }),
    };

    const formatOptions = ({ value, label, avatar }: CustomOptionsType) => (
        <div className="flex">
            <img
                src={avatar || Avatar}
                className="h-10 w-10 rounded-full"
                alt=""
            />
            <div className="ml-ooolab_m_3">
                <p>{label}</p>
                <p className="text-gray-400">{value}</p>
            </div>
        </div>
    );

    const MultiValueLabel = (props: any) => {
        return (
            <div>
                <components.MultiValueLabel {...props}>
                    <div className="flex items-center ">
                        {/* <div
                        className="w-4 h-4 rounded-full mr-ooolab_m_1"
                        style={{ backgroundColor: props.data.color }}
                    /> */}
                        <img
                            src={props.data.avatar}
                            className="w-5 h-5 rounded-full mr-ooolab_m_1"
                            alt=""
                        />
                        <p>{props.data.label}</p>
                    </div>
                </components.MultiValueLabel>
            </div>
        );
    };

    const handleCheckSelectedMember = (e: any) => {
        if (e && e.length) {
            setIsSelected(true);
        } else setIsSelected(false);
    };

    const resetSelectedMember = () => {
        handleCheckSelectedMember([]);
        setValue(formFields.selectedMembers, []);
        setValue(formFields.message, '');
    };

    const closeModal = () => {
        googleMiddleware.setRightMenuContext(googleDispatch, '  ');
    };

    const onSubmit = () => {
        if (!fileDetail?.id) return;
        const formValues = getValues();
        const { selectedMembers } = formValues;
        if (selectedMembers && selectedMembers.length) {
            const listRequest = selectedMembers.map((i: { value: string }) => {
                const requestParam: Record<any, any> = {};
                requestParam.fields = '*';
                requestParam.sendNotificationEmail =
                    formValues[`${formFields.notify}`];
                if (formValues[`${formFields.notify}`]) {
                    requestParam.emailMessage =
                        formValues[`${formFields.message}`];
                }

                return GoogleService.createFilePermission(
                    fileDetail?.id,
                    requestParam,
                    {
                        type: 'user',
                        role: formValues[`${formFields.role}`]
                            ? formValues[`${formFields.role}`].value
                            : 'writer',
                        emailAddress: i.value,
                    }
                );
            });
            Promise.all(listRequest).then(() => {
                closeModal();
                setValue(formFields.selectedMembers, []);
                setValue(formFields.message, '');
            });
        }
    };

    useEffect(() => {
        // workspaceMiddleware.getWorkspaceMembers()
        const { id } = routerParam;
        const { access_token } = getLocalStorageAuthData();
        if (id && access_token) {
            workspaceMiddleware.getWorkspaceMembers(workspaceDispatch, {
                id,
            });
        }
    }, []);

    useEffect(() => {
        const temp: CustomOptionsType[] =
            (members?.items?.length &&
                members.items.map((i) => ({
                    value: i.email,
                    label: i.name,
                    avatar: i.avatar_url,
                    id: i.id,
                }))) ||
            [];
        setListMembers(temp);
    }, [members]);

    useEffect(() => {
        if (contextAction) {
            handleCheckSelectedMember([]);
        }
    }, [contextAction]);

    useEffect(() => {
        if (err?.error?.name === AUTH_CONST.TOKEN_EXPIRED) {
            handleLogout(authDispatch, setAuthStorage);
        }
    }, [err]);

    return (
        <Transition.Root show={contextAction === 'share'} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto "
                open
                onClose={() => {
                    closeModal();
                    setValue(formFields.selectedMembers, []);
                    setValue(formFields.message, '');
                }}
                initialFocus={cancelButtonRef}
            >
                <div className="flex items-center justify-center max-h-screen pt-4 px-4 pb-20 text-center ">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in"
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
                        // leave="ease-in duration-200"
                        // leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        // leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom text-left transition-all sm:my-8 sm:align-middle sm:w-8/12 lg:w-5/12 sm:rounded-3xl relative">
                            {/* <button className="absolute w-8 right-2 top-2 opacity-50 focus:outline-none">
                                <XIcon />
                            </button> */}

                            <div
                                ref={cancelButtonRef}
                                className="w-full bg-ooolab_gray_6 h-ooolab_h_16 flex items-center justify-between px-ooolab_p_3 rounded-t-3xl"
                            >
                                <div className="flex items-center">
                                    <PaperClipIcon className="text-gray-400 h-ooolab_h_6 cursor-pointer" />
                                    <p className="w-max pl-ooolab_p_3">
                                        {fileDetail?.name}
                                    </p>
                                </div>
                                <div className="flex">
                                    <CogIcon className="text-gray-400 h-ooolab_h_6 cursor-pointer mr-ooolab_m_3 " />
                                    <XIcon
                                        onClick={() => {
                                            closeModal();
                                            setValue(
                                                formFields.selectedMembers,
                                                []
                                            );
                                            setValue(formFields.message, '');
                                        }}
                                        className="text-gray-400 h-ooolab_h_6 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="bg-white px-10 pt-5 pb-4">
                                    <h1 className="my-5 font-semibold text-xl">
                                        Share with people
                                    </h1>

                                    <div className="grid grid-cols-4">
                                        <Controller
                                            control={control}
                                            name={formFields.selectedMembers}
                                            render={({
                                                field: { onChange, value },
                                            }) => (
                                                <Select
                                                    value={value}
                                                    className={`${
                                                        isSelected
                                                            ? 'col-span-3'
                                                            : 'col-span-4'
                                                    }`}
                                                    closeMenuOnSelect={true}
                                                    isMulti
                                                    options={listMembers}
                                                    styles={
                                                        customSelectMemberStyles
                                                    }
                                                    placeholder="Add collaborators with email"
                                                    formatOptionLabel={
                                                        formatOptions
                                                    }
                                                    components={{
                                                        MultiValueLabel,
                                                    }}
                                                    onChange={(
                                                        e: OptionsType<CustomOptionsType>
                                                    ) => {
                                                        handleCheckSelectedMember(
                                                            e
                                                        );
                                                        onChange([...e]);
                                                    }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name={formFields.role}
                                            render={({ field, fieldState }) => (
                                                <Select
                                                    {...field}
                                                    {...fieldState}
                                                    className={`${
                                                        isSelected
                                                            ? 'col-span-1'
                                                            : 'hidden'
                                                    }`}
                                                    options={shareOptions}
                                                    styles={
                                                        customPermissionSelect
                                                    }
                                                    defaultValue={shareOptions.find(
                                                        (i) =>
                                                            i.value === 'writer'
                                                    )}
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* </form> */}
                                </div>
                                {/* <div className="bg-white px-10 rounded-b-3xl"> */}
                                <Transition
                                    show={isSelected}
                                    enter="transition-all duration-500"
                                    enterFrom="h-0"
                                    enterTo="h-72"
                                    leave="transition-all duration-500"
                                    leaveFrom="h-72"
                                    leaveTo="h-0"
                                    className="max-w-full w-full overflow-y-hidden rounded-b-3xl min-h-72 bg-white "
                                    // className="h-full"
                                >
                                    <div className="flex items-center pt-ooolab_m_4 px-10">
                                        <input
                                            id="notify"
                                            type="checkbox"
                                            className="h-4 w-4 mr-ooolab_m_2"
                                            {...register(formFields.notify)}
                                        />
                                        <label htmlFor={formFields.notify}>
                                            Notify via Email
                                        </label>
                                    </div>
                                    <div className="mx-10 bg-white">
                                        <textarea
                                            rows={4}
                                            className="w-full border-0 border-b-2 inset-0 outline-none my-ooolab_m_4 bg-ooolab_gray_6 p-ooolab_p_2"
                                            placeholder="Message"
                                            {...register(formFields.message)}
                                        />
                                    </div>
                                    <div className="px-10 pt-5 pb-4 border-t-2 flex justify-between items-center bg-white w-full">
                                        <ArrowLeftIcon
                                            className="h-6 w-6 cursor-pointer"
                                            onClick={() =>
                                                resetSelectedMember()
                                            }
                                        />
                                        <button
                                            type="submit"
                                            className="bg-ooolab_blue_4 text-white py-3 px-ooolab_p_12 rounded-xl"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </Transition>
                            </form>
                            {/* </div> */}
                            <Transition
                                show={!isSelected}
                                enter="delay-500 transition-all duration-500"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-all duration-500"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                className="w-full "
                                // className="px-10 pt-5 pb-4 border-t-2 flex justify-between items-center bg-white rounded-b-3xl"
                            >
                                <SharedMembersUI
                                    data={fileDetail}
                                    onClose={closeModal}
                                />
                            </Transition>

                            <Transition
                                show={!isSelected}
                                enter="transition-opacity duration-1000"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                className="w-full"
                            >
                                <div className="w-full h-10 opacity-0 shadow-none border-0" />
                                <div
                                    className={`bg-white rounded-3xl px-10 py-5 `}
                                >
                                    <div className="flex items-center text-ooolab_blue_0 cursor-pointer">
                                        <PaperClipIcon className="h-ooolab_h_6 cursor-pointer" />
                                        <p className="w-max pl-ooolab_p_1 ">
                                            Get File
                                        </p>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ShareModal;
