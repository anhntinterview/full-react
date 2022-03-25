import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useHistory } from 'react-router-dom';

import CustomInput from 'components/CustomInput';
import AuthService from 'services/auth.service';
import { AUTH_CONST } from 'constant/auth.const';

export interface CustomDialogProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ setAuthStorage }) => {
    const history = useHistory();
    const [open] = React.useState(true);
    const [isTwoFactorAuth, setTwoFactorAuth] = React.useState<boolean>(false);

    function closeModal() {
        // setOpen(false);
    }

    async function handleTwoFactorAuth(inputCode: string) {
        const res = await AuthService.twoFactorAuth();
        if (inputCode === res) {
            setTwoFactorAuth(true);
        }
    }

    React.useEffect(() => {
        if (isTwoFactorAuth) {
            // Save sessionStorage
            sessionStorage.setItem(
                AUTH_CONST.SESSION_STORAGE_AUTH,
                JSON.stringify(true)
            );
            // *** IMPORTANT: UPDATE SESSION STORAGE *** //
            setAuthStorage(
                sessionStorage.getItem(AUTH_CONST.SESSION_STORAGE_AUTH)
                    ? true
                    : false
            );
            history.push('/user');
        }
        return setTwoFactorAuth(false); // avoid leak memory cause we will not use "isTwoFactorAuth" any time
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTwoFactorAuth]);

    return (
        <>
            <Transition show={open} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-70 overflow-y-auto"
                    static
                    open={open}
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-ooolab_lg font-medium leading-ooolab_24px text-gray-900"
                                >
                                    Your email was active successfully!
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-ooolab_sm text-gray-500">
                                        Please check your authenticator based on
                                        your email was registered and paste to
                                        below area.
                                    </p>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <CustomInput
                                            asyncFunction={handleTwoFactorAuth}
                                            classNameText={'w-full'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default CustomDialog;
