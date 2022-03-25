/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useMemo, useRef, useState } from 'react';
// PACKAGE
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ModalPropTypes } from 'types/Modal.type';

export interface TheSecondCommonModalProps {
    isModal: boolean;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalProps: ModalPropTypes;
}

const TheSecondCommonModal: React.FC<TheSecondCommonModalProps> = ({
    isModal,
    setIsModal,
    modalProps,
}) => {
    const cancelButtonRef = useRef(null);
    const [loading, setLoading] = useState<boolean>(true);

    function onClose() {
        setIsModal(false);
    }

    function onFetchSubmit() {
        modalProps?.onFetch();
        setIsModal(false);
    }

    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [isModal]);

    return (
        <Transition.Root show={isModal} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isModal}
                onClose={setIsModal}
            >
                <div className="flex i justify-center min-h-screen pt-4 px-4 pb-20 text-center items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
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
                        <div className="inline-block align-bottom bg-white rounded-ooolab_h5p text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle w-3/12 relative py-ooolab_p_2">
                            <button
                                onClick={onClose}
                                ref={cancelButtonRef}
                                className="absolute w-ooolab_w_8 right-2 top-2 opacity-50 focus:outline-none"
                            >
                                <XIcon className="hover:text-ooolab_error focus:text-oolab_error" />
                            </button>
                            {loading ? (
                                <div className="min-h-ooolab_h_60">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 w-ooolab_w_5 h-ooolab_h_5 opacity-100 absolute top-1/2 left-1/2"
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
                                </div>
                            ) : (
                                modalProps && (
                                    <>
                                        <div className="w-full flex justify-center">
                                            <img
                                                className="w-ooolab_w_25 h-ooolab_h_25"
                                                src={modalProps.component.img}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-ooolab_dark_1 text-ooolab_sm font-medium my-ooolab_m_3">
                                                {modalProps.component.title}
                                            </p>
                                            <p className="text-ooolab_dark_1 text-ooolab_sm font-normal">
                                                {modalProps.component.subTitle}
                                            </p>
                                        </div>
                                        <div className="flex w-full justify-evenly my-ooolab_m_4 ">
                                            <button
                                                className="py-ooolab_p_1 px-ooolab_p_4 rounded-xl border-ooolab_dark_1 border text-ooolab_sm text-ooolab_dark_1 bg-ooolab_gray_11 focus:outline-none"
                                                onClick={onClose}
                                            >
                                                {modalProps.component.btnCancel}
                                            </button>
                                            <button
                                                style={{
                                                    backgroundColor: `${modalProps.component.color}`,
                                                }}
                                                className={`py-ooolab_p_1 px-ooolab_p_4 rounded-xl  text-ooolab_sm text-white focus:outline-none `}
                                                onClick={onFetchSubmit}
                                            >
                                                {modalProps.component.btnSubmit}
                                            </button>
                                        </div>
                                    </>
                                )
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default TheSecondCommonModal;
