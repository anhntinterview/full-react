import React, { useState } from 'react';
// PACKAGES
import { useForm } from 'react-hook-form';
import { XIcon } from '@heroicons/react/outline';
// COMPONENTS
import CommonButton from 'components/CommonButton';
// CONSTANTS
import { FORM_CONST } from 'constant/form.const';
// TYPES
import { MemberType } from 'types/CreateWorkspace.type';
// LOGIC
import {
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberEmail,
    onSubmitForm,
} from './InviteToWorkspaceFormFn';
import { ArrowIcon } from 'constant/authNode.const';
import {
    handleEmail,
    InviteToWorkspaceFormProps,
} from './InviteToWorkspaceFormFn';
import { useTranslation } from 'react-i18next';

const AddAnotherIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.5 3C5.84315 3 4.5 4.34315 4.5 6C4.5 7.65685 5.84315 9 7.5 9C9.15685 9 10.5 7.65685 10.5 6C10.5 4.34315 9.15685 3 7.5 3ZM3 6C3 3.51472 5.01472 1.5 7.5 1.5C9.98528 1.5 12 3.51472 12 6C12 8.48528 9.98528 10.5 7.5 10.5C5.01472 10.5 3 8.48528 3 6ZM14.25 8.25C14.6642 8.25 15 8.58579 15 9V9.75H15.75C16.1642 9.75 16.5 10.0858 16.5 10.5C16.5 10.9142 16.1642 11.25 15.75 11.25H15V12C15 12.4142 14.6642 12.75 14.25 12.75C13.8358 12.75 13.5 12.4142 13.5 12V11.25H12.75C12.3358 11.25 12 10.9142 12 10.5C12 10.0858 12.3358 9.75 12.75 9.75H13.5V9C13.5 8.58579 13.8358 8.25 14.25 8.25ZM4.875 13.5C3.93041 13.5 3 14.4102 3 15.75C3 16.1642 2.66421 16.5 2.25 16.5C1.83579 16.5 1.5 16.1642 1.5 15.75C1.5 13.7761 2.9201 12 4.875 12H10.125C12.0799 12 13.5 13.7761 13.5 15.75C13.5 16.1642 13.1642 16.5 12.75 16.5C12.3358 16.5 12 16.1642 12 15.75C12 14.4102 11.0696 13.5 10.125 13.5H4.875Z"
            fill="#0071CE"
        />
    </svg>
);

const InviteToWorkspaceForm: React.FC<InviteToWorkspaceFormProps> = ({
    isLoading,
    setApiErrorMsg,
    access_token,
    dispatch,
    setApiSuccessMsg,
    workspaceName,
    avatar,
}) => {
    const { t: translator } = useTranslation();
    const [listMember, setListMember] = useState<MemberType[]>([]);
    const { handleSubmit } = useForm();

    return (
        <>
            <form
                onSubmit={handleSubmit(
                    onSubmitForm(
                        listMember,
                        setApiErrorMsg,
                        access_token,
                        dispatch,
                        setApiSuccessMsg,
                        workspaceName,
                        avatar
                    )
                )}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        return;
                    }
                }}
                className="w-full flex flex-col items-center animate-ooolab_fade_in"
            >
                <label
                    className={
                        'text-ooolab_dark_1 text-ooolab_32px leading-ooolab_44px text-center font-semibold mt-ooolab_m_20'
                    }
                >
                    {translator('AUTHENTICATION.WORKSPACE.WHO_IS_ON_YOUR_TEAM')}
                </label>
                <div
                    className={
                        'flex flex-col items-start mt-ooolab_m_17 w-ooolab_w_150 space-y-5'
                    }
                >
                    <div
                        className={
                            'flex flex-col items-start w-full space-y-5 max-h-48 overflow-y-scroll'
                        }
                    >
                        {listMember.map((member, index) => (
                            <EmailInputComponent
                                onRemove={(index) => {
                                    handleRemoveMember(
                                        listMember,
                                        setListMember,
                                        index
                                    )();
                                }}
                                onChange={(email, index) => {
                                    handleUpdateMemberEmail(
                                        email,
                                        listMember,
                                        setListMember,
                                        index
                                    )();
                                }}
                                index={index}
                                key={index}
                                defaultValue={member.email}
                                onAdding={handleAddMember(
                                    listMember,
                                    setListMember
                                )}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleAddMember(listMember, setListMember)}
                        type={'reset'}
                        className={
                            'flex flex-row space-x-2 items-center font-medium text-ooolab_blue_1 text-ooolab_base mt-ooolab_m_3 ml-ooolab_m_5'
                        }
                    >
                        <AddAnotherIcon />
                        <label>
                            {translator('AUTHENTICATION.WORKSPACE.ADD_ANOTHER')}
                        </label>
                    </button>
                </div>
                <CommonButton
                    classStyle={
                        'group mt-ooolab_m_9 w-ooolab_w_15 h-ooolab_h_15 rounded-ooolab_circle shadow-ooolab_login_1 flex justify-center items-center hover:bg-ooolab_blue_0 focus:bg-ooolab_blue_1'
                    }
                    type="circular"
                    loading={isLoading}
                    actionType={'submit'}
                    title="Update Information"
                    Icon={ArrowIcon}
                />
            </form>
        </>
    );
};

