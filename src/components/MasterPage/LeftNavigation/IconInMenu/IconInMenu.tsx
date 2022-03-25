import React, { ReactNode } from 'react';
import { genClassNames } from 'utils/handleString';

const IconInMenu: React.FC<{
    open: boolean;
    children: ReactNode;
}> = ({ open, children }) => (
    <div
        className={genClassNames({
            'bg-ooolab_blue_1 border-ooolab_transparent': open,
            'group border-ooolab_border_bar_button hover:bg-ooolab_bg_sub_tab_hover hover:border-ooolab_transparent': !open,
            'p-ooolab_p_1_e rounded-full': true,
        })}
    >
        {children}
    </div>
);

export default IconInMenu;
