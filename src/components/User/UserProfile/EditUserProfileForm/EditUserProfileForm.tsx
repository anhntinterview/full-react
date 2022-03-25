import * as React from 'react';
// PACKAGE
import {useForm} from 'react-hook-form';
// CONST
import {FORM_CONST} from 'constant/form.const';
import {UPDATE_USER_MODALS} from 'constant/modal.const';
import {timezone} from 'constant/timezone.const';
// ASSETS
import default_user from 'assets/SVG/default_user.svg';
// MIDDLWARE
import userMiddlware from 'middleware/user.middleware';
// CONTEXT
import {UpdateUserContext} from 'contexts/User/UserContext';
import {AuthContext} from 'contexts/Auth/AuthContext';
// TYPES
import {AuthLocalStorageType} from 'types/Auth.type';
// ACTIONS
import {SET_AUTH} from 'actions/auth.action';
// UTILS
import {
    isLocalStorageAuth,
    removeLocalStorageAuthData,
} from 'utils/handleLocalStorage';
import {SET_USER} from 'actions/user.action';

export interface EditUserProfileFormProps {
    titleText: string;
    setAuthStorage?: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenEditUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleChangeAvatar(
    setAvatar: React.Dispatch<React.SetStateAction<File | undefined>>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList) return;
        setAvatar(fileList[0]);
    };
}

export function handleChangeName(
    setName: React.Dispatch<React.SetStateAction<string | undefined>>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setName(value);
    };
}

export function handleChangeContactEmail(
    setEmail: React.Dispatch<React.SetStateAction<string | undefined>>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setEmail(value);
    };
}

export function handleChangeStatus(
    setStatus: React.Dispatch<React.SetStateAction<string | undefined>>
) {
    return (event: React.FormEvent<HTMLSelectElement>) => {
        const {value} = event.currentTarget;
        setStatus(value);
    };
}

export function handleChangeTimeZone(
    setTimeZone: React.Dispatch<React.SetStateAction<string | undefined>>
) {
    return (event: React.FormEvent<HTMLSelectElement>) => {
        const {value} = event.currentTarget;
        setTimeZone(value);
    };
}

