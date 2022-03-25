/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef } from 'react';
// PACKAGE
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

interface PreviewProps {
    onClosePreview: () => void;
    target: any;
}

const OFFICE_EXTENSION = [
    'application/vnd.google-apps.document',
    'application/vnd.google-apps.spreadsheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const renderPreview = (target: any) => {
    switch (target.fileType) {
        case 'application/pdf':
        case 'image/jpeg':
        case 'image/png':
        case 'image/jpg':
            return (
                <iframe
                    src={`https://drive.google.com/file/d/${target.id}/preview`}
                    width="100%"
                    height="100%"
                />
            );
        // case 'application/vnd.google-apps.document':
        //     return (
        //         <iframe
        //             src={`https://docs.google.com/document/d/${target.id}/pub?embedded=true`}
        //             width="100%"
        //             height="100%"
        //         />
        //     );
        default:
            if (target.thumbnail) {
                return (
                    <iframe
                        src={target.thumbnail.replace(/=s\d+/g, '=s1500')}
                        width="100%"
                        height="100%"
                    />
                );
            }
            return (
                <div className="h-ooolab_h_preview leading-preview text-center text-ooolab_xl">
                    No Preview Available
                </div>
            );
    }
};

const Preview: React.FC<PreviewProps> = ({ onClosePreview, target }) => {
    const cancelButtonRef = useRef(null);
    return (
        <Transition.Root show as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-1 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open
                onClose={onClosePreview}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:items-start sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-ooolab_modal_top_1 sm:align-middle sm:w-10/12 lg:w-9/12 sm:rounded-3xl relative">
                            <button
                                onClick={onClosePreview}
                                ref={cancelButtonRef}
                                className="absolute w-8 right-2 top-2 opacity-50 focus:outline-none"
                            >
                                <XIcon />
                            </button>
                            {OFFICE_EXTENSION.includes(target.fileType) && (
                                <a
                                    target="_blank"
                                    href={target.webViewLink}
                                    className="cursor-pointer absolute w-ooolab_w_15 right-12 top-3 opacity-50 focus:outline-none hover:bg-ooolab_gray_6 text-ooolab_lg text-center"
                                >
                                    Edit
                                </a>
                            )}
                            <div className="mt-ooolab_m_3">
                                <label className="block text-black font-bold mb-5 ml-4">
                                    Preview
                                </label>
                                <div className="h-ooolab_h_preview">
                                    {renderPreview(target)}
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default Preview;
