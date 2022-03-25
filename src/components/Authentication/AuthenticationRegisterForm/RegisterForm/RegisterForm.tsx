import * as React from 'react';
// PACKAGE
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
// COMPONENT
import CommonButton from '../../../CommonButton';
// CONSTANTS
import { EmailIcon, ArrowIcon } from 'constant/authNode.const';
import { AUTH_CONST } from 'constant/auth.const';
import { FORM_CONST } from 'constant/form.const';
// CONTEXT
import { RegisterContext } from 'contexts/Auth/RegisterContext';
// LOGIC
import {
    RegisterFormProps,
    handleChangeEmail,
    onSubmit,
} from './RegisterFormFn';
import { ERROR_AUTH } from 'constant/auth.const';
import { useTranslation } from 'react-i18next';

const RegisterForm: React.FC<RegisterFormProps> = ({
    setEmailRegisted,
    setEmailState,
    emailState,
}) => {
    const { t: translator } = useTranslation();
    const [apiError, setApiError] = React.useState<string>();
    const { registerState, dispatch } = React.useContext(RegisterContext);
    const { registerResult, err, isLoading } = registerState;

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        trigger,
        formState: { errors },
    } = useForm();

    React.useEffect(() => {
        if (registerResult?.response === 204) {
            setEmailRegisted(true);
        }
        if (err?.error) {
            setApiError(err.error.name ?? err.error.description);
        }
    }, [registerState || err]);

    return (
        <div className="flex items-center flex-col  w-ooolab_w_90 ml-ooolab_m_15 mr-ooolab_m_15 mt-ooolab_m_16">
            <div className="flex items-start w-full">
                <Link
                    to="/login"
                    className="h-ooolab_login_4_btn_1 border border-ooolab_border_logout bg-white rounded-sub_tab text-ooolab_blue_1 text-ooolab_sm font-medium ooolab_btn_second_animate_parent_2 flex justify-center items-center px-ooolab_p_3"
                >
                    {translator('LOG_IN')}
                </Link>
                <Link
                    to="/register"
                    className="h-ooolab_login_4_btn_1 bg-ooolab_blue_1 rounded-sub_tab text-white text-ooolab_sm font-medium flex justify-center items-center mx-ooolab_m_10px px-ooolab_p_3"
                >
                    {translator('SIGN_UP')}
                </Link>
            </div>
            <div className="flex flex-col items-start w-full mt-ooolab_m_7 animate-ooolab_fade_in">
                <label className="ooolab_text_base text-ooolab_text_username">
                    {translator('AUTHENTICATION.SIGN_UP.REGISTER_REMINDER')}
                </label>
                <form
                    className="flex flex-col mt-ooolab_m_2 w-full items-center"
                    onSubmit={handleSubmit(
                        onSubmit(dispatch, emailState, getValues)
                    )}
                >
                    <div className="flex flex-col w-full">
                        <div className="w-full ooolab_input_1 flex items-center relative">
                            <span className="ooolab_input_icon_1">
                                <EmailIcon />
                            </span>
                            <input
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
                                    setEmailState,
                                    errors,
                                    setApiError,
                                    setValue,
                                    trigger
                                )}
                            />
                        </div>
                        {errors.email && errors.email.type === 'required' && (
                            <span className="text-red-500 ooolab_paragraph_1">
                                {translator('FORM_CONST.REQUIRED_FIELD')}
                            </span>
                        )}
                        {errors.email && errors.email.type === 'pattern' && (
                            <span className="text-red-500 ooolab_paragraph_1">
                                {translator('FORM_CONST.EMAIL_VALIDATE')}
                            </span>
                        )}
                        {apiError && (
                            <span className="text-red-500 ooolab_paragraph_1">
                                {translator(
                                    `AUTHENTICATION.SIGN_UP.${apiError}`,
                                    { defaultValue: apiError }
                                )}
                            </span>
                        )}
                    </div>
                    <CommonButton
                        classStyle={
                            'group mt-ooolab_m_10 w-ooolab_w_15 h-ooolab_h_15 rounded-ooolab_circle shadow-ooolab_login_1 flex justify-center items-center hover:bg-ooolab_blue_0 focus:bg-ooolab_blue_1'
                        }
                        type="circular"
                        loading={isLoading}
                        title="Title"
                        Icon={ArrowIcon}
                    />
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
