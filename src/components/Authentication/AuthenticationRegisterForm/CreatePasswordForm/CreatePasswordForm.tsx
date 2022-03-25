import * as React from 'react';
// PACKAGE
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
// COMPONENTS
import CommonModals from 'components/CommonModals';
// CONST
import { FORM_CONST } from 'constant/form.const';

// CONTEXT
import { AuthContext } from 'contexts/Auth/AuthContext';
import { RegisterContext } from 'contexts/Auth/RegisterContext';

// ACTION
import { SET_REGISTER } from 'actions/auth.action';
// UTILS
import {
    changeFalseForLocalStorageCurrentAccount,
    sessionClear,
    setStorageAuthApiData,
} from 'utils/handleLocalStorage';
import { handleLogoutRegister } from 'utils/handleLogout';

// ACTIONS
import CommonButton from 'components/CommonButton';
import Information from 'assets/SVG/information.svg';
import CircleChecked from 'assets/SVG/circle_checked.svg';
import {
    CreatePasswordFormProps,
    handleNewPassword,
    onSubmit,
    navigateToUpdateInformation,
    handleConfirmPassword,
} from 'components/Authentication/AuthenticationRegisterForm/CreatePasswordForm/CreatePasswordFormFn';
import PasswordWithEyes from 'components/PasswordWithEyes';
import { ArrowIcon } from 'constant/authNode.const';
import { useTranslation } from 'react-i18next';
import { AUTH_CONST } from 'constant/auth.const';

const CreatePasswordForm: React.FC<CreatePasswordFormProps> = ({
    storageUserInfo,
    setAuthStorage,
    storageUserInfoSession,
}) => {
    const { t: translator } = useTranslation();
    const history = useHistory();
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
        trigger,
        watch,
    } = useForm();

    const [apiError, setApiError] = React.useState<string>();
    const { dispatch, registerState } = React.useContext(RegisterContext);
    const {
        createNewPasswordResult,
        verifyEmailResult,
        err,
        isLoading,
    } = registerState;
    const authCtx = React.useContext(AuthContext);
    const { temporary_access_token } = storageUserInfoSession;

    React.useEffect(() => {
        if (createNewPasswordResult) {
            setAuthStorage(true);
            sessionClear();
            navigateToUpdateInformation(history, setAuthStorage)();
            // @ts-ignore
            dispatch({ type: SET_REGISTER.REQ_RESET_RESULT });

            setStorageAuthApiData(createNewPasswordResult);
            setApiError(undefined);
        }
        if (err?.error) {
            setApiError(err.error.description);
            if (
                err.error.name === AUTH_CONST.TOKEN_EXPIRED ||
                err.error.code === 401
            ) {
                handleLogoutRegister(setAuthStorage);
                history.push('/register');
                // registerMiddleware.
            }
        }
    }, [createNewPasswordResult, err]);
    return (
        <>
            <div className="flex justify-center lg:items-center h-ooolab_body_3 sm:h-4/5 lg:h-ooolab_body_1 my-5 ooolab_ipad_portrait:h-ooolab_body_1 w-full">
                <form
                    className="ooolab_w_448px flex flex-col"
                    onSubmit={handleSubmit(
                        onSubmit(getValues, temporary_access_token, dispatch)
                    )}
                >
                    <div className="mt-16 w-full lg:mt-0 flex items-center flex-col">
                        <div className={'flex flex-row items-center mb-16'}>
                            <img
                                src={Information}
                                alt={'_information'}
                                className={'w-ooolab_w_8 h-ooolab_h_8'}
                            />
                            <label className="text-ooolab_32px leading-ooolab_44px text-ooolab_dark_1 font-semibold ml-ooolab_m_3">
                                {translator(
                                    'AUTHENTICATION.SIGN_UP.CREATE_PASSWORD.CREATE_A_PASSWORD'
                                )}
                            </label>
                        </div>
                        <div
                            className={
                                'flex flex-row items-center mt-5 w-ooolab_w_100 ml-ooolab_m_12'
                            }
                        >
                            <PasswordWithEyes
                                formProps={register('password', {
                                    required: true,
                                    pattern: FORM_CONST.PASSWORD_REGEX,
                                })}
                                placeholder={`${translator(
                                    'AUTHENTICATION.SIGN_UP.CREATE_PASSWORD.ENTER_PASSWORD'
                                )}`}
                                onChange={handleNewPassword(
                                    setValue,
                                    errors,
                                    setApiError,
                                    trigger,
                                    getValues
                                )}
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
                                            className={'w-full h-full'}
                                        />
                                    )}
                            </div>
                        </div>
                        <div
                            className={
                                'flex flex-row items-center mt-ooolab_m_5 w-ooolab_w_100 ml-ooolab_m_12'
                            }
                        >
                            <PasswordWithEyes
                                formProps={register('confirm_password', {
                                    required: true,
                                })}
                                placeholder={`${translator(
                                    'AUTHENTICATION.SIGN_UP.CREATE_PASSWORD.CONFIRM_PASSWORD'
                                )}`}
                                onChange={handleConfirmPassword(
                                    setValue,
                                    errors,
                                    setApiError,
                                    trigger,
                                    getValues
                                )}
                            />
                            <div
                                className={
                                    'ml-ooolab_m_4 w-ooolab_w_8 h-ooolab_h_8'
                                }
                            >
                                {!apiError &&
                                    !errors?.confirm_password &&
                                    !errors?.password &&
                                    getValues('confirm_password')?.length > 0 &&
                                    getValues('confirm_password') ===
                                        getValues('password') && (
                                        <img
                                            src={CircleChecked}
                                            alt={'_circle_checked'}
                                            className={'w-full h-full'}
                                        />
                                    )}
                            </div>
                        </div>
                        <div className={'mt-8'} />
                        <div
                            className={
                                'flex flex-col justify-start ml-ooolab_m_6'
                            }
                        >
                            {(errors?.password?.type === 'required' ||
                                errors?.confirm_password?.type ===
                                    'required') && (
                                <span className="text-red-500">
                                    {translator('FORM_CONST.REQUIRED_FIELD')}
                                </span>
                            )}
                            {(errors?.password?.type === 'pattern' ||
                                errors?.confirm_password?.type ===
                                    'pattern') && (
                                <span className="text-red-500">
                                    {translator('FORM_CONST.PASSWORD_VALIDATE')}
                                </span>
                            )}
                            {apiError && (
                                <span className="text-red-500">{apiError}</span>
                            )}
                        </div>
                        <CommonButton
                            classStyle={
                                'group mt-ooolab_m_10 w-ooolab_w_15 h-ooolab_h_15 rounded-ooolab_circle shadow-ooolab_login_1 flex justify-center items-center hover:bg-ooolab_blue_0 focus:bg-ooolab_blue_1'
                            }
                            type="circular"
                            loading={isLoading}
                            title="Create password"
                            Icon={ArrowIcon}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreatePasswordForm;
