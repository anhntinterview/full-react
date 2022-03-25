import { RegisterContext } from 'contexts/Auth/RegisterContext';
import React from 'react';
import { RegisterCreateTemporaryUserBodyType } from 'types/Register.type';
import { genClassNames } from 'utils/handleString';
import SendCodeTimer from '../SendCodeTimer';
import { handleResend } from '../SendCodeToEmailFormFn';
import {useTranslation} from "react-i18next";

export interface SendCodeFromEmailFormFooterProps {
    emailState: RegisterCreateTemporaryUserBodyType | undefined;
    setEmailState: React.Dispatch<
        React.SetStateAction<RegisterCreateTemporaryUserBodyType | undefined>
    >;
    setEmailRegisted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SendCodeFromEmailFormFooter: React.FC<SendCodeFromEmailFormFooterProps> = ({
    emailState,
    setEmailState,
    setEmailRegisted,
}) => {
    const {t: translator} = useTranslation();
    const [showTimer, setShowTimer] = React.useState<boolean>(true);
    const { dispatch } = React.useContext(RegisterContext);
    return (
        <div className="ooolab_text_sm text-ooolab_blue_1">
            <button
                className={genClassNames({
                    'text-ooolab_blue_1': !showTimer,
                    'text-ooolab_gray_10': showTimer,
                })}
                onClick={() => {
                    if (!showTimer) {
                        handleResend(
                            setEmailState,
                            setEmailRegisted,
                            emailState
                        )();
                        setShowTimer(true);
                    }
                }}
            >
                <span>{translator('AUTHENTICATION.SIGN_UP.VERIFY_EMAIL.RESEND_VERIFICATION_EMAIL')}</span>
            </button>{' '}
            <label className="text-ooolab_blue_1">
                {showTimer && (
                    <SendCodeTimer onDone={() => setShowTimer(false)} />
                )}
            </label>
        </div>
    );
};

export default SendCodeFromEmailFormFooter;
