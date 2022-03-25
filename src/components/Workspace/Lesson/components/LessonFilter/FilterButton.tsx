import React from 'react';

type FilterBarProps = {
    text: string;
    active?: boolean;
    icon?: React.ReactNode;
};

const FilterButton: React.FC<FilterBarProps> = ({
    text,
    active = false,
    icon = null,
}) => (
    <button
        style={{ borderRadius: 100 }}
        className={`${
            active
                ? 'bg-ooolab_blue_1'
                : 'bg-white border border-ooolab_border_logout text-ooolab_dark_2 hover:bg-ooolab_bg_bar hover:text-ooolab_blue_1 hover:border-opacity-0'
        } flex items-center text-white px-ooolab_p_3 py-ooolab_p_1 mr-ooolab_m_3 focus:outline-none focus:bg-ooolab_blue_1 focus:text-white`}
    >
        {icon} {text}
    </button>
);

export default FilterButton;
