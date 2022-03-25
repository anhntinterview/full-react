import {
    Fragment,
    FC,
    useRef,
    useState,
    useCallback,
    useContext,
    useEffect,
} from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { ExclamationCircleIcon, XIcon } from '@heroicons/react/outline';
import {
    ActionMeta,
    components,
    MultiValue,
    MultiValueGenericProps,
    OnChangeValue,
    Options,
    StylesConfig,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { WorkspaceService } from 'services';
import { useParams } from 'react-router';
import { debounce } from 'lodash';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import {
    BodyInviteEmail,
    MemberInviteType,
    SelectOptionType,
} from 'types/GetListOfWorkspace.type';
import { Controller, useForm } from 'react-hook-form';
import { errorNoti } from 'components/H5P/H5PFN';
import { FORM_CONST } from 'constant/form.const';
import { UserContext } from '../../../../contexts/User/UserContext';
import { useTranslation } from 'react-i18next';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string | React.ReactNode;
    inviteType: 'teacher' | 'student';
}

const customSelectStyle: StylesConfig<any, true> = {
    clearIndicator: (base) => ({ ...base, display: 'none' }),
    indicatorSeparator: (base) => ({ ...base, display: 'none' }),
    indicatorsContainer: (base) => ({ ...base, display: 'none' }),
    option: (base) => ({ ...base, fontSize: 'calc(14*(100vw/1440))' }),
    placeholder: (base) => ({ ...base, fontSize: 'calc(12*(100vw/1440))' }),
    multiValueRemove: (base) => ({
        ...base,
        width: 'calc(24*(100vw/1440))',
        height: 'calc(24*(100vw/1440))',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }),
    valueContainer: (base) => ({
        ...base,
        fontSize: 'calc(14*(100vw/1440))',
    }),
    noOptionsMessage: (base) => ({
        ...base,
        fontSize: 'calc(14*(100vw/1440))',
    }),
    control: (base) => ({
        ...base,
        border: 0,
        boxShadow: 'none',
        cursor: 'text',
        maxHeight: 'calc(68*(100vw/1440))',
        overflowY: 'auto',
        '::-webkit-scrollbar': {
            width: '4px',
            height: '0px',
        },
        '::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: '#555',
        },
    }),
    menuList: (base) => ({
        ...base,
        maxHeight: 'calc(112*(100vw/1440))',
        '::-webkit-scrollbar': {
            width: '4px',
            height: '0px',
        },
        '::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: '#555',
        },
    }),
};

const formatOptionLabel = ({ value, label }) => (
    <div>
        <div className="text-ooolab_xs ">{label}</div>
    </div>
);

