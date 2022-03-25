import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type WorkspaceOverlayProps = {
    component: React.Component | any;
    onClickBackdrop: () => void;
    show: boolean;
};

const WorkspaceOverlay: React.FC<WorkspaceOverlayProps> = ({
    component,
    onClickBackdrop,
    show,
}) => {
    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed inset-0 overflow-hidden z-70"
                open={show}
                onClose={onClickBackdrop}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="relative w-screen max-w-md">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-500"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-500"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 sm:-ml-10 sm:pr-4">
                                        <button
                                            onClick={() => onClickBackdrop()}
                                        >
                                            <span className="sr-only">
                                                Close panel
                                            </span>
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-visible">
                                    <div className="relative">
                                        {/* Replace with your content */}
                                        {component}
                                        {/* /End replace */}
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default WorkspaceOverlay;
