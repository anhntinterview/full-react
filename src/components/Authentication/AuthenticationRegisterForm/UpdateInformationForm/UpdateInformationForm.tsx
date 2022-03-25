import * as React from 'react';
// PACKAGE
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
// COMPONENTS
import CommonButton from 'components/CommonButton';
// CONSTANTS
import { FORM_CONST } from 'constant/form.const';
import { ArrowIcon } from 'constant/authNode.const';
import { countryAndLanguage } from 'constant/i18n.const';
// CONTEXT
import { UpdateUserContext } from 'contexts/User/UserContext';
// UTILS
import {
    getLocalStorageAuthData,
    setStorageAuthApiData,
} from 'utils/handleLocalStorage';
// LOGIC
import {
    UpdateInformationProps,
    onSubmit,
    handleChangeFirstName,
    handleChangeLastName,
} from './UpdateInformationFormFn';
// ACTIONS
import { SET_REGISTER } from 'actions/auth.action';
// ASSETS
import Camera from 'assets/SVG/camera.svg';
import ArrowDown from 'assets/SVG/arrow_down.svg';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { handleChangeEmail } from '../../AuthenticationLoginForm/LoginForm/LoginFormFn';

const UpdateInformationForm: React.FC<UpdateInformationProps> = ({}) => {
    const { t: translator } = useTranslation();
    const userInfo = getLocalStorageAuthData();
    const { access_token, avatar_url } = userInfo;
    const history = useHistory();

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
        trigger,
    } = useForm();

    const [apiError, setApiError] = React.useState<string>();
    const { dispatch, updateUserState } = React.useContext(UpdateUserContext);
    const { result, err, isLoading } = updateUserState;
    const [languageList, setLanguageList] = React.useState<string[]>();
    const [countryList, setCountryList] = React.useState<string[]>();
    const [country, setCountry] = React.useState<string>();
    const [language, setLanguage] = React.useState<string>();
    const [avatar, setAvatar] = useState<File>();

    React.useEffect(() => {
        if (result) {
            setStorageAuthApiData({
                ...userInfo,
                defaultPassword: false,
                country: result.country,
                display_name: result.display_name,
                language: result.language,
                first_name: result.first_name,
                last_name: result.last_name,
                time_zone: result.time_zone,
            });
            history.push('/workspace/create');
        }
        if (err) {
            setApiError(err.error?.description);
        }
        dispatch({ type: SET_REGISTER.REQ_RESET_RESULT });
    }, [result]);

    React.useEffect(() => {
        setLanguageList(
            countryAndLanguage.languages.map((item) => {
                return item.name;
            })
        );
        setCountryList(
            countryAndLanguage.countries.map((item) => {
                return item.name;
            })
        );
    }, []);

    return (
        <div className="flex items-center flex-col w-ooolab_w_540px h-full justify-center">
            <form
                className="absolute flex flex-col w-full items-center"
                onSubmit={handleSubmit(
                    onSubmit(
                        {
                            country: country,
                            first_name: getValues('firstName'),
                            language: language,
                            last_name: getValues('lastName'),
                            avatar,
                        },
                        dispatch
                    )
                )}
            >
                <label className="ooolab_text_lg text-ooolab_dark_1 mb-ooolab_m_11">
                    {translator(
                        'AUTHENTICATION.UPDATE_INFORMATION.UPDATE_YOUR_INFORMATION'
                    )}
                </label>
                <div className={'flex flex-row'}>
                    <PhotoComponent onSelectAvatar={setAvatar} />

                    <div className={'flex flex-col ml-ooolab_m_5'}>
                        <div className={'flex flex-row'}>
                            <div
                                className={'flex flex-col justify-start w-full'}
                            >
                                <div className="w-full ooolab_input_1 flex items-center relative">
                                    <input
                                        type="text"
                                        placeholder={`${translator(
                                            'AUTHENTICATION.UPDATE_INFORMATION.FIRST_NAME'
                                        )}`}
                                        className="w-full pl-ooolab_p_5 bg-transparent"
                                        {...register('firstName', {
                                            required: true,
                                            setValueAs: (value: any) =>
                                                value.trim(),
                                        })}
                                        onChange={handleChangeFirstName(
                                            setValue,
                                            trigger,
                                            setApiError
                                        )}
                                    />
                                </div>
                                <p className="ooolab_text_base mt-ooolab_m_2">
                                    {errors?.firstName?.type === 'required' && (
                                        <span className="text-red-500">
                                            {translator(
                                                'FORM_CONST.REQUIRED_FIELD'
                                            )}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div
                                className={
                                    'flex flex-col justify-start w-full  ml-ooolab_m_5'
                                }
                            >
                                <div className="w-full ooolab_input_1 flex items-center relative">
                                    <input
                                        type="text"
                                        placeholder={`${translator(
                                            'AUTHENTICATION.UPDATE_INFORMATION.LAST_NAME'
                                        )}`}
                                        className="w-full pl-ooolab_p_5 bg-transparent"
                                        {...register('lastName', {
                                            required: true,
                                            setValueAs: (value: any) =>
                                                value.trim(),
                                        })}
                                        onChange={handleChangeLastName(
                                            setValue,
                                            trigger,
                                            setApiError
                                        )}
                                    />
                                </div>
                                <p className="ooolab_text_base mt-ooolab_m_2">
                                    {errors?.lastName?.type === 'required' && (
                                        <span className="text-red-500">
                                            {translator(
                                                'FORM_CONST.REQUIRED_FIELD'
                                            )}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className={'flex flex-row mt-ooolab_m_5'}>
                            <Menu
                                as="div"
                                className="relative inline-block text-left w-full"
                            >
                                <div>
                                    <Menu.Button className="inline-flex justify-between w-full  px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 ooolab_input_1 items-center relative pl-ooolab_p_5 pr-ooolab_p_5">
                                        {language ??
                                            translator(
                                                'AUTHENTICATION.UPDATE_INFORMATION.LANGUAGE'
                                            )}
                                        <img
                                            src={ArrowDown}
                                            alt={'_arrowDown'}
                                            className="h-ooolab_h_5 w-ooolab_w_5"
                                        />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={'div'}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                    className={
                                        'h-ooolab_h_36 flex flex-col overflow-y-scroll origin-top-right absolute left-0 mt-ooolab_m_2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                                    }
                                >
                                    <Menu.Items>
                                        <div className="py-1">
                                            {languageList?.map((value) => {
                                                return (
                                                    <Menu.Item
                                                        onClick={() =>
                                                            setLanguage(value)
                                                        }
                                                    >
                                                        {({ active }) => (
                                                            <label
                                                                className={`block px-4 py-2 text-sm ${
                                                                    active
                                                                        ? 'bg-gray-100 text-gray-900'
                                                                        : 'text-gray-700'
                                                                }`}
                                                            >
                                                                {value}
                                                            </label>
                                                        )}
                                                    </Menu.Item>
                                                );
                                            })}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                            <Menu
                                as="div"
                                className="relative inline-block text-left w-full ml-ooolab_m_5"
                            >
                                <div>
                                    <Menu.Button className="inline-flex justify-between w-full px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 ooolab_input_1 items-center relative pl-ooolab_p_5 pr-ooolab_p_5">
                                        {country ??
                                            translator(
                                                'AUTHENTICATION.UPDATE_INFORMATION.COUNTRY'
                                            )}
                                        <img
                                            src={ArrowDown}
                                            alt={'_arrowDown'}
                                            className="h-ooolab_h_5 w-ooolab_w_5"
                                        />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={'div'}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                    className={
                                        'h-ooolab_h_36 flex flex-col overflow-y-scroll origin-top-right absolute left-0 mt-ooolab_m_2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                                    }
                                >
                                    <Menu.Items>
                                        <div className="py-1">
                                            {countryList?.map((value) => {
                                                return (
                                                    <Menu.Item
                                                        onClick={() =>
                                                            setCountry(value)
                                                        }
                                                    >
                                                        {({ active }) => (
                                                            <label
                                                                className={`block px-4 py-2 text-sm ${
                                                                    active
                                                                        ? 'bg-gray-100 text-gray-900'
                                                                        : 'text-gray-700'
                                                                }`}
                                                            >
                                                                {value}
                                                            </label>
                                                        )}
                                                    </Menu.Item>
                                                );
                                            })}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </div>
                <p className="ooolab_text_base">
                    {apiError && (
                        <span className="text-red-500 pt-ooolab_p_2 block">
                            {apiError}
                        </span>
                    )}
                </p>
                <CommonButton
                    classStyle={
                        'group mt-ooolab_m_17 mb-ooola w-ooolab_w_15 h-ooolab_h_15 rounded-ooolab_circle shadow-ooolab_login_1 flex justify-center items-center hover:bg-ooolab_blue_0 focus:bg-ooolab_blue_1'
                    }
                    type="circular"
                    loading={isLoading}
                    title="Update Information"
                    Icon={ArrowIcon}
                />
            </form>
        </div>
    );
};

const PhotoComponent: React.FC<{ onSelectAvatar: (avatar: File) => void }> = ({
    onSelectAvatar,
}) => {
    const [avatar, setAvatar] = useState<File>();

    useEffect(() => {
        if (avatar) {
            onSelectAvatar(avatar);
        }
    }, [avatar]);
    return (
        <div className={'w-ooolab_w_25 h-ooolab_h_25 relative'}>
            <Dropzone
                onDrop={(acceptedFiles) => {
                    if (acceptedFiles && acceptedFiles.length > 0) {
                        setAvatar(acceptedFiles[0]);
                    }
                }}
            >
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                        {...getRootProps()}
                        className={
                            'justify-center flex flex-col w-full h-full items-center absolute rounded-ooolab_circle shadow-ooolab_login_1'
                        }
                    >
                        <input {...getInputProps()} accept={'image/*'} />
                        {avatar ? (
                            <img
                                src={URL.createObjectURL(avatar)}
                                alt={avatar.name}
                                className={
                                    'h-full w-full rounded-ooolab_circle'
                                }
                            />
                        ) : (
                            <img
                                src={`https://ui-avatars.com/api?name=${'Workspace'}&size=92`}
                                alt={'_avatar'}
                                className={
                                    'w-full h-full rounded-ooolab_circle bg-ooolab_light_100'
                                }
                            />
                        )}
                        <div
                            className={
                                'rounded-ooolab_circle bg-white w-ooolab_w_12 h-ooolab_h_12 flex justify-center items-center absolute -right-2 -bottom-2'
                            }
                        >
                            <div
                                className={
                                    'shadow-ooolab_menu rounded-ooolab_circle w-ooolab_w_9 h-ooolab_h_9 flex justify-center items-center'
                                }
                            >
                                <img
                                    src={Camera}
                                    alt={'_camera'}
                                    className={'w-ooolab_w_5 h-ooolab_h_5'}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Dropzone>
        </div>
    );
};

export default UpdateInformationForm;