const EditUserProfileForm: React.FC<EditUserProfileFormProps> = ({
                                                                     titleText,
                                                                     setAuthStorage,
                                                                     setOpenEditUserModal,
                                                                 }) => {
    const customeTimeZone: string[] = [];
    const [updateUserMsg, setUpdateUserMsg] = React.useState<string>();
    const {access_token} = isLocalStorageAuth();
    const {updateUserState, dispatch} = React.useContext(UpdateUserContext);
    const updateUserStateResult = updateUserState.result;
    const updateUserStateError = updateUserState.err;

    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;

    const [avatar, setAvatar] = React.useState<File>();
    const [name, setName] = React.useState<string>();
    const [email, setEmail] = React.useState<string>();
    const [status, setStatus] = React.useState<string>();
    const [timeZone, setTimeZone] = React.useState<string>();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    function onSave() {
        console.log(access_token, name, timeZone);
        if (access_token && name && timeZone) {
            userMiddlware.updateUser(dispatch, {
                access_token,
                name,
                time_zone: timeZone,
            });
        }
    }

    timezone.map((item) => {
        item.utc.map((utcItem) => customeTimeZone.push(utcItem));
    });

    function handleLogout() {
        authDispatch({type: SET_AUTH.LOGOUT});
        removeLocalStorageAuthData();
        if (setAuthStorage) {
            setAuthStorage(isLocalStorageAuth());
        }
    }

    console.log(`updateUserStateResult: `, updateUserStateResult);

    React.useEffect(() => {
        if (updateUserStateResult && updateUserStateResult.id > -1) {
            setUpdateUserMsg(UPDATE_USER_MODALS.titleText);
            dispatch({type: SET_USER.REQ_UPDATE_USER});
            setOpenEditUserModal(false);
            alert(
                'You have just updated your infomation. You need login again to update system'
            );
            handleLogout();
        }
        if (updateUserStateError?.error) {
            setUpdateUserMsg(updateUserStateError.error.description);
        }
    }, [updateUserStateResult?.id, updateUserStateError]);

    return (
        <form onSubmit={handleSubmit(onSave)}>
            <div className="pl-ooolab_p_8 pt-ooolab_p_8">
                <label htmlFor="_editProfile" className="text-ooolab_2xl">
                    {titleText}
                </label>
            </div>
            <div className="p-ooolab_p_8">
                {/* <div className="flex items-center mb-ooolab_m_3">
                    <div className="lg:w-1/5">
                        <div className="w-ooolab_min_w_4">
                            <img src={default_user} alt="_defeaultUser" />
                        </div>
                    </div>
                    <div className="flex flex-col w-2/5 ">
                        <input
                            type="file"
                            className="form-input w-full px-ooolab_p_4 py-ooolab_p_3 rounded-2xl border border-ooolab_gray_3 focus:ring-0 focus:outline-none"
                            {...register('avatar', {
                                required: true,
                            })}
                            name="avatar"
                            onChange={handleChangeAvatar(setAvatar)}
                        />
                        {errors.avatar && errors.avatar.type === 'required' && (
                            <span className="text-red-500 block ml-ooolab_m_5 mt-ooolab_m_2">
                                {FORM_CONST.IS_REQUIRED}
                            </span>
                        )}
                    </div>
                </div> */}
                <div className="flex items-center mb-ooolab_m_3">
                    <label htmlFor="_name" className="lg:w-1/5">
                        Name
                    </label>
                    <div className="flex flex-col lg:w-4/5 ">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="form-input w-full px-ooolab_p_4 py-ooolab_p_3 rounded-2xl border border-ooolab_gray_3 focus:ring-0 focus:outline-none"
                            {...register('name', {
                                required: true,
                            })}
                            name="name"
                            onChange={handleChangeName(setName)}
                        />
                        {errors.name && errors.name.type === 'required' && (
                            <span className="text-red-500 block  ml-ooolab_m_5 mt-ooolab_m_2">
                                {FORM_CONST.IS_REQUIRED}
                            </span>
                        )}
                    </div>
                </div>
                {/* <div className="flex items-center mb-ooolab_m_3">
                    <label htmlFor="_email" className="lg:w-1/5">
                        Email
                    </label>
                    <div className="flex flex-col lg:w-4/5 ">
                        <input
                            type="text"
                            placeholder="Enter your email"
                            className="form-input w-full px-ooolab_p_4 py-ooolab_p_3 rounded-2xl border border-ooolab_gray_3 focus:bg-white focus:outline-none focus:ring-0"
                            {...register('email', {
                                required: true,
                                pattern: FORM_CONST.EMAIL_REGEX,
                            })}
                            name="email"
                            onChange={handleChangeContactEmail(setEmail)}
                        />
                        {errors.email && errors.email.type === 'required' && (
                            <span className="text-red-500 ml-ooolab_m_5 mt-ooolab_m_2">
                                {FORM_CONST.IS_REQUIRED}
                            </span>
                        )}
                        {errors.email && errors.email.type === 'pattern' && (
                            <span className="text-red-500 ml-ooolab_m_5 mt-ooolab_m_2">
                                {FORM_CONST.EMAIL_VALIDATE}
                            </span>
                        )}
                    </div>
                </div> */}
                {/* <div className="flex items-center mb-ooolab_m_3">
                    <label htmlFor="_status" className="lg:w-1/5">
                        Status
                    </label>
                    <div className="flex flex-col lg:w-4/5 ">
                        <select
                            className="text-ooolab_green_0 border border-ooolab_gray_2 rounded-2xl w-full px-ooolab_p_4 py-ooolab_p_3"
                            onChange={handleChangeStatus(setStatus)}
                            value={status}
                        >
                            <option className="font-bold" value="Activated">
                                Activated
                            </option>
                            <option className="font-bold" value="Inactivated">
                                Inactivated
                            </option>
                        </select>
                    </div>
                </div> */}
                <div className="flex items-center mb-ooolab_m_3">
                    <label htmlFor="_status" className="lg:w-1/5">
                        Time zone
                    </label>
                    <div className="flex flex-col lg:w-4/5 ">
                        <select
                            className="text-ooolab_green_0 border border-ooolab_gray_2 rounded-2xl w-full px-ooolab_p_4 py-ooolab_p_3"
                            onChange={handleChangeTimeZone(setTimeZone)}
                            value={status}
                        >
                            {customeTimeZone.map((item, index) => (
                                <option
                                    key={index}
                                    className="font-bold"
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                    type="submit"
                    className="lg:w-1/5 inline-flex justify-center rounded-2xl border-ooolab_blue_3 border shadow-sm px-4 py-3  border-ooolab_blue_1 text-base font-medium text-ooolab_blue_1 hover:bg-ooolab_blue_1 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    Save
                </button>
            </div>
            {updateUserMsg && (
                <span className="text-red-500 text-ooolab_base">
                    {updateUserMsg}
                </span>
            )}
        </form>
    );
};

export default EditUserProfileForm;
