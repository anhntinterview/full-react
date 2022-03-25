import * as React from 'react';
// PACKAGE
import OtpInput from 'react-otp-input';
import { useForm } from 'react-hook-form';
// COMPONENTS
import CommonButton from 'components/CommonButton';
// TYPES
import { RegisterVerifyEmailBodyType } from 'types/Register.type';
import { InputOtp } from 'types/Auth.type';
// CONSTANTS
import { ArrowIcon, CircleCheckIcon } from 'constant/authNode.const';
// CONTEXT
import { AuthContext } from 'contexts/Auth/AuthContext';
import { RegisterContext } from 'contexts/Auth/RegisterContext';
// UTILS
import { setStorageAuthApiData } from 'utils/handleLocalStorage';
// LOGIC
import { SendCodeFromEmailProps, onSubmit } from './SendCodeToEmailFormFn';
// STATE
import { initInputOtp } from 'state/Auth/auth.state';
import { Trans, useTranslation } from 'react-i18next';
import registerMiddleware from '../../../../middleware/register.middleware';

const SendCodeFromEmailForm: React.FC<SendCodeFromEmailProps> = ({
    setEmailVerified,
}) => {
    const { t: translator } = useTranslation();
    const [inputOtp, setInputOtp] = React.useState<InputOtp>(initInputOtp);
    const {
        otp,
        numInputs,
        separator,
        isDisabled,
        hasErrored,
        isInputNum,
        isInputSecure,
        placeholder,
    } = inputOtp;

    const [apiError, setApiError] = React.useState<string>();
    const { dispatch, registerState } = React.useContext(RegisterContext);
    const { registerResult, verifyEmailResult, isLoading, err } = registerState;
    const { dispatch: authDispatch } = React.useContext(AuthContext);
    const [
        verifyCodeState,
        setVerifyCodeState,
    ] = React.useState<RegisterVerifyEmailBodyType>();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        clearErrors,
    } = useForm();

    React.useEffect(() => {
        setVerifyCodeState({
            email: registerResult?.email,
            code: '',
        });
    }, []);

    React.useEffect(() => {
        if (verifyEmailResult?.temporary_access_token) {
            setStorageAuthApiData(verifyEmailResult);
            setEmailVerified(true);
        }
        if (err?.error) {
            setApiError(err.error.name || err.error.description);
        }
    }, [verifyEmailResult, err]);

    function handleOtpChange(otp: string) {
        setInputOtp((prevState) => ({
            ...prevState,
            otp,
        }));
        setVerifyCodeState((prevState) => {
            return {
                email: prevState?.email,
                code: otp,
            };
        });
        setApiError(undefined);
        registerMiddleware.clearRegisterErrorState(dispatch);
        clearErrors('verifyCode');
        setValue('verifyCode', otp);
    }

    return (
        <div className="flex items-center flex-col w-full">
            <label className="ooolab_text_lg text-ooolab_dark_1">
                {translator(
                    'AUTHENTICATION.SIGN_UP.VERIFY_EMAIL.VERIFY_YOUR_EMAIL'
                )}
            </label>
            <div className="flex flex-col items-start w-full mt-ooolab_m_36px">
                <label className="ooolab_text_base text-ooolab_dark_1 text-center">
                    <Trans
                        i18nKey={
                            'AUTHENTICATION.SIGN_UP.VERIFY_EMAIL.ENTER_THE_6_DIGIT_VERIFICATION_CODE_SENT_TO_EMAIL'
                        }
                        tOptions={{ email: registerResult?.email }}
                        components={{
                            1: (
                                <strong className="text-ooolab_blue_1 font-medium" />
                            ),
                        }}
                    />
                </label>
            </div>
            <form
                className="flex flex-col mt-ooolab_m_3 w-full items-center"
                onSubmit={handleSubmit(
                    onSubmit(verifyCodeState, dispatch, authDispatch)
                )}
            >
                <div className={'flex flex-row justify-center items-center'}>
                    <OtpInput
                        inputStyle="ooolab_input_otp"
                        numInputs={numInputs}
                        isDisabled={isDisabled}
                        hasErrored={hasErrored}
                        errorStyle="error"
                        onChange={handleOtpChange}
                        separator={<span>{separator}</span>}
                        isInputNum={isInputNum}
                        isInputSecure={isInputSecure}
                        shouldAutoFocus
                        value={otp}
                        placeholder={placeholder}
                    />
                    {getValues('verifyCode')?.length === 6 && !!apiError ? (
                        <CircleCheckIcon />
                    ) : (
                        <div className={'w-ooolab_w_8 h-ooolab_h_8'} />
                    )}
                </div>
                <input
                    value={otp}
                    type="hidden"
                    placeholder="Enter code from your email"
                    {...register('verifyCode', {
                        required: true,
                        minLength: 6,
                    })}
                    name="verifyCode"
                    className="w-full px-4 py-3 rounded-lg border-ooolab_gray_3 mt-ooolab_m_6 border focus:ring-0  focus:bg-white focus:outline-none"
                />
                <p className="ooolab_text_base">
                    {errors.verifyCode &&
                        errors.verifyCode.type === 'required' && (
                            <span className="text-red-500  pt-ooolab_p_2">
                                {translator('FORM_CONST.REQUIRED_FIELD')}
                            </span>
                        )}
                </p>
                <p className="ooolab_text_base">
                    {errors.verifyCode &&
                        errors.verifyCode.type === 'minLength' && (
                            <span className="text-red-500  pt-ooolab_p_2">
                                {translator('FORM_CONST.MIN_LENGTH')}
                            </span>
                        )}
                </p>
                <p className="ooolab_text_base">
                    {apiError && (
                        <span className="text-red-500 pt-ooolab_p_2 pl-ooolab_p_3 block">
                            {translator(
                                `AUTHENTICATION.SIGN_UP.VERIFY_EMAIL.${apiError}`,
                                { defaultValue: apiError }
                            )}
                        </span>
                    )}
                </p>
                <CommonButton
                    classStyle={
                        'group mt-ooolab_m_17 w-ooolab_w_15 h-ooolab_h_15 rounded-ooolab_circle shadow-ooolab_login_1 flex justify-center items-center hover:bg-ooolab_blue_0 focus:bg-ooolab_blue_1'
                    }
                    type="circular"
                    loading={isLoading}
                    title="Title"
                    Icon={ArrowIcon}
                />
            </form>
        </div>
    );
};

export default SendCodeFromEmailForm;
