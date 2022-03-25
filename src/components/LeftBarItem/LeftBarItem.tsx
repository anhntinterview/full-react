import * as React from 'react';
import { IBarItem } from 'constant/setupBars.const';
import { genClassNames } from 'utils/handleString';
import BG from 'assets/SVG/bg_item.svg';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '../Tooltip';

interface CustomItemProps extends IBarItem {
    active: boolean;
    index: number;
}

const SubItem = ({ title, url }: { title: string; url: string }) => (
    <Menu.Item>
        <Link to={url} className="mt-ooolab_m_2 first:mt-0 inline-block">
            <div className="shadow-ooolab_sub_item text-ooolab_sm text-ooolab_text_username w-ooolab_w_sub_tab h-ooolab_h_8 bg-white pl-ooolab_p_3 rounded-sub_tab leading-sub_tab hover:bg-ooolab_bg_bar">
                {title}
            </div>
        </Link>
    </Menu.Item>
);

const LeftBarItem: React.FC<CustomItemProps> = ({
    active,
    activeIcon,
    inactiveIcon,
    index,
    subTabs,
    title,
}: CustomItemProps) => (
    <div
        className={genClassNames({
            'relative w-ooolab_w_bar_item h-ooolab_h_bar_item': true,
            'z-0': active,
            'z-auto': !active,
        })}
        style={{ top: -50 * index }}
    >
        <Menu as={Fragment}>
            {({ open }) => (
                <>
                    <Menu.Button
                        className={genClassNames({
                            'focus:outline-none absolute inset-y-ooolab_inset_25 left-0 right-0 bar-item-content z-2 w-full': true,
                            group: !active && !open,
                        })}
                    >
                        <div className="flex items-center justify-center w-full h-full">
                            {open ? (
                                <div className="rounded-full border-4 border-ooolab_selected_bar_item bg-cover bg-bg-bar-item flex items-center justify-center w-ooolab_w_9 h-ooolab_h_9">
                                    {activeIcon}
                                </div>
                            ) : active ? (
                                <Tooltip title={title}>
                                    <div className="bg-ooolab_bar_icon bg-bg-bar-item flex items-center justify-center w-ooolab_w_7_n h-ooolab_h_7">
                                        {activeIcon}
                                    </div>
                                </Tooltip>
                            ) : (
                                <Tooltip title={title}>
                                    <div className="flex items-center">
                                        {inactiveIcon}
                                    </div>
                                </Tooltip>
                            )}
                        </div>
                    </Menu.Button>

                    <Transition
                        show={open}
                        as="div"
                        className="absolute left-full ml-1"
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        style={{
                            top: `calc(${
                                60 -
                                16 * subTabs.length -
                                4 * (subTabs.length - 1)
                            }*(100vw/1440))`,
                        }}
                    >
                        <Menu.Items static>
                            {subTabs.map(
                                (item: { title: string; url: string }) => (
                                    <SubItem
                                        key={`subitem_${item.url}`}
                                        {...item}
                                    />
                                )
                            )}
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
        {active ? (
            <img
                src={BG}
                className="w-ooolab_w_bar_item h-ooolab_h_bar_item absolute top-0 left-0 right-0 bottom-0 z-1"
            />
        ) : (
            <svg
                viewBox="0 0 72 120"
                fill="none"
                className="opacity-0 w-ooolab_w_bar_item h-ooolab_h_bar_item absolute top-0 left-0 right-0 bottom-0 transition-opacity duration-300 baritem:opacity-100 z-1"
            >
                <path
                    d="M31.311 88.7716C9.72351 83.2444 2.99146 72.2653 0.913198 65.3816C-0.27405 61.4491 -0.216718 57.1676 1.01644 53.2493C3.18951 46.3445 10.0084 35.3488 31.311 30.1842C63.6535 22.3431 72 -7.62939e-06 72 -7.62939e-06L72 120C72 120 64.1751 97.1861 31.311 88.7716Z"
                    fill="#F2F9FF"
                />
            </svg>
        )}
    </div>
);

export default LeftBarItem;
