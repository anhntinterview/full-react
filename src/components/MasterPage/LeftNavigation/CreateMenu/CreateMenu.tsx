import { Menu, Transition } from '@headlessui/react';
import React, { ReactNode } from 'react';
import { IMenu } from 'constant/setupBars.const';
import { genClassNames } from 'utils/handleString';

function isPureMenu(arg: any): arg is IMenu {
    return arg && arg.title && typeof arg.title == 'string';
}

const CreateMenu: React.FC<{
    open: boolean;
    items: Array<IMenu | ReactNode>;
    children: ReactNode;
    onItemClick: (index: number) => void;
    mtClass?: string;
}> = ({ open, items, children, onItemClick, mtClass }) => (
    <>
        <Menu.Button className="focus:outline-none">{children}</Menu.Button>

        <Transition
            show={open}
            as="div"
            className={genClassNames({
                'absolute bg-white rounded-header_menu m-1 left-1/2 z-60 shadow-ooolab_menu': true,
                [mtClass || '']: true,
            })}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items static>
                {items.map(
                    (
                        item:
                            | {
                                  title: string;
                                  icon: any;
                                  widthClass: string;
                                  heightClass: string;
                              }
                            | ReactNode,
                        index: number
                    ) => (
                        <Menu.Item key={`menu-${index}`}>
                            {isPureMenu(item) ? (
                                <div
                                    onClick={() => onItemClick(index)}
                                    className="flex items-center whitespace-nowrap text-left text-ooolab_sm pl-3 py-1.5 pr-ooolab_p_16 cursor-pointer hover:bg-ooolab_bg_sub_tab_hover"
                                >
                                    <div className="w-ooolab_w_5">
                                        <img
                                            src={item.icon}
                                            className={`${item.widthHeightClass} mr-2`}
                                        />
                                    </div>
                                    {item.title}
                                </div>
                            ) : (
                                item
                            )}
                        </Menu.Item>
                    )
                )}
            </Menu.Items>
        </Transition>
    </>
);

export default CreateMenu;