const ModalInviteClass: FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    inviteType,
}) => {
    const { t: translator } = useTranslation();

    const cancelButtonRef = useRef(null);

    const params: { id: string; classId: string } = useParams();

    const [listEmailInvite, setListEmailInvite] = useState<SelectOptionType[]>(
        []
    );

    const [labelList, setLabelList] = useState<SelectOptionType[]>([]);
    const {
        handleSubmit,
        setValue,
        formState: { errors },
        trigger,
        control,
        reset,
    } = useForm();

    const {
        dispatch: dispatchWorkspace,
        getWorkspaceDetailState: { class: classes },
    } = useContext(GetWorkspaceContext);

    const { userState } = useContext(UserContext);

    const {
        loading,

        userWorkspaceInvite,
    } = classes;

    useEffect(() => {
        reset();
    }, [isOpen]);

    const debounceInput = useCallback(
        debounce((nextValue: string, asyncFunction: (p: string) => void) => {
            if (nextValue.length) {
                asyncFunction(nextValue);
            }
        }, 1000),
        []
    );

    const handleSearch = async (email: string) => {
        workspaceMiddleware.getMemberWorkspaceForInvite(
            dispatchWorkspace,
            email,
            params.id
        );
    };

    const handleChange = async (
        newValue: OnChangeValue<any, true>,
        actionMeta: any
    ) => {
        if (actionMeta.action === 'select-option') {
            const optionSelect = actionMeta.option;
            await WorkspaceService.getClassesMembers(
                params.id,
                params.classId,
                {
                    user_ids: optionSelect.user_id,
                }
            )
                .then((res) => {
                    if (res.total === 0) {
                        if (labelList?.length) {
                            setLabelList([...labelList, optionSelect]);
                        } else {
                            setLabelList([optionSelect]);
                        }

                        setValue('email', newValue);
                        trigger('email');
                    } else {
                        errorNoti(
                            translator('CLASSES.USER_AVAILABLE'),
                            <ExclamationCircleIcon />
                        );
                    }
                })
                .catch(() => {
                    errorNoti(
                        translator('CLASSES.SOMETHING_WRONG'),
                        <ExclamationCircleIcon />
                    );
                });
        } else if (actionMeta.action === 'create-option') {
            const optionSelect = actionMeta.option;
            const validateEmail = optionSelect.value.match(
                FORM_CONST.EMAIL_REGEX
            );
            if (validateEmail) {
                if (labelList?.length) {
                    setLabelList([...labelList, optionSelect]);
                } else {
                    setLabelList([optionSelect]);
                }
                setValue('email', newValue);
                trigger('email');
            } else {
                errorNoti(
                    translator('CLASSES.INVALID_EMAIL'),
                    <ExclamationCircleIcon />
                );
            }
        } else if (actionMeta.action === 'remove-value') {
            const optionSelect = actionMeta.removedValue;
            setLabelList(
                labelList.filter((i) => i.value !== optionSelect?.value)
            );
            setValue('email', newValue);
            trigger('email');
        } else {
            setLabelList([...labelList, actionMeta.option]);
            setValue('email', newValue);
            trigger('email');
        }
    };

    useEffect(() => {
        if (userWorkspaceInvite.items.length) {
            let list: SelectOptionType[] = [];
            userWorkspaceInvite.items.map((i) => {
                const item: SelectOptionType = {
                    user_id: i.id,
                    value: i.email,
                    label: i.email,
                };
                list.push(item);
            });
            setListEmailInvite(list);
        }
    }, [userWorkspaceInvite]);

    const onSubmit = (data) => {
        if (data?.email.length) {
            let isMeAsTeacher = false;
            let emailInvite: BodyInviteEmail[] = [];
            data.email.map((i) => {
                const email: BodyInviteEmail = {
                    email: i.value,
                    type: inviteType,
                };
                if (
                    inviteType === 'teacher' &&
                    i.value === userState.result.email
                ) {
                    isMeAsTeacher = true;
                }
                emailInvite.push(email);
            });
            const ListEmailInvite: MemberInviteType = {
                members: emailInvite,
                typeInvite: inviteType,
            };
            workspaceMiddleware.inviteUserClasses(
                dispatchWorkspace,
                params.id,
                params.classId,
                ListEmailInvite,
                isMeAsTeacher,
                onClose
            );
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                unmount
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isOpen}
                onClose={onClose}
            >
                <div className="relative flex justify-center h-screen text-center items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-700"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-ooolab_gray_4 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0"
                        enterTo="transform opacity-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100"
                        leaveTo="transform opacity-0"
                    >
                        <div className="bg-white text-left overflow-hidden shadow-xl transform transition-all sm:align-middle max-w-ooolab_w_100 w-ooolab_w_100 min-h-ooolab_h_75 relative pt-ooolab_p_4 pb-ooolab_p_2 px-ooolab_p_5">
                            <div className="flex items-center justify-between mb-ooolab_m_2">
                                <p className="text-ooolab_xs text-ooolab_dark_1 font-semibold">
                                    {title}
                                </p>
                                <XIcon
                                    onClick={onClose}
                                    className="h-ooolab_h_5 w-ooolab_w_5 text-ooolab_dark_2 cursor-pointer"
                                />
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <CreatableSelect
                                            {...field}
                                            isMulti
                                            placeholder={translator(
                                                'CLASSES.TYPE_NAME_OR_EMAIL'
                                            )}
                                            onChange={handleChange}
                                            onInputChange={(inputValue) =>
                                                debounceInput(
                                                    inputValue,
                                                    handleSearch
                                                )
                                            }
                                            value={labelList}
                                            isLoading={loading}
                                            options={listEmailInvite}
                                            styles={customSelectStyle}
                                            noOptionsMessage={({
                                                inputValue,
                                            }) =>
                                                !inputValue &&
                                                translator('CLASSES.NO_RESULTS')
                                            }
                                            formatOptionLabel={
                                                formatOptionLabel
                                            }
                                            maxMenuHeight={200}
                                            formatCreateLabel={(inputValue) =>
                                                `${translator(
                                                    'CLASSES.INVITE'
                                                )} ${inputValue}`
                                            }
                                            className=" custom-style-scrollbar"
                                        />
                                    )}
                                    rules={{ required: true }}
                                />
                                <div className="bg-ooolab_gray_6 h-ooolab_h_1px"></div>
                                {errors?.email?.type === 'required' && (
                                    <span className="text-red-500 ooolab_paragraph_1">
                                        {translator('CLASSES.FIELD_REQUIRED')}
                                    </span>
                                )}

                                <div className="absolute bottom-ooolab_inset_12px right-ooolab_inset_12px">
                                    <button
                                        disabled={
                                            labelList?.length ? false : true
                                        }
                                        type="submit"
                                        className={` ${
                                            !labelList?.length
                                                ? `bg-gray-300 text-black`
                                                : `bg-ooolab_dark_300 text-white`
                                        }   h-ooolab_h_7 w-ooolab_w_10  rounded-ooolab_radius_4px flex justify-center items-center shadow-ooolab_sched_button  text-ooolab_xs font-semibold`}
                                    >
                                        {translator('CLASSES.INVITE')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ModalInviteClass;
