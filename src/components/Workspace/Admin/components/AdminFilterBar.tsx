import { PlusIcon, SearchIcon } from '@heroicons/react/outline';
import React from 'react';
import AdminFilter from './AdminFilter';
import { TFunction, useTranslation } from 'react-i18next';

type FilterBarProps = {
    text: string;
    active?: boolean;
    icon?: React.ReactNode;
    translator: TFunction<'translation'>;
};

const mockStatus = [
    {
        text: 'ALL_FILES',
        props: {
            active: true,
        },
    },
    // {
    //     text: 'Lesson',
    // },
    // {
    //     text: 'Course',
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
        {icon}
        {`${translator(`DASHBOARD.WORKSPACE_SETTING.${text}`)}`}
    </button>
);

const AdminFilterBar = () => {
    const { t: translator } = useTranslation();
    return (
        <div className="flex justify-between items-center mb-ooolab_m_2 ">
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
            <div>
                <AdminFilter />
            </div>
            {/* <div style={{ minHeight: 32 }} className="flex items-center">
                <div>Filter</div>
            </div> */}
        </div>
    );
};

export default AdminFilterBar;
