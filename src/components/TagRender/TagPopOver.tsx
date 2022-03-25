import { Fragment, useState, useReducer, useEffect, useCallback } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { debounce } from 'lodash';
import { PlusIcon, SearchIcon } from '@heroicons/react/outline';

import { TagType } from 'types/GetListOfWorkspace.type';
import { CreateTagBody } from 'types/ApiData.type';
import RadioColor from 'components/Form/RadioColor';

const iconStyle = 'w-ooolab_w_4 h-ooolab_w_4 text-ooolab_dark_2 mb-ooolab_m_2';

import './style.css';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FormatTagType extends TagType {
    check: boolean;
}

interface TagPopoverProps {
    title?: string;
    listTag?: FormatTagType[];
    lessonId: string;
    onCheck?: (tagId: number) => void;
    onUnCheck?: (tagId: number) => void;
    onCreate?: (body: CreateTagBody) => Promise<boolean>;
    onSearch?: (e: string) => void;
}

interface CreateItemType {
    name: string;
    bg: string;
    text: string;
}

interface ActionType {
    type: 'SET_NAME' | 'SET_BG' | 'SET_TEXT_COLOR' | 'SET_SPACE';
    value: any;
}

const initItem: CreateItemType = {
    name: '',
    bg: '#fff',
    text: '#000',
};

const itemReducer = (state: CreateItemType, actions: ActionType) => {
    let newState = { ...state };

    switch (actions.type) {
        case 'SET_NAME':
            newState.name = actions.value;
            break;
        case 'SET_BG':
            newState.bg = actions.value;
            break;
        case 'SET_TEXT_COLOR':
            newState.text = actions.value;
            break;
        case 'SET_SPACE':
            newState.name = `${newState.name}`;
            break;
        default:
            break;
    }

    return newState;
};

