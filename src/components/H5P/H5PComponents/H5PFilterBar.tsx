import React from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import H5PFilter from './H5PFilter';
import { TFunction, useTranslation } from 'react-i18next';

type FilterBarProps = {
    text: string;
    active?: boolean;
    icon?: React.ReactNode;
    translator: TFunction<'translation'>;
};

const mockStatus = [
    {
        text: 'ALL_LIBRARY',
        props: {
            active: true,
        },
    },
    // {
    //     text: 'Single Choice Set',
    // },
    // {
    //     text: 'Starters',
    // },
    // {
    //     text: 'New View',
    //     props: {
    //         icon: (
    //             <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_2" />
    //         ),
    //     },
    // },
];

const FilterBar: React.FC<FilterBarProps> = ({
    text,
    active = false,
    icon = null,
    translator,
}) => (
    <button
        style={{ borderRadius: 100 }}
        className={`${
            active
                ? 'bg-ooolab_blue_1'
                : 'bg-white border border-ooolab_border_logout text-ooolab_dark_2 hover:bg-ooolab_bg_bar hover:text-ooolab_blue_1 hover:border-opacity-0'
        } flex items-center text-white px-ooolab_p_3 py-ooolab_p_1 mr-ooolab_m_3 focus:outline-none focus:bg-ooolab_blue_1 focus:text-white`}
    >
        {icon} {`${translator(`DASHBOARD.H5P_CONTENTS.${text}`)}`}
    </button>
);

const H5PFilterBar = () => {
    const { t: translator } = useTranslation();

    return (
        <div className="flex justify-between items-center mb-ooolab_m_2  text-ooolab_sm ">
            <div className="flex">
                {mockStatus.map((i) => (
                    <FilterBar
                        key={i.text}
                        text={i.text}
                        {...i?.props}
                        translator={translator}
                    />
                ))}
            </div>
            <H5PFilter />
            {/* <div className="flex items-cente justify-centerr rounded-lg bg-ooolab_bg_bar py-ooolab_p_1 px-ooolab_p_3 group hover:bg-ooolab_blue_1 cursor-pointer">
                <svg
                    className="h-ooolab_h_5 w-ooolab_w_3_i mr-ooolab_m_1"
                    viewBox="0 0 12 8"
                    fill="none"
                >
                    <path
                        className="group-hover:fill-white"
                        d="M0.666626 0.666667C0.666626 0.298477 0.965103 0 1.33329 0H10.6666C11.0348 0 11.3333 0.298477 11.3333 0.666667C11.3333 1.03486 11.0348 1.33333 10.6666 1.33333H1.33329C0.965103 1.33333 0.666626 1.03486 0.666626 0.666667ZM1.99996 4C1.99996 3.63181 2.29844 3.33333 2.66663 3.33333H9.33329C9.70148 3.33333 9.99996 3.63181 9.99996 4C9.99996 4.36819 9.70148 4.66667 9.33329 4.66667H2.66663C2.29844 4.66667 1.99996 4.36819 1.99996 4ZM3.33329 7.33333C3.33329 6.96514 3.63177 6.66667 3.99996 6.66667H7.99996C8.36815 6.66667 8.66663 6.96514 8.66663 7.33333C8.66663 7.70152 8.36815 8 7.99996 8H3.99996C3.63177 8 3.33329 7.70152 3.33329 7.33333Z"
                        fill="#0071CE"
                    />
                </svg>

                <div className="group-hover:text-white text-ooolab_sm text-ooolab_blue_1">
                    Filter
                </div>
            </div> */}
        </div>
    );
};

export default H5PFilterBar;
