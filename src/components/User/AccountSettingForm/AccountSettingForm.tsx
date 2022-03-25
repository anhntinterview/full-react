import * as React from 'react';
// PACKAGES
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Menu, Transition } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// UTILS
import {
    getLocalStorageAuthData,
    setStorageAuthApiData,
} from 'utils/handleLocalStorage';
// ASSETS
import ArrowDown from 'assets/SVG/arrow_down.svg';
// LOGIC
import { formatTimezone, saveUserInfoChanges } from './AccountSettingFormFn';
// CONSTANTS
import { timezone } from 'constant/timezone.const';
import { countryAndLanguage } from 'constant/i18n.const';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'components/Modal';
import CancelImage from 'assets/SVG/cancel.svg';
import SaveChanges from 'assets/SVG/save-changes.svg';
import { UpdateUserContext, UserContext } from 'contexts/User/UserContext';
import { SET_REGISTER } from 'actions/auth.action';
import ChangePasswordModal from './ChangePasswordModal/ChangePasswordModal';
import UpdateAvatarModal from './UpdateAvatarModal';
import SavingChangesModal from './SavingChangesModal/SavingChangesModal';
import PasswordProvider from 'contexts/Password/PasswordProvider';
import SaveSuccessModal from './SaveSuccesModal/SaveSuccessModal';
import UpdateUserProvider from 'contexts/User/UpdateUserProvider';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import userMiddleware from 'middleware/user.middleware';
import dayjs from 'dayjs';
import Select, { StylesConfig } from 'react-select';
import { SET_USER } from 'actions/user.action';

