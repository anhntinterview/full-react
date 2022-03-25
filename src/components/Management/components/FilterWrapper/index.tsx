import { Transition } from '@headlessui/react';
import React from 'react';

type FilterByProps = {
    onClose: () => void;
    isOpeningFilter: boolean;
    classname?: string;
};

const FilterBy: React.FC<FilterByProps> = ({
    children,
    onClose,
    isOpeningFilter,
    classname,
}) => {
    return (
        <Transition
            unmount={false}
            show={isOpeningFilter}
            appear={true}
            enter="transition-all duration-300"
            enterFrom="opacity-0 w-0"
            enterTo="opacity-1 w-ooolab_w_56"
            leave="transition-all duration-300"
            leaveFrom="opacity-1 w-ooolab_w_56"
            leaveTo="opacity-0 w-0"
        >
            <div
                className={`p-ooolab_p_4 border-r border-ooolab_bar_color ${classname}`}
            >
                <p className="border-b pb-ooolab_p_3 border-ooolab_bar_color flex items-center justify-between mb-ooolab_m_3">
                    <span className="inline-flex items-center">
                        <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-ooolab_m_1 w-ooolab_w_5 h-ooolab_h_5 cursor-pointer"
                        >
                            <path
                                d="M7.5 13.5H10.5V12H7.5V13.5ZM2.25 4.5V6H15.75V4.5H2.25ZM4.5 9.75H13.5V8.25H4.5V9.75Z"
                                fill="#2E3A59"
                            />
                        </svg>

                        <span className="font-semibold leading-ooolab_24px text-ooolab_xs ">
                            Filter By
                        </span>
                    </span>
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer"
                        onClick={onClose}
                    >
                        <path
                            d="M17.4993 15.0006V16.6672H2.49935V15.0006H17.4993ZM5.49602 3.25391L6.67435 4.43224L4.02268 7.08391L6.67435 9.73557L5.49602 10.9139L1.66602 7.08391L5.49602 3.25391ZM17.4993 9.16724V10.8339H9.99935V9.16724H17.4993ZM17.4993 3.33391V5.00057H9.99935V3.33391H17.4993Z"
                            fill="#2E3A59"
                        />
                    </svg>
                </p>
                <div className="grid gap-y-2 divide-y-2 divide-gray-100">
                    {React.Children.map(children, (i) => i)}
                </div>
            </div>
        </Transition>
    );
};

export default FilterBy;
