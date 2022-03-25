/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import approveIcon from 'assets/SVG/approve.svg';
import declineIcon from 'assets/SVG/decline.svg';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdminOptions: React.FC<{
    onApprove: () => void;
    onDecline: () => void;
    onDisplayMenu: (display: boolean) => void;
}> = ({ onApprove, onDecline, onDisplayMenu }) => {
    const { t: translator } = useTranslation();

    const MenuList = [
        {
            name: translator('DASHBOARD.ADMIN_APPROVAL.APPROVE'),
            icons: (
                <img
                    src={approveIcon}
                    className="w-ooolab_w_4 h-ooolab_w_4 text-ooolab_dark_2"
                />
            ),
        },
        {
            name: translator('DASHBOARD.ADMIN_APPROVAL.DECLINE'),
            icons: (
                <img
                    src={declineIcon}
                    className="w-ooolab_w_4 h-ooolab_w_4 text-ooolab_dark_2"
                />
            ),
        },
    ];
    return (
        <Menu as="div" className="relative inline-block text-left">
            {({ open }) => {
                useEffect(() => {
                    onDisplayMenu(open);
                }, [open]);
                return (
                    <>
                        <div>
                            <Menu.Button className="flex justify-center items-center text-ooolab_dark_1 hover:bg-ooolab_bg_sub_tab_hover hover:text-white focus:outline-none w-ooolab_w_6 h-ooolab_h_6 rounded-full">
                                <DotsVerticalIcon
                                    className="w-ooolab_w_4 h-ooolab_h_4"
                                    aria-hidden="true"
                                />
                            </Menu.Button>
                        </div>

                        <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="z-9999 shadow-ooolab_box_shadow_container origin-top-right absolute right-0 mt-2 w-ooolab_w_44 rounded-header_menu divide-y divide-gray-100 focus:outline-none">
                                <div className="py-1">
                                    {MenuList.map((i, index) => {
                                        return (
                                            <Menu.Item key={i.name}>
                                                {({}) => (
                                                    <div
                                                        onClick={() => {
                                                            switch (index) {
                                                                case 0:
                                                                    onApprove();
                                                                    break;
                                                                case 1:
                                                                    onDecline();
                                                                    break;
                                                                default:
                                                                    break;
                                                            }
                                                        }}
                                                        className="flex  px-ooolab_p_2 w-full bg-white hover:bg-ooolab_bg_sub_tab_hover cursor-pointer"
                                                    >
                                                        {i.icons}
                                                        <a className="block px-4 py-2 text-sm">
                                                            {i.name}
                                                        </a>
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        );
                                    })}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                );
            }}
        </Menu>
    );
};

export default AdminOptions;