const EmailInputComponent: React.FC<{
    onRemove: (index: number) => void;
    onChange: (email: string, index: number) => void;
    index: number;
    defaultValue: string;
    onAdding: () => void;
}> = ({ onRemove, onChange, index, defaultValue, onAdding }) => {
    const { t: translator } = useTranslation();
    const {
        register,
        formState: { errors },
        getValues,
        setValue,
        trigger,
    } = useForm();
    const [focused, setFocus] = useState(false);
    return (
        <div
            className={
                'flex flex-col items-start w-full animate-ooolab_fade_in'
            }
            key={index}
        >
            <div
                className={`flex flex-row justify-between items-center w-full ooolab_input_1 flex items-center px-ooolab_p_5 bg-transparent ${
                    errors?.email && 'border-red-600'
                }`}
            >
                <input
                    autoFocus={true}
                    className={'w-full'}
                    type="email"
                    placeholder={`${translator(
                        'AUTHENTICATION.WORKSPACE.ENTER_EMAIL'
                    )}`}
                    onKeyDown={(event) => {
                        if (
                            event.key === 'Enter' &&
                            !!getValues(`${index}`)?.trim() &&
                            errors[`${index}`]?.type !== 'pattern' &&
                            errors[`${index}`]?.type !== 'required'
                        ) {
                            onAdding();
                        }
                    }}
                    {...register(`${index}`, {
                        required: true,
                        pattern: FORM_CONST.EMAIL_REGEX,
                        setValueAs: (value: any) => value.trim(),
                    })}
                    onChange={handleEmail(setValue, trigger, index, onChange)}
                    onFocus={() => {
                        setFocus(true);
                    }}
                    // onBlur={() => setFocus(false)}
                    onSubmit={() => {
                        onChange(getValues(`${index}`), index);
                    }}
                    defaultValue={defaultValue}
                />
                {focused && (
                    <button
                        className={'w-ooolab_w_5 h-ooolab_h_5'}
                        onClick={() => onRemove(index)}
                        type={'reset'}
                    >
                        <XIcon />
                    </button>
                )}
            </div>
            <div className={'flex flex-col items-start ml-ooolab_m_5'}>
                {errors[`${index}`]?.type === 'required' && (
                    <ErrorMessage
                        error={translator('FORM_CONST.REQUIRED_FIELD')}
                    />
                )}
                {errors[`${index}`]?.type === 'pattern' && (
                    <ErrorMessage
                        error={translator('FORM_CONST.EMAIL_VALIDATE')}
                    />
                )}
            </div>
        </div>
    );
};

const ErrorMessage: React.FC<{ error: string }> = ({ error }) => {
    return <span className="text-red-500 ooolab_paragraph_1">{error}</span>;
};

export default InviteToWorkspaceForm;
