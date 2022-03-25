import * as React from 'react';
import { genClassNames } from 'utils/handleString';

interface TooltipProps {
    title: string;
    children: React.ReactNode;
    mtClass?: string;
    mlClass?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
    title,
    children,
    mtClass,
    mlClass,
}: TooltipProps) => (
    <div className="has-tooltip">
        <span
            className={genClassNames({
                'whitespace-nowrap tooltip shadow-lg text-ooolab_sxs rounded-sub_tab px-3 py-1 bg-ooolab_bg_tooltip text-white': true,
                'ml-ooolab_default_tooltip_left': mlClass === undefined,
                'mt-ooolab_default_tooltip_top': mtClass === undefined,
                [mtClass || '']: true,
                [mlClass || '']: true,
                'opacity-0': !title,
            })}
        >
            {title}
        </span>
        {children}
    </div>
);

export default Tooltip;