const customSelectStyle: StylesConfig<any, true> = {
    clearIndicator: (base) => ({ ...base, display: 'none' }),
    indicatorSeparator: (base) => ({ ...base, display: 'none' }),
    control: (base) => {
        return {
            ...base,
            borderColor: '#8F90A6',
            padding: `calc(8 * (100vw/ 1440)) calc(12* (100vw/ 1440))`,
        };
    },
    valueContainer: (base) => ({
        ...base,
        padding: 0,
        fontSize: 'calc(14* (100vw/ 1440))',
        lineHeight: 'calc(24* (100vw/ 1440))',
    }),
    indicatorsContainer: (base, { selectProps }) => ({
        ...base,
        transition: 'all 0.3s ease-in-out',
        transform: selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    input: (base) => ({
        ...base,
        padding: 0,
        margin: 0,
    }),
};

const DropdownIndicator = () => (
    <img
        className="w-ooolab_w_5 h-ooolab_h_5 leading-ooolab_24px"
        src={ArrowDown}
        alt=""
    />
);

export interface AccountSettingFormProps {}

export function openAvatarModal(
    setOpenUpdateAvatarModal: React.Dispatch<
        React.SetStateAction<boolean | undefined>
    >
) {
    return () => {
        setOpenUpdateAvatarModal(true);
    };
}

const AccountSettingForm: React.FC<AccountSettingFormProps> = () => {
    const [
        openUpdateAvatarModal,
        setOpenUpdateAvatarModal,
    ] = React.useState<boolean>();
    const { t: translator } = useTranslation();
    const userInfo = getLocalStorageAuthData();
    const {
        userState: { result: userInformation },
        dispatch: UserDispatch,
    } = React.useContext(UserContext);

    useEffect(() => {
        userMiddleware.getUser(UserDispatch);
    }, []);

    return (
        <div className={'h-full px-ooolab_p_10 py-ooolab_p_8'}>
            <div
                className={
                    'flex flex-col items-start h-full overflow-y-scroll bg-white shadow-ooolab_box_shadow_container_2 rounded-ooolab_radius_20px px-ooolab_p_17 py-ooolab_p_8'
                }
            >
                <label
                    className={
                        'text-ooolab_xl font-semibold leading-ooolab_28px text-ooolab_dark_1'
                    }
                >
                    {translator('ACCOUNT_SETTING.ACCOUNT_SETTINGS')}
                </label>
                <div className={'flex flex-col items-start space-y-8'}>
                    <UserProfileForm />
                    <div className={'h-0.5 bg-ooolab_border_logout w-full'} />
                    <PasswordForm />
                    <div className={'h-0.5 bg-ooolab_border_logout w-full'} />
                    <UpdateUserProvider>
                        <PreferencesForm />
                    </UpdateUserProvider>
                    {/*<div className={'h-0.5 bg-ooolab_border_logout w-full'}/>
                    <DeleteAccountForm/>*/}
                </div>
            </div>
        </div>
    );
};

const PreferencesForm: React.FC<{}> = () => {
    const { t: translator } = useTranslation();
    const { dispatch, updateUserState } = React.useContext(UpdateUserContext);
    const {
        dispatch: userDispatch,
        userState: { result: userInformation },
    } = React.useContext(UserContext);
    const { result, err, isLoading } = updateUserState;
    const [apiError, setApiError] = React.useState<string>();
    const [languageList, setLanguageList] = React.useState<
        { name: string; locale: string }[]
    >();
    const { language, country, first_name, last_name } = userInformation;
    const [locale, setLocale] = useState<string | undefined>(language);
    const [localName, setLocaleName] = useState<string | undefined>('');
    const [timeZone, setTimeZone] = React.useState<{
        label: string;
        value: string;
    }>(undefined);
    const [
        isShowSaveChangeSuccessModal,
        showSaveChangesSuccessModal,
    ] = useState(false);

    const customTimeZone: { value: string; label: string }[] = [];
    timezone.map((item) => {
        customTimeZone.push({
            label: item.text,
            value: item.utc[0],
        });
    });

    const [saved, setSavedState] = useState(true);
    const [isShowCancelModal, showCancelModal] = useState(false);
    const [isShowConfirmChangesModal, showConfirmChangeModal] = useState(false);

    function saveChanges() {
        setSavedState(true);
        showConfirmChangeModal(false);
        saveUserInfoChanges(
            {
                country: country,
                first_name: first_name,
                language: locale,
                last_name: last_name,
                time_zone: timeZone.value ?? 'Asia/Ho_Chi_Minh',
            },
            dispatch
        )();
    }

    function discardChanges() {
        setLocale(language);
        const formattedTimezone = formatTimezone(userInformation.time_zone);
        setTimeZone(formattedTimezone);
        setSavedState(true);
        showCancelModal(false);
    }

    function mappingLanguageName() {
        const _localeName = languageList?.find(
            (value) => value.locale === locale
        );
        if (locale && _localeName) {
            setLocaleName(_localeName.name);
        }
    }

    useEffect(() => {
        const hasChanges =
            locale !== language ||
            timeZone?.value !== userInformation?.time_zone;
        if (hasChanges) {
            setSavedState(false);
        } else setSavedState(true);
        mappingLanguageName();
    }, [locale, timeZone]);

    useEffect(() => {
        if (userInformation?.time_zone) {
            const formattedTimezone = formatTimezone(userInformation.time_zone);

            setTimeZone(formattedTimezone);
        }
        if (userInformation?.language) {
            setLocale(userInformation.language);
        }
    }, [userInformation]);

    React.useEffect(() => {
        setLanguageList(
            countryAndLanguage.languages.map((item) => {
                return {
                    name: item.name,
                    locale: item.code,
                };
            })
        );

        return () => {
            setSavedState(true);
        };
    }, []);

    useEffect(() => {
        mappingLanguageName();
    }, [languageList]);

    useEffect(() => {
        if (result && !isLoading) {
            setLocale(result.language);
            i18n.changeLanguage(result.language).then();
            showSaveChangesSuccessModal(true);
            userDispatch({
                type: SET_USER.REQ_USER_SUCCESS,
                result,
            });
            setStorageAuthApiData({
                ...getLocalStorageAuthData(),
                defaultPassword: false,
                language: result.language,
                time_zone: result.time_zone,
            });
        }
        if (err?.error) {
            setApiError(err.error.description);
        }
        dispatch({ type: SET_REGISTER.REQ_RESET_RESULT });
    }, [isLoading, result, err]);

    return (
        <>
            <div
                className={'mt-ooolab_m_5 flex flex-row justify-between w-full'}
            >
                <label
                    className={
                        'text-ooolab_base leading-ooolab_22px font-normal text-ooolab_dark_1 w-1/3'
                    }
                >
                    {translator('ACCOUNT_SETTING.PREFERENCES')}
                </label>
                <div className={'flex flex-row justify-between w-3/5'}>
                    <div
                        className={'flex flex-col items-start w-full space-y-6'}
                    >
                        <div
                            className={
                                'flex flex-row items-start w-full space-x-6'
                            }
                        >
                            <div className={'flex flex-col items-start w-1/2'}>
                                <label
                                    className={
                                        'font-medium text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mb-ooolab_m_1'
                                    }
                                >
                                    {translator('ACCOUNT_SETTING.LANGUAGE')}
                                </label>
                                <Menu
                                    as="div"
                                    className="relative inline-block text-left w-full"
                                >
                                    <Menu.Button className="justify-between bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 flex items-center relative rounded-ooolab_radius_4px border border-ooolab_dark_1 py-ooolab_p_2 px-ooolab_p_3 w-full text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_1">
                                        {localName || 'Language'}
                                        <img
                                            src={ArrowDown}
                                            alt={'_arrowDown'}
                                            className="h-ooolab_h_5 w-ooolab_w_5"
                                        />
                                    </Menu.Button>

                                    <Transition
                                        as={'div'}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                        className={
                                            'max-h-ooolab_h_36 flex flex-col overflow-y-scroll origin-top-right absolute z-10 left-0 mt-ooolab_m_2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                                        }
                                    >
                                        <Menu.Items>
                                            <div className="py-1">
                                                {languageList?.map(
                                                    (item, index) => {
                                                        return (
                                                            <Menu.Item
                                                                key={index}
                                                                onClick={() =>
                                                                    setLocale(
                                                                        item.locale
                                                                    )
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                }) => (
                                                                    <label
                                                                        className={`block px-4 py-2 text-sm ${
                                                                            active
                                                                                ? 'bg-gray-100 text-gray-900'
                                                                                : 'text-gray-700'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </label>
                                                                )}
                                                            </Menu.Item>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                            <div className={'flex flex-col items-start w-1/2'}>
                                {/*todo comment temporarily because of no planning for this*/}
                                {/*<label*/}
                                {/*    className={'font-medium text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mb-ooolab_m_1'}>*/}
                                {/*    Date Format*/}
                                {/*</label>*/}
                                {/*<input*/}
                                {/*    className={'rounded-ooolab_radius_4px border border-ooolab_dark_1 py-ooolab_p_2 px-ooolab_p_3 w-full text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_1'}*/}
                                {/*/>*/}
                                <label
                                    className={
                                        'font-medium text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mb-ooolab_m_1'
                                    }
                                >
                                    {translator('ACCOUNT_SETTING.TIME_ZONE')}
                                </label>
                                <Select
                                    styles={customSelectStyle}
                                    className="w-full"
                                    options={customTimeZone}
                                    onChange={(val: any) => setTimeZone(val)}
                                    value={timeZone}
                                    components={{ DropdownIndicator }}
                                    menuPlacement="top"
                                />
                                {/* <Menu
                                    as="div"
                                    className="relative inline-block text-left w-full"
                                >
                                    <div>
                                        <Menu.Button className="justify-between bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 flex items-center relative rounded-ooolab_radius_4px border border-ooolab_dark_1 py-ooolab_p_2 px-ooolab_p_3 w-full text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_1">
                                            {timeZone ??
                                                translator(
                                                    'ACCOUNT_SETTING.TIME_ZONE'
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
                                                {customTimeZone.map(
                                                    (item, index) => (
                                                        <Menu.Item
                                                            key={index}
                                                            onClick={() =>
                                                                setTimeZone(
                                                                    item
                                                                )
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
                                                                    {item}
                                                                </label>
                                                            )}
                                                        </Menu.Item>
                                                    )
                                                )}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu> */}
                            </div>
                        </div>

                        {apiError && <ApiErrorText apiError={apiError} />}
                        {!saved && (
                            <ModifyActionComponent
                                onSaveChanges={() =>
                                    showConfirmChangeModal(true)
                                }
                                onCancel={() => showCancelModal(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
            <SavingChangesModal isLoading={isLoading} />
            <SaveSuccessModal
                isSuccess={isShowSaveChangeSuccessModal}
                onClose={() => showSaveChangesSuccessModal(false)}
            />
            {isShowConfirmChangesModal && (
                <ConfirmChangesModal
                    onClose={() => showConfirmChangeModal(false)}
                    onSaveChanges={() => saveChanges()}
                />
            )}
            {isShowCancelModal && (
                <CancelModal
                    onClose={() => showCancelModal(false)}
                    onDiscard={() => discardChanges()}
                />
            )}
        </>
    );
};

const PasswordForm: React.FC<{}> = () => {
    const { t: translator } = useTranslation();
    const [isShowChangePasswordModal, showChangePasswordModal] = useState(
        false
    );
    const [
        isShowSaveChangeSuccessModal,
        showSaveChangesSuccessModal,
    ] = useState(false);
    return (
        <>
            <div
                className={'mt-ooolab_m_5 flex flex-row justify-between w-full'}
            >
                <label
                    className={
                        'text-ooolab_base leading-ooolab_22px font-normal text-ooolab_dark_1 w-1/3'
                    }
                >
                    {translator('ACCOUNT_SETTING.PASSWORD')}
                </label>
                <div className={'flex flex-row justify-between w-3/5'}>
                    <label
                        className={
                            'text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_2'
                        }
                    >
                        {translator('ACCOUNT_SETTING.SET_A_UNIQUE_PASSWORD')}
                    </label>
                    <button
                        className={
                            'text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_blue_1 underline'
                        }
                        onClick={() => showChangePasswordModal(true)}
                    >
                        {translator('ACCOUNT_SETTING.CHANGE_PASSWORD')}
                    </button>
                </div>
            </div>
            {isShowChangePasswordModal && (
                <PasswordProvider>
                    <ChangePasswordModal
                        onClose={() => showChangePasswordModal(false)}
                        onUpdateSuccess={() => {
                            showChangePasswordModal(false);
                            showSaveChangesSuccessModal(true);
                        }}
                    />
                </PasswordProvider>
            )}
            <SaveSuccessModal
                isSuccess={isShowSaveChangeSuccessModal}
                onClose={() => showSaveChangesSuccessModal(false)}
            />
        </>
    );
};
const UserProfileForm: React.FC<{}> = ({}) => {
    const { t: translator } = useTranslation();
    const { dispatch, updateUserState } = React.useContext(UpdateUserContext);
    const {
        userState: { result: userInformation },
        dispatch: UserDispatch,
    } = React.useContext(UserContext);
    const { result, err, isLoading } = updateUserState;
    const [apiError, setApiError] = React.useState<string>();
    // const {
    //     access_token,
    //     avatar_url,
    //     first_name,
    //     last_name,
    //     email,
    //     dob,
    //     country,
    //     language,
    //     time_zone,
    // } = getLocalStorageAuthData();
    const [initialBirthday, setInitialBirthday] = useState(
        userInformation?.dob ? new Date(userInformation.dob) : null
    );

    const {
        register,
        setValue,
        handleSubmit,
        getValues,
        reset,
        formState: { errors, dirtyFields },
        control,
    } = useForm({
        defaultValues: React.useMemo(() => {
            return {
                ...userInformation,
            };
        }, [userInformation]),
    });

    useEffect(() => {
        reset(userInformation);
    }, [userInformation]);

    const [birthDay, setBirthday] = useState(initialBirthday);
    const [saved, setSavedState] = useState(true);
    const [isShowCancelModal, showCancelModal] = useState(false);
    const [isShowConfirmChangesModal, showConfirmChangeModal] = useState(false);
    const [isShowUpdateAvatarModal, showUpdateAvatarModal] = useState(false);
    const [
        isShowSaveChangeSuccessModal,
        showSaveChangesSuccessModal,
    ] = useState(false);

    function saveChanges() {
        const formValues = getValues();
        showConfirmChangeModal(false);
        saveUserInfoChanges(
            {
                country: userInformation.country,
                first_name: formValues['first_name']?.trim(),
                language: '',
                last_name: formValues['last_name']?.trim(),
                time_zone: userInformation?.time_zone || 'Asia/Ho_Chi_Minh',
                dob: formValues['dob'],
            },
            dispatch
        )();
    }

    const discardChanges = React.useCallback(() => {
        // setBirthday(initialBirthday);
        // setValue('first_name', first_name);
        // setValue('last_name', last_name);
        // setSavedState(true);
        showCancelModal(false);
        reset(userInformation);
    }, [userInformation]);

    // useEffect(() => {
    //     const hasChanges =
    //         birthDay?.getTime() !== initialBirthday?.getTime() ||
    //         first_name?.trim() !== getValues('first_name')?.trim() ||
    //         last_name?.trim() !== getValues('last_name')?.trim();
    //     if (hasChanges) {
    //         setSavedState(false);
    //     }
    // }, [
    //     birthDay,
    //     getValues('first_name')?.trim(),
    //     getValues('last_name')?.trim(),
    // ]);

    useEffect(() => {
        if (result && !isLoading) {
            // setStorageAuthApiData({
            //     ...getLocalStorageAuthData(),
            //     defaultPassword: false,
            //     dob: result.dob,
            //     first_name: result.first_name,
            //     last_name: result.last_name,
            //     display_name: result.display_name,
            // });
            setSavedState(true);
            userMiddleware.getUser(UserDispatch);
            showSaveChangesSuccessModal(true);
        }
        if (err?.error) {
            setApiError(err.error.description);
        }

        dispatch({ type: SET_REGISTER.REQ_RESET_RESULT });
    }, [isLoading, result]);

    return (
        <>
            <div className={'mt-ooolab_m_5 flex flex-row justify-between'}>
                <div className={'flex flex-col w-1/3'}>
                    <label
                        className={
                            'text-ooolab_base leading-ooolab_22px font-normal text-ooolab_dark_1'
                        }
                    >
                        {translator('ACCOUNT_SETTING.USER_PROFILE')}
                    </label>
                    <label
                        className={
                            'text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_1'
                        }
                    >
                        {translator(
                            'ACCOUNT_SETTING.YOUR_USER_PROFILE_INFORMATION_WILL_BE_ACCESSIBLE'
                        )}
                    </label>
                </div>
                <div className={'flex flex-col items-start w-3/5'}>
                    <label
                        className={
                            'text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_2'
                        }
                    >
                        {translator('ACCOUNT_SETTING.PROFILE_PHOTO')}
                    </label>
                    <div
                        className={'flex flex-col items-start w-full space-y-6'}
                    >
                        <div
                            className={
                                'flex flex-row items-center mt-ooolab_m_2'
                            }
                        >
                            <img
                                src={userInformation?.avatar_url}
                                alt={'_avatar'}
                                className={
                                    'block rounded-ooolab_circle h-20 w-20 object-cover'
                                }
                            />
                            <div
                                className={
                                    'flex flex-col ml-ooolab_m_6 items-start'
                                }
                            >
                                <button
                                    className={
                                        'rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium'
                                    }
                                    onClick={() => showUpdateAvatarModal(true)}
                                >
                                    {translator(
                                        'ACCOUNT_SETTING.UPLOAD_AN_IMAGE'
                                    )}
                                </button>
                                <label
                                    className={
                                        'text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mt-ooolab_m_2'
                                    }
                                >
                                    {translator(
                                        'ACCOUNT_SETTING.UPLOADS_MUST_BE_IN_EITHER_JPG_OR_PNG_FORMATS'
                                    )}
                                </label>
                            </div>
                        </div>
                        <div
                            className={'h-0.5 bg-ooolab_border_logout w-full'}
                        />
                        <form
                            className={
                                'flex flex-col items-start w-full space-y-6'
                            }
                            onSubmit={handleSubmit(() =>
                                showConfirmChangeModal(true)
                            )}
                        >
                            <div
                                className={
                                    'flex flex-row items-start w-full space-x-6'
                                }
                            >
                                <div
                                    className={
                                        'flex flex-col items-start w-1/2'
                                    }
                                >
                                    <label
                                        className={
                                            'font-medium text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mb-ooolab_m_1'
                                        }
                                    >
                                        {translator(
                                            'ACCOUNT_SETTING.FIRST_NAME'
                                        )}
                                        <span className={'text-ooolab_error'}>
                                            {' '}
                                            *
                                        </span>
                                    </label>
                                    <input
                                        className={
                                            'rounded-ooolab_radius_4px border border-ooolab_dark_1 py-ooolab_p_2 px-ooolab_p_3 w-full text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_1'
                                        }
                                        // defaultValue={
                                        //     userInformation?.first_name || null
                                        // }
                                        {...register('first_name', {
                                            required: true,
                                            // setValueAs: (value) =>
                                            //     value?.trim(),
                                        })}
                                        // onChange={handleFirstNameChange(
                                        //     setValue,
                                        //     errors,
                                        //     trigger
                                        // )}
                                    />
                                    {errors?.first_name?.type ===
                                        'required' && (
                                        <ApiErrorText
                                            apiError={translator(
                                                'FORM_CONST.REQUIRED_FIELD'
                                            )}
                                        />
                                    )}
                                </div>
                                <div
                                    className={
                                        'flex flex-col items-start w-1/2'
                                    }
                                >
                                    <label
                                        className={
                                            'font-medium text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mb-ooolab_m_1'
                                        }
                                    >
                                        {translator(
                                            'ACCOUNT_SETTING.LAST_NAME'
                                        )}
                                        <span className={'text-ooolab_error'}>
                                            {' '}
                                            *
                                        </span>
                                    </label>
                                    <input
                                        className={
                                            'rounded-ooolab_radius_4px border border-ooolab_dark_1 py-ooolab_p_2 px-ooolab_p_3 w-full text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_1'
                                        }
                                        // defaultValue={
                                        //     userInformation?.last_name
                                        // }
                                        {...register('last_name', {
                                            required: true,
                                            setValueAs: (value) =>
                                                value?.trim(),
                                        })}
                                        // onChange={handleLastNameChange(
                                        //     setValue,
                                        //     errors,
                                        //     trigger
                                        // )}
                                    />
                                    {errors?.last_name?.type === 'required' && (
                                        <ApiErrorText
                                            apiError={translator(
                                                'FORM_CONST.REQUIRED_FIELD'
                                            )}
                                        />
                                    )}
                                </div>
                            </div>
                            <div
                                className={
                                    'flex flex-row items-start w-full space-x-6'
                                }
                            >
                                <div
                                    className={
                                        'flex flex-col items-start w-1/2'
                                    }
                                >
                                    <label
                                        className={
                                            'font-medium text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mb-ooolab_m_1'
                                        }
                                    >
                                        {translator('ACCOUNT_SETTING.BIRTHDAY')}
                                    </label>
                                    {/* <DatePicker
                                        selected={birthDay}
                                        onChange={(date: Date) =>
                                            setBirthday(date)
                                        }
                                        placeholderText={'DD/MM/YYYY'}
                                        dateFormat={'dd/MM/yyyy'}
                                        maxDate={new Date()}
                                        className={
                                            'rounded-ooolab_radius_4px border border-ooolab_dark_1 py-ooolab_p_2 px-ooolab_p_3 w-full text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_1'
                                        }
                                    /> */}
                                    <Controller
                                        control={control}
                                        name="dob"
                                        render={({
                                            field: {
                                                onChange,
                                                onBlur,
                                                value,
                                                name,
                                                ref,
                                            },
                                        }) => {
                                            return (
                                                <DatePicker
                                                    ref={ref}
                                                    placeholderText={
                                                        'YYYY-MM-DD'
                                                    }
                                                    dateFormat={'yyyy/MM/dd'}
                                                    maxDate={new Date()}
                                                    selected={
                                                        value
                                                            ? new Date(value)
                                                            : null
                                                    }
                                                    onChange={(e) => {
                                                        const dateValue = dayjs(
                                                            e.toString()
                                                        );
                                                        onChange(
                                                            dateValue.format(
                                                                'YYYY-MM-DD'
                                                            )
                                                        );
                                                        // if (
                                                        //     dayjs(
                                                        //         e.toString()
                                                        //     ).isValid()
                                                        // ) {
                                                        // onChange(
                                                        //     dateValue.format(
                                                        //         'DD/MM/YYYY'
                                                        //     )
                                                        // );
                                                        // }
                                                    }}
                                                    className={
                                                        'rounded-ooolab_radius_4px border border-ooolab_dark_1 py-ooolab_p_2 px-ooolab_p_3 w-full text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_1'
                                                    }
                                                />
                                            );
                                        }}
                                    />
                                </div>
                                <div
                                    className={
                                        'flex flex-col items-start w-1/2'
                                    }
                                >
                                    <label
                                        className={
                                            'font-medium text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mb-ooolab_m_1'
                                        }
                                    >
                                        {translator(
                                            'ACCOUNT_SETTING.EMAIL_ADDRESS'
                                        )}
                                    </label>
                                    <input
                                        disabled={true}
                                        className={
                                            'rounded-ooolab_radius_4px border border-ooolab_dark_1 py-ooolab_p_2 px-ooolab_p_3 w-full text-ooolab_sm leading-ooolab_24px font-normal text-ooolab_dark_2'
                                        }
                                        defaultValue={userInformation?.email}
                                    />
                                </div>
                            </div>
                            {apiError && <ApiErrorText apiError={apiError} />}
                            {(dirtyFields &&
                                Object.keys(dirtyFields).length && (
                                    <ModifyActionComponent
                                        onCancel={() => showCancelModal(true)}
                                    />
                                )) ||
                                null}
                        </form>
                    </div>
                </div>
            </div>
            <SavingChangesModal isLoading={isLoading} />
            <SaveSuccessModal
                isSuccess={isShowSaveChangeSuccessModal}
                onClose={() => showSaveChangesSuccessModal(false)}
            />
            {isShowConfirmChangesModal && (
                <ConfirmChangesModal
                    onClose={() => showConfirmChangeModal(false)}
                    onSaveChanges={() => saveChanges()}
                />
            )}
            {isShowCancelModal && (
                <CancelModal
                    onClose={() => showCancelModal(false)}
                    onDiscard={() => discardChanges()}
                />
            )}
            {isShowUpdateAvatarModal && (
                <UpdateAvatarModal
                    avatar_url={userInformation.avatar_url}
                    onUpdatedAvatar={() => {
                        showUpdateAvatarModal(false);
                        userMiddleware.getUser(UserDispatch);
                    }}
                    onCancel={() => showUpdateAvatarModal(false)}
                />
            )}
        </>
    );
};

const CancelModal: React.FC<{ onClose: () => void; onDiscard: () => void }> = ({
    onClose,
    onDiscard,
}) => {
    const { t: translator } = useTranslation();
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={translator('MODALS.CONFIRM_CANCEL_MODAL.TITLE_TEXT')}
            imgSrc={CancelImage}
            contentText={translator('MODALS.CONFIRM_CANCEL_MODAL.CONTENT_TEXT')}
            subBtn={
                <button
                    className={
                        'rounded-ooolab_radius_8px bg-white border border-ooolab_dark_2 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-ooolab_dark_1 font-medium'
                    }
                    onClick={onClose}
                >
                    {translator('MODALS.CONFIRM_CANCEL_MODAL.NO_CANCEL')}
                </button>
            }
            mainBtn={
                <button
                    className={
                        'rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium'
                    }
                    onClick={onDiscard}
                >
                    {translator('MODALS.CONFIRM_CANCEL_MODAL.YES_DO_IT')}
                </button>
            }
        />
    );
};

const ConfirmChangesModal: React.FC<{
    onClose: () => void;
    onSaveChanges: () => void;
}> = ({ onClose, onSaveChanges }) => {
    const { t: translator } = useTranslation();
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={translator('MODALS.CONFIRM_SAVE_CHANGE_MODAL.TITLE_TEXT')}
            imgSrc={SaveChanges}
            contentText={translator(
                'MODALS.CONFIRM_SAVE_CHANGE_MODAL.CONTENT_TEXT'
            )}
            subBtn={
                <button
                    className={
                        'rounded-ooolab_radius_8px bg-white border border-ooolab_dark_2 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-ooolab_dark_1 font-medium'
                    }
                    onClick={onClose}
                >
                    {translator('MODALS.CONFIRM_SAVE_CHANGE_MODAL.NO_CANCEL')}
                </button>
            }
            mainBtn={
                <button
                    className={
                        'rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium'
                    }
                    onClick={onSaveChanges}
                >
                    {translator('MODALS.CONFIRM_SAVE_CHANGE_MODAL.YES_DO_IT')}
                </button>
            }
        />
    );
};
const ModifyActionComponent: React.FC<{
    onSaveChanges?: () => void;
    onCancel: () => void;
}> = ({ onSaveChanges, onCancel }) => {
    const { t: translator } = useTranslation();
    return (
        <div className={'flex flex-row justify-end w-full space-x-6'}>
            <button
                type={'reset'}
                className={
                    'rounded-ooolab_radius_8px bg-white border border-ooolab_dark_2 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-ooolab_dark_1 font-medium'
                }
                onClick={onCancel}
            >
                {translator('ACCOUNT_SETTING.CANCEL')}
            </button>
            <button
                type={'submit'}
                className={
                    'rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium'
                }
                onClick={onSaveChanges}
            >
                {translator('ACCOUNT_SETTING.SAVE_CHANGES')}
            </button>
        </div>
    );
};
const DeleteAccountForm: React.FC<{}> = () => {
    return (
        <div className={'mt-ooolab_m_5 flex flex-col w-full'}>
            <div className={'flex flex-row justify-between'}>
                <label
                    className={
                        'text-ooolab_base leading-ooolab_22px font-normal text-ooolab_dark_1'
                    }
                >
                    Delete account
                </label>
                <button
                    className={
                        'rounded-ooolab_radius_8px bg-ooolab_error px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium'
                    }
                    onClick={() => {
                        //todo delete account
                    }}
                >
                    Delete account
                </button>
            </div>
            <label
                className={
                    'font-normal text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px w-1/3 mt-ooolab_m_1'
                }
            >
                <span className={'text-ooolab_error'}>Warning: </span>You will
                not be able to access your account data after you confirm this
                action
            </label>
        </div>
    );
};

const ApiErrorText: React.FC<{ apiError: string }> = ({ apiError }) => {
    return (
        <p className="ooolab_text_base">
            <span className="text-red-500 pt-ooolab_p_2 block">{apiError}</span>
        </p>
    );
};

export default AccountSettingForm;
