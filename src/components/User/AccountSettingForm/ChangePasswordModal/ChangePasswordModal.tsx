import { Fragment, FC, useRef, useEffect, useCallback } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import {
    handleConfirmPasswordChange,
    handleCurrentPasswordChange,
    handleNewPasswordChange,
    onSubmit,
} from './ChangePasswordModalFn';
import { PasswordContext } from 'contexts/Password/PasswordContext';
import { FORM_CONST } from 'constant/form.const';
import SavingChangesModal from '../SavingChangesModal/SavingChangesModal';
import { EyeClose, EyeOpen } from '../../../PasswordWithEyes/PasswordWithEyes';
import { useTranslation } from 'react-i18next';
import lodash from 'lodash';
import userMiddleware from 'middleware/user.middleware';

interface ChangePasswordModalProps {
    onClose: () => void;
    onUpdateSuccess: () => void;
}

const ChangePasswordModal: FC<ChangePasswordModalProps> = ({
    onClose,
    onUpdateSuccess,
}) => {
    const { t: translator } = useTranslation();
    const cancelButtonRef = useRef(null);
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        watch,
        setError,
        clearErrors,
    } = useForm({
        mode: 'onChange',
    });
    const newPassword = watch('new_password');
    const { dispatch, passwordState } = React.useContext(PasswordContext);
    const [apiError, setApiError] = React.useState<string>();
    const { isLoading, err, valErr, result: passwordResult } = passwordState;
    useEffect(() => {
        if (passwordResult?.email && passwordResult?.id) {
            onUpdateSuccess();
        }
        if (err) {
            setApiError(err.error.name ?? err.error.description);
        }
        if (valErr) {
            setApiError(valErr.validation_error.body_params[0].msg);
        }
    }, [passwordResult, err, valErr]);

    const submitForm = () => {
        const formValues = getValues();
        userMiddleware.updatePassword(dispatch, {
            old_password: formValues.current_password,
            new_password: newPassword,
        });
    };

    return (
        <>
            <Transition.Root show={true} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed z-70 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    open={true}
                    onClose={onClose}
                >
                    <div className="flex i justify-center min-h-screen pt-4 px-4 pb-20 text-center items-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
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
                            <div className="bg-white rounded-ooolab_radius_20px text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle min-w-ooolab_w_80 relative py-ooolab_p_4 px-ooolab_p_6 w-ooolab_w_125">
                                <form
                                    className="flex flex-col"
                                    onSubmit={handleSubmit(submitForm)}
                                >
                                    {/* title */}
                                    <p className="leading-ooolab_24px text-ooolab_dark_1 text-ooolab_sm mb-ooolab_m_5">
                                        {translator(
                                            'ACCOUNT_SETTING.CHANGE_PASSWORD'
                                        )}
                                    </p>
                                    <div className="flex flex-col space-y-6">
                                        <div
                                            className={
                                                'flex flex-col items-start w-full'
                                            }
                                        >
                                            <PasswordInput
                                                // onChange={handleCurrentPasswordChange(
                                                //     setValue,
                                                //     errors,
                                                //     trigger,
                                                //     setApiError
                                                // )}
                                                inputProps={register(
                                                    'current_password',
                                                    {
                                                        required: {
                                                            value: true,
                                                            message: `${translator(
                                                                'FORM_CONST.REQUIRED_FIELD'
                                                            )}`,
                                                        },
                                                        // pattern: {
                                                        //     value:
                                                        //         FORM_CONST.PASSWORD_REGEX,
                                                        //     message: `${translator(
                                                        //         'FORM_CONST.PASSWORD_VALIDATE'
                                                        //     )}`,
                                                        // },
                                                    }
                                                )}
                                                // {...register(
                                                //     'current_password',
                                                //     {
                                                //         required: {
                                                //             value: true,
                                                //             message: `${translator(
                                                //                 'FORM_CONST.REQUIRED_FIELD'
                                                //             )}`,
                                                //         },
                                                //         pattern: {
                                                //             value:
                                                //                 FORM_CONST.PASSWORD_REGEX,
                                                //             message: `${translator(
                                                //                 'FORM_CONST.PASSWORD_VALIDATE'
                                                //             )}`,
                                                //         },
                                                //     }
                                                // )}
                                                placeholder={`${translator(
                                                    'ACCOUNT_SETTING.ENTER_CURRENT_PASSWORD'
                                                )}`}
                                                label={`${translator(
                                                    'ACCOUNT_SETTING.CURRENT_PASSWORD'
                                                )}`}
                                            />
                                            <ErrorMessage
                                                className="text-red-500 text-ooolab_sxs mt-ooolab_m_1"
                                                errors={errors}
                                                name="current_password"
                                                as="p"
                                            />
                                        </div>
                                        <div
                                            className={
                                                'flex flex-col items-start w-full'
                                            }
                                        >
                                            <PasswordInput
                                                // onChange={handleNewPasswordChange(
                                                //     setValue,
                                                //     errors,
                                                //     trigger,
                                                //     setApiError
                                                // )}
                                                inputProps={register(
                                                    'new_password',
                                                    {
                                                        required: {
                                                            value: true,
                                                            message: `${translator(
                                                                'FORM_CONST.REQUIRED_FIELD'
                                                            )}`,
                                                        },
                                                        pattern: {
                                                            value:
                                                                FORM_CONST.PASSWORD_REGEX,
                                                            message: `${translator(
                                                                'FORM_CONST.PASSWORD_VALIDATE'
                                                            )}`,
                                                        },
                                                        validate: {
                                                            revalidateWhenChangeNewpassword: (
                                                                val
                                                            ) => {
                                                                const confirmPassword = watch(
                                                                    'confirm_password'
                                                                );

                                                                if (
                                                                    !!confirmPassword &&
                                                                    !lodash.isEqual(
                                                                        val,
                                                                        confirmPassword
                                                                    )
                                                                ) {
                                                                    setError(
                                                                        'confirm_password',
                                                                        {
                                                                            type:
                                                                                'not_match',
                                                                            message: `${translator(
                                                                                'ACCOUNT_SETTING.CHANGE_PASSWORD_MODAL.CONFIRM_PASSWORD_NOT_MATCH'
                                                                            )}`,
                                                                        }
                                                                    );
                                                                    return false;
                                                                } else {
                                                                    clearErrors(
                                                                        'confirm_password'
                                                                    );
                                                                }
                                                                return true;
                                                            },
                                                            shouldBeDifferentCurrentPassword: (
                                                                val
                                                            ) => {
                                                                const currentPassword = watch(
                                                                    'current_password'
                                                                );
                                                                if (
                                                                    !!currentPassword &&
                                                                    lodash.isEqual(
                                                                        val,
                                                                        currentPassword
                                                                    )
                                                                ) {
                                                                    return `${translator(
                                                                        'ACCOUNT_SETTING.CHANGE_PASSWORD_MODAL.DUPLICATE_PASSWORD'
                                                                    )}`;
                                                                } else {
                                                                    clearErrors(
                                                                        'new_password'
                                                                    );
                                                                }
                                                                return true;
                                                            },
                                                        },
                                                    }
                                                )}
                                                placeholder={`${translator(
                                                    'ACCOUNT_SETTING.ENTER_NEW_PASSWORD'
                                                )}`}
                                                label={`${translator(
                                                    'ACCOUNT_SETTING.NEW_PASSWORD'
                                                )}`}
                                            />

                                            <ErrorMessage
                                                className="text-red-500 text-ooolab_sxs mt-ooolab_m_1"
                                                errors={errors}
                                                name="new_password"
                                                as="p"
                                            />
                                        </div>
                                        <div
                                            className={
                                                'flex flex-col items-start w-full'
                                            }
                                        >
                                            <PasswordInput
                                                // onChange={handleConfirmPasswordChange(
                                                //     setValue,
                                                //     errors,
                                                //     trigger,
                                                //     getValues,
                                                //     setApiError,
                                                //     translator
                                                // )}
                                                inputProps={register(
                                                    'confirm_password',
                                                    {
                                                        required: {
                                                            value: true,
                                                            message: `${translator(
                                                                'FORM_CONST.REQUIRED_FIELD'
                                                            )}`,
                                                        },
                                                        // pattern: {
                                                        //     value:
                                                        //         FORM_CONST.PASSWORD_REGEX,
                                                        //     message: `${translator(
                                                        //         'FORM_CONST.PASSWORD_VALIDATE'
                                                        //     )}`,
                                                        // },
                                                        validate: {
                                                            shouldBeTheSameWithNewPassword: (
                                                                val
                                                            ) => {
                                                                const newPasswordWatch = watch(
                                                                    'new_password'
                                                                );
                                                                return !val
                                                                    ? true
                                                                    : val !==
                                                                      newPasswordWatch
                                                                    ? `${translator(
                                                                          'ACCOUNT_SETTING.CHANGE_PASSWORD_MODAL.CONFIRM_PASSWORD_NOT_MATCH'
                                                                      )}`
                                                                    : true;
                                                            },
                                                        },
                                                    }
                                                )}
                                                placeholder={`${translator(
                                                    'ACCOUNT_SETTING.RE_ENTER_NEW_PASSWORD'
                                                )}`}
                                                label={`${translator(
                                                    'ACCOUNT_SETTING.CONFIRM_NEW_PASSWORD'
                                                )}`}
                                            />
                                            <ErrorMessage
                                                className="text-red-500 text-ooolab_sxs mt-ooolab_m_1"
                                                errors={errors}
                                                name="confirm_password"
                                                as="p"
                                            />
                                            {/* {errors?.confirm_password?.type ===
                                                'required' && (
                                                <ErrorMessageComponent
                                                    error={translator(
                                                        'FORM_CONST.REQUIRED_FIELD'
                                                    )}
                                                />
                                            )}
                                            {errors?.confirm_password?.type ===
                                                'pattern' && (
                                                <ErrorMessageComponent
                                                    error={translator(
                                                        'FORM_CONST.PASSWORD_VALIDATE'
                                                    )}
                                                />
                                            )} */}
                                        </div>
                                        {Object.keys(errors).length === 0 &&
                                            apiError && (
                                                <ErrorMessageComponent
                                                    error={apiError}
                                                />
                                            )}
                                        <div className="flex w-full flex-row justify-end space-x-4">
                                            <button
                                                className={
                                                    'rounded-ooolab_radius_8px bg-white border border-ooolab_dark_2 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-ooolab_dark_1 font-medium'
                                                }
                                                onClick={onClose}
                                            >
                                                {translator(
                                                    'ACCOUNT_SETTING.CANCEL'
                                                )}
                                            </button>
                                            <button
                                                type="submit"
                                                className={
                                                    'rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium'
                                                }
                                            >
                                                {translator(
                                                    'ACCOUNT_SETTING.SAVE'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <XIcon
                                    onClick={() => onClose()}
                                    className="w-ooolab_w_5 h-ooolab_h_5 absolute top-4 right-5 cursor-pointer"
                                />
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            <SavingChangesModal isLoading={isLoading} />
        </>
    );
};

const PasswordInput: FC<{
    placeholder: string;
    inputProps: any;
    label: string;
}> = ({ inputProps, placeholder, label }) => {
    const [show, updateShow] = React.useState(false);
    const changeEye = useCallback(() => updateShow(!show), [show]);
    return (
        <div className={'flex flex-col items-start w-full'}>
            <label
                className={
                    'font-medium text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mb-ooolab_m_1'
                }
            >
                {label}
            </label>
            <div
                className={
                    'rounded-ooolab_radius_4px border border-ooolab_dark_1 py-ooolab_p_2 px-ooolab_p_3 w-full text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_1 flex flex-row'
                }
            >
                <input
                    className={'w-full'}
                    {...inputProps}
                    placeholder={placeholder}
                    type={show ? 'text' : 'password'}
                />
                <div
                    onClick={changeEye}
                    className="flex justify-center items-center w-ooolab_w_8 cursor-pointer group"
                >
                    {show ? <EyeClose /> : <EyeOpen />}
                </div>
            </div>
        </div>
    );
};

const ErrorMessageComponent: React.FC<{ error: string }> = ({ error }) => {
    const { t: translator } = useTranslation();
    return (
        <span className="text-red-500 text-ooolab_xs mt-ooolab_m_2">
            {translator(`ACCOUNT_SETTING.CHANGE_PASSWORD_MODAL.${error}`, {
                defaultValue: error,
            })}
        </span>
    );
};

export default ChangePasswordModal;
