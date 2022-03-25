/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function LessonSearch() {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <div className="relative">
            <input
                className={`${
                    !open
                        ? 'w-ooolab_w_8 border-none h-ooolab_h_8'
                        : 'w-ooolab_w_64 border-2 border-ooolab_dark_2'
                } overflow-hidden ease-linear transition-all duration-500 w-full h-ooolab_h_10 rounded-sub_tab focus:outline-none pl-ooolab_p_9`}
                type="text"
                placeholder="Search"
                onBlur={() => setOpen(false)}
            />
            <SearchIcon
                onClick={() => setOpen(true)}
                style={{ top: 10, left: 10 }}
                className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 absolute cursor-pointer"
            />
        </div>
    );
}