const TagPopover: React.FC<TagPopoverProps> = ({
    title,
    listTag,
    onCheck,
    onUnCheck,
    onCreate,
    onSearch,
}) => {
    const handleClick = (e: any, workspaceId: string, tagId: number) => {
        if (e.target.checked && onCheck) {
            onCheck(tagId);
        } else if (onUnCheck) {
            onUnCheck(tagId);
        }
    };

    const [isCreating, setCreating] = useState(false);
    const [newItem, setNewItem] = useReducer(itemReducer, initItem);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
        reset,
    } = useForm({
        defaultValues: {
            tag: '',
        },
    });
    const { t: translator } = useTranslation();

    const setTextColor = (color: string) => {
        setNewItem({
            type: 'SET_TEXT_COLOR',
            value: color,
        });
    };

    const setBGColor = (bg: string) => {
        setNewItem({
            type: 'SET_BG',
            value: bg,
        });
    };

    const debounceInput = useCallback(
        debounce((nextValue: string, asyncFunction: (e: string) => void) => {
            asyncFunction(nextValue);
        }, 1000),
        []
    );

    const submit = () => {
        if (isCreating && onCreate) {
            onCreate({
                name: newItem.name,
                color: {
                    backgroundColor: newItem.bg,
                    textColor: newItem.text,
                },
            }).then((res) => {
                if (res) {
                    setTimeout(() => setCreating(false), 1000);
                }
            });
        } else setCreating(true);
    };

    // translator('FORM_CONST.REQUIRED_FIELD')
    return (
        <Popover as="div" className="relative inline-block">
            {({ open }) => (
                <>
                    <Popover.Button
                        as="button"
                        className={`flex border justify-center items-center focus:outline-none  rounded-md`}
                    >
                        <PlusIcon
                            onClick={() => {
                                setCreating(false);
                                clearErrors();
                                reset();
                            }}
                            className={`${(open && 'bg-ooolab_blue_1 text-white') ||
                                'text-ooolab_dark_2'
                                } w-ooolab_w_6 h-ooolab_h_6 py-ooolab_p_1_half px-ooolab_p_1  rounded-md`}
                        />
                    </Popover.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Popover.Panel
                            onSubmit={handleSubmit(submit)}
                            as="form"
                            unmount
                            className="z-9999 bg-white shadow-ooolab_box_shadow_container origin-top-right absolute left-0 mt-2 min-w-ooolab_w_56 rounded-header_menu divide-y divide-gray-100 focus:outline-none"
                        >
                            {isCreating ? (
                                <div className="px-ooolab_p_3 pt-ooolab_p_4 text-ooolab_xs font-light">
                                    <input
                                        maxLength={16}
                                        {...register('tag', {
                                            required: {
                                                value: true,
                                                message: translator(
                                                    'FORM_CONST.REQUIRED_FIELD'
                                                ),
                                            },
                                            maxLength: {
                                                value: 16,
                                                message: translator(
                                                    'FORM_CONST.MAX_LENGTH_TAG'
                                                ),
                                            },
                                        })}
                                        placeholder={translator("TAGS_NAME")}
                                        type="text"
                                        className="mb-ooolab_m_1 border-b border-gray-200 focus:outline-none"
                                        onChange={(e) => {
                                            setNewItem({
                                                type: 'SET_NAME',
                                                value: e.target.value,
                                            });
                                        }}
                                    />
                                    <p className="mb-ooolab_m_2">
                                        {errors.tag &&
                                            errors.tag.type === 'required' && (
                                                <span className="text-red-500 text-ooolab_10px font-light">
                                                    {translator(
                                                        'FORM_CONST.REQUIRED_FIELD'
                                                    )}
                                                </span>
                                            )}
                                    </p>
                                    <p>
                                        {errors.tag &&
                                            errors.tag.type === 'maxLength' && (
                                                <span className="text-red-500 text-ooolab_10px font-light">
                                                    {translator(
                                                        'FORM_CONST.MAX_LENGTH_TAG'
                                                    )}
                                                </span>
                                            )}
                                    </p>
                                    <div className="grid grid-cols-4">
                                        <label
                                            className="col-span-1"
                                            htmlFor="tag-color"
                                        >
                                            Text
                                        </label>
                                        <div className="col-span-3 flex pb-ooolab_p_6">
                                            <RadioColor
                                                inputName="choose-text-color"
                                                onClick={setTextColor}
                                                color="red"
                                            />
                                            <RadioColor
                                                inputName="choose-text-color"
                                                onClick={setTextColor}
                                                color="blue"
                                            />
                                            <RadioColor
                                                inputName="choose-text-color"
                                                onClick={setTextColor}
                                                color="yellow"
                                            />
                                            <RadioColor
                                                inputName="choose-text-color"
                                                onClick={setTextColor}
                                                color="green"
                                            />
                                            <RadioColor
                                                inputName="choose-text-color"
                                                onClick={setTextColor}
                                                color="pink"
                                            />
                                            <div className="relative w-ooolab_w_4 h-ooolab_h_4 overflow-hidden rounded-full border border-ooolab_dark_1 inline-flex justify-center items-center">
                                                <input
                                                    onChange={(e) =>
                                                        setTextColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    type="color"
                                                    id="choose-text-color"
                                                    className="border-none opacity-0 absolute top-0 left-0 z-10"
                                                />
                                                {/* <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4 z-0 text-ooolab_dark_2" /> */}
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            newItem.text,
                                                    }}
                                                    className="w-ooolab_w_4 h-ooolab_h_4 z-0 rounded-full border-none"
                                                />
                                            </div>
                                        </div>
                                        <label
                                            className="col-span-1"
                                            htmlFor="bg-color"
                                        >
                                            BG
                                        </label>
                                        <div className="col-span-3 pb-ooolab_p_6 flex">
                                            <RadioColor
                                                inputName="choose-bg-color"
                                                onClick={setBGColor}
                                                color="red"
                                            />
                                            <RadioColor
                                                inputName="choose-bg-color"
                                                onClick={setBGColor}
                                                color="blue"
                                            />
                                            <RadioColor
                                                inputName="choose-bg-color"
                                                onClick={setBGColor}
                                                color="yellow"
                                            />
                                            <RadioColor
                                                inputName="choose-bg-color"
                                                onClick={setBGColor}
                                                color="green"
                                            />
                                            <RadioColor
                                                inputName="choose-bg-color"
                                                onClick={setBGColor}
                                                color="pink"
                                            />
                                            <div className="relative w-ooolab_w_4 h-ooolab_h_4 overflow-hidden rounded-full border border-gray-200 inline-flex justify-center items-center">
                                                <input
                                                    onChange={(e) =>
                                                        setBGColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    type="color"
                                                    id="choose-text-color"
                                                    className="border-none opacity-0 absolute top-0 left-0 z-10"
                                                />
                                                {/* <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4 z-0 text-ooolab_dark_2" /> */}
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            newItem.bg,
                                                    }}
                                                    className="w-ooolab_w_4 h-ooolab_h_4 z-0 rounded-full border-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-ooolab_p_2 py-ooolab_p_3">
                                    <p className="font-medium text-ooolab_base text-black">
                                        {title}
                                    </p>
                                    {/* <SearchIcon className={iconStyle} /> */}
                                    <div className="relative">
                                        <input
                                            className="w-full bg-gray-50 rounded-sub_tab focus:outline-none pl-ooolab_p_10 py-ooolab_p_1 text-ooolab_xs"
                                            type="text"
                                            name=""
                                            id={`${title}-input`}
                                            onChange={(e) => {
                                                if (onSearch)
                                                    debounceInput(
                                                        e.target.value,
                                                        onSearch
                                                    );
                                            }}
                                        />
                                        <SearchIcon
                                            className={`${iconStyle} absolute left-0 top-0 h-full ml-ooolab_m_2`}
                                        />
                                    </div>
                                    <form className="mt-ooolab_m_1 max-h-24 overflow-y-scroll custom-scrollbar">
                                        {listTag &&
                                            listTag.map((i) => (
                                                <div
                                                    key={i.id}
                                                    className="flex items-center mb-ooolab_m_2"
                                                >
                                                    <input
                                                        className="mr-ooolab_m_3 w-ooolab_w_4 h-ooolab_h_4"
                                                        type="checkbox"
                                                        defaultChecked={i.check}
                                                        name={`${i.name}-${i.id}`}
                                                        id={`${i.name}-${i.id}`}
                                                        onChange={(e) =>
                                                            handleClick(
                                                                e,
                                                                `${i.workspace_id}`,
                                                                i.id
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        className="text-ooolab_xs text-black"
                                                        htmlFor={`${i.name}-${i.id}`}
                                                    >
                                                        {i.name.length < 16
                                                            ? i.name
                                                            : `${i.name?.slice(0, 17)}...`}
                                                    </label>
                                                </div>
                                            ))}
                                    </form>
                                </div>
                            )}
                            <div className="border-t border-ooolab_dark_1 px-ooolab_p_5 py-ooolab_p_3 flex justify-between">
                                <div
                                    className={`${(!isCreating &&
                                            'w-0 h-0 overflow-hidden') ||
                                        'text-ooolab_xs inline-flex items-center px-ooolab_p_2 rounded'
                                        }`}
                                    style={{
                                        color: newItem.text,
                                        backgroundColor: newItem.bg,
                                    }}
                                >
                                    {newItem.name}
                                </div>
                                <button
                                    type="submit"
                                    // onClick={() => {
                                    //     if (isCreating && onCreate) {
                                    //         onCreate({
                                    //             name: newItem.name,
                                    //             color: {
                                    //                 backgroundColor: newItem.bg,
                                    //                 textColor: newItem.text,
                                    //             },
                                    //         }).then((res) => {
                                    //             if (res) {
                                    //                 setTimeout(
                                    //                     () =>
                                    //                         setCreating(false),
                                    //                     1000
                                    //                 );
                                    //             }
                                    //         });
                                    //     } else setCreating(true);
                                    // }}
                                    className="px-ooolab_p_3 py-0 h-ooolab_h_7 bg-ooolab_blue_4 rounded-lg font-light text-ooolab_xs text-white focus:outline-none"
                                >
                                    {translator("LESSON.CREATE_TAG")}
                                </button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default TagPopover;
