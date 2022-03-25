import {Transition, Dialog} from '@headlessui/react';
import {FC, Fragment} from 'react';
import SaveChanges from "../../../../assets/SVG/save-changes.svg";
import {useTranslation} from "react-i18next";

type ModalProps = {
    isSuccess: boolean;
    onClose: () => void;
};

const SaveSuccessModal: FC<ModalProps> = ({isSuccess, onClose,}) => {
    const {t: translator} = useTranslation();
    return (
        <Transition.Root show={isSuccess} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                open={isSuccess}
                onClose={onClose}
            >
                <div className="flex justify-center h-screen text-center items-center">
                    <Transition.Child
                        as={'div'}
                        enter="ease-out duration-700"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-ooolab_gray_4 bg-opacity-75 transition-opacity"/>
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
                        <div
                            className="w-2/5 h-2/5 p-ooolab_p_5 bg-white rounded-ooolab_card text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle relative">
                            <div className="flex justify-center items-center h-full">
                                <div
                                    className={'flex flex-col justify-center items-center w-full h-full'}
                                >
                                    <img
                                        className="w-ooolab_w_142px"
                                        src={SaveChanges}
                                        alt=""
                                    />
                                    <p>{translator('MODALS.SAVED_SUCCESSFULLY')}</p>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default SaveSuccessModal;
