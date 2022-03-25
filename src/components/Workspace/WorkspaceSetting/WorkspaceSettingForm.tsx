import UpdateAvatarModal from 'components/User/AccountSettingForm/UpdateAvatarModal';
import {
    Dispatch,
    FC,
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { Transition } from '@headlessui/react';

import { WorkspaceItem } from 'types/GetListOfWorkspace.type';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import workspaceMiddleware from 'middleware/workspace.middleware';
import Modal from 'components/Modal';

import { FORM_CONST } from 'constant/form.const';
import {
    CONFIRM_UPDATE_WORKSPACE,
    INFORM_UPDATE_WORKSPACE_RESULT,
} from 'constant/modal.const';
import SaveChanges from 'assets/SVG/save-changes.svg';
import CancelChanges from 'assets/SVG/cancel.svg';

import { useTranslation } from 'react-i18next';

interface WorkspaceSettingPropsInterface {
    data: WorkspaceItem;
    dispatch: Dispatch<any>;
    workspaceId: string;
    loading: boolean;
    status: 'init' | 'done' | 'error';
}

const formFields: Record<string, string> = {
    name: 'name',
    email: 'email',
    address: 'address',
    phone: 'phone',
};

const RenderError = ({ err }: { err: string }) => (
    <p className="text-red-500 font-light text-ooolab_xs">{err}</p>
);

const ModalUpdateImage: Record<'done' | 'error' | 'init', string> = {
    done: SaveChanges,
    error: CancelChanges,
    init: SaveChanges,
};

const LoadingSVG = () => (
    <svg
        className="animate-spin -ml-1 mr-3 w-ooolab_w_10 h-ooolab_w_10 opacity-100"
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

const WorkspaceSettingForm: FC<WorkspaceSettingPropsInterface> = ({
    data,
    dispatch,
    workspaceId,
    loading,
    status: updateStatus,
}) => {
    const { t: translator } = useTranslation();
    const [confirmModal, setConfirmModal] = useState(false);
    const {
        register,
        formState: { dirtyFields, errors, touchedFields },
        reset,
        getValues,
        handleSubmit,
        clearErrors,
        setValue,
        setError,
    } = useForm({
        defaultValues: useMemo(
            () => ({
                [formFields.name]: data.name,
                [formFields.address]: data.address,
                [formFields.phone]: data.phone,
                [formFields.email]: data.email,
            }),
            [data]
        ),
    });

    const ModalTitleText: Record<'done' | 'error' | 'init', string> = {
        done: translator('MODALS.INFORM_UPDATE_WORKSPACE_RESULT.DONE'),
        error: translator('MODALS.INFORM_UPDATE_WORKSPACE_RESULT.ERROR'),
        init: translator(
            'MODALS.CONFIRM_UPDATE_WORKSPACE.TITLE_CONFIRM_UPDATE_WORKSPACE'
        ),
    };

    const setFormDefaultValue = useCallback(() => {
        // clearErrors();
        // setValue(formFields.name, data.name, { shouldDirty: false });
        // setValue(formFields.address, data.address, { shouldDirty: false });
        // setValue(formFields.phone, data.phone, { shouldDirty: false });
        // setValue(formFields.email, data.email, { shouldDirty: false });
        return {
            [formFields.name]: data.name,
            [formFields.address]: data.address,
            [formFields.phone]: data.phone,
            [formFields.email]: data.email,
        };
    }, [data]);

    const onSubmit = () => {
        toggleConfirmModal();
    };

    const handleUpdateWorkspace = () => {
        const values = getValues();
        workspaceMiddleware.updateDetailWorkspace(dispatch, workspaceId, {
            ...values,
            name: values.name,
        });
    };

    const toggleConfirmModal = () => setConfirmModal(!confirmModal);

    const handleCloseUpdateModal = () => {
        setTimeout(
            () => workspaceMiddleware.resetUpdateWorkspaceState(dispatch),
            200
        );
        reset();
        toggleConfirmModal();
    };

    useEffect(() => {
        reset({
            [formFields.name]: data.name,
            [formFields.address]: data.address,
            [formFields.phone]: data.phone,
            [formFields.email]: data.email,
        });
    }, [data]);

    return (
        <>
            <Modal
                isOpen={confirmModal}
                onClose={handleCloseUpdateModal}
                title={
                    !loading
                        ? ModalTitleText[updateStatus]
                        : translator('MODALS.UPDATING')
                }
                imgSrc={
                    loading ? <LoadingSVG /> : ModalUpdateImage[updateStatus]
                }
                contentText={
                    updateStatus === 'init' && !loading
                        ? translator(
                              'MODALS.CONFIRM_UPDATE_WORKSPACE.SUB_TITLE_CONFIRM_UPDATE_WORKSPACE'
                          )
                        : ''
                }
                subBtn={
                    (updateStatus === 'init' && !loading && (
                        <button
                            className={
                                'rounded-ooolab_radius_8px bg-white border border-ooolab_dark_2 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-ooolab_dark_1 font-medium'
                            }
                            onClick={handleCloseUpdateModal}
                        >
                            {translator(
                                'MODALS.CONFIRM_CANCEL_MODAL.NO_CANCEL'
                            )}
                        </button>
                    )) ||
                    null
                }
                mainBtn={
                    (updateStatus === 'init' && !loading && (
                        <button
                            className={
                                'rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium'
                            }
                            onClick={handleUpdateWorkspace}
                        >
                            {translator(
                                'MODALS.CONFIRM_CANCEL_MODAL.YES_DO_IT'
                            )}
                        </button>
                    )) || (
                        <button
                            className={`${
                                updateStatus === 'init' && 'hidden'
                            } rounded-ooolab_radius_8px bg-red-500 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium`}
                            onClick={handleCloseUpdateModal}
                        >
                            {translator('MODALS.CLOSE')}
                        </button>
                    )
                }
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-6"
            >
                <div className="col-span-2">
                    <div className={'h-0.5 bg-ooolab_border_logout w-full'} />
                </div>
                <div className="flex flex-col col-span-1">
                    <label
                        className={`${
                            errors[formFields.name] &&
                            errors[formFields.name]?.message
                                ? 'text-red-500'
                                : 'text-ooolab_dark_2 '
                        } text-ooolab_sm mb-ooolab_m_1`}
                        htmlFor="name"
                    >
                        {translator(
                            'DASHBOARD.WORKSPACE_SETTING.WORKSPACE_NAME'
                        )}
                    </label>
                    <input
                        autoComplete="off"
                        className={`${
                            errors[formFields.name] &&
                            errors[formFields.name]?.message
                                ? 'border-red-500'
                                : 'border-ooolab_dark_1'
                        } border rounded px-ooolab_p_3 py-ooolab_p_2 font-normal`}
                        type="text"
                        id="name"
                        {...register(formFields.name, {
                            required: {
                                value: true,
                                message: 'Workspace Name is required!',
                            },
                        })}
                    />
                    {(errors[formFields.name]?.message && (
                        <RenderError
                            err={errors[formFields.name]?.message || ''}
                        />
                    )) ||
                        null}
                </div>
                <div className="flex flex-col col-span-1">
                    <label
                        className={`${
                            errors[formFields.address] &&
                            errors[formFields.address]?.message
                                ? 'text-red-500'
                                : 'text-ooolab_dark_2 '
                        } text-ooolab_sm mb-ooolab_m_1`}
                        htmlFor="address"
                    >
                        {translator('DASHBOARD.WORKSPACE_SETTING.ADDRESS')}
                    </label>
                    <input
                        autoComplete="off"
                        className={`${
                            errors[formFields.address] &&
                            errors[formFields.address]?.message
                                ? 'border-red-500'
                                : 'border-ooolab_dark_1'
                        } border rounded px-ooolab_p_3 py-ooolab_p_2 font-normal`}
                        type="text"
                        id="address"
                        defaultValue={data.address}
                        {...register(formFields.address, {
                            // validate: (val) => {
                            //     if (!val) return true;
                            //     return (
                            //         val !== data.address || 'Nothing changed!'
                            //     );
                            // },
                        })}
                    />
                    {(errors[formFields.address]?.message && (
                        <RenderError
                            err={errors[formFields.address]?.message || ''}
                        />
                    )) ||
                        null}
                </div>
                <div className="flex flex-col col-span-1">
                    <label
                        className={`${
                            errors[formFields.email] &&
                            errors[formFields.email]?.message
                                ? 'text-red-500'
                                : 'text-ooolab_dark_2 '
                        } text-ooolab_sm mb-ooolab_m_1`}
                        htmlFor="email"
                    >
                        {translator('ACCOUNT_SETTING.EMAIL_ADDRESS')}
                    </label>
                    <input
                        autoComplete="off"
                        className={`${
                            errors[formFields.email] &&
                            errors[formFields.email]?.message
                                ? 'border-red-500'
                                : 'border-ooolab_dark_1'
                        } border rounded px-ooolab_p_3 py-ooolab_p_2 font-normal`}
                        type="text"
                        id="email"
                        {...register(formFields.email, {
                            pattern: {
                                value: FORM_CONST.EMAIL_REGEX,
                                message: 'Email is unvalid',
                            },
                            // validate: (val) => {
                            //     if (!val) return true;
                            //     return val !== data.email || 'Nothing changed!';
                            // },
                        })}
                    />
                    {errors[formFields.email] && (
                        <RenderError
                            err={errors[formFields.email]?.message || ''}
                        />
                    )}
                </div>
                <div className="flex flex-col col-span-1">
                    <label
                        className={`${
                            errors[formFields.phone] &&
                            errors[formFields.phone]?.message
                                ? 'text-red-500'
                                : 'text-ooolab_dark_2 '
                        } text-ooolab_sm mb-ooolab_m_1`}
                        htmlFor="phone"
                    >
                        {translator('DASHBOARD.WORKSPACE_SETTING.PHONE')}
                    </label>
                    <input
                        autoComplete="off"
                        className={`${
                            errors[formFields.phone] &&
                            errors[formFields.phone]?.message
                                ? 'border-red-500'
                                : 'border-ooolab_dark_1'
                        } border rounded px-ooolab_p_3 py-ooolab_p_2 font-normal`}
                        type="text"
                        id="phone"
                        {...register(formFields.phone, {
                            // validate: (val) => {
                            //     if (!val) return true;
                            //     return val !== data.phone || 'Nothing changed!';
                            // },
                        })}
                    />
                    {errors[formFields.phone] && (
                        <RenderError
                            err={errors[formFields.phone]?.message || ''}
                        />
                    )}
                </div>

                <Transition
                    as={Fragment}
                    show={
                        dirtyFields && Object.keys(dirtyFields).length
                            ? true
                            : false
                    }
                    enter="ease transition-all duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease transition-all duration-150"
                    leaveFrom="opacity-80"
                    leaveTo="opacity-0"
                >
                    <div className="col-span-2 flex justify-end items-center">
                        {(errors.custom_validation && (
                            <p className="m-0 mr-ooolab_m_2 p-0 mb-ooolab_m_1 text-red-500 text-ooolab_xs text-right font-light">
                                {errors.custom_validation.message}
                            </p>
                        )) ||
                            null}
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                setFormDefaultValue();
                            }}
                            className="px-ooolab_p_3 py-ooolab_p_1 border border-black rounded-lg mr-ooolab_m_5"
                        >
                            {translator('MODALS.CANCEL')}
                        </button>
                        <button
                            // onClick={(e) => {
                            //     e.preventDefault();
                            //     onSubmit();
                            // }}
                            type="submit"
                            className="px-ooolab_p_3 py-ooolab_p_1 bg-ooolab_blue_1 text-white rounded-lg"
                        >
                            {translator('MODALS.SAVE_CHANGES')}
                        </button>
                    </div>
                </Transition>

                {/* {(dirtyFields && Object.keys(dirtyFields).length && (
                    <div className="col-span-2 flex justify-end items-center">
                        {(errors.update_fields_required && (
                            <p className="m-0 mr-ooolab_m_2 p-0 mb-ooolab_m_1 text-red-500 text-ooolab_xs text-right font-light">
                                {errors.update_fields_required.message}
                            </p>
                        )) ||
                            null}
                        <button
                            onClick={() => reset()}
                            className="px-ooolab_p_3 py-ooolab_p_1 border border-black rounded-lg mr-ooolab_m_5"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onSubmit();
                            }}
                            className="px-ooolab_p_3 py-ooolab_p_1 bg-ooolab_blue_1 text-white rounded-lg"
                        >
                            Save changes
                        </button>
                    </div>
                )) ||
                    null} */}
            </form>
        </>
    );
};

export default WorkspaceSettingForm;
