import { FC, useEffect, useRef, useState } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { SearchIcon, XIcon } from '@heroicons/react/outline';
import { CheckboxType } from 'types/Lesson.type';

import './style.css';
import SearchInput from 'components/Workspace/CoursesList/components/SearchInput';
import { Transition } from '@headlessui/react';

interface Props {
    title: string;
    listCheckBox: CheckboxType[];
    onSearch: (e: string) => void;
    fetchData: () => void;
    register: UseFormRegister<FieldValues>;
    placeholder?: string;
    loading?: boolean;
    onUnmount?: () => void;
}

const iconStyle = 'w-ooolab_w_4 h-ooolab_w_4 text-ooolab_dark_2 mb-ooolab_m_2';

const SearchAndCheckBox: FC<Props> = ({
    title,
    listCheckBox,
    placeholder,
    onSearch,
    fetchData,
    register,
    loading,
    onUnmount,
}) => {
    const [openInput, setOpenInput] = useState(false);

    useEffect(() => {
        fetchData();
        return () => {
            if (onUnmount) {
                onUnmount();
            }
        };
    }, []);
    return (
        <div>
            <div className="flex items-center mb-ooolab_m_3 pr-ooolab_p_2">
                <span className="font-medium pr-ooolab_p_1_e text-ooolab_sm text-ooolab_dark_1">
                    {title}
                </span>

                <div className="relative w-full h-ooolab_h_6 overflow-hidden">
                    <Transition
                        show={openInput}
                        enter="transition ease-out duration-100"
                        enterFrom="w-ooolab_w_6 opacity-0"
                        enterTo="w-full opaity-100"
                        leave="transition ease-out duration-100"
                        leaveFrom="w-full opacity-80"
                        leaveTo="w-ooolab_w_6 opacity-0"
                    >
                        <input
                            className={`border border-ooolab_border_logout rounded-sub_tab text-ooolab_xs pl-ooolab_p_2 py-ooolab_p_1_half overflow-hidden ease-linear transition-transform duration-500 w-full focus:outline-none pr-ooolab_p_9`}
                            type="text"
                            placeholder="Search"
                            // onBlur={() => setOpenInput(false)}
                            onChange={(e) => {
                                onSearch(e.target.value);
                            }}
                        />
                    </Transition>
                    <SearchIcon
                        onClick={() => setOpenInput(true)}
                        className={`w-ooolab_w_4 h-ooolab_h_4 text-ooolab_dark_2 absolute cursor-pointer top-1 ${
                            openInput ? 'right-80' : 'left-ooolab_1_e'
                        }`}
                    />
                    <XIcon
                        onClick={() => {
                            setOpenInput(false);
                            onSearch('');
                        }}
                        className={`w-ooolab_w_4 h-ooolab_h_4 text-ooolab_dark_2 absolute cursor-pointer top-1 ${
                            openInput ? 'right-ooolab_1_e' : 'right-80'
                        }`}
                    />
                </div>
            </div>
            <div className="max-h-ooolab_h_30 overflow-y-scroll custom-scrollbar">
                {listCheckBox &&
                    listCheckBox.map((i) => (
                        <div
                            key={i.id}
                            className="flex items-center mb-ooolab_m_2 relative group"
                        >
                            <input
                                className="mr-ooolab_m_3  w-ooolab_w_5 h-ooolab_h_5 z-2"
                                type="checkbox"
                                defaultChecked={i.check}
                                {...register(
                                    `${title}.${i.id}-${i.name
                                        .split('.')
                                        .join(' ')}`,
                                    {}
                                )}
                                id={`${i.name}-${i.id}`}
                                // onChange={() =>
                                //     setTimeout(() => fetchData(), 300)
                                // }
                            />
                            <label
                                className="text-ooolab_xs text-black"
                                htmlFor={`${i.name}-${i.id}`}
                            >
                                {i.name}
                            </label>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default SearchAndCheckBox;
