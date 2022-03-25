import React from 'react';
// PACKAGE
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
// COMPONENT
import CommonButton from '../../../CommonButton';
// CONSTANTS
import { EmailIcon, ArrowIcon } from 'constant/authNode.const';
import { FORM_CONST } from 'constant/form.const';
// CONTEXT
import { AuthContext } from 'contexts/Auth/AuthContext';
// UTILS
import {
    isLocalStorageAuth,
    setStorageAuthApiData,
} from 'utils/handleLocalStorage';
// LOGIC
import {
    LoginFormProps,
    handleChangeEmail,
    handleChangePassword,
    onSubmit,
} from './LoginFormFn';
import PasswordWithEyes from '../../../PasswordWithEyes';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { isUserLoggedIn } from 'utils/handleAuthorized';

const LoginForm: React.FC<LoginFormProps> = ({ setAuthStorage }) => {
    const { t: translator } = useTranslation();
    const [errorMsg, setErrorMsg] = React.useState<string>();

    const { authState, dispatch } = React.useContext(AuthContext);
    const { result, isLoading } = authState;
    const authError = authState.err;

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        trigger,
        formState: { errors },
    } = useForm();

    React.useEffect(() => {
        const isLoggedIn = isUserLoggedIn();
        if (isLoggedIn) {
            setAuthStorage(true);
            i18n.changeLanguage(result?.language ?? 'en');
            setStorageAuthApiData(result);
        }
        // if (result?.access_token) {
        //     setLocalStorageAuthApiData(result);
        //     setAuthStorage(isUserLoggedIn());
        // }
    }, [result]);

    React.useEffect(() => {
        if (authError && authError?.error) {
            setErrorMsg(authError.error.name);
        } else setErrorMsg('');
    }, [authError]);

    return (
        <div className="flex items-center flex-col w-ooolab_w_90 ml-ooolab_m_15 mr-ooolab_m_15 mt-ooolab_m_16">
            <div className="flex items-start w-full">
                <Link
                    to="/login"
                    className="h-ooolab_login_4_btn_1 bg-ooolab_blue_1 rounded-sub_tab text-white text-ooolab_sm font-medium flex justify-center items-center px-ooolab_p_3"
                >
                    {translator('LOG_IN')}
                </Link>
                <Link
                    to="/register"
                    className="h-ooolab_login_4_btn_1 border border-ooolab_border_logout bg-white rounded-sub_tab text-ooolab_blue_1 text-ooolab_sm font-medium ooolab_btn_second_animate_parent_2 flex justify-center items-center mx-ooolab_m_10px px-ooolab_p_3"
                >
                    {translator('SIGN_UP')}
                </Link>
            </div>
            <form
                className="flex flex-col mt-ooolab_m_7 w-full items-center animate-ooolab_fade_in"
                onSubmit={handleSubmit(onSubmit(dispatch, getValues))}
            >
                <div className="flex flex-col w-full">
                    <div className="group w-full ooolab_input_1 flex items-center relative">
                        <span className="ooolab_input_icon_1">
                            <EmailIcon />
                        </span>
                        <input
                            data-test-id="login-email-text-field"
                            type="text"
                            placeholder={`${translator('EMAIL')}`}
                            className="w-full pl-ooolab_p_10 bg-transparent"
                            {...register('email', {
                                required: true,
                                pattern: FORM_CONST.EMAIL_REGEX,
                                setValueAs: (value: any) => value.trim(),
                            })}
                            name="email"
                            onChange={handleChangeEmail(
                                setValue,
                                trigger,
                                setErrorMsg
                            )}
                        />
                    </div>
                    {errors?.email?.type === 'required' && (
                        <span className="text-red-500 ooolab_paragraph_1">
                            {translator('FORM_CONST.REQUIRED_FIELD')}
                        </span>
                    )}
                    {errors?.email?.type === 'pattern' && (
                        <span className="text-red-500 ooolab_paragraph_1">
                            {translator('FORM_CONST.EMAIL_VALIDATE')}
                        </span>
                    )}

                    <div className={'mt-ooolab_m_5'}>
                        <PasswordWithEyes
                            formProps={register('password', {
                                required: true,
                            })}
                            dataTestId={'login-password-text-field'}
                            placeholder={translator('PASSWORD')}
                            onChange={handleChangePassword(
                                setValue,
                                trigger,
                                setErrorMsg
                            )}
                        />
                    </div>
                    {errors?.password?.type === 'required' && (
                        <span className="text-red-500 ooolab_paragraph_1">
                            {translator('FORM_CONST.REQUIRED_FIELD')}
                        </span>
                    )}
                    {errors?.password?.type === 'pattern' && (
                        <span className="text-red-500 ooolab_paragraph_1">
                            {translator('FORM_CONST.PASSWORD_VALIDATE')}
                        </span>
                    )}
                    {!!errorMsg && (
                        <span className="text-red-500 ooolab_paragraph_1">
                            {translator(`AUTHENTICATION.SIGN_IN.${errorMsg}`, {
                                defaultValue: errorMsg,
                            })}
                        </span>
                    )}
                </div>
                <CommonButton
                    classStyle={
                        'group mt-ooolab_m_10 w-ooolab_w_15 h-ooolab_h_15 rounded-ooolab_circle shadow-ooolab_login_1 flex justify-center items-center hover:bg-ooolab_blue_0 focus:bg-ooolab_blue_1'
                    }
                    dataTestId={'login-common-button'}
                    type="circular"
                    loading={isLoading}
                    title="Title"
                    Icon={ArrowIcon}
                />
            </form>
        </div>
    );
};

export default LoginForm;
