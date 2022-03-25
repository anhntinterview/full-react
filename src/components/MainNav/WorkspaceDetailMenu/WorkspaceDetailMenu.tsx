import React, { Fragment } from 'react';
// PACKAGES
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { useParams } from 'react-router-dom';
// CONTEXT
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
// ASSETS
import avatar from 'assets/SVG/workspace_avatar.svg';
import lock from 'assets/SVG/lock.svg';


export interface WorkspaceDetailMenuProps {
    onClickWorkspaceDetail?: (type?: string) => void;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const WorkspaceDetailMenu: React.FC<WorkspaceDetailMenuProps> = ({
    setIsModal,
    onClickWorkspaceDetail,
}) => {
    const { getWorkspaceDetailState } = React.useContext(GetWorkspaceContext);
    const {
        result: { name },
    } = getWorkspaceDetailState;

    return (
        <Menu as="div" className="relative h-ooolab_h_10 inline-block text-left">
            {({ open }) => (
                <>
                    <div>
                        <Menu.Button className="inline-flex justify-center items-center w-full rounded-md border-none px-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0 appearance-none focus:ring-offset-0 focus:ring-offset-gray-100 focus:ring-indigo-500">
                            <img
                                src={avatar}
                                className="w-ooolab_w_10 h-ooolab_h_10 pr-ooolab_p_3 rounded-full"
                            />
                            <p className="text-ooolab_1xs">{name || ''}</p>
                            
                            <ChevronDownIcon
                                className="-mr-1 ml-1 h-ooolab_h_3 w-3"
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
                        <Menu.Items
                            static
                            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            className={`${classNames(
                                                active
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )} flex items-center justify-start cursor-pointer`}
                                            onClick={() =>
                                                onClickWorkspaceDetail && onClickWorkspaceDetail('detail')
                                            }
                                        >
                                            <img
                                                className="mr-ooolab_m_3"
                                                src={lock}
                                                alt=""
                                            />
                                            Workspace Detail
                                        </span>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            className={`${classNames(
                                                active
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )} flex items-center justify-start cursor-pointer`}
                                            onClick={() =>
                                                onClickWorkspaceDetail && onClickWorkspaceDetail('member')
                                            }
                                        >
                                            <img
                                                className="mr-ooolab_m_3"
                                                src={lock}
                                                alt=""
                                            />
                                            Member list
                                        </span>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            className={`${classNames(
                                                active
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )} flex items-center justify-start cursor-pointer`}
                                            onClick={() => setIsModal(true)}
                                        >
                                            <img
                                                className="mr-ooolab_m_3"
                                                src={lock}
                                                alt=""
                                            />
                                            Invite people
                                        </span>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default WorkspaceDetailMenu;
