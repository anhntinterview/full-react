import { Fragment, FC, useRef } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { PencilAltIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onConfirm: (e: string) => void;
}

const ModalRename: FC<ModalProps> = ({ isOpen, onClose, title, onConfirm }) => {
    const cancelButtonRef = useRef(null);
    const inputRef = useRef(title);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
        clearErrors,
    } = useForm({
        defaultValues: {
            title: title,
        },
    });

    const { t: translator } = useTranslation();

    const submit = () => {
        const val = getValues();
        onConfirm(val.title);
        onClose();
    };

    const onCloseModal = () => {
        reset();
        clearErrors();
        onClose();
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isOpen}
                onClose={onCloseModal}
            >
                <div className="flex justify-center h-screen pt-4 px-4 pb-20 text-center items-center">
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
                        <div className="bg-white rounded-header_menu text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle min-w-ooolab_w_80 min-h-ooolab_h_18 relative ">
                            <div className="border-b border-ooolab_border_logout py-ooolab_p_4 px-ooolab_p_6">
                                <p className="inline-flex items-center">
                                    <PencilAltIcon className="w-ooolab_w_4 h-ooolab_h_4 text-ooolab_blue_1 mr-ooolab_m_3" />
                                    {translator('MODALS.RENAME')}
                                </p>
                            </div>
                            <form
                                onSubmit={handleSubmit(submit)}
                                className="py-ooolab_p_4 px-ooolab_p_6 flex items-center justify-between"
                            >
                                <div>
                                    <input
                                        type="text"
                                        defaultValue={title}
                                        className={`${
                                            errors.title &&
                                            errors.title.type === 'required'
                                                ? 'border-opacity-0 focus:border-opacity-100 focus:border-red-500 text-red-500'
                                                : 'border-opacity-0 focus:border-opacity-100 focus:border-ooolab_border_logout text-ooolab_dark_2'
                                        } border-b text-ooolab_xs font-light`}
                                        placeholder={`${translator(
                                            'NAME'
                                        )} ...`}
                                        // onChange={(e) =>
                                        //     (inputRef.current = e.target.value)
                                        // }
                                        {...register('title', {
                                            required: {
                                                value: true,
                                                message: translator(
                                                    'FORM_CONST.REQUIRED_FIELD'
                                                ),
                                            },
                                        })}
                                    />
                                    {errors.title &&
                                        errors.title.type === 'required' && (
                                            <span className="text-red-500 block font-light text-ooolab_xs">
                                                {errors.title.message}
                                            </span>
                                        )}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-ooolab_blue_1 text-white ml-ooolab_m_2 px-ooolab_p_3 py-ooolab_p_1_e text-ooolab_xs rounded-lg disabled:bg-ooolab_dark_50"
                                >
                                    {translator('APPLY')}
                                </button>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ModalRename;
