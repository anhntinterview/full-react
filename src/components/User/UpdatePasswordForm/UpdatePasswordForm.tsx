import * as React from 'react';
// PACKAGE
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
// COMPONENTS
import CommonModals from '../../CommonModals';
// CONSTANTS
import { FORM_CONST } from 'constant/form.const';
// CONTEXTS
import { AuthContext } from 'contexts/Auth/AuthContext';
import { PasswordContext } from 'contexts/Password/PasswordContext';
// MODALS
import { UPDATE_PASSWORD_MODALS } from 'constant/modal.const';

import {
    UpdatePasswordFormProps,
    handleChangeOldPassword,
    handleChangeNewPassword,
    onSubmit,
    handleModalAgree,
} from './UpdatePasswordFormFn';
import CommonButton from '../../CommonButton';

const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({
    storageUserInfo,
}) => {
    const [apiSuccessMsg, setApiSuccessMsg] = React.useState<string>();
    // const history = useHistory();
    // const [isModal, setModal] = React.useState<boolean>(false);
    const { authState } = React.useContext(AuthContext);
    const authStateResult = authState.result;
    const access_token =
        storageUserInfo.access_token || authStateResult?.access_token;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { dispatch, passwordState } = React.useContext(PasswordContext);
    const [apiError, setApiError] = React.useState<string>();
    const [oldPassword, setOldPassword] = React.useState<string>();
    const [newPassword, setNewPassword] = React.useState<string>();
    const { isLoading, err, valErr } = passwordState;
    const passwordResult = passwordState.result;

    React.useEffect(() => {
        if (passwordResult?.email && passwordResult.id) {
            setApiSuccessMsg('Upload successfully!');
            // setModal(true);
        }
        if (err) {
            setApiError(err.error.description);
        }
        if (valErr) {
            setApiError(valErr.validation_error.body_params[0].msg);
        }
    }, [passwordResult || err || valErr]);

    console.log(`passwordState: `, passwordState);
    console.log(`isLoading: `, isLoading);

    return (
        <div className="flex justify-center items-center h-ooolab_body_3 sm:h-4/5 lg:h-ooolab_body_1 my-5 ooolab_ipad_portrait:h-ooolab_body_1 relative">
            <form
                className="xl:w-1/3 lg:w-1/3 md:w-1/3 w-9/12 h-4/5"
                onSubmit={handleSubmit(
                    onSubmit(oldPassword, newPassword, access_token, dispatch)
                )}
            >
                <div>
                    <label className="block text-ooolab_gray_5 font-bold text-xl mb-ooolab_m_5 md:text-ooolab_4xl">
                        Update password
                    </label>
                    <span className="block  text-ooolab_gray_4 font-normal mt-ooolab_m_2 text-xs md:text-sm mb-2  xl:text-ooolab_sm  md:mt-ooolab_m_2">
                        Please create a login password to be secured. We
                        recommend you should not skip this step.
                    </span>
                    <div className="bg-ooolab_gray_7 mt-ooolab_m_6 rounded-lg">
                        <input
                            type="password"
                            {...register('oldPassword', {
                                required: true,
                                pattern: FORM_CONST.PASSWORD_REGEX,
                            })}
                            name="oldPassword"
                            onChange={handleChangeOldPassword(
                                setOldPassword,
                                setApiError,
                                errors
                            )}
                            placeholder="Enter your old password"
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 border focus:border-blue-500 focus:bg-white focus:outline-none"
                        />
                        {errors.oldPassword &&
                            errors.oldPassword.type === 'required' && (
                                <span className="text-red-500">
                                    {FORM_CONST.IS_REQUIRED}
                                </span>
                            )}
                        {errors.oldPassword &&
                            errors.oldPassword.type === 'pattern' && (
                                <span className="text-red-500">
                                    {FORM_CONST.PASSWORD_VALIDATE}
                                </span>
                            )}
                        <span className="block mt-ooolab_m_2 text-ooolab_gray_4 font-normal italic text-xs mb-3 xl:text-ooolab_xs px-3 pb-3">
                            {`Please use at least 8 characters. Don't use
            passwords for other sites or obvious content like
            your pet's name.`}
                        </span>
                    </div>
                    <input
                        type="password"
                        {...register('newPassword', {
                            required: true,
                            pattern: FORM_CONST.PASSWORD_REGEX,
                        })}
                        name="newPassword"
                        onChange={handleChangeNewPassword(
                            setNewPassword,
                            setApiError,
                            errors
                        )}
                        placeholder="Confirm your new password"
                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-ooolab_m_6 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                    {errors.newPassword &&
                        errors.newPassword.type === 'required' && (
                            <span className="text-red-500">
                                {FORM_CONST.IS_REQUIRED}
                            </span>
                        )}
                    {errors.newPassword &&
                        errors.newPassword.type === 'pattern' && (
                            <span className="text-red-500">
                                {FORM_CONST.PASSWORD_VALIDATE}
                            </span>
                        )}
                    {apiError && (
                        <span className="text-red-500">{apiError}</span>
                    )}
                </div>
                <CommonButton
                    classStyle={
                        'w-full block bg-ooolab_blue_1 text-white rounded-lg px-ooolab_p_4 py-ooolab_p_3 mt-ooolab_m_2 flex justify-center'
                    }
                    type="circular"
                    loading={isLoading}
                    title="Update password"
                />

                <Link
                    to="/workspace/create"
                    className="mt-ooolab_m_4 w-full block bg-white text-gray-900 rounded-lg px-4 py-3 border border-gray-300 border-none text-center"
                >
                    <span className="ml-4 text-ooolab_blue_1">
                        {apiSuccessMsg
                            ? 'Back to list of workspce'
                            : 'Skip updating password'}
                    </span>
                </Link>
                {apiSuccessMsg && (
                    <span className="text-green-500 w-full text-center block">
                        {apiSuccessMsg}
                    </span>
                )}
            </form>
        </div>
    );
};

export default UpdatePasswordForm;
