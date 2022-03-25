import * as React from 'react';
// PACKAGE
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
// COMPONENTS
import CommonButton from 'components/CommonButton/CommonButton';
import PasswordWithEyes from 'components/PasswordWithEyes';
// CONTEXT
import { PasswordContext } from 'contexts/Password/PasswordContext';
// CONSTANT
import { FORM_CONST } from 'constant/form.const';
import { ForgotPasswordEmailIcon } from 'constant/authNode.const';
import { MESSAGE } from 'constant/message.const';
// LOGIC
import {
    handleResetPasswordState,
    ForgotPasswordFormProps,
    handleChangeEmail,
    handleChangePassword,
    handleChangeConfirmPassword,
    onForgotSubmit,
    onResetSubmit,
} from './ForgotPasswordFormFn';
// ASSETS
import CircleChecked from 'assets/SVG/circle_checked.svg';
import { Trans, useTranslation } from 'react-i18next';
import { AuthContext } from 'contexts/Auth/AuthContext';
import { ErrorMessage } from '@hookform/error-message';

export function handleResendEmail(
    setApiForgotPasswordSuccess: (
        value: React.SetStateAction<string | undefined>
    ) => void
) {
    return () => {
        setApiForgotPasswordSuccess(undefined);
    };
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    tokenParam,
    emailParam,
}) => {
    const { t: translator } = useTranslation();
    const history = useHistory();
    const [
        apiForgotPasswordSuccess,
        setApiForgotPasswordSuccess,
    ] = React.useState<string>();
    const [
        apiResetPasswordSuccess,
        setApiResetPasswordSuccess,
    ] = React.useState<string>();
    const [apiError, setApiError] = React.useState<string>();
    const { passwordState, dispatch } = React.useContext(PasswordContext);
    const { dispatch: authDispatch } = React.useContext(AuthContext);
    const {
        result,
        isLoading,
        resetPasswordResult,
        forgotPasswordResult,
        err,
        valErr,
    } = passwordState;
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        trigger,
        watch,
    } = useForm();

    React.useEffect(() => {
        if (resetPasswordResult === 204) {
            setApiResetPasswordSuccess(MESSAGE.RESET_PASSWORD_SUCCESS);
        }
        if (forgotPasswordResult === 204) {
            setApiForgotPasswordSuccess(
                MESSAGE.EMAIL_WAS_SENT_PLEASE_CHECK_YOUR_EMAIL
            );
        }
        if (err) {
            setApiError(err.error.description);
        }
        if (valErr) {
            setApiError(valErr.validation_error.body_params[0].msg);
        }
    }, [resetPasswordResult || forgotPasswordResult || err || valErr]);

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex relative w-ooolab_w_1280px h-ooolab_h_640px rounded-ooolab_radius_40px shadow-ooolab_login_1 items-center justify-center">
                {tokenParam ? (
                    <form
                        className="w-ooolab_w_553px"
                        onSubmit={handleSubmit(
                            onResetSubmit(
                                getValues,
                                tokenParam,
                                emailParam,
                                dispatch
                            )
                        )}
                    >
                        <div className="flex items-center flex-col">
                            <label className="block ooolab_text_lg text-center text-ooolab_dark_1">
                                Reset password
                            </label>
                            {resetPasswordResult ? (
                                <>
                                    <p className="text-green-500 ooolab_paragraph_1">
                                        {translator(
                                            'FORM_CONST.PASSWORD_RESET_SUCCESS'
                                        )}
                                    </p>
                                    <button
                                        onClick={handleResetPasswordState(
                                            dispatch,
                                            authDispatch,
                                            history
                                        )}
                                        className="ooolab_btn_primary_1 flex justify-center items-center mt-ooolab_m_10"
                                    >
                                        {translator('LOG_IN')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center w-ooolab_login_4 h-ooolab_h_10 mt-ooolab_m_10">
                                        <PasswordWithEyes
                                            formProps={register('password', {
                                                required: true,
                                                pattern: {
                                                    value:
                                                        FORM_CONST.PASSWORD_REGEX,
                                                    message: `${translator(
                                                        'FORM_CONST.PASSWORD_VALIDATE'
                                                    )}`,
                                                },
                                            })}
                                            onChange={handleChangePassword(
                                                setValue,
                                                trigger
                                            )}
                                            placeholder={`${translator(
                                                'ENTER_NEW_PASSWORD'
                                            )}`}
                                        />
                                        <div
                                            className={
                                                'ml-ooolab_m_4 w-ooolab_w_8 h-ooolab_h_8'
                                            }
                                        >
                                            {!apiError &&
                                                !errors?.password &&
                                                getValues('password') && (
                                                    <img
                                                        src={CircleChecked}
                                                        alt={'_circle_checked'}
                                                        className={
                                                            'w-full h-full'
                                                        }
                                                    />
                                                )}
                                        </div>
                                    </div>
                                    {/* {errors?.password?.type === 'required' && (
                                        <span className="text-red-500 ooolab_paragraph_1 w-ooolab_login_4">
                                            {translator(
                                                'FORM_CONST.REQUIRED_FIELD'
                                            )}
                                        </span>
                                    )}
                                    {errors?.password?.type === 'pattern' && (
                                        <span className="text-red-500 ooolab_paragraph_1 w-ooolab_login_4">
                                            {translator(
                                                'FORM_CONST.PASSWORD_VALIDATE'
                                            )}
                                        </span>
                                    )} */}
                                    <ErrorMessage
                                        errors={errors}
                                        name="password"
                                        as="span"
                                        className="text-red-500 ooolab_paragraph_1 w-ooolab_login_4"
                                    />
                                    <div className="flex items-center w-ooolab_login_4 h-ooolab_h_10 mt-ooolab_m_3">
                                        <PasswordWithEyes
                                            formProps={register(
                                                'confirmPassword',
                                                {
                                                    required: {
                                                        value: true,
                                                        message: `${translator(
                                                            'FORM_CONST.REQUIRED_FIELD'
                                                        )}`,
                                                    },
                                                    validate: (value) => {
                                                        const pass = watch(
                                                            'password'
                                                        );
                                                        return value ===
                                                            getValues(
                                                                'password'
                                                            )
                                                            ? true
                                                            : `${translator(
                                                                  'FORM_CONST.PASSWORD_NOT_MATCH'
                                                              )}`;
                                                    },
                                                }
                                            )}
                                            onChange={handleChangeConfirmPassword(
                                                setValue,
                                                trigger
                                            )}
                                            placeholder={`${translator(
                                                'CONFIRM_NEW_PASSWORD'
                                            )}`}
                                        />
                                        <div
                                            className={
                                                'ml-ooolab_m_4 w-ooolab_w_8 h-ooolab_h_8'
                                            }
                                        >
                                            {!apiError &&
                                                !errors?.confirmPassword &&
                                                getValues(
                                                    'confirmPassword'
                                                ) && (
                                                    <img
                                                        src={CircleChecked}
                                                        alt={'_circle_checked'}
                                                        className={
                                                            'w-full h-full'
                                                        }
                                                    />
                                                )}
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        errors={errors}
                                        name="confirmPassword"
                                        as="span"
                                        className="text-red-500 ooolab_paragraph_1 w-ooolab_login_4"
                                    />
                                    {apiError && (
                                        <span className="text-red-500 ooolab_paragraph_1 w-ooolab_login_4">
                                            {apiError}
                                        </span>
                                    )}
                                    {apiResetPasswordSuccess && (
                                        <span className="text-green-500 ooolab_paragraph_1 w-ooolab_login_4">
                                            {apiResetPasswordSuccess}
                                        </span>
                                    )}
                                    <CommonButton
                                        classStyle={
                                            'ooolab_btn_primary_1 flex justify-center items-center mt-ooolab_m_10'
                                        }
                                        type="circular"
                                        loading={isLoading}
                                        title="Reset"
                                    />
                                </>
                            )}
                        </div>
                    </form>
                ) : !apiForgotPasswordSuccess ? (
                    <form
                        className="flex flex-col w-ooolab_w_553px items-center"
                        onSubmit={handleSubmit(
                            onForgotSubmit(getValues, dispatch)
                        )}
                    >
                        <div className="flex items-center flex-col">
                            <label className="block ooolab_text_lg text-center text-ooolab_dark_1">
                                {translator(
                                    'FORGOT_YOUR_PASSWORD.FORGOT_YOUR_PASSWORD'
                                )}
                            </label>
                            <p className="ooolab_text_base text-ooolab_dark_1 mt-ooolab_m_10">
                                {translator(
                                    'FORGOT_YOUR_PASSWORD.FORGOT_PASSWORD_DETAIL'
                                )}
                            </p>
                            <div className="flex flex-col items-center mt-ooolab_m_3 justify-center">
                                <input
                                    className="w-ooolab_login_4 h-ooolab_h_10 ooolab_input_1 pl-ooolab_p_5"
                                    type="text"
                                    placeholder="Email"
                                    {...register('email', {
                                        required: true,
                                        pattern: FORM_CONST.EMAIL_REGEX,
                                        setValueAs: (value) => value.trim(),
                                    })}
                                    name="email"
                                    onChange={handleChangeEmail(
                                        setValue,
                                        trigger
                                    )}
                                />

                                {errors.email &&
                                    errors.email.type === 'required' && (
                                        <span className="text-red-500 ooolab_paragraph_1">
                                            {translator(
                                                'FORM_CONST.REQUIRED_FIELD'
                                            )}
                                        </span>
                                    )}

                                {errors.email &&
                                    errors.email.type === 'pattern' && (
                                        <span className="text-red-500 ooolab_paragraph_1">
                                            {translator(
                                                'FORM_CONST.EMAIL_VALIDATE'
                                            )}
                                        </span>
                                    )}

                                {apiError && (
                                    <span className="text-red-500 ooolab_paragraph_1">
                                        {apiError}
                                    </span>
                                )}
                            </div>
                        </div>
                        <CommonButton
                            classStyle={
                                'group mt-ooolab_m_10 w-ooolab_w_15 h-ooolab_h_15 rounded-ooolab_circle shadow-ooolab_login_1 flex justify-center items-center hover:bg-ooolab_blue_0 focus:bg-ooolab_blue_1'
                            }
                            type="circular"
                            loading={isLoading}
                            title="Send"
                            Icon={ForgotPasswordEmailIcon}
                        />
                    </form>
                ) : (
                    <div className="flex flex-col w-ooolab_w_553px">
                        <div className="flex flex-col w-ooolab_w_553px items-center">
                            <label className="block ooolab_text_lg text-center text-ooolab_dark_1">
                                {translator(
                                    'AUTHENTICATION.FORGOT_PASSWORD.EMAIL_HAS_BEEN_SENT'
                                )}
                            </label>
                            <p className="ooolab_text_base text-ooolab_dark_1 mt-ooolab_m_10 text-center">
                                <Trans
                                    i18nKey="AUTHENTICATION.FORGOT_PASSWORD.PLEASE_CHECK_YOUR_EMAIL"
                                    tOptions={{ email: getValues('email') }}
                                    components={{
                                        1: (
                                            <span className="text-ooolab_blue_1" />
                                        ),
                                    }}
                                ></Trans>
                            </p>
                            <button
                                onClick={handleResetPasswordState(
                                    dispatch,
                                    authDispatch,
                                    history
                                )}
                                className="h-ooolab_login_4_btn_1 bg-ooolab_blue_1 rounded-sub_tab text-white text-ooolab_sm font-medium flex justify-center items-center mt-ooolab_m_122px px-ooolab_p_5"
                            >
                                {translator('HOME')}
                            </button>
                        </div>
                        <button
                            onClick={handleResendEmail(
                                setApiForgotPasswordSuccess
                            )}
                            className="ooolab_text_base text-ooolab_blue_1 absolute bottom-ooolab_inset_50px left-1/2 transform -translate-x-1/2"
                        >
                            {translator(
                                'AUTHENTICATION.FORGOT_PASSWORD.RESEND_PASSWORD_RESET_EMAIL'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
