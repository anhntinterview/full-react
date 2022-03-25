import { Transition, Dialog } from '@headlessui/react';
import { FC, useRef, useState, Fragment } from 'react';
import SaveChanges from 'assets/SVG/save-changes.svg';
import CancelChanges from 'assets/SVG/cancel.svg';
import { useHistory, useParams } from 'react-router';
import { XIcon } from '@heroicons/react/outline';
type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    status: 'init' | 'done' | 'error' | 'tags_error';
};

const ModalCreateCourse: FC<ModalProps> = ({ isOpen, onClose, status }) => {
    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isOpen}
                onClose={() => {
                    if (status !== 'init') {
                        onClose();
                    }
                }}
            >
                <div className="flex justify-center h-screen text-center items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-700"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-ooolab_gray_4 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
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
                        <div className="w-2/5 h-2/5 p-ooolab_p_5 bg-white rounded-ooolab_card text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle relative">
                            {status !== 'init' && (
                                <XIcon
                                    onClick={() => onClose()}
                                    className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer absolute top-ooolab_inset_12px right-ooolab_inset_12px"
                                />
                            )}
                            <div className="flex justify-center items-center h-full">
                                {status === 'init' &&
                                    ((
                                        <p className="inline-flex flex-col items-center">
                                            <span className="text-ooolab_dark_1">
                                                Updating Course{' '}
                                                <span className="animate-bounce">
                                                    ...
                                                </span>
                                            </span>
                                            <svg
                                                className="animate-spin -ml-1 mt-1 mr-3 w-ooolab_w_8 h-ooolab_h_8 opacity-100"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="red"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        </p>
                                    ) ||
                                        null)}
                                <div
                                    className={`flex flex-col justify-center items-center w-full h-full ${status !== 'error' ? 'hidden' : ''
                                        }`}
                                >
                                    <img
                                        className="w-ooolab_w_142px"
                                        src={CancelChanges}
                                        alt=""
                                    />
                                    {status === 'error' && (
                                        <>
                                            <p>
                                                Something went wrong when create
                                                course, please try again!
                                            </p>
                                            <button
                                                onClick={() => onClose()}
                                                className="mt-ooolab_m_2 rounded-lg bg-red-500 text-white px-ooolab_p_3 py-ooolab_p_1_e"
                                            >
                                                Close
                                            </button>
                                        </>
                                    )}
                                    {status === 'tags_error' && (
                                        <>
                                            <p>
                                                Something went wrong when change tags
                                                course, please try again!
                                            </p>
                                            <button
                                                onClick={() => onClose()}
                                                className="mt-ooolab_m_2 rounded-lg bg-red-500 text-white px-ooolab_p_3 py-ooolab_p_1_e"
                                            >
                                                Close
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center w-full h-full ${status !== 'done' && 'hidden'
                                        }`}
                                >
                                    <img
                                        className="w-ooolab_w_142px"
                                        src={SaveChanges}
                                        alt=""
                                    />
                                    <p>Course Updated Successfully!</p>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ModalCreateCourse;
